"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, PlusCircle, Loader2, FileText } from "lucide-react";

interface Assessment {
  id: string;
  system_id: string | null;
  status: "draft" | "in_review" | "approved" | "superseded";
  reviewer_email: string | null;
  reviewed_at: string | null;
  supervisory_authority_consulted: boolean;
  updated_at: string;
  created_at: string;
}

const STATUS_STYLE: Record<Assessment["status"], string> = {
  draft: "bg-slate-200 text-slate-800",
  in_review: "bg-amber-500 text-white",
  approved: "bg-emerald-600 text-white",
  superseded: "bg-slate-500 text-white",
};

export default function DpiaListPage() {
  const [items, setItems] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/dpia");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setItems(data.assessments ?? []);
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
            Data Protection Impact Assessments
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            GDPR Article 35. Required when processing is likely to result in a
            high risk to the rights and freedoms of data subjects. Common
            triggers: large-scale profiling, special category data, monitoring
            of public areas, or any item on your supervisory authority&apos;s
            Art. 35(4) positive list.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/dpia/new">
            <PlusCircle className="mr-2 h-4 w-4" /> New DPIA
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading assessments
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ShieldCheck className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-display text-lg font-semibold">No DPIAs yet</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Generate your first DPIA from an AI system in your inventory or
              from any processing operation. Claude drafts all Art. 35(7)
              sections. A qualified DPO must review before the controller
              relies on the output.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/dpia/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Generate my first DPIA
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {items.map((a) => (
            <Link
              key={a.id}
              href={`/dashboard/dpia/${a.id}`}
              className="rounded-md border bg-card p-5 transition-colors hover:border-slate-400"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-semibold">DPIA — {a.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(a.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {a.supervisory_authority_consulted && (
                    <Badge variant="outline" className="text-xs">SA consulted</Badge>
                  )}
                  <Badge className={STATUS_STYLE[a.status]}>
                    {a.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
