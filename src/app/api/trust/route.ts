import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const updateSchema = z.object({
  trust_enabled: z.boolean().optional(),
  trust_slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9][a-z0-9-]{2,40}$/, "Slug must be 3-41 chars, lowercase, start with alphanumeric")
    .optional(),
  trust_display_name: z.string().trim().max(120).optional(),
  trust_website: z
    .string()
    .url()
    .max(200)
    .refine(
      (v) => {
        try {
          const p = new URL(v);
          return p.protocol === "http:" || p.protocol === "https:";
        } catch {
          return false;
        }
      },
      { message: "Only http:// or https:// URLs are allowed" },
    )
    .optional()
    .or(z.literal("")),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("profiles")
    .select("trust_slug, trust_enabled, trust_display_name, trust_website")
    .eq("id", user.id)
    .single();

  return NextResponse.json({ profile: data ?? {} });
}

export async function PATCH(req: Request) {
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
  if (update.trust_website === "") update.trust_website = undefined;

  const { data, error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id)
    .select("trust_slug, trust_enabled, trust_display_name, trust_website")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "That slug is already taken. Pick another." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
