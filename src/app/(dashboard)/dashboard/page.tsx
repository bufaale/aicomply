import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, AlertTriangle, ShieldCheck, Sparkles, GraduationCap } from "lucide-react";
import { CrossPromoBanner } from "@/components/dashboard/cross-promo-banner";

interface SystemRow {
  id: string;
  name: string;
  risk_tier: string;
  classified_at: string | null;
  created_at: string;
}

const TIER_CLASS: Record<string, string> = {
  unacceptable: "bg-red-700 text-white",
  high: "bg-orange-600 text-white",
  limited: "bg-yellow-500 text-white",
  minimal: "bg-emerald-600 text-white",
  unclassified: "bg-muted text-muted-foreground",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: systemsRaw } = await supabase
    .from("ai_systems")
    .select("id, name, risk_tier, classified_at, created_at")
    .eq("user_id", user!.id);

  const systems = (systemsRaw ?? []) as SystemRow[];

  const counts = {
    total: systems.length,
    unacceptable: systems.filter((s) => s.risk_tier === "unacceptable").length,
    high: systems.filter((s) => s.risk_tier === "high").length,
    limited: systems.filter((s) => s.risk_tier === "limited").length,
    minimal: systems.filter((s) => s.risk_tier === "minimal").length,
    unclassified: systems.filter((s) => s.risk_tier === "unclassified").length,
  };

  const { data: literacyRaw } = await supabase
    .from("ai_literacy_records")
    .select("id")
    .eq("user_id", user!.id);
  const literacyCount = literacyRaw?.length ?? 0;

  const recent = [...systems]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {user?.user_metadata?.full_name || user?.email || "there"}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/ai-systems/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add AI System
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Systems tracked
            </CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{counts.total}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              High risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.high + counts.unacceptable}</p>
            {counts.unacceptable > 0 && (
              <p className="text-xs text-red-600 mt-1">{counts.unacceptable} prohibited</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Unclassified
            </CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{counts.unclassified}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Art. 4 training records
            </CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{literacyCount}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent AI systems</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>No systems tracked yet.</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/dashboard/ai-systems/new">Add your first AI system</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {recent.map((s) => (
                <li key={s.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <Link href={`/dashboard/ai-systems/${s.id}`} className="font-medium hover:underline">
                    {s.name}
                  </Link>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Badge className={TIER_CLASS[s.risk_tier] ?? TIER_CLASS.unclassified}>
                      {s.risk_tier}
                    </Badge>
                    <span>{new Date(s.created_at).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <CrossPromoBanner />
    </div>
  );
}
