import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/stripe/plans";

export async function checkSystemLimit(): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
  plan: string;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false, used: 0, limit: 0, plan: "free" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("id", user.id)
    .single();

  const plan = getUserPlan(profile?.subscription_plan ?? null);

  if (plan.limits.systems_max === Infinity) {
    return { allowed: true, used: 0, limit: Infinity, plan: plan.id };
  }

  const { count } = await supabase
    .from("ai_systems")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const used = count ?? 0;

  return {
    allowed: used < plan.limits.systems_max,
    used,
    limit: plan.limits.systems_max,
    plan: plan.id,
  };
}
