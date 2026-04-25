import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Last30DaysStats {
  dpias_generated: number;
  frias_generated: number;
  systems_assessed: number;
  dpias_generated_prev: number;
  frias_generated_prev: number;
  systems_assessed_prev: number;
}

export function calcDelta(current: number, prev: number): { pct: number; direction: "up" | "down" | "flat" } {
  if (prev === 0) {
    if (current === 0) return { pct: 0, direction: "flat" };
    return { pct: 100, direction: "up" };
  }
  const pct = Math.round(((current - prev) / prev) * 100);
  if (pct > 0) return { pct, direction: "up" };
  if (pct < 0) return { pct: Math.abs(pct), direction: "down" };
  return { pct: 0, direction: "flat" };
}

interface MetricProps {
  label: string;
  current: number;
  prev: number;
}

function Metric({ label, current, prev }: MetricProps) {
  const delta = calcDelta(current, prev);
  const Icon =
    delta.direction === "up" ? TrendingUp : delta.direction === "down" ? TrendingDown : Minus;
  const color =
    delta.direction === "up" ? "text-emerald-700" : delta.direction === "down" ? "text-rose-700" : "text-slate-500";

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{current.toLocaleString()}</p>
      <div className={`mt-1 inline-flex items-center gap-1 text-xs ${color}`}>
        <Icon className="h-3 w-3" />
        {delta.direction === "flat" ? "No change" : `${delta.pct}% vs prev 30d`}
      </div>
    </div>
  );
}

export function Last30DaysWidget({ stats }: { stats: Last30DaysStats }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Last 30 days</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          <Metric label="DPIAs" current={stats.dpias_generated} prev={stats.dpias_generated_prev} />
          <Metric label="FRIAs" current={stats.frias_generated} prev={stats.frias_generated_prev} />
          <Metric label="Systems assessed" current={stats.systems_assessed} prev={stats.systems_assessed_prev} />
        </div>
      </CardContent>
    </Card>
  );
}
