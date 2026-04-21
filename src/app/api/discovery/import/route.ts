import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { AI_TOOLS } from "@/lib/eu-ai-act/ai-tool-registry";

const bodySchema = z.object({
  tool_names: z.array(z.string().trim().min(1)).min(1).max(100),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid tool_names" }, { status: 400 });
  }

  const tierToRisk: Record<string, "high" | "limited" | "minimal"> = {
    high: "high",
    limited: "limited",
    minimal: "minimal",
  };

  const inserts = parsed.data.tool_names
    .map((name) => AI_TOOLS.find((t) => t.name === name))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .map((tool) => ({
      user_id: user.id,
      name: tool.name,
      vendor: tool.vendor,
      purpose: tool.rationale,
      deployment_type: tool.deploymentType,
      base_model: tool.baseModel ?? null,
      risk_tier: tierToRisk[tool.suggestedTier] ?? ("unclassified" as const),
      risk_rationale: `Pre-classified via shadow-AI discovery. ${tool.rationale}`,
      classified_at: new Date().toISOString(),
    })) as Array<Partial<import("@/types/database").AISystem> & {
      user_id: string;
      name: string;
      purpose: string;
    }>;

  if (inserts.length === 0) {
    return NextResponse.json({ error: "No matching tools in registry" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("ai_systems")
    .insert(inserts)
    .select("id, name, risk_tier");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ imported: data ?? [] });
}
