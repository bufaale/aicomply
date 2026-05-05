"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileArchive, PlusCircle, Loader2, FileText, Lock } from "lucide-react";
import { CrossWalkBanner } from "@/components/cross-walk-banner";

interface AnnexIvDoc {
  id: string;
  system_id: string | null;
  status: "draft" | "in_review" | "approved" | "superseded";
  reviewer_email: string | null;
  reviewed_at: string | null;
  updated_at: string;
}

const STATUS_STYLE: Record<AnnexIvDoc["status"], string> = {
  draft: "bg-slate-200 text-slate-800",
  in_review: "bg-amber-500 text-white",
  approved: "bg-emerald-600 text-white",
  superseded: "bg-slate-500 text-white",
};

export default function AnnexIvListPage() {
  const [items, setItems] = useState<AnnexIvDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/annex-iv");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setItems(data.documents ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Annex IV technical documentation
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            EU AI Act Article 11 + Annex IV. Providers of high-risk AI systems
            must maintain this pack covering the nine mandatory sections.
            Must be kept current through the system lifecycle and made
            available to authorities on request.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/annex-iv/new">
            <PlusCircle className="mr-2 h-4 w-4" /> New Annex IV pack
          </Link>
        </Button>
      </div>

      <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <Lock className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Annex IV generation is on the <strong>Regulated plan</strong>. A
          provider acting under a self-cert conformity path (Annex VI) or
          notified-body path (Annex VII) can download the drafts as PDF
          submissions directly to their quality manager or audit team.
        </p>
      </div>

      <CrossWalkBanner />

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading documents
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileArchive className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-display text-lg font-semibold">
              No Annex IV packs yet
            </p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Generate your first Annex IV documentation pack. Claude drafts
              all nine sections with Art. 11 + Annex IV inline references.
              Quality manager review required before notified-body
              submission.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/annex-iv/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Generate my first pack
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {items.map((a) => (
            <Link
              key={a.id}
              href={`/dashboard/annex-iv/${a.id}`}
              className="rounded-md border bg-card p-5 transition-colors hover:border-slate-400"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-semibold">Annex IV — {a.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(a.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge className={STATUS_STYLE[a.status]}>
                  {a.status.replace("_", " ")}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
