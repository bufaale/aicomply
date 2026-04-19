import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!system) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: obligations } = await supabase
    .from("ai_system_obligations")
    .select("*")
    .eq("system_id", id)
    .order("created_at", { ascending: true });

  return NextResponse.json({ system, obligations: obligations ?? [] });
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
    .from("ai_systems")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
