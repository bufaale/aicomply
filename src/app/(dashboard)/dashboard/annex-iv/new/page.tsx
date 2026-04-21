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
import { Loader2, FileArchive, ArrowLeft, Sparkles } from "lucide-react";

interface System {
  id: string;
  name: string;
  risk_tier: string;
}

const ANNEX_III_CATEGORIES = [
  "Biometric identification and categorisation (Annex III §1)",
  "Critical infrastructure management (Annex III §2)",
  "Education and vocational training (Annex III §3)",
  "Employment, workers management, access to self-employment (Annex III §4)",
  "Access to and enjoyment of essential services (Annex III §5)",
  "Law enforcement (Annex III §6)",
  "Migration, asylum, and border control (Annex III §7)",
  "Administration of justice and democratic processes (Annex III §8)",
];

export default function NewAnnexIvPage() {
  const router = useRouter();
  const [systems, setSystems] = useState<System[]>([]);
  const [systemId, setSystemId] = useState<string>("");
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [category, setCategory] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/ai-systems");
        if (!res.ok) return;
        const data = await res.json();
        setSystems((data.systems ?? []).filter((s: System) => s.risk_tier === "high" || s.risk_tier === "unclassified"));
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
        body.system_name = name;
        body.system_purpose = purpose;
      }
      if (category) body.annex_iii_category = category;

      const res = await fetch("/api/annex-iv", {
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
      router.push(`/dashboard/annex-iv/${json.document.id}`);
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/annex-iv">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Annex IV
          </Link>
        </Button>
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight">
          Generate an Annex IV documentation pack
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Claude drafts all nine Annex IV sections. Your technical lead /
          quality manager reviews before you submit to a notified body or
          self-certify under Annex VI.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {systems.length > 0 && (
              <div>
                <Label htmlFor="system">Use an existing AI system (high-risk)</Label>
                <Select value={systemId} onValueChange={setSystemId}>
                  <SelectTrigger id="system" className="mt-1.5">
                    <SelectValue placeholder="Select system (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {systems.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {!systemId && (
              <>
                <div>
                  <Label htmlFor="name">System name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5"
                    required={!systemId}
                    maxLength={200}
                  />
                </div>
                <div>
                  <Label htmlFor="purpose">Intended purpose</Label>
                  <Textarea
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="mt-1.5"
                    required={!systemId}
                    maxLength={2000}
                    rows={3}
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="category">Annex III high-risk category (optional)</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="mt-1.5">
                  <SelectValue placeholder="Pick if Annex III applies" />
                </SelectTrigger>
                <SelectContent>
                  {ANNEX_III_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
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
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating draft</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" />Generate Annex IV pack</>
                )}
              </Button>
              <span className="text-xs text-muted-foreground">
                ~30 seconds · 9 sections · reviewable afterwards
              </span>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <FileArchive className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Annex IV applies to <strong>providers</strong> of high-risk AI systems
          (Art. 3(3)). If you fine-tune a GPAI model on your data, you may
          become a provider under Art. 3(68)(b) and inherit this obligation.
        </p>
      </div>
    </div>
  );
}
