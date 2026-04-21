import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Boxes, Sparkles, GraduationCap, FileText } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0b1f3a] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-16 px-6 py-20 lg:grid-cols-[1.15fr_1fr] lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-sm border border-[#06b6d4]/40 bg-[#06b6d4]/10 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#06b6d4]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#06b6d4]">
              EU AI ACT · ARTICLE 4 · AUGUST 2, 2026
            </span>
          </div>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[72px]">
            EU AI Act compliance for SMBs.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Inventory every AI tool your team uses, auto-classify each one against the 4 EU AI Act risk tiers, and generate Article 4 AI literacy registers — before penalties start. Vanta charges €50,000+. AIComply starts at{" "}
            <span className="font-semibold text-white">$49/mo</span>.
          </p>

          <figure className="mt-8 max-w-xl rounded-md border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <span
                className="font-display text-5xl font-bold leading-none text-[#06b6d4]"
                aria-hidden
              >
                “
              </span>
              <div className="flex-1 pt-1">
                <blockquote className="text-xl leading-snug text-white">
                  Up to <span className="text-[#06b6d4]">€35M or 7%</span> of global turnover for prohibited practices. Stacked on top of GDPR.
                </blockquote>
                <figcaption className="mt-3 text-[11px] uppercase tracking-[0.14em] text-white/50">
                  Regulation (EU) 2024/1689 · Article 99
                </figcaption>
              </div>
            </div>
          </figure>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-md bg-[#dc2626] px-6 text-base font-semibold text-white shadow-none transition-colors hover:bg-[#b91c1c]"
              asChild
            >
              <Link href="/signup">
                Start free audit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-md border-white/25 bg-transparent px-6 text-base font-semibold text-white shadow-none transition-colors hover:border-white hover:bg-white/5"
              asChild
            >
              <Link href="#pricing">See pricing</Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/55">
            <TrustItem>No credit card required</TrustItem>
            <TrustItem>Free tier · 1 AI system</TrustItem>
            <TrustItem>1000x cheaper than Vanta</TrustItem>
          </div>
        </div>

        <RiskTierSchematic />
      </div>
    </section>
  );
}

function TrustItem({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <CheckCircle2 className="h-3.5 w-3.5 text-[#06b6d4]" />
      {children}
    </span>
  );
}

/**
 * EU AI Act 4-tier risk pyramid schematic with examples from a typical SMB stack.
 */
function RiskTierSchematic() {
  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[32px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(6,182,212,0.18), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative space-y-3">
        <TierRow
          tier="UNACCEPTABLE"
          article="Art. 5 · prohibited"
          tone="critical"
          example="CV-screening w/ emotion inference"
          badge="0"
          icon={Sparkles}
        />
        <TierRow
          tier="HIGH RISK"
          article="Art. 6 + Annex III"
          tone="warn"
          example="AI credit scoring · HR shortlisting"
          badge="2"
          icon={FileText}
        />
        <TierRow
          tier="LIMITED RISK"
          article="Art. 50 · transparency"
          tone="cyan"
          example="ChatGPT Enterprise · Claude · Copilot"
          badge="8"
          icon={Boxes}
        />
        <TierRow
          tier="MINIMAL RISK"
          article="No AI-Act obligations"
          tone="success"
          example="Spam filters · code completion"
          badge="5"
          icon={GraduationCap}
        />
      </div>

      {/* Inventory total badge */}
      <div className="mt-6 rounded-md border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">
              Tracked AI systems
            </p>
            <p className="mt-1 font-display text-2xl font-bold leading-none text-white">
              15 <span className="text-sm text-white/50">in inventory</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">
              Art. 4 records
            </p>
            <p className="mt-1 font-display text-2xl font-bold leading-none text-[#06b6d4]">
              42
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TierRow({
  tier,
  article,
  tone,
  example,
  badge,
  icon: Icon,
}: {
  tier: string;
  article: string;
  tone: "critical" | "warn" | "cyan" | "success";
  example: string;
  badge: string;
  icon: React.ElementType;
}) {
  const borderTone = {
    critical: "border-l-[#dc2626]",
    warn: "border-l-orange-500",
    cyan: "border-l-[#06b6d4]",
    success: "border-l-emerald-400",
  }[tone];
  const badgeBg = {
    critical: "bg-[#dc2626] text-white",
    warn: "bg-orange-500 text-white",
    cyan: "bg-[#06b6d4] text-[#0b1f3a]",
    success: "bg-emerald-400 text-[#0b1f3a]",
  }[tone];

  return (
    <div
      className={`flex items-center gap-3 rounded-md border border-white/10 border-l-[3px] bg-white/5 p-4 backdrop-blur-sm ${borderTone}`}
    >
      <Icon className="h-4 w-4 shrink-0 text-white/55" strokeWidth={1.8} />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
          {tier} · {article}
        </p>
        <p className="mt-0.5 truncate text-sm text-white/85">{example}</p>
      </div>
      <span
        className={`flex h-7 min-w-[28px] items-center justify-center rounded-sm px-2 font-mono text-[11px] font-bold ${badgeBg}`}
      >
        {badge}
      </span>
    </div>
  );
}
