import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { DpiaReport } from "@/lib/pdf/dpia-report";
import type { DpiaDraft } from "@/lib/gdpr/dpia-generator";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan, full_name, email, company_name")
    .eq("id", user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { data: assessment } = await supabase
    .from("dpia_assessments")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!assessment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let processingName = "Processing operation";
  if (assessment.system_id) {
    const { data: system } = await supabase
      .from("ai_systems")
      .select("name")
      .eq("id", assessment.system_id)
      .eq("user_id", user.id)
      .single();
    if (system) processingName = system.name;
  }

  const draft: DpiaDraft = {
    processing_description: assessment.processing_description ?? "",
    processing_purposes: assessment.processing_purposes ?? "",
    data_categories: assessment.data_categories ?? "",
    data_subjects: assessment.data_subjects ?? "",
    recipients: assessment.recipients ?? "",
    retention_period: assessment.retention_period ?? "",
    international_transfers: assessment.international_transfers ?? "",
    legal_basis: assessment.legal_basis ?? "",
    necessity_justification: assessment.necessity_justification ?? "",
    proportionality_assessment: assessment.proportionality_assessment ?? "",
    data_minimisation: assessment.data_minimisation ?? "",
    rights_at_risk: assessment.rights_at_risk ?? "",
    risk_scenarios: assessment.risk_scenarios ?? "",
    likelihood_severity: assessment.likelihood_severity ?? "",
    technical_measures: assessment.technical_measures ?? "",
    organisational_measures: assessment.organisational_measures ?? "",
    data_subject_rights: assessment.data_subject_rights ?? "",
    breach_procedure: assessment.breach_procedure ?? "",
    dpo_consultation: assessment.dpo_consultation ?? "",
  };

  const buffer = await renderToBuffer(
    DpiaReport({
      meta: {
        controllerName:
          (profile.company_name || profile.full_name || "").trim() || "Your Organization",
        processingName,
        contactEmail: (profile.email || user.email || "").trim() || "—",
        assessmentDate: new Date(assessment.created_at).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        status: assessment.status,
        supervisoryConsulted: Boolean(assessment.supervisory_authority_consulted),
      },
      draft,
    }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="dpia-art35-${id}.pdf"`,
    },
  });
}
