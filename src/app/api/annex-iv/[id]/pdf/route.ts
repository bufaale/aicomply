import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { AnnexIvReport } from "@/lib/pdf/annex-iv-report";
import type { AnnexIvDraft } from "@/lib/eu-ai-act/annex-iv-generator";

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
    .select("full_name, email, company_name")
    .eq("id", user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { data: doc } = await supabase
    .from("annex_iv_documents")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let systemName = "AI System";
  if (doc.system_id) {
    const { data: system } = await supabase
      .from("ai_systems")
      .select("name")
      .eq("id", doc.system_id)
      .eq("user_id", user.id)
      .single();
    if (system) systemName = system.name;
  }

  const draft: AnnexIvDraft = {
    system_intended_purpose: doc.system_intended_purpose ?? "",
    system_developer_identity: doc.system_developer_identity ?? "",
    system_version_and_date: doc.system_version_and_date ?? "",
    system_interaction_with_hardware: doc.system_interaction_with_hardware ?? "",
    system_software_versions: doc.system_software_versions ?? "",
    system_deployment_forms: doc.system_deployment_forms ?? "",
    system_hardware_description: doc.system_hardware_description ?? "",
    design_methods_and_steps: doc.design_methods_and_steps ?? "",
    design_specifications: doc.design_specifications ?? "",
    system_architecture: doc.system_architecture ?? "",
    data_requirements: doc.data_requirements ?? "",
    human_oversight_assessment: doc.human_oversight_assessment ?? "",
    accuracy_and_performance_metrics: doc.accuracy_and_performance_metrics ?? "",
    capabilities_and_limitations: doc.capabilities_and_limitations ?? "",
    degrees_of_accuracy: doc.degrees_of_accuracy ?? "",
    foreseeable_unintended_outcomes: doc.foreseeable_unintended_outcomes ?? "",
    specifications_input_data: doc.specifications_input_data ?? "",
    risk_management_description: doc.risk_management_description ?? "",
    lifecycle_changes: doc.lifecycle_changes ?? "",
    harmonised_standards_applied: doc.harmonised_standards_applied ?? "",
    conformity_assessment_procedure: doc.conformity_assessment_procedure ?? "",
    conformity_assessment_changes: doc.conformity_assessment_changes ?? "",
    post_market_monitoring_plan: doc.post_market_monitoring_plan ?? "",
    additional_information: doc.additional_information ?? "",
  };

  const buffer = await renderToBuffer(
    AnnexIvReport({
      meta: {
        providerName:
          (profile.company_name || profile.full_name || "").trim() || "Your Organization",
        systemName,
        contactEmail: (profile.email || user.email || "").trim() || "—",
        assessmentDate: new Date(doc.created_at).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        status: doc.status,
      },
      draft,
    }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="annex-iv-${id}.pdf"`,
    },
  });
}
