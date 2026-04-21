import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  findGpaiEntry,
  gpaiDeployerGuidance,
  gpaiStatusBadgeLabel,
} from "@/lib/eu-ai-act/gpai-registry";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: system } = await supabase
    .from("ai_systems")
    .select("vendor, base_model, ai_provider")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!system) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const combinedVendor = [system.vendor, system.ai_provider].filter(Boolean).join(" ");
  const entry = findGpaiEntry(combinedVendor, system.base_model);

  if (!entry) {
    return NextResponse.json({
      analysis: null,
      message:
        "No GPAI registry match for the configured vendor/base model. Either it is not a general-purpose AI model, or the provider is not yet in the AIComply registry.",
    });
  }

  return NextResponse.json({
    analysis: {
      provider: entry.provider,
      status: entry.status,
      status_label: gpaiStatusBadgeLabel(entry.status),
      notes: entry.notes,
      source: entry.source ?? null,
      deployer_guidance: gpaiDeployerGuidance(entry),
    },
  });
}
