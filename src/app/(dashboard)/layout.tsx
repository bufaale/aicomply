import "../aicomply-v2.css";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "./dashboard-shell";

function planLabel(plan: string | null | undefined, status: string | null | undefined): string {
  if (status !== "active" || !plan || plan === "free") return "Free plan";
  return `${plan.charAt(0).toUpperCase()}${plan.slice(1)} plan`;
}

function initialsOf(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, company_name, subscription_plan, subscription_status")
    .eq("id", user.id)
    .single();

  const { count: systemCount } = await supabase
    .from("ai_systems")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const workspaceName = profile?.company_name?.trim() || profile?.full_name?.trim() || "Workspace";
  const tracked = systemCount ?? 0;
  const workspacePlan = `${planLabel(profile?.subscription_plan, profile?.subscription_status)} · ${tracked} system${tracked === 1 ? "" : "s"}`;
  const workspaceInitials = initialsOf(profile?.company_name ?? profile?.full_name, "WS");
  const userInitials = initialsOf(profile?.full_name ?? user.email, user.email?.[0]?.toUpperCase() ?? "U");

  return (
    <DashboardShell
      workspaceName={workspaceName}
      workspacePlan={workspacePlan}
      workspaceInitials={workspaceInitials}
      userInitials={userInitials}
    >
      {children}
    </DashboardShell>
  );
}
