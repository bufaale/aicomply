import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const createSchema = z.object({
  name: z.string().trim().min(2).max(120),
  vendor: z.string().trim().max(120).optional(),
  purpose: z.string().trim().min(10).max(1000),
  usage_context: z.string().trim().max(1000).optional(),
  data_inputs: z.string().trim().max(1000).optional(),
  data_outputs: z.string().trim().max(1000).optional(),
  business_units: z.string().trim().max(500).optional(),
  ai_provider: z.string().trim().max(120).optional(),
  base_model: z.string().trim().max(120).optional(),
  deployment_type: z
    .enum(["saas", "self_hosted", "api", "plugin", "informal"])
    .default("saas"),
  owner_email: z.string().email().optional().or(z.literal("")),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: systems } = await supabase
    .from("ai_systems")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ systems: systems ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("ai_systems")
    .insert({
      user_id: user.id,
      ...parsed.data,
      owner_email: parsed.data.owner_email || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ system: data });
}
