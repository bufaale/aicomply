"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ANNEX_IV_CROSS_WALK,
  getCrossWalkStats,
  type Coverage,
  type CrossWalkEntry,
} from "@/lib/eu-ai-act/cross-walk";

const COVERAGE_LABEL: Record<Coverage, string> = {
  high: "Direct reuse",
  medium: "Structural reuse",
  none: "AI Act-specific",
};

const COVERAGE_TONE: Record<Coverage, string> = {
  high: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  medium: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  none: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-400",
};

interface CrossWalkBannerProps {
  /** When true, hides the marketing-style framing and presents only the matrix. */
  matrixOnly?: boolean;
}

export function CrossWalkBanner({ matrixOnly = false }: CrossWalkBannerProps) {
  const [open, setOpen] = useState(false);
  const stats = getCrossWalkStats();

  return (
    <>
      <div className="flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div className="flex flex-1 flex-col gap-2">
          {!matrixOnly && (
            <p className="leading-relaxed">
              Already SOC2 or ISO 27001 certified? AIComply pre-satisfies{" "}
              <strong>
                {stats.soc2Count} of {stats.total} Annex IV sections ({stats.soc2Pct}%)
              </strong>{" "}
              if you have SOC2, and{" "}
              <strong>
                {stats.iso27001Count} of {stats.total} ({stats.iso27001Pct}%)
              </strong>{" "}
              if you have ISO 27001 — your existing controls map directly into the
              technical-documentation pack.
            </p>
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="self-start border-emerald-300 bg-white text-emerald-900 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-100 dark:hover:bg-emerald-900"
              >
                See the cross-walk matrix
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Annex IV ↔ SOC2 / ISO 27001 cross-walk</DialogTitle>
                <DialogDescription>
                  How your existing compliance evidence pre-satisfies each of
                  the {stats.total} sections of the EU AI Act Annex IV
                  technical documentation pack.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 pt-2">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <SummaryStat
                    label="SOC2 alone"
                    value={`${stats.soc2Count}/${stats.total}`}
                    pct={stats.soc2Pct}
                  />
                  <SummaryStat
                    label="ISO 27001 alone"
                    value={`${stats.iso27001Count}/${stats.total}`}
                    pct={stats.iso27001Pct}
                  />
                  <SummaryStat
                    label="Either / both"
                    value={`${stats.eitherCount}/${stats.total}`}
                    pct={stats.eitherPct}
                    highlight
                  />
                </div>
                <div className="grid gap-3">
                  {ANNEX_IV_CROSS_WALK.map((entry) => (
                    <CrossWalkRow key={entry.field} entry={entry} />
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}

function SummaryStat({
  label,
  value,
  pct,
  highlight,
}: {
  label: string;
  value: string;
  pct: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-0.5 rounded-md border p-3 ${
        highlight
          ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40"
          : "bg-card"
      }`}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="font-display text-lg font-bold">{value}</span>
      <span className="text-muted-foreground">{pct}% pre-satisfied</span>
    </div>
  );
}

function CrossWalkRow({ entry }: { entry: CrossWalkEntry }) {
  const refs: string[] = [];
  if (entry.references.soc2?.length) {
    refs.push(`SOC2 ${entry.references.soc2.join(", ")}`);
  }
  if (entry.references.iso27001?.length) {
    refs.push(`ISO 27001 ${entry.references.iso27001.join(", ")}`);
  }

  return (
    <div className="rounded-md border bg-card p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="font-semibold">{entry.label}</span>
        <div className="flex flex-wrap gap-1">
          <CoverageBadge framework="SOC2" coverage={entry.coverage.soc2} />
          <CoverageBadge framework="ISO 27001" coverage={entry.coverage.iso27001} />
        </div>
      </div>
      {refs.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="font-mono">{refs.join(" · ")}</span>
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {entry.note}
      </p>
    </div>
  );
}

function CoverageBadge({
  framework,
  coverage,
}: {
  framework: string;
  coverage: Coverage;
}) {
  return (
    <Badge variant="outline" className={`gap-1 ${COVERAGE_TONE[coverage]}`}>
      {(coverage === "high" || coverage === "medium") && (
        <CheckCircle2 className="h-3 w-3" />
      )}
      {framework} · {COVERAGE_LABEL[coverage]}
    </Badge>
  );
}
