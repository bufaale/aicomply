"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NewSystemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    vendor: "",
    purpose: "",
    usage_context: "",
    data_inputs: "",
    data_outputs: "",
    business_units: "",
    ai_provider: "",
    base_model: "",
    deployment_type: "saas" as const,
    owner_email: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ai-systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Failed");
      }
      toast.success("System added. Running classification…");
      const classifyRes = await fetch(`/api/ai-systems/${data.system.id}/classify`, {
        method: "POST",
      });
      if (!classifyRes.ok) {
        toast.info("System saved, classification queued. You can retry later.");
      }
      router.push(`/dashboard/ai-systems/${data.system.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add system");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/ai-systems">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Add an AI System</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>System details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ChatGPT Enterprise"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input
                  id="vendor"
                  value={form.vendor}
                  onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                  placeholder="OpenAI"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                required
                minLength={10}
                rows={2}
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                placeholder="What is this AI system used for?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usage_context">Usage context</Label>
              <Textarea
                id="usage_context"
                rows={2}
                value={form.usage_context}
                onChange={(e) => setForm({ ...form, usage_context: e.target.value })}
                placeholder="Who uses it, when, how often, at what point in your processes."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="data_inputs">Data inputs</Label>
                <Textarea
                  id="data_inputs"
                  rows={2}
                  value={form.data_inputs}
                  onChange={(e) => setForm({ ...form, data_inputs: e.target.value })}
                  placeholder="Customer emails, CVs, product specs..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_outputs">Decisions / outputs</Label>
                <Textarea
                  id="data_outputs"
                  rows={2}
                  value={form.data_outputs}
                  onChange={(e) => setForm({ ...form, data_outputs: e.target.value })}
                  placeholder="Short-listed candidates, credit score, content draft..."
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="base_model">Underlying model</Label>
                <Input
                  id="base_model"
                  value={form.base_model}
                  onChange={(e) => setForm({ ...form, base_model: e.target.value })}
                  placeholder="GPT-4o, Claude Sonnet 4.6..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deployment_type">Deployment</Label>
                <select
                  id="deployment_type"
                  aria-label="Deployment type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.deployment_type}
                  onChange={(e) =>
                    setForm({ ...form, deployment_type: e.target.value as typeof form.deployment_type })
                  }
                >
                  <option value="saas">SaaS subscription</option>
                  <option value="api">Direct API</option>
                  <option value="plugin">Plugin / extension</option>
                  <option value="self_hosted">Self-hosted</option>
                  <option value="informal">Informal (BYO)</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="business_units">Business units</Label>
                <Input
                  id="business_units"
                  value={form.business_units}
                  onChange={(e) => setForm({ ...form, business_units: e.target.value })}
                  placeholder="HR, Marketing"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner_email">Owner email</Label>
                <Input
                  id="owner_email"
                  type="email"
                  value={form.owner_email}
                  onChange={(e) => setForm({ ...form, owner_email: e.target.value })}
                  placeholder="owner@company.com"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/ai-systems">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save &amp; classify
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
