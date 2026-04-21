import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateFriaDraft, type FriaInput } from "@/lib/eu-ai-act/fria-generator";
import { applyRateLimit, createAiLimiter } from "@/lib/security/rate-limit";

const createSchema = z.object({
  system_id: z.string().uuid().optional(),
  system_name: z.string().trim().min(2).max(200).optional(),
  system_purpose: z.string().trim().min(10).max(2000).optional(),
  deployer_type: z
    .enum([
      "public_authority",
      "public_body",
      "private_public_service",
      "credit_scoring",
      "insurance_pricing",
      "other",
    ])
    .optional(),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: assessments } = await supabase
    .from("fria_assessments")
    .select("id, system_id, status, reviewer_email, reviewed_at, notified_authority_at, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return NextResponse.json({ assessments: assessments ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Plan gate: FRIA generator is a Pro+ feature.
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("id", user.id)
    .single();
  const plan = (profile?.subscription_plan ?? "free").toLowerCase();
  if (plan === "free") {
    return NextResponse.json(
      { error: "FRIA generation requires the Pro, Business, or Regulated plan." },
      { status: 402 },
    );
  }

  // Rate limit Claude calls per user. Business/Regulated get the paid quota.
  const limited = await applyRateLimit(`fria:${user.id}`, createAiLimiter(plan));
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

  let input: FriaInput;

  if (parsed.data.system_id) {
    const { data: system, error: systemErr } = await supabase
      .from("ai_systems")
      .select("name, vendor, purpose, usage_context, data_inputs, data_outputs, business_units, deployment_type")
      .eq("id", parsed.data.system_id)
      .eq("user_id", user.id)
      .single();
    if (systemErr || !system) {
      return NextResponse.json({ error: "AI system not found" }, { status: 404 });
    }
    input = {
      systemName: system.name,
      systemPurpose: system.purpose,
      vendor: system.vendor,
      usageContext: system.usage_context,
      dataInputs: system.data_inputs,
      dataOutputs: system.data_outputs,
      businessUnits: system.business_units,
      deploymentType: system.deployment_type,
      deployerType: parsed.data.deployer_type,
    };
  } else {
    if (!parsed.data.system_name || !parsed.data.system_purpose) {
      return NextResponse.json(
        { error: "Provide either system_id or (system_name + system_purpose)" },
        { status: 400 },
      );
    }
    input = {
      systemName: parsed.data.system_name,
      systemPurpose: parsed.data.system_purpose,
      deployerType: parsed.data.deployer_type,
    };
  }

  try {
    const draft = await generateFriaDraft(input);

    const { data, error } = await supabase
      .from("fria_assessments")
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
    const message = err instanceof Error ? err.message : "FRIA draft generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
