"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, ExternalLink, ShieldCheck, Copy, Check } from "lucide-react";

interface TrustProfile {
  trust_slug: string | null;
  trust_enabled: boolean;
  trust_display_name: string | null;
  trust_website: string | null;
}

export default function TrustSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [slug, setSlug] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/trust");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const p: TrustProfile = data.profile ?? {};
        setSlug(p.trust_slug ?? "");
        setEnabled(Boolean(p.trust_enabled));
        setDisplayName(p.trust_display_name ?? "");
        setWebsite(p.trust_website ?? "");
      } catch {
        setError("Could not load trust settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      const body: Record<string, unknown> = {
        trust_enabled: enabled,
        trust_display_name: displayName,
        trust_website: website,
      };
      if (slug) body.trust_slug = slug;

      const res = await fetch("/api/trust", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(typeof json.error === "string" ? json.error : "Save failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  const publicUrl =
    slug && enabled
      ? `${typeof window !== "undefined" ? window.location.origin : ""}/trust/${slug}`
      : null;

  async function copyUrl() {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Public trust page
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Expose an aggregated summary of your EU AI Act posture at a public URL.
          Procurement teams increasingly ask for this during vendor qualification.
          No sensitive data — only counts, risk-tier distribution and a readiness
          score.
        </p>
      </div>

      {publicUrl && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Your public trust page is live</p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="flex-1 truncate rounded-sm border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs">
                    {publicUrl}
                  </code>
                  <Button variant="outline" size="sm" onClick={copyUrl}>
                    {copied ? (
                      <>
                        <Check className="mr-1.5 h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> View
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Label className="text-base">Enable public trust page</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                When off, the URL returns 404 even if a slug is set.
              </p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div>
            <Label htmlFor="slug">URL slug</Label>
            <p className="text-xs text-muted-foreground">
              Lowercase letters, numbers and dashes. 3-41 characters. Unique across
              all AIComply deployers.
            </p>
            <div className="mt-1.5 flex items-center gap-1">
              <span className="text-sm text-slate-500">/trust/</span>
              <Input
                id="slug"
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                }
                maxLength={41}
                placeholder="acme-corp"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="display-name">Display name (optional)</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={120}
              placeholder="Acme Corp"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="website">Website (optional)</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              maxLength={200}
              placeholder="https://acme.example"
              className="mt-1.5"
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="rounded-md border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
        <p className="font-semibold">What shows on your public page</p>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-xs">
          <li>Number of AI systems in your inventory</li>
          <li>Breakdown by EU AI Act risk tier (Unacceptable / High / Limited / Minimal / Unclassified)</li>
          <li>Number of FRIA assessments and how many are approved</li>
          <li>Number of Article 4 AI literacy records</li>
          <li>A readiness score 0-100 derived from all of the above</li>
        </ul>
        <p className="mt-2 text-xs">
          No system names, no vendor names, no PII, no free-text content ever
          leaves the authenticated dashboard. Check the{" "}
          <Link href="/dashboard/fria" className="underline">
            FRIA page
          </Link>{" "}
          to see what a reviewer sees privately.
        </p>
      </div>
    </div>
  );
}
