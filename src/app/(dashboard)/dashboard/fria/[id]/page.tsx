"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Download,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

interface Assessment {
  id: string;
  user_id: string;
  system_id: string | null;
  status: "draft" | "in_review" | "approved" | "superseded";
  reviewer_email: string | null;
  reviewed_at: string | null;
  notified_authority_at: string | null;
  system_description: string;
  deployment_purpose: string;
  deployment_duration: string;
  affected_groups: string;
  frequency_of_use: string;
  rights_at_risk: string;
  harm_scenarios: string;
  oversight_measures: string;
  oversight_personnel: string;
  mitigation_measures: string;
  escalation_procedure: string;
  governance_framework: string;
  complaint_mechanism: string;
  created_at: string;
  updated_at: string;
}

type FriaTextField =
  | "system_description"
  | "deployment_purpose"
  | "deployment_duration"
  | "affected_groups"
  | "frequency_of_use"
  | "rights_at_risk"
  | "harm_scenarios"
  | "oversight_measures"
  | "oversight_personnel"
  | "mitigation_measures"
  | "escalation_procedure"
  | "governance_framework"
  | "complaint_mechanism";

const SECTIONS: Array<{
  title: string;
  article: string;
  fields: Array<{
    key: FriaTextField;
    label: string;
    help: string;
  }>;
}> = [
  {
    title: "1. Deployer processes & context of use",
    article: "Art. 27(1)(a)–(c)",
    fields: [
      { key: "system_description", label: "System description", help: "Narrative of the processes using the high-risk system." },
      { key: "deployment_purpose", label: "Deployment purpose", help: "Operational objective tied to a legitimate aim." },
      { key: "deployment_duration", label: "Duration", help: "Period over which the system will be used." },
      { key: "frequency_of_use", label: "Frequency of use", help: "How often decisions affecting natural persons are produced." },
      { key: "affected_groups", label: "Affected groups", help: "Categories of natural persons or groups likely to be affected." },
    ],
  },
  {
    title: "2. Risks to fundamental rights",
    article: "Art. 27(1)(d)",
    fields: [
      { key: "rights_at_risk", label: "Rights implicated", help: "Specific Charter of Fundamental Rights articles at risk." },
      { key: "harm_scenarios", label: "Harm scenarios", help: "Concrete failure modes and resulting harm." },
    ],
  },
  {
    title: "3. Human oversight",
    article: "Art. 27(1)(e) · Art. 14",
    fields: [
      { key: "oversight_measures", label: "Oversight measures", help: "How reviewers will monitor, override and interpret outputs." },
      { key: "oversight_personnel", label: "Oversight personnel", help: "Roles, competencies, training requirements." },
    ],
  },
  {
    title: "4. Mitigation if risks materialise",
    article: "Art. 27(1)(f)",
    fields: [
      { key: "mitigation_measures", label: "Mitigation measures", help: "Actions to correct, suspend or remediate harmful outcomes." },
      { key: "escalation_procedure", label: "Escalation procedure", help: "Operator → manager → DPO → authority path." },
    ],
  },
  {
    title: "5. Governance & complaints",
    article: "Art. 27(1)(f) · Art. 26",
    fields: [
      { key: "governance_framework", label: "Governance framework", help: "Internal governance, logging, review cadence." },
      { key: "complaint_mechanism", label: "Complaint mechanism", help: "How affected persons can seek explanations and lodge complaints." },
    ],
  },
];

export default function FriaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/fria/${id}`);
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

    const payload: Partial<Assessment> = {
      system_description: assessment.system_description,
      deployment_purpose: assessment.deployment_purpose,
      deployment_duration: assessment.deployment_duration,
      affected_groups: assessment.affected_groups,
      frequency_of_use: assessment.frequency_of_use,
      rights_at_risk: assessment.rights_at_risk,
      harm_scenarios: assessment.harm_scenarios,
      oversight_measures: assessment.oversight_measures,
      oversight_personnel: assessment.oversight_personnel,
      mitigation_measures: assessment.mitigation_measures,
      escalation_procedure: assessment.escalation_procedure,
      governance_framework: assessment.governance_framework,
      complaint_mechanism: assessment.complaint_mechanism,
      status: assessment.status,
    };

    try {
      const res = await fetch(`/api/fria/${id}`, {
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
    if (!confirm("Delete this FRIA? This cannot be undone.")) return;
    await fetch(`/api/fria/${id}`, { method: "DELETE" });
    window.location.href = "/dashboard/fria";
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-sm text-red-700">{error ?? "Not found"}</div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/fria">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to FRIAs
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            FRIA · {assessment.id.slice(0, 8)}
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
            <a href={`/api/fria/${id}/pdf`} download>
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
            Deleting removes this FRIA and all its history.
          </p>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </div>
    </div>
  );
}
