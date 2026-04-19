"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Boxes, PlusCircle, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface System {
  id: string;
  name: string;
  vendor: string | null;
  purpose: string;
  risk_tier: string;
  deployment_type: string;
  created_at: string;
  classified_at: string | null;
}

const TIER_CLASS: Record<string, string> = {
  unacceptable: "bg-red-700 text-white",
  high: "bg-orange-600 text-white",
  limited: "bg-yellow-500 text-white",
  minimal: "bg-emerald-600 text-white",
  unclassified: "bg-muted text-muted-foreground",
};

export default function AISystemsListPage() {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/ai-systems");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSystems(data.systems ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = systems.filter(
    (s) =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      (s.vendor ?? "").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Boxes className="h-6 w-6 text-primary" /> AI Systems
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every AI tool, plugin, or informal usage the organization relies on.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/ai-systems/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add System
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or vendor..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <Card><CardContent className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {systems.length === 0
              ? "No AI systems yet. Add your first to start classifying."
              : "No matches for your search."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((s) => (
            <Card key={s.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/dashboard/ai-systems/${s.id}`}
                      className="font-semibold hover:underline"
                    >
                      {s.name}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">
                      {s.vendor ? `${s.vendor} · ` : ""}{s.purpose}
                    </p>
                  </div>
                  <Badge className={TIER_CLASS[s.risk_tier] ?? TIER_CLASS.unclassified}>
                    {s.risk_tier}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {s.deployment_type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
