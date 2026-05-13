import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Trust Center · AIComply",
  description:
    "Every AIComply customer gets a public Trust Center page showing their real-time EU AI Act compliance posture. Procurement officers cite it in RFPs. Auditors verify it before site visits. Browse live customer trust pages.",
  openGraph: {
    title: "AIComply Trust Center — show prospects your compliance in real time",
    description:
      "Public, auto-updating trust pages for every paying AIComply customer. The procurement equivalent of vanta.com/trust.",
    type: "website",
  },
};

interface LiveTrustEntry {
  slug: string;
  display_name: string;
  website: string | null;
  ai_systems_count: number;
  fria_count: number;
  literacy_count: number;
}

async function fetchLiveTrustPages(): Promise<LiveTrustEntry[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, trust_slug, trust_display_name, trust_website")
    .eq("trust_enabled", true)
    .not("trust_slug", "is", null)
    .limit(12);

  const profiles = (data ?? []) as Array<{
    id: string;
    trust_slug: string;
    trust_display_name: string | null;
    trust_website: string | null;
  }>;

  if (profiles.length === 0) return [];

  // Per-profile counts (parallel)
  const out: LiveTrustEntry[] = [];
  await Promise.all(
    profiles.map(async (p) => {
      const [sysRes, friaRes, litRes] = await Promise.all([
        admin.from("ai_systems").select("id", { count: "exact", head: true }).eq("user_id", p.id),
        admin.from("fria_assessments").select("id", { count: "exact", head: true }).eq("user_id", p.id),
        admin.from("ai_literacy_records").select("id", { count: "exact", head: true }).eq("user_id", p.id),
      ]);
      out.push({
        slug: p.trust_slug,
        display_name: p.trust_display_name ?? p.trust_slug,
        website: p.trust_website,
        ai_systems_count: sysRes.count ?? 0,
        fria_count: friaRes.count ?? 0,
        literacy_count: litRes.count ?? 0,
      });
    }),
  );
  return out.sort((a, b) => a.display_name.localeCompare(b.display_name));
}

export default async function TrustCenterIndexPage() {
  const live = await fetchLiveTrustPages();

  return (
    <main
      style={{
        background: "var(--aic-paper-0, #fafafa)",
        color: "var(--aic-fg-l-1, #0f172a)",
        minHeight: "100vh",
      }}
    >
      {/* Hero */}
      <section
        style={{
          padding: "80px 56px 56px",
          background: "var(--aic-surface-1, #0f172a)",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--aic-gold, #d4af37)",
              marginBottom: 16,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "currentColor" }} />
            LIVE TRUST PAGES · EU AI ACT · ART. 11
          </div>
          <h1
            style={{
              fontFamily: "var(--aic-font-serif, serif)",
              fontSize: 56,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#fff",
              margin: 0,
            }}
          >
            Every AIComply customer gets a{" "}
            <span style={{ color: "var(--aic-gold, #d4af37)", fontStyle: "italic" }}>
              public trust page
            </span>
            .
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 720,
              marginTop: 22,
            }}
          >
            Real-time AI-system inventory, risk-tier classification per Article
            6 + Annex III, FRIA approval count, Article 4 literacy coverage —
            all on a public URL the customer hands to procurement. The same
            page lives at <code style={{ color: "var(--aic-gold, #d4af37)" }}>aicomply.app/trust/&lt;your-slug&gt;</code>{" "}
            and auto-updates from the customer&apos;s workspace.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <Link
              href="/signup"
              style={{
                background: "var(--aic-gold, #d4af37)",
                color: "#0b1220",
                padding: "12px 22px",
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Sign up + claim your trust slug
            </Link>
            <Link
              href="/pricing"
              style={{
                background: "transparent",
                color: "#fff",
                padding: "12px 22px",
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.3)",
                textDecoration: "none",
              }}
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Live customer index */}
      <section style={{ padding: "64px 56px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--aic-gold-deep, #a16207)",
              marginBottom: 12,
            }}
          >
            Live trust pages
          </div>
          <h2
            style={{
              fontFamily: "var(--aic-font-serif, serif)",
              fontSize: 36,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "var(--aic-fg-l-1, #0f172a)",
              margin: 0,
              marginBottom: 28,
            }}
          >
            {live.length > 0
              ? `${live.length} ${live.length === 1 ? "customer" : "customers"} publishing right now`
              : "Be the first customer to publish."}
          </h2>

          {live.length === 0 ? (
            <div
              style={{
                background: "var(--aic-paper-1, #fff)",
                border: "1px solid var(--aic-paper-line, #e5e7eb)",
                borderRadius: 12,
                padding: 32,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  color: "var(--aic-fg-l-3, #475569)",
                  maxWidth: 540,
                  margin: "0 auto 20px",
                }}
              >
                Customer trust pages publish to{" "}
                <code style={{ background: "var(--aic-paper-line, #f1f5f9)", padding: "2px 6px", borderRadius: 3 }}>
                  aicomply.app/trust/&lt;your-slug&gt;
                </code>{" "}
                — show your AI-system inventory, risk tiers, FRIA status, and Article 4 literacy
                coverage as the same auto-updating page Vanta + Drata charge $25k+/yr for, scoped
                to the EU AI Act.
              </p>
              <Link
                href="/signup"
                style={{
                  display: "inline-block",
                  background: "var(--aic-gold, #d4af37)",
                  color: "#0b1220",
                  padding: "10px 20px",
                  fontWeight: 600,
                  fontSize: 14,
                  borderRadius: 6,
                  textDecoration: "none",
                }}
              >
                Claim your slug — free
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {live.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/trust/${entry.slug}`}
                  style={{
                    background: "var(--aic-paper-1, #fff)",
                    border: "1px solid var(--aic-paper-line, #e5e7eb)",
                    borderRadius: 12,
                    padding: 24,
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    transition: "border-color 150ms",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 18, color: "var(--aic-fg-l-1, #0f172a)" }}>
                    {entry.display_name}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--aic-fg-l-4, #94a3b8)" }}>
                    aicomply.app/trust/{entry.slug}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      fontSize: 13,
                      color: "var(--aic-fg-l-3, #475569)",
                      marginTop: "auto",
                    }}
                  >
                    <span>
                      <strong style={{ color: "var(--aic-fg-l-1, #0f172a)" }}>{entry.ai_systems_count}</strong> systems
                    </span>
                    <span>
                      <strong style={{ color: "var(--aic-fg-l-1, #0f172a)" }}>{entry.fria_count}</strong> FRIAs
                    </span>
                    <span>
                      <strong style={{ color: "var(--aic-fg-l-1, #0f172a)" }}>{entry.literacy_count}</strong> literacy
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* What's on a trust page */}
      <section
        style={{
          padding: "64px 56px",
          background: "var(--aic-paper-1, #fff)",
          borderTop: "1px solid var(--aic-paper-line, #e5e7eb)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--aic-font-serif, serif)",
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              margin: 0,
              marginBottom: 32,
            }}
          >
            What lives on a customer trust page
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                title: "AI system inventory",
                body: "Each AI system the customer operates, with the Article 6 / Annex III risk tier visible at a glance.",
              },
              {
                title: "FRIA approval status",
                body: "Fundamental Rights Impact Assessments per Article 27 — how many high-risk systems have an approved FRIA on file.",
              },
              {
                title: "Article 4 literacy",
                body: "Internal AI literacy training records — count, dates, and aggregate coverage percentage.",
              },
              {
                title: "Annex IV pack link",
                body: "Direct download URL for the Article 11 technical documentation pack — exactly what conformity assessors request.",
              },
              {
                title: "Last audit timestamp",
                body: "When the workspace was last reviewed, signed off by whom, and the next required review window.",
              },
              {
                title: "Regulator cross-walk",
                body: "EU AI Act mapped against NIST AI RMF, ISO 42001, SOC 2 Type II, GDPR Article 22 — so cross-framework auditors don't ask twice.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: 20,
                  border: "1px solid var(--aic-paper-line, #e5e7eb)",
                  borderRadius: 10,
                  background: "var(--aic-paper-0, #fafafa)",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: "var(--aic-fg-l-1, #0f172a)",
                    marginBottom: 6,
                  }}
                >
                  {item.title}
                </div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--aic-fg-l-3, #475569)" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-portfolio: accessibility audit badge */}
      <section
        style={{
          padding: "48px 56px",
          background: "var(--aic-paper-0, #fafafa)",
          borderTop: "1px solid var(--aic-paper-line, #e5e7eb)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--aic-gold-deep, #a16207)",
              marginBottom: 14,
            }}
          >
            ACCESSIBILITY · WCAG 2.1 AA
          </div>
          <h2
            style={{
              fontFamily: "var(--aic-font-serif, serif)",
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              margin: 0,
              marginBottom: 14,
            }}
          >
            We audit our own site with{" "}
            <a
              href="https://accessiscan.piposlab.com?utm_source=aicomply_trust&utm_medium=embed"
              style={{
                color: "var(--aic-gold-deep, #a16207)",
                fontStyle: "italic",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              AccessiScan
            </a>
            .
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--aic-fg-l-3, #475569)",
              marginBottom: 18,
              maxWidth: 700,
            }}
          >
            Compliance starts with treating regulators&apos; words as
            requirements, not branding. Live AccessiScan WCAG score for
            this site:
          </p>
          <a
            href="https://accessiscan.piposlab.com/free/wcag-scanner?utm_source=aicomply_trust&utm_medium=embed&utm_campaign=cross_promo"
            target="_blank"
            rel="noopener"
            style={{ display: "inline-block", lineHeight: 0 }}
          >
            <img
              src="https://accessiscan.piposlab.com/badge/aicomply.piposlab.com"
              alt="AIComply WCAG accessibility score, audited by AccessiScan"
              width={250}
              height={60}
            />
          </a>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "64px 56px",
          background: "var(--aic-surface-1, #0f172a)",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--aic-font-serif, serif)",
              fontSize: 36,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "#fff",
              margin: 0,
              marginBottom: 16,
            }}
          >
            Get your trust page in under 30 minutes.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 28,
              maxWidth: 600,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Sign up, run the 10-question risk classifier, generate your Annex
            IV pack, enable your trust slug. Procurement officers stop emailing
            you SIG-Lite forms because they read your page first.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/free/risk-checker"
              style={{
                background: "var(--aic-gold, #d4af37)",
                color: "#0b1220",
                padding: "12px 24px",
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Start with the 10-question check
            </Link>
            <Link
              href="/pricing"
              style={{
                color: "#fff",
                padding: "12px 24px",
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.3)",
                textDecoration: "none",
              }}
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
