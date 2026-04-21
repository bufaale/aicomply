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
import { Loader2, Shield, ArrowLeft, Sparkles } from "lucide-react";

interface System {
  id: string;
  name: string;
  risk_tier: string;
}

const DEPLOYER_TYPES = [
  { value: "public_authority", label: "Public authority" },
  { value: "public_body", label: "Body governed by public law" },
  { value: "private_public_service", label: "Private entity providing a public service" },
  { value: "credit_scoring", label: "Private entity — credit scoring" },
  { value: "insurance_pricing", label: "Private entity — life or health insurance pricing" },
  { value: "other", label: "Other (document rationale)" },
];

export default function NewFriaPage() {
  const router = useRouter();
  const [systems, setSystems] = useState<System[]>([]);
  const [systemId, setSystemId] = useState<string>("");
  const [systemName, setSystemName] = useState("");
  const [systemPurpose, setSystemPurpose] = useState("");
  const [deployerType, setDeployerType] = useState<string>("");
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
        body.system_name = systemName;
        body.system_purpose = systemPurpose;
      }
      if (deployerType) body.deployer_type = deployerType;

      const res = await fetch("/api/fria", {
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
      router.push(`/dashboard/fria/${json.assessment.id}`);
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/fria">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to FRIAs
          </Link>
        </Button>
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight">
          Generate a FRIA draft
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Claude will pre-fill all five Article 27(1) sections from the information
          you provide. Edit and review each section before notifying the national
          market surveillance authority.
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
                  Choosing an existing system pre-fills purpose, vendor and context.
                </p>
              </div>
            )}

            {!systemId && (
              <>
                <div>
                  <Label htmlFor="system-name">System name</Label>
                  <Input
                    id="system-name"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                    className="mt-1.5"
                    required={!systemId}
                    maxLength={200}
                    placeholder="e.g. Resume Screening Classifier"
                  />
                </div>
                <div>
                  <Label htmlFor="system-purpose">Purpose (what does it do?)</Label>
                  <Textarea
                    id="system-purpose"
                    value={systemPurpose}
                    onChange={(e) => setSystemPurpose(e.target.value)}
                    className="mt-1.5"
                    required={!systemId}
                    maxLength={2000}
                    rows={3}
                    placeholder="Ranks candidate CVs by similarity to role requirements, surfaces top 20 for recruiter review…"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="deployer">Deployer type (Art. 27 applicability)</Label>
              <Select value={deployerType} onValueChange={setDeployerType}>
                <SelectTrigger id="deployer" className="mt-1.5">
                  <SelectValue placeholder="Select deployer type" />
                </SelectTrigger>
                <SelectContent>
                  {DEPLOYER_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1.5 text-xs text-muted-foreground">
                FRIA is mandatory for the first four categories. If &quot;other&quot;,
                document why you are preparing one voluntarily.
              </p>
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
                    Generate FRIA draft
                  </>
                )}
              </Button>
              <span className="text-xs text-muted-foreground">
                ~10-15 seconds · reviewable &amp; editable afterwards
              </span>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <Shield className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          This draft is a starting point. A qualified DPO or privacy counsel must
          review and complete it before notifying the national market surveillance
          authority under Article 27(3). AIComply does not warrant legal compliance.
        </p>
      </div>
    </div>
  );
}
