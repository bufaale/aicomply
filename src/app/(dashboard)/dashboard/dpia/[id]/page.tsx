"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Download, Loader2, Save, Trash2 } from "lucide-react";

interface Assessment {
  id: string;
  user_id: string;
  system_id: string | null;
  status: "draft" | "in_review" | "approved" | "superseded";
  reviewer_email: string | null;
  reviewed_at: string | null;
  supervisory_authority_consulted: boolean;
  supervisory_consultation_date: string | null;
  processing_description: string;
  processing_purposes: string;
  data_categories: string;
  data_subjects: string;
  recipients: string;
  retention_period: string;
  international_transfers: string;
  legal_basis: string;
  necessity_justification: string;
  proportionality_assessment: string;
  data_minimisation: string;
  rights_at_risk: string;
  risk_scenarios: string;
  likelihood_severity: string;
  technical_measures: string;
  organisational_measures: string;
  data_subject_rights: string;
  breach_procedure: string;
  dpo_consultation: string;
  created_at: string;
  updated_at: string;
}

type DpiaTextField =
  | "processing_description"
  | "processing_purposes"
  | "data_categories"
  | "data_subjects"
  | "recipients"
  | "retention_period"
  | "international_transfers"
  | "legal_basis"
  | "necessity_justification"
  | "proportionality_assessment"
  | "data_minimisation"
  | "rights_at_risk"
  | "risk_scenarios"
  | "likelihood_severity"
  | "technical_measures"
  | "organisational_measures"
  | "data_subject_rights"
  | "breach_procedure"
  | "dpo_consultation";

const SECTIONS: Array<{
  title: string;
  article: string;
  fields: Array<{ key: DpiaTextField; label: string; help: string }>;
}> = [
  {
    title: "1. Systematic description of processing",
    article: "Art. 35(7)(a)",
    fields: [
      { key: "processing_description", label: "Processing description", help: "Nature, scope, context." },
      { key: "processing_purposes", label: "Purposes", help: "Each distinct purpose pursued." },
      { key: "data_categories", label: "Data categories", help: "Flag Art. 9 special category data." },
      { key: "data_subjects", label: "Data subjects", help: "Categories incl. vulnerable groups." },
      { key: "recipients", label: "Recipients", help: "Internal teams, processors, third parties." },
      { key: "retention_period", label: "Retention", help: "Period + justification per Art. 5(1)(e)." },
      { key: "international_transfers", label: "International transfers", help: "EEA? SCCs? BCRs? Derogation?" },
    ],
  },
  {
    title: "2. Necessity & proportionality",
    article: "Art. 35(7)(b)",
    fields: [
      { key: "legal_basis", label: "Lawful basis", help: "Art. 6 (+ Art. 9 if special)." },
      { key: "necessity_justification", label: "Necessity", help: "Evidence-based justification." },
      { key: "proportionality_assessment", label: "Proportionality", help: "Balancing test." },
      { key: "data_minimisation", label: "Data minimisation", help: "Concrete measures per Art. 5(1)(c)." },
    ],
  },
  {
    title: "3. Risks to rights & freedoms",
    article: "Art. 35(7)(c)",
    fields: [
      { key: "rights_at_risk", label: "Rights implicated", help: "Charter + GDPR-protected rights." },
      { key: "risk_scenarios", label: "Risk scenarios", help: "Likelihood × severity." },
      { key: "likelihood_severity", label: "Likelihood & severity methodology", help: "CNIL PIA scale or equivalent." },
    ],
  },
  {
    title: "4. Mitigation measures",
    article: "Art. 35(7)(d) · Art. 32",
    fields: [
      { key: "technical_measures", label: "Technical measures", help: "Encryption, access control, logging." },
      { key: "organisational_measures", label: "Organisational measures", help: "Policies, training, DPAs." },
      { key: "data_subject_rights", label: "Data subject rights", help: "Arts. 15-22 fulfilment + SLA." },
      { key: "breach_procedure", label: "Breach procedure", help: "Art. 33 + 34 workflow." },
    ],
  },
  {
    title: "5. DPO & supervisory consultation",
    article: "Art. 35(2) · Art. 36",
    fields: [
      { key: "dpo_consultation", label: "DPO consultation", help: "Involvement + prior consultation posture." },
    ],
  },
];

export default function DpiaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/dpia/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAssessment(data.assessment);
      } catch {
        setError("Could not load assessment");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function update<K extends keyof Assessment>(key: K, value: Assessment[K]) {
    setAssessment((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave() {
    if (!assessment) return;
    setSaving(true);
    setError(null);

    const payload: Partial<Assessment> = {};
    for (const section of SECTIONS) {
      for (const field of section.fields) {
        (payload as Record<string, unknown>)[field.key] = assessment[field.key];
      }
    }
    payload.status = assessment.status;
    payload.supervisory_authority_consulted = assessment.supervisory_authority_consulted;

    try {
      const res = await fetch(`/api/dpia/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(typeof json.error === "string" ? json.error : "Save failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this DPIA? This cannot be undone.")) return;
    await fetch(`/api/dpia/${id}`, { method: "DELETE" });
    window.location.href = "/dashboard/dpia";
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading
      </div>
    );
  }

  if (!assessment) {
    return <div className="text-sm text-red-700">{error ?? "Not found"}</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/dpia">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to DPIAs
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            DPIA · {assessment.id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Created {new Date(assessment.created_at).toLocaleString()} · Updated{" "}
            {new Date(assessment.updated_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={assessment.status}
            onValueChange={(v) => update("status", v as Assessment["status"])}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in_review">In review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="superseded">Superseded</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild variant="outline">
            <a href={`/api/dpia/${id}/pdf`} download>
              <Download className="mr-2 h-4 w-4" /> PDF
            </a>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
        <Checkbox
          id="sa-consulted"
          checked={assessment.supervisory_authority_consulted}
          onCheckedChange={(checked) =>
            update("supervisory_authority_consulted", Boolean(checked))
          }
        />
        <Label htmlFor="sa-consulted" className="cursor-pointer font-medium text-amber-900">
          Supervisory authority consulted per Art. 36(1)
        </Label>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {SECTIONS.map((section) => (
          <Card key={section.title}>
            <CardContent className="pt-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <h2 className="font-display text-lg font-semibold">{section.title}</h2>
                <Badge variant="outline" className="font-mono text-xs">
                  {section.article}
                </Badge>
              </div>
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <p className="text-xs text-muted-foreground">{field.help}</p>
                    <Textarea
                      id={field.key}
                      value={(assessment[field.key] ?? "") as string}
                      onChange={(e) => update(field.key, e.target.value)}
                      rows={5}
                      className="mt-1.5 font-mono text-xs"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-md border border-slate-200 p-4">
        <div>
          <p className="text-sm font-semibold">Danger zone</p>
          <p className="text-xs text-muted-foreground">
            Deleting removes this DPIA and all its history.
          </p>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </div>
    </div>
  );
}
