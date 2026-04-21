import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { FriaReport } from "@/lib/pdf/fria-report";
import type { FriaDraft } from "@/lib/eu-ai-act/fria-generator";

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
    .select("subscription_plan, full_name, email")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { data: assessment } = await supabase
    .from("fria_assessments")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!assessment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let systemName = "AI System";
  if (assessment.system_id) {
    const { data: system } = await supabase
      .from("ai_systems")
      .select("name")
      .eq("id", assessment.system_id)
      .eq("user_id", user.id)
      .single();
    if (system) systemName = system.name;
  }

  const draft: FriaDraft = {
    system_description: assessment.system_description ?? "",
    deployment_purpose: assessment.deployment_purpose ?? "",
    deployment_duration: assessment.deployment_duration ?? "",
    affected_groups: assessment.affected_groups ?? "",
    frequency_of_use: assessment.frequency_of_use ?? "",
    rights_at_risk: assessment.rights_at_risk ?? "",
    harm_scenarios: assessment.harm_scenarios ?? "",
    oversight_measures: assessment.oversight_measures ?? "",
    oversight_personnel: assessment.oversight_personnel ?? "",
    mitigation_measures: assessment.mitigation_measures ?? "",
    escalation_procedure: assessment.escalation_procedure ?? "",
    governance_framework: assessment.governance_framework ?? "",
    complaint_mechanism: assessment.complaint_mechanism ?? "",
  };

  const buffer = await renderToBuffer(
    FriaReport({
      meta: {
        deployerName: (profile.full_name || "").trim() || "Your Organization",
        systemName,
        contactEmail: (profile.email || user.email || "").trim() || "—",
        assessmentDate: new Date(assessment.created_at).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        status: assessment.status,
      },
      draft,
    }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="fria-art27-${id}.pdf"`,
    },
  });
}
