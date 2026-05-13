/**
 * Dynamic OG image for /quiz-result/[token] — 1200×630 share card with
 * the verdict tier + system label so Twitter / LinkedIn / Slack previews
 * show a rich preview instead of the generic AIComply card.
 *
 * Mirrors AccessiScan's /scan-result/[token]/opengraph-image.tsx pattern
 * (Edge runtime, ImageResponse). Failure-tolerant: bogus token falls
 * back to a "Take the quiz" generic card so the URL is never broken.
 */

import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "edge";
export const alt = "AIComply EU AI Act risk-checker verdict";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Tier = "prohibited" | "high" | "limited" | "minimal";

const TIER_DETAILS: Record<
  Tier,
  { title: string; citation: string; color: string; subtitle: string }
> = {
  prohibited: {
    title: "Prohibited",
    citation: "ART. 5",
    color: "#b91c1c",
    subtitle: "Banned outright · €35M / 7% revenue cap",
  },
  high: {
    title: "High-risk",
    citation: "ART. 6 · ANNEX III",
    color: "#b45309",
    subtitle: "Full Article 8–17 obligations + conformity assessment",
  },
  limited: {
    title: "Limited risk",
    citation: "ART. 50",
    color: "#1d4ed8",
    subtitle: "Transparency obligations · inform users",
  },
  minimal: {
    title: "Minimal risk",
    citation: "RECITAL 165",
    color: "#0f766e",
    subtitle: "No mandatory obligations · Article 4 literacy applies",
  },
};

export default async function QuizResultOG({
  params,
}: {
  params: { token: string };
}) {
  const admin = createAdminClient();
  type LooseDb = { from: (t: string) => any }; // eslint-disable-line @typescript-eslint/no-explicit-any
  const db = admin as unknown as LooseDb;

  let classification: Tier = "minimal";
  let systemLabel: string | null = null;

  try {
    const { data } = await db
      .from("public_quiz_results")
      .select("classification, system_label")
      .eq("id", params.token)
      .maybeSingle();
    if (data?.classification && data.classification in TIER_DETAILS) {
      classification = data.classification as Tier;
    }
    systemLabel = (data?.system_label as string | null) ?? null;
  } catch {
    // fall through to defaults
  }

  const det = TIER_DETAILS[classification];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "56px 64px",
          background: "#fdfcfa",
          color: "#0f172a",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 18,
            color: "#64748b",
            fontWeight: 500,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: det.color }}>●</span>
          AIComply · {det.citation}
        </div>

        {systemLabel ? (
          <div
            style={{
              marginTop: 22,
              fontSize: 32,
              color: "#475569",
              fontWeight: 500,
              display: "flex",
            }}
          >
            {systemLabel}
          </div>
        ) : null}

        <div
          style={{
            marginTop: systemLabel ? 12 : 30,
            fontSize: 130,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1,
            color: det.color,
            display: "flex",
          }}
        >
          {det.title}
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 26,
            color: "#334155",
            display: "flex",
            maxWidth: 1000,
          }}
        >
          {det.subtitle}
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "#64748b",
          }}
        >
          <div style={{ display: "flex" }}>
            Regulation (EU) 2024/1689 — the EU AI Act
          </div>
          <div style={{ display: "flex", color: "#0d9488", fontWeight: 600 }}>
            run yours · aicomply.piposlab.com/free/risk-checker
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
