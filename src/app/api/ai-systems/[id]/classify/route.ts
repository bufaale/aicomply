import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { classifySystem } from "@/lib/eu-ai-act/risk-classifier";

export const maxDuration = 60;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: system } = await supabase
    .from("ai_systems")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!system) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let result;
  try {
    result = await classifySystem({
      name: system.name,
      vendor: system.vendor,
      purpose: system.purpose,
      usageContext: system.usage_context,
      dataInputs: system.data_inputs,
      dataOutputs: system.data_outputs,
      baseModel: system.base_model,
      deploymentType: system.deployment_type,
      businessUnits: system.business_units,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Classification failed" },
      { status: 502 },
    );
  }

  const now = new Date().toISOString();

  const { error: updateErr } = await supabase
    .from("ai_systems")
    .update({
      risk_tier: result.tier,
      risk_rationale: result.rationale,
      classified_at: now,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  // Replace obligations with the freshly generated ones.
  await supabase.from("ai_system_obligations").delete().eq("system_id", id);

  const rows = result.obligations.map((o) => ({
    system_id: id,
    user_id: user.id,
    article: o.article,
    title: o.title,
    description: o.description,
  }));

  if (rows.length > 0) {
    const { error: insertErr } = await supabase
      .from("ai_system_obligations")
      .insert(rows);
    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    tier: result.tier,
    rationale: result.rationale,
    obligations: result.obligations,
  });
}
