"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Loader2, RefreshCw, Trash2, Sparkles, FileText, AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface System {
  id: string;
  name: string;
  vendor: string | null;
  purpose: string;
  usage_context: string | null;
  data_inputs: string | null;
  data_outputs: string | null;
  business_units: string | null;
  deployment_type: string;
  base_model: string | null;
  owner_email: string | null;
  risk_tier: string;
  risk_rationale: string | null;
  classified_at: string | null;
  created_at: string;
}

interface Obligation {
  id: string;
  article: string;
  title: string;
  description: string | null;
  status: string;
}

const TIER_CLASS: Record<string, string> = {
  unacceptable: "bg-red-700 text-white",
  high: "bg-orange-600 text-white",
  limited: "bg-yellow-500 text-white",
  minimal: "bg-emerald-600 text-white",
  unclassified: "bg-muted text-muted-foreground",
};

const TIER_LABEL: Record<string, string> = {
  unacceptable: "Unacceptable — prohibited (Art. 5)",
  high: "High risk (Art. 6 + Annex III)",
  limited: "Limited risk — transparency (Art. 50)",
  minimal: "Minimal risk",
  unclassified: "Not yet classified",
};

export default function SystemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [system, setSystem] = useState<System | null>(null);
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [loading, setLoading] = useState(true);
  const [reclassifying, setReclassifying] = useState(false);

  async function load() {
    try {
      const res = await fetch(`/api/ai-systems/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSystem(data.system);
      setObligations(data.obligations ?? []);
    } catch {
      toast.error("Failed to load system");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleReclassify() {
    setReclassifying(true);
    try {
      const res = await fetch(`/api/ai-systems/${id}/classify`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(typeof data.error === "string" ? data.error : "Failed");
      }
      toast.success("Reclassified");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reclassify");
    } finally {
      setReclassifying(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this AI system and all its obligations?")) return;
    try {
      const res = await fetch(`/api/ai-systems/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted");
      router.push("/dashboard/ai-systems");
    } catch {
      toast.error("Failed to delete");
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (!system) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/ai-systems">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{system.name}</h1>
            {system.vendor && (
              <p className="text-sm text-muted-foreground">{system.vendor}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleReclassify} disabled={reclassifying}>
            {reclassifying ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Reclassify
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Risk classification
            </span>
            <Badge className={TIER_CLASS[system.risk_tier] ?? TIER_CLASS.unclassified}>
              {TIER_LABEL[system.risk_tier] ?? system.risk_tier}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {system.risk_rationale ? (
            <p className="text-sm leading-relaxed">{system.risk_rationale}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Not yet classified. Click &quot;Reclassify&quot; to run the EU AI Act risk analysis.
            </p>
          )}
          {system.classified_at && (
            <p className="text-xs text-muted-foreground">
              Last classified {new Date(system.classified_at).toLocaleString()}
            </p>
          )}
          {system.risk_tier === "unacceptable" && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:bg-red-950/40 dark:text-red-100 dark:border-red-900 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">This system is prohibited under Article 5.</p>
                <p>
                  The EU AI Act bans this use case. Deploying it in the EU exposes you to
                  fines of up to €35M or 7% of global annual turnover.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Obligations ({obligations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {obligations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Reclassify to generate obligations for this system.
            </p>
          ) : (
            <ul className="space-y-3">
              {obligations.map((o) => (
                <li key={o.id} className="border-b pb-3 last:border-0">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="min-w-[90px] justify-center">
                      {o.article}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{o.title}</p>
                      {o.description && (
                        <p className="text-sm text-muted-foreground mt-1">{o.description}</p>
                      )}
                    </div>
                    <Badge
                      className={
                        o.status === "completed"
                          ? "bg-emerald-600 text-white"
                          : o.status === "in_progress"
                            ? "bg-blue-600 text-white"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      {o.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 text-sm">
          <Detail label="Purpose" value={system.purpose} />
          <Detail label="Usage context" value={system.usage_context} />
          <Detail label="Data inputs" value={system.data_inputs} />
          <Detail label="Data outputs" value={system.data_outputs} />
          <Detail label="Business units" value={system.business_units} />
          <Detail label="Underlying model" value={system.base_model} />
          <Detail label="Deployment" value={system.deployment_type} />
          <Detail label="Owner email" value={system.owner_email} />
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1">{value || <span className="text-muted-foreground">—</span>}</p>
    </div>
  );
}
