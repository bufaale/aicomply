import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Badge variant="destructive" className="mb-4">
          EU AI Act deployer deadline · August 2, 2026 · €35M fines
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          EU AI Act Compliance{" "}
          <span className="text-primary">for SMBs.</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Inventory every AI tool your team uses, auto-classify each one against
          the 4 EU AI Act risk tiers, and generate Article 4 AI literacy
          registers — before penalties start. Vanta charges €50,000+. AIComply
          starts at $49/mo.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/signup">Start free audit</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#pricing">See pricing</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          No credit card required. Free tier: 1 AI system tracked.
        </p>
      </div>
    </section>
  );
}
