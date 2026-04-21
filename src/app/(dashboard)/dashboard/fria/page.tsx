"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, PlusCircle, Loader2, FileText } from "lucide-react";

interface Assessment {
  id: string;
  system_id: string | null;
  status: "draft" | "in_review" | "approved" | "superseded";
  reviewer_email: string | null;
  reviewed_at: string | null;
  notified_authority_at: string | null;
  updated_at: string;
  created_at: string;
}

const STATUS_STYLE: Record<Assessment["status"], string> = {
  draft: "bg-slate-200 text-slate-800",
  in_review: "bg-amber-500 text-white",
  approved: "bg-emerald-600 text-white",
  superseded: "bg-slate-500 text-white",
};

export default function FriaListPage() {
  const [items, setItems] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/fria");
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
            Fundamental Rights Impact Assessments
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Article 27 EU AI Act. Required before first use of a high-risk system by a
            deployer that is a public authority, body governed by public law, private
            entity providing public services, or is using the system for credit scoring
            or life/health insurance pricing. Enforceable from 2 August 2026.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/fria/new">
            <PlusCircle className="mr-2 h-4 w-4" /> New FRIA
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
            <Shield className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-display text-lg font-semibold">
              No FRIAs yet
            </p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Generate your first FRIA from an existing AI system in your inventory,
              or start from a blank template. The draft uses Claude to pre-fill all
              five sections per Art. 27(1). A qualified DPO must review before
              notification to the national authority.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/fria/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Generate my first FRIA
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {items.map((a) => (
            <Link
              key={a.id}
              href={`/dashboard/fria/${a.id}`}
              className="rounded-md border bg-card p-5 transition-colors hover:border-slate-400"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-semibold">FRIA — {a.id.slice(0, 8)}</p>
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
