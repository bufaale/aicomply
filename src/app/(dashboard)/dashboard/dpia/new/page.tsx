"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ShieldCheck, ArrowLeft, Sparkles } from "lucide-react";

interface System {
  id: string;
  name: string;
  risk_tier: string;
}

const LAWFUL_BASES = [
  { value: "consent", label: "Consent (Art. 6(1)(a))" },
  { value: "contract", label: "Contract (Art. 6(1)(b))" },
  { value: "legal_obligation", label: "Legal obligation (Art. 6(1)(c))" },
  { value: "vital_interests", label: "Vital interests (Art. 6(1)(d))" },
  { value: "public_task", label: "Public task (Art. 6(1)(e))" },
  { value: "legitimate_interests", label: "Legitimate interests (Art. 6(1)(f))" },
];

export default function NewDpiaPage() {
  const router = useRouter();
  const [systems, setSystems] = useState<System[]>([]);
  const [systemId, setSystemId] = useState<string>("");
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [dataCategoriesHint, setDataCategoriesHint] = useState("");
  const [dataSubjectsHint, setDataSubjectsHint] = useState("");
  const [lawfulBasis, setLawfulBasis] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/ai-systems");
        if (!res.ok) return;
        const data = await res.json();
        setSystems(data.systems ?? []);
      } catch {
        // non-fatal
      }
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const body: Record<string, string> = {};
      if (systemId) body.system_id = systemId;
      else {
        body.processing_name = name;
        body.processing_purpose = purpose;
      }
      if (dataCategoriesHint) body.data_categories_hint = dataCategoriesHint;
      if (dataSubjectsHint) body.data_subjects_hint = dataSubjectsHint;
      if (lawfulBasis) body.lawful_basis_hint = lawfulBasis;

      const res = await fetch("/api/dpia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(typeof json.error === "string" ? json.error : "Generation failed");
        setSubmitting(false);
        return;
      }
      router.push(`/dashboard/dpia/${json.assessment.id}`);
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/dpia">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to DPIAs
          </Link>
        </Button>
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight">
          Generate a DPIA draft
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Claude will pre-fill all Art. 35(7) sections from the inputs below.
          Review each section with your DPO before relying on the output.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {systems.length > 0 && (
              <div>
                <Label htmlFor="system">Use an existing AI system from inventory</Label>
                <Select value={systemId} onValueChange={setSystemId}>
                  <SelectTrigger id="system" className="mt-1.5">
                    <SelectValue placeholder="Select a system (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {systems.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} {s.risk_tier !== "unclassified" ? `· ${s.risk_tier}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Choosing an existing system pre-fills processing context.
                </p>
              </div>
            )}

            {!systemId && (
              <>
                <div>
                  <Label htmlFor="name">Processing name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5"
                    required={!systemId}
                    maxLength={200}
                    placeholder="e.g. Customer support ticket routing"
                  />
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose (what does the processing achieve?)</Label>
                  <Textarea
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="mt-1.5"
                    required={!systemId}
                    maxLength={2000}
                    rows={3}
                    placeholder="Route inbound support tickets to the appropriate team and draft suggested replies..."
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="categories">Data categories (hint, optional)</Label>
              <Input
                id="categories"
                value={dataCategoriesHint}
                onChange={(e) => setDataCategoriesHint(e.target.value)}
                maxLength={2000}
                placeholder="names, emails, support transcript content, IP addresses"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="subjects">Data subjects (hint, optional)</Label>
              <Input
                id="subjects"
                value={dataSubjectsHint}
                onChange={(e) => setDataSubjectsHint(e.target.value)}
                maxLength={1500}
                placeholder="paying customers, trial users, prospects"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="basis">Proposed lawful basis (optional)</Label>
              <Select value={lawfulBasis} onValueChange={setLawfulBasis}>
                <SelectTrigger id="basis" className="mt-1.5">
                  <SelectValue placeholder="Claude will propose one if omitted" />
                </SelectTrigger>
                <SelectContent>
                  {LAWFUL_BASES.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating draft
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate DPIA draft
                  </>
                )}
              </Button>
              <span className="text-xs text-muted-foreground">
                ~15-20 seconds · 5 sections · reviewable afterwards
              </span>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          GDPR Art. 35(2) requires DPO consultation when a DPO has been
          designated. Art. 36(1) requires prior consultation with the
          supervisory authority if residual risk remains high after mitigation.
          AIComply does not warrant legal compliance.
        </p>
      </div>
    </div>
  );
}
