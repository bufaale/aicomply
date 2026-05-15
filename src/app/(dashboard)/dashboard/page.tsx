import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CrossPromoBanner } from "@/components/dashboard/cross-promo-banner";
import {
  Icon,
  Pyramid,
  TierBadge,
  type RiskTier,
} from "@/components/aicomply/atoms";
import { getCrossWalkStats } from "@/lib/eu-ai-act/cross-walk";

interface SystemRow {
  id: string;
  name: string;
  risk_tier: string;
  classified_at: string | null;
  created_at: string;
}

const DB_TO_TIER: Record<string, RiskTier> = {
  unacceptable: "prohibited",
  high: "high",
  limited: "limited",
  minimal: "minimal",
};

function formatDate(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(d: string): string {
  return new Date(d).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: systemsRaw } = await supabase
    .from("ai_systems")
    .select("id, name, risk_tier, classified_at, created_at")
    .eq("user_id", user!.id);

  const systems = (systemsRaw ?? []) as SystemRow[];

  const counts = {
    total: systems.length,
    prohibited: systems.filter((s) => s.risk_tier === "unacceptable").length,
    high: systems.filter((s) => s.risk_tier === "high").length,
    limited: systems.filter((s) => s.risk_tier === "limited").length,
    minimal: systems.filter((s) => s.risk_tier === "minimal").length,
    unclassified: systems.filter((s) => s.risk_tier === "unclassified").length,
  };

  const { data: literacyRaw } = await supabase
    .from("ai_literacy_records")
    .select("id")
    .eq("user_id", user!.id);
  const literacyCount = literacyRaw?.length ?? 0;

  // Days to EU AI Act Article 4 deployer obligations enter into force.
  const target = new Date("2026-08-02").getTime();
  const days = Math.max(0, Math.ceil((target - Date.now()) / 86400000));

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "";
  const greeting = firstName ? `, ${firstName}` : "";

  const recent = [...systems]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="aic-dashboard-dark-shell">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div>
          <div className="aic-eyebrow-line" style={{ marginBottom: 8 }}>
            <span className="live-dot" />
            EU AI ACT IN FORCE 02 AUG 2026
          </div>
          <h1
            style={{
              font: "500 36px/1.1 var(--aic-font-serif)",
              letterSpacing: "-.025em",
              margin: 0,
              color: "#fff",
            }}
          >
            Good morning{greeting}.
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              color: "rgba(255,255,255,.55)",
              font: "15px/1.5 var(--aic-font-sans)",
            }}
          >
            {counts.total} AI systems tracked. {counts.high + counts.prohibited} high-risk.{" "}
            {counts.unclassified} unclassified.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href="/dashboard/annex-iv"
            className="aic-btn aic-btn--ghost-dark-soft aic-btn--sm"
          >
            <Icon name="download" size={14} />
            Export packet
          </Link>
          <Link
            href="/dashboard/ai-systems/new"
            className="aic-btn aic-btn--primary aic-btn--sm"
          >
            <Icon name="plus" size={14} />
            Register AI system
          </Link>
        </div>
      </div>

      <div className="aic-stats-row" style={{ marginBottom: 24 }}>
        <div className="aic-stat">
          <div className="aic-stat-label">SYSTEMS TRACKED</div>
          <div className="aic-stat-value aic-tabular">{counts.total}</div>
          <div className="aic-stat-sub aic-tabular">
            {counts.unclassified} unclassified
          </div>
        </div>
        <div className="aic-stat">
          <div className="aic-stat-label">HIGH-RISK</div>
          <div
            className="aic-stat-value aic-tabular"
            style={{ color: "#fbbf24" }}
          >
            {counts.high + counts.prohibited}
          </div>
          <div className="aic-stat-sub">Annex III · Art. 6</div>
        </div>
        <div className="aic-stat">
          <div className="aic-stat-label">DAYS TO 02 AUG 2026</div>
          <div
            className="aic-stat-value aic-tabular"
            style={{ color: "var(--aic-gold)" }}
          >
            {days}
          </div>
          <div className="aic-stat-sub">Article 4 in force</div>
        </div>
        <div className="aic-stat">
          <div className="aic-stat-label">LITERACY RECORDS</div>
          <div className="aic-stat-value aic-tabular">{literacyCount}</div>
          <div className="aic-stat-sub">signed acknowledgements</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 18,
          marginBottom: 18,
        }}
      >
        <div className="aic-card">
          <div className="aic-card-h">
            <div className="aic-card-h-l">
              <div className="aic-card-eyebrow">RISK PYRAMID · CURRENT QUARTER</div>
              <div className="aic-card-title">EU AI Act 4-tier classification</div>
            </div>
            <span className="aic-pill aic-pill--pass aic-pill--live">
              <span className="dot" />
              LIVE
            </span>
          </div>
          <div className="aic-card-body">
            <Pyramid
              dark
              counts={{
                prohibited: `${counts.prohibited} system${counts.prohibited === 1 ? "" : "s"}`,
                high: `${counts.high} system${counts.high === 1 ? "" : "s"}`,
                limited: `${counts.limited} system${counts.limited === 1 ? "" : "s"}`,
                minimal: `${counts.minimal} system${counts.minimal === 1 ? "" : "s"}`,
              }}
            />
          </div>
        </div>

        <div className="aic-card">
          <div className="aic-card-h">
            <div className="aic-card-h-l">
              <div className="aic-card-eyebrow">ANNEX IV CROSS-WALK · BASELINE</div>
              <div className="aic-card-title">Pre-satisfied if you already have</div>
            </div>
          </div>
          <div className="aic-card-body" style={{ padding: 0 }}>
            {(() => {
              const stats = getCrossWalkStats();
              return [
                [
                  "ISO/IEC 27001",
                  `${stats.iso27001Count} / ${stats.total}`,
                  `${stats.iso27001Pct}%`,
                  stats.iso27001Pct >= 70 ? "pass" : "review",
                  stats.iso27001Pct >= 70 ? "#5eead4" : "#fbbf24",
                ],
                [
                  "SOC 2 Type II",
                  `${stats.soc2Count} / ${stats.total}`,
                  `${stats.soc2Pct}%`,
                  stats.soc2Pct >= 70 ? "pass" : "review",
                  stats.soc2Pct >= 70 ? "#5eead4" : "#fbbf24",
                ],
                [
                  "Either framework",
                  `${stats.eitherCount} / ${stats.total}`,
                  `${stats.eitherPct}%`,
                  stats.eitherPct >= 70 ? "pass" : "review",
                  stats.eitherPct >= 70 ? "#5eead4" : "#fbbf24",
                ],
              ] as const;
            })().map((r, i) => (
              <div
                key={r[0]}
                style={{
                  padding: "14px 20px",
                  borderTop: i ? "1px solid rgba(255,255,255,.05)" : "0",
                  display: "grid",
                  gridTemplateColumns: "1.2fr .8fr 1fr .6fr",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    font: "500 14px/1.2 var(--aic-font-serif)",
                    color: "#fff",
                  }}
                >
                  {r[0]}
                </span>
                <span
                  className="aic-tabular"
                  style={{
                    font: "var(--aic-mono)",
                    color: "rgba(255,255,255,.78)",
                  }}
                >
                  {r[1]}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      flex: 1,
                      height: 4,
                      background: "rgba(255,255,255,.06)",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: r[2],
                        background: r[4],
                      }}
                    />
                  </div>
                  <span
                    className="aic-tabular"
                    style={{
                      font: "var(--aic-mono-sm)",
                      color: "rgba(255,255,255,.78)",
                      minWidth: 32,
                      textAlign: "right",
                    }}
                  >
                    {r[2]}
                  </span>
                </div>
                <span
                  style={{
                    font: "var(--aic-mono-sm)",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    color: r[4],
                    textAlign: "right",
                  }}
                >
                  {r[3] === "pass" ? "PASS" : "REVIEW"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="aic-card">
        <div className="aic-card-h">
          <div className="aic-card-h-l">
            <div className="aic-card-eyebrow">RECENT AI SYSTEMS</div>
            <div className="aic-card-title">Last 5 added</div>
          </div>
          <Link
            href="/dashboard/ai-systems"
            style={{
              font: "var(--aic-mono-sm)",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--aic-gold)",
              textDecoration: "none",
            }}
          >
            View all →
          </Link>
        </div>
        <div style={{ padding: 0 }}>
          {recent.length === 0 ? (
            <div
              style={{
                padding: "32px 20px",
                textAlign: "center",
                color: "rgba(255,255,255,.55)",
                font: "14px/1.55 var(--aic-font-sans)",
              }}
            >
              <p style={{ margin: "0 0 12px" }}>No systems tracked yet.</p>
              <Link
                href="/dashboard/ai-systems/new"
                className="aic-btn aic-btn--primary aic-btn--sm"
              >
                <Icon name="plus" size={14} />
                Register your first AI system
              </Link>
            </div>
          ) : (
            recent.map((s, i) => {
              const tier =
                DB_TO_TIER[s.risk_tier] ?? ("minimal" as RiskTier);
              const isUnclassified = s.risk_tier === "unclassified";
              return (
                <div
                  key={s.id}
                  style={{
                    padding: "12px 20px",
                    borderTop: i ? "1px solid rgba(255,255,255,.05)" : "0",
                    display: "grid",
                    gridTemplateColumns: "82px 1fr auto auto",
                    gap: 12,
                    alignItems: "baseline",
                    fontSize: 13,
                  }}
                >
                  <span
                    className="aic-tabular"
                    style={{
                      font: "var(--aic-mono)",
                      color: "rgba(255,255,255,.5)",
                    }}
                  >
                    {formatTime(s.created_at)}
                  </span>
                  <Link
                    href={`/dashboard/ai-systems/${s.id}`}
                    style={{
                      color: "rgba(255,255,255,.92)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    {s.name}
                  </Link>
                  {isUnclassified ? (
                    <span
                      style={{
                        font: "var(--aic-mono-sm)",
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,.55)",
                      }}
                    >
                      UNCLASSIFIED
                    </span>
                  ) : (
                    <TierBadge tier={tier} dark />
                  )}
                  <span
                    style={{
                      font: "var(--aic-mono-sm)",
                      letterSpacing: ".06em",
                      color: "rgba(255,255,255,.5)",
                    }}
                  >
                    {formatDate(s.created_at)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <CrossPromoBanner />
      </div>
    </div>
  );
}
