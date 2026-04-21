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
import { ArrowLeft, Download, Loader2, Save, Trash2 } from "lucide-react";

interface AnnexIvDoc {
  id: string;
  status: "draft" | "in_review" | "approved" | "superseded";
  system_intended_purpose: string;
  system_developer_identity: string;
  system_version_and_date: string;
  system_interaction_with_hardware: string;
  system_software_versions: string;
  system_deployment_forms: string;
  system_hardware_description: string;
  design_methods_and_steps: string;
  design_specifications: string;
  system_architecture: string;
  data_requirements: string;
  human_oversight_assessment: string;
  accuracy_and_performance_metrics: string;
  capabilities_and_limitations: string;
  degrees_of_accuracy: string;
  foreseeable_unintended_outcomes: string;
  specifications_input_data: string;
  risk_management_description: string;
  lifecycle_changes: string;
  harmonised_standards_applied: string;
  conformity_assessment_procedure: string;
  conformity_assessment_changes: string;
  post_market_monitoring_plan: string;
  additional_information: string;
  created_at: string;
  updated_at: string;
}

type Field = Exclude<keyof AnnexIvDoc, "id" | "status" | "created_at" | "updated_at">;

const SECTIONS: Array<{ title: string; ref: string; fields: Array<{ key: Field; label: string; ref: string }> }> = [
  {
    title: "§1 General description",
    ref: "Annex IV §1",
    fields: [
      { key: "system_intended_purpose", label: "Intended purpose", ref: "§1(a)" },
      { key: "system_developer_identity", label: "Provider identity", ref: "§1(a)" },
      { key: "system_version_and_date", label: "Version + date", ref: "§1(b)" },
      { key: "system_interaction_with_hardware", label: "Hardware interaction", ref: "§1(c)" },
      { key: "system_software_versions", label: "Software versions", ref: "§1(d)" },
      { key: "system_deployment_forms", label: "Deployment forms", ref: "§1(e)" },
      { key: "system_hardware_description", label: "Hardware description", ref: "§1(f)" },
    ],
  },
  {
    title: "§2 Design and development",
    ref: "Annex IV §2",
    fields: [
      { key: "design_methods_and_steps", label: "Methods", ref: "§2(a)" },
      { key: "design_specifications", label: "Design specs", ref: "§2(b)" },
      { key: "system_architecture", label: "Architecture", ref: "§2(c)" },
      { key: "data_requirements", label: "Data requirements (Art. 10)", ref: "§2(d)" },
      { key: "human_oversight_assessment", label: "Human oversight (Art. 14)", ref: "§2(e)" },
      { key: "accuracy_and_performance_metrics", label: "Accuracy & performance (Art. 15)", ref: "§2(f)" },
    ],
  },
  {
    title: "§3 Monitoring, functioning, control",
    ref: "Annex IV §3",
    fields: [
      { key: "capabilities_and_limitations", label: "Capabilities / limits", ref: "§3(a)" },
      { key: "degrees_of_accuracy", label: "Accuracy per subgroup", ref: "§3(b)" },
      { key: "foreseeable_unintended_outcomes", label: "Unintended outcomes", ref: "§3(c)" },
      { key: "specifications_input_data", label: "Input-data spec", ref: "§3(d)" },
    ],
  },
  {
    title: "§4 Risk management system",
    ref: "Annex IV §4 · Art. 9",
    fields: [
      { key: "risk_management_description", label: "RMS description", ref: "§4" },
    ],
  },
  {
    title: "§5 Lifecycle changes",
    ref: "Annex IV §5",
    fields: [
      { key: "lifecycle_changes", label: "Change management", ref: "§5" },
    ],
  },
  {
    title: "§6 Harmonised standards",
    ref: "Annex IV §6",
    fields: [
      { key: "harmonised_standards_applied", label: "Standards applied", ref: "§6" },
    ],
  },
  {
    title: "§7 Conformity assessment",
    ref: "Annex IV §7 · Art. 43",
    fields: [
      { key: "conformity_assessment_procedure", label: "Assessment procedure", ref: "§7(a)" },
      { key: "conformity_assessment_changes", label: "Changes since assessment", ref: "§7(b)" },
    ],
  },
  {
    title: "§8 Post-market monitoring",
    ref: "Annex IV §8 · Art. 72",
    fields: [
      { key: "post_market_monitoring_plan", label: "Monitoring plan", ref: "§8" },
    ],
  },
  {
    title: "§9 Additional information",
    ref: "Annex IV §9",
    fields: [
      { key: "additional_information", label: "Supplementary", ref: "§9" },
    ],
  },
];

export default function AnnexIvDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [doc, setDoc] = useState<AnnexIvDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/annex-iv/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setDoc(data.document);
      } catch {
        setError("Could not load document");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function update<K extends keyof AnnexIvDoc>(key: K, value: AnnexIvDoc[K]) {
    setDoc((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave() {
    if (!doc) return;
    setSaving(true);
    setError(null);
    const payload: Partial<AnnexIvDoc> = { status: doc.status };
    for (const section of SECTIONS) {
      for (const field of section.fields) {
        (payload as Record<string, unknown>)[field.key] = doc[field.key];
      }
    }
    try {
      const res = await fetch(`/api/annex-iv/${id}`, {
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
    if (!confirm("Delete this Annex IV pack? This cannot be undone.")) return;
    await fetch(`/api/annex-iv/${id}`, { method: "DELETE" });
    window.location.href = "/dashboard/annex-iv";
  }

  if (loading) {
    return <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Loading
    </div>;
  }
  if (!doc) return <div className="text-sm text-red-700">{error ?? "Not found"}</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/annex-iv">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Annex IV
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Annex IV pack · {doc.id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Updated {new Date(doc.updated_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={doc.status} onValueChange={(v) => update("status", v as AnnexIvDoc["status"])}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in_review">In review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="superseded">Superseded</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild variant="outline">
            <a href={`/api/annex-iv/${id}/pdf`} download>
              <Download className="mr-2 h-4 w-4" /> PDF
            </a>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
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
                <Badge variant="outline" className="font-mono text-xs">{section.ref}</Badge>
              </div>
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <div className="flex items-center justify-between">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <span className="font-mono text-[10px] text-muted-foreground">{field.ref}</span>
                    </div>
                    <Textarea
                      id={field.key}
                      value={(doc[field.key] ?? "") as string}
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
          <p className="text-xs text-muted-foreground">Deleting removes this pack and all its history.</p>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </div>
    </div>
  );
}
