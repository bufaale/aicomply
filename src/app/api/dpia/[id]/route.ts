import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const updateSchema = z.object({
  processing_description: z.string().max(3000).optional(),
  processing_purposes: z.string().max(2000).optional(),
  data_categories: z.string().max(2000).optional(),
  data_subjects: z.string().max(1500).optional(),
  recipients: z.string().max(2000).optional(),
  retention_period: z.string().max(1000).optional(),
  international_transfers: z.string().max(2000).optional(),
  legal_basis: z.string().max(1500).optional(),
  necessity_justification: z.string().max(2000).optional(),
  proportionality_assessment: z.string().max(2000).optional(),
  data_minimisation: z.string().max(2000).optional(),
  rights_at_risk: z.string().max(2000).optional(),
  risk_scenarios: z.string().max(3000).optional(),
  likelihood_severity: z.string().max(2000).optional(),
  technical_measures: z.string().max(3000).optional(),
  organisational_measures: z.string().max(3000).optional(),
  data_subject_rights: z.string().max(2000).optional(),
  breach_procedure: z.string().max(2000).optional(),
  dpo_consultation: z.string().max(1500).optional(),
  status: z.enum(["draft", "in_review", "approved", "superseded"]).optional(),
  reviewer_email: z.string().email().optional().or(z.literal("")),
  supervisory_authority_consulted: z.boolean().optional(),
  supervisory_consultation_date: z.string().datetime().optional().or(z.literal("")),
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
    .from("dpia_assessments")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ assessment: data });
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
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const update = { ...parsed.data };
  if (update.reviewer_email === "") update.reviewer_email = undefined;
  if (update.supervisory_consultation_date === "")
    update.supervisory_consultation_date = undefined;
  if (update.status === "approved" || update.status === "in_review") {
    (update as Record<string, unknown>).reviewed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("dpia_assessments")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ assessment: data });
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
    .from("dpia_assessments")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
