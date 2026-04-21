import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateDpiaDraft, type DpiaInput } from "@/lib/gdpr/dpia-generator";
import { applyRateLimit, createAiLimiter } from "@/lib/security/rate-limit";

const createSchema = z.object({
  system_id: z.string().uuid().optional(),
  processing_name: z.string().trim().min(2).max(200).optional(),
  processing_purpose: z.string().trim().min(10).max(2000).optional(),
  data_categories_hint: z.string().trim().max(2000).optional(),
  data_subjects_hint: z.string().trim().max(1500).optional(),
  lawful_basis_hint: z
    .enum([
      "consent",
      "contract",
      "legal_obligation",
      "vital_interests",
      "public_task",
      "legitimate_interests",
    ])
    .optional(),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: assessments } = await supabase
    .from("dpia_assessments")
    .select("id, system_id, status, reviewer_email, reviewed_at, supervisory_authority_consulted, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return NextResponse.json({ assessments: assessments ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Plan gate: DPIA generator is a Pro+ feature.
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("id", user.id)
    .single();
  const plan = (profile?.subscription_plan ?? "free").toLowerCase();
  if (plan === "free") {
    return NextResponse.json(
      { error: "DPIA generation requires the Pro, Business, or Regulated plan." },
      { status: 402 },
    );
  }

  const limited = await applyRateLimit(`dpia:${user.id}`, createAiLimiter(plan));
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  let input: DpiaInput;

  if (parsed.data.system_id) {
    const { data: system, error: systemErr } = await supabase
      .from("ai_systems")
      .select("name, vendor, purpose, data_inputs, data_outputs")
      .eq("id", parsed.data.system_id)
      .eq("user_id", user.id)
      .single();
    if (systemErr || !system) {
      return NextResponse.json({ error: "AI system not found" }, { status: 404 });
    }
    input = {
      processingName: system.name,
      processingPurpose: system.purpose,
      dataCategoriesHint: parsed.data.data_categories_hint,
      dataSubjectsHint: parsed.data.data_subjects_hint,
      lawfulBasisHint: parsed.data.lawful_basis_hint,
      linkedSystem: {
        name: system.name,
        purpose: system.purpose,
        vendor: system.vendor,
        dataInputs: system.data_inputs,
        dataOutputs: system.data_outputs,
      },
    };
  } else {
    if (!parsed.data.processing_name || !parsed.data.processing_purpose) {
      return NextResponse.json(
        { error: "Provide either system_id or (processing_name + processing_purpose)" },
        { status: 400 },
      );
    }
    input = {
      processingName: parsed.data.processing_name,
      processingPurpose: parsed.data.processing_purpose,
      dataCategoriesHint: parsed.data.data_categories_hint,
      dataSubjectsHint: parsed.data.data_subjects_hint,
      lawfulBasisHint: parsed.data.lawful_basis_hint,
    };
  }

  try {
    const draft = await generateDpiaDraft(input);

    const { data, error } = await supabase
      .from("dpia_assessments")
      .insert({
        user_id: user.id,
        system_id: parsed.data.system_id ?? null,
        status: "draft",
        ...draft,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ assessment: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "DPIA draft generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
