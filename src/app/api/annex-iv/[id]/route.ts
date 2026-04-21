import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const updateSchema = z.object({
  system_intended_purpose: z.string().max(3000).optional(),
  system_developer_identity: z.string().max(1500).optional(),
  system_version_and_date: z.string().max(500).optional(),
  system_interaction_with_hardware: z.string().max(2000).optional(),
  system_software_versions: z.string().max(1500).optional(),
  system_deployment_forms: z.string().max(2000).optional(),
  system_hardware_description: z.string().max(2000).optional(),
  design_methods_and_steps: z.string().max(3000).optional(),
  design_specifications: z.string().max(3000).optional(),
  system_architecture: z.string().max(3000).optional(),
  data_requirements: z.string().max(3000).optional(),
  human_oversight_assessment: z.string().max(3000).optional(),
  accuracy_and_performance_metrics: z.string().max(3000).optional(),
  capabilities_and_limitations: z.string().max(3000).optional(),
  degrees_of_accuracy: z.string().max(2000).optional(),
  foreseeable_unintended_outcomes: z.string().max(3000).optional(),
  specifications_input_data: z.string().max(2000).optional(),
  risk_management_description: z.string().max(3000).optional(),
  lifecycle_changes: z.string().max(2000).optional(),
  harmonised_standards_applied: z.string().max(2000).optional(),
  conformity_assessment_procedure: z.string().max(2000).optional(),
  conformity_assessment_changes: z.string().max(1500).optional(),
  post_market_monitoring_plan: z.string().max(3000).optional(),
  additional_information: z.string().max(2000).optional(),
  status: z.enum(["draft", "in_review", "approved", "superseded"]).optional(),
  reviewer_email: z.string().email().optional().or(z.literal("")),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("annex_iv_documents")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ document: data });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const update = { ...parsed.data };
  if (update.reviewer_email === "") update.reviewer_email = undefined;
  if (update.status === "approved" || update.status === "in_review") {
    (update as Record<string, unknown>).reviewed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("annex_iv_documents")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ document: data });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("annex_iv_documents")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
