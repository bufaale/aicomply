import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const updateSchema = z.object({
  system_description: z.string().max(3000).optional(),
  deployment_purpose: z.string().max(2000).optional(),
  deployment_duration: z.string().max(800).optional(),
  affected_groups: z.string().max(2000).optional(),
  frequency_of_use: z.string().max(800).optional(),
  rights_at_risk: z.string().max(3000).optional(),
  harm_scenarios: z.string().max(3000).optional(),
  oversight_measures: z.string().max(3000).optional(),
  oversight_personnel: z.string().max(1500).optional(),
  mitigation_measures: z.string().max(3000).optional(),
  escalation_procedure: z.string().max(2000).optional(),
  governance_framework: z.string().max(3000).optional(),
  complaint_mechanism: z.string().max(2000).optional(),
  status: z.enum(["draft", "in_review", "approved", "superseded"]).optional(),
  reviewer_email: z.string().email().optional().or(z.literal("")),
  notified_authority_at: z.string().datetime().optional().or(z.literal("")),
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
    .from("fria_assessments")
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
  if (update.notified_authority_at === "") update.notified_authority_at = undefined;
  if (update.status === "approved" || update.status === "in_review") {
    (update as Record<string, unknown>).reviewed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("fria_assessments")
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
    .from("fria_assessments")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
