"use client";

import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Radar, Loader2, Upload, CheckCircle2 } from "lucide-react";

interface ToolMatch {
  url: string;
  tool: {
    name: string;
    vendor: string;
    baseModel?: string;
    suggestedTier: "high" | "limited" | "minimal";
    rationale: string;
    category: string;
  };
  alreadyInInventory: boolean;
}

const TIER_STYLE: Record<string, string> = {
  high: "bg-orange-600 text-white",
  limited: "bg-yellow-500 text-white",
  minimal: "bg-emerald-600 text-white",
};

export default function DiscoveryPage() {
  const [pasted, setPasted] = useState("");
  const [scanning, setScanning] = useState(false);
  const [importing, setImporting] = useState(false);
  const [matches, setMatches] = useState<ToolMatch[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [scannedCount, setScannedCount] = useState(0);
  const [registrySize, setRegistrySize] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  function extractUrls(text: string): string[] {
    // Grab URLs (http/https) or plain domains (any `*.com|io|ai|app` pattern)
    const urlMatches = text.match(/https?:\/\/[^\s"'<>]+/g) ?? [];
    const domainMatches = text.match(/[a-z0-9-]+\.(com|ai|io|app|co|net|org)[^\s"'<>]*/gi) ?? [];
    return Array.from(new Set([...urlMatches, ...domainMatches])).slice(0, 2000);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setPasted(text.slice(0, 500_000));
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleScan() {
    const urls = extractUrls(pasted);
    if (urls.length === 0) {
      toast.error("No URLs detected in the input");
      return;
    }
    setScanning(true);
    try {
      const res = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Scan failed");
        return;
      }
      setMatches(data.matches);
      setSelected(new Set(data.matches
        .filter((m: ToolMatch) => !m.alreadyInInventory)
        .map((m: ToolMatch) => m.tool.name)));
      setScannedCount(data.scanned);
      setRegistrySize(data.registrySize);
      toast.success(`${data.matched} of ${data.registrySize} registered AI tools found`);
    } finally {
      setScanning(false);
    }
  }

  async function handleImport() {
    if (selected.size === 0) return;
    setImporting(true);
    try {
      const res = await fetch("/api/discovery/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool_names: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Import failed");
        return;
      }
      toast.success(`Imported ${data.imported.length} system${data.imported.length === 1 ? "" : "s"}`);
      window.location.href = "/dashboard/ai-systems";
    } finally {
      setImporting(false);
    }
  }

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight">
          <Radar className="h-6 w-6" /> Shadow-AI discovery
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Paste URLs, upload a bookmarks / history export, or drop a SaaS
          spend list. We match against our registry of common AI tools,
          pre-classify each match against EU AI Act risk tiers, and you
          import the ones you actually use into your inventory.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label htmlFor="input">Paste URLs / bookmarks / spend data</Label>
            <Textarea
              id="input"
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              rows={10}
              placeholder="Paste anything: a bookmarks HTML export, a CSV of subscriptions, a list of URLs, or a browser history dump. We'll extract every URL and match them."
              maxLength={500_000}
              className="mt-1.5 font-mono text-xs"
            />
            <div className="mt-2 flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <label className="cursor-pointer">
                  <Upload className="mr-2 h-3.5 w-3.5" /> Upload file
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".html,.htm,.csv,.json,.txt"
                    onChange={handleFile}
                    className="hidden"
                  />
                </label>
              </Button>
              <span className="text-xs text-muted-foreground">
                Supports bookmarks HTML, CSV, JSON, plain text. 500KB max.
              </span>
            </div>
          </div>

          <Button onClick={handleScan} disabled={scanning || !pasted.trim()}>
            {scanning ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Scanning</>
            ) : (
              <><Radar className="mr-2 h-4 w-4" />Scan for AI tools</>
            )}
          </Button>
        </CardContent>
      </Card>

      {matches && (
        <>
          <Card>
            <CardContent className="flex flex-wrap items-center gap-6 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  URLs scanned
                </p>
                <p className="font-display text-3xl font-bold">{scannedCount}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  AI tools matched
                </p>
                <p className="font-display text-3xl font-bold text-sky-700">{matches.length}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Registry size
                </p>
                <p className="font-display text-3xl font-bold text-slate-500">{registrySize}</p>
              </div>
              <div className="ml-auto">
                <Button onClick={handleImport} disabled={importing || selected.size === 0}>
                  {importing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                  Import {selected.size} selected
                </Button>
              </div>
            </CardContent>
          </Card>

          {matches.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No registered AI tools in your input.</CardContent></Card>
          ) : (
            <div className="grid gap-3">
              {matches.map((m) => (
                <Card key={m.tool.name}>
                  <CardContent className="flex items-start gap-4 py-5">
                    <Checkbox
                      checked={selected.has(m.tool.name)}
                      disabled={m.alreadyInInventory}
                      onCheckedChange={() => toggle(m.tool.name)}
                      className="mt-1"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{m.tool.name}</p>
                        <Badge className={TIER_STYLE[m.tool.suggestedTier]}>
                          {m.tool.suggestedTier}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{m.tool.category}</Badge>
                        {m.alreadyInInventory && (
                          <Badge variant="outline" className="text-xs text-slate-500">
                            already in inventory
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {m.tool.vendor}
                        {m.tool.baseModel ? ` · ${m.tool.baseModel}` : ""}
                        {" · "}<code>{m.url}</code>
                      </p>
                      <p className="mt-2 text-sm text-slate-700">{m.tool.rationale}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
