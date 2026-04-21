import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateAnnexIvDraft, type AnnexIvInput } from "@/lib/eu-ai-act/annex-iv-generator";

const createSchema = z.object({
  system_id: z.string().uuid().optional(),
  system_name: z.string().trim().min(2).max(200).optional(),
  system_purpose: z.string().trim().min(10).max(2000).optional(),
  annex_iii_category: z.string().trim().max(300).optional(),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("annex_iv_documents")
    .select("id, system_id, status, reviewer_email, reviewed_at, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return NextResponse.json({ documents: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Plan gate: Regulated tier only (Annex IV is a notified-body / auditor artifact).
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("id", user.id)
    .single();
  const plan = (profile?.subscription_plan ?? "free").toLowerCase();
  if (plan !== "regulated") {
    return NextResponse.json(
      { error: "Annex IV documentation is on the Regulated plan." },
      { status: 402 },
    );
  }

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

  let input: AnnexIvInput;
  if (parsed.data.system_id) {
    const { data: system } = await supabase
      .from("ai_systems")
      .select("name, vendor, purpose, data_inputs, data_outputs, business_units, deployment_type, base_model")
      .eq("id", parsed.data.system_id)
      .eq("user_id", user.id)
      .single();
    if (!system) return NextResponse.json({ error: "AI system not found" }, { status: 404 });
    input = {
      systemName: system.name,
      systemPurpose: system.purpose,
      vendor: system.vendor,
      baseModel: system.base_model,
      deploymentType: system.deployment_type,
      dataInputs: system.data_inputs,
      dataOutputs: system.data_outputs,
      businessUnits: system.business_units,
      annexIiiCategory: parsed.data.annex_iii_category,
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
      annexIiiCategory: parsed.data.annex_iii_category,
    };
  }

  try {
    const draft = await generateAnnexIvDraft(input);
    const { data, error } = await supabase
      .from("annex_iv_documents")
      .insert({
        user_id: user.id,
        system_id: parsed.data.system_id ?? null,
        status: "draft",
        ...draft,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ document: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Annex IV draft generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
