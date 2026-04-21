import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ShieldCheck,
  Boxes,
  GraduationCap,
  Scale,
  ExternalLink,
} from "lucide-react";

interface Params {
  slug: string;
}

const TIER_WEIGHT: Record<string, number> = {
  minimal: 100,
  limited: 85,
  high: 60,
  unacceptable: 0,
  unclassified: 40,
};

async function loadTrustData(slug: string) {
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("id, trust_slug, trust_enabled, trust_display_name, trust_website")
    .eq("trust_slug", slug)
    .eq("trust_enabled", true)
    .maybeSingle();

  if (!profile) return null;

  const [systemsRes, friaRes, literacyRes] = await Promise.all([
    admin
      .from("ai_systems")
      .select("id, risk_tier, classified_at")
      .eq("user_id", profile.id),
    admin
      .from("fria_assessments")
      .select("id, status, reviewed_at, notified_authority_at")
      .eq("user_id", profile.id),
    admin
      .from("ai_literacy_records")
      .select("id, training_date")
      .eq("user_id", profile.id),
  ]);

  const systems = systemsRes.data ?? [];
  const frias = friaRes.data ?? [];
  const literacy = literacyRes.data ?? [];

  const tierCounts = systems.reduce<Record<string, number>>((acc, s) => {
    const t = s.risk_tier ?? "unclassified";
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});

  const classifiedCount = systems.filter((s) => Boolean(s.classified_at)).length;
  const friaApproved = frias.filter((f) => f.status === "approved").length;
  const friaCoverageTarget = tierCounts.high ?? 0;
  const friaCoverage =
    friaCoverageTarget === 0 ? 100 : Math.min(100, (friaApproved / friaCoverageTarget) * 100);

  const classificationCoverage =
    systems.length === 0 ? 0 : (classifiedCount / systems.length) * 100;

  const tierScore =
    systems.length === 0
      ? 50
      : systems.reduce((acc, s) => acc + (TIER_WEIGHT[s.risk_tier ?? "unclassified"] ?? 50), 0) /
        systems.length;

  const literacyBonus = literacy.length >= 3 ? 100 : (literacy.length / 3) * 100;

  const readiness = Math.round(
    tierScore * 0.35 + classificationCoverage * 0.25 + friaCoverage * 0.25 + literacyBonus * 0.15,
  );

  return {
    profile,
    systems,
    frias,
    literacy,
    tierCounts,
    classifiedCount,
    friaApproved,
    readiness,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadTrustData(slug);
  if (!data) return { title: "Trust page not found" };
  const name = data.profile.trust_display_name ?? slug;
  return {
    title: `${name} · EU AI Act Trust Page | AIComply`,
    description: `Public EU AI Act compliance posture for ${name}. ${data.systems.length} AI systems tracked, readiness score ${data.readiness}/100.`,
  };
}

export default async function TrustPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const data = await loadTrustData(slug);
  if (!data) notFound();

  const { profile, systems, frias, literacy, tierCounts, readiness } = data;
  const displayName = profile.trust_display_name ?? slug;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1000px] px-6 py-14">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700">
              Public EU AI Act Trust Page
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {displayName}
            </h1>
            {profile.trust_website && (
              <a
                href={profile.trust_website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm text-sky-700 hover:underline"
              >
                {profile.trust_website}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-5 py-4">
            <ShieldCheck className="h-8 w-8 text-sky-700" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Readiness score
              </p>
              <p className="font-display text-3xl font-bold tracking-tight">
                {readiness}
                <span className="text-sm font-normal text-slate-500"> / 100</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Stat
            icon={Boxes}
            label="AI systems in inventory"
            value={systems.length.toString()}
            sub={`${data.classifiedCount} risk-classified`}
          />
          <Stat
            icon={Scale}
            label="FRIA assessments"
            value={frias.length.toString()}
            sub={`${data.friaApproved} approved`}
          />
          <Stat
            icon={GraduationCap}
            label="Art. 4 literacy records"
            value={literacy.length.toString()}
            sub={literacy.length >= 3 ? "Above minimum" : "Building coverage"}
          />
        </div>

        <section className="mt-10 rounded-md border border-slate-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold">
            Inventory by EU AI Act risk tier
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Classification follows Articles 5, 6 + Annex III, and 50. Unclassified
            systems have not yet been evaluated.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
            {["unacceptable", "high", "limited", "minimal", "unclassified"].map((tier) => (
              <div
                key={tier}
                className="rounded-md border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {tier}
                </p>
                <p className="mt-1.5 font-display text-2xl font-bold">
                  {tierCounts[tier] ?? 0}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-md border border-slate-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold">
            What this page means
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            This is a public, aggregated summary of {displayName}&apos;s EU AI
            Act compliance posture, generated live from their AIComply inventory.
            It is not a certification. The readiness score weights risk-tier
            distribution, classification coverage, Article 27 FRIA completion for
            high-risk systems, and Article 4 literacy evidence. Procurement teams
            can request the underlying documentation directly from the deployer.
          </p>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
          <p>
            Powered by{" "}
            <Link href="/" className="font-semibold text-sky-700 hover:underline">
              AIComply
            </Link>{" "}
            · EU AI Act compliance tooling for SMBs
          </p>
        </footer>
      </div>
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Boxes;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight">
            {value}
          </p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
    </div>
  );
}
