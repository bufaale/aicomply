import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { AI_TOOLS, matchTool, type AiToolEntry } from "@/lib/eu-ai-act/ai-tool-registry";

/**
 * Shadow-AI discovery. Non-enterprise path — we do not require Okta/Azure AD
 * OAuth. The user uploads a list of URLs (bookmarks export, SaaS spend CSV,
 * browser history export, or a manual paste) and we match each URL against
 * the registry of commonly-used AI tools. Matches return pre-classified
 * draft AI systems the user can import into inventory with one click.
 */

const bodySchema = z.object({
  urls: z.array(z.string().trim().min(3).max(1000)).min(1).max(2000),
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
    return NextResponse.json({ error: "Invalid urls array" }, { status: 400 });
  }

  const seenTools = new Set<string>();
  const matches: Array<{
    url: string;
    tool: AiToolEntry;
    alreadyInInventory: boolean;
  }> = [];

  const { data: existingSystems } = await supabase
    .from("ai_systems")
    .select("name")
    .eq("user_id", user.id);
  const existingNames = new Set(
    (existingSystems ?? []).map((s) => (s.name as string).toLowerCase()),
  );

  for (const url of parsed.data.urls) {
    const tool = matchTool(url);
    if (!tool) continue;
    if (seenTools.has(tool.name)) continue;
    seenTools.add(tool.name);
    matches.push({
      url,
      tool,
      alreadyInInventory: existingNames.has(tool.name.toLowerCase()),
    });
  }

  return NextResponse.json({
    scanned: parsed.data.urls.length,
    matched: matches.length,
    registrySize: AI_TOOLS.length,
    matches,
  });
}
