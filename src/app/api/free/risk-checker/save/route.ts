/**
 * POST /api/free/risk-checker/save — persist a quiz verdict so we can
 * generate a shareable permalink at /quiz-result/[token].
 *
 * Body:
 *   {
 *     classification: 'prohibited' | 'high' | 'limited' | 'minimal',
 *     answers: Array<'yes' | 'no' | null>,
 *     system_label?: string,   // optional ≤80 chars
 *     email?: string,          // optional, captured into lead pipeline
 *   }
 *
 * Returns:
 *   { ok: true, token, share_url }
 *
 * No auth required — same pattern as AccessiScan's free WCAG scan persist.
 * The data is public-readable by token (RLS allows SELECT on the table).
 *
 * Rate-limit: 6 saves/min per IP (in-memory; will move to Upstash if abuse
 * surfaces). The save endpoint is the only write surface.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { randomBytes } from "crypto";

const VALID_TIERS = ["prohibited", "high", "limited", "minimal"] as const;
type Tier = (typeof VALID_TIERS)[number];

interface SaveBody {
  classification: Tier;
  answers: Array<"yes" | "no" | null>;
  system_label?: string;
  email?: string;
}

// In-memory IP rate limit — single Vercel instance per region.
const ipHits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_PER_MIN = 6;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cur = ipHits.get(ip);
  if (!cur || cur.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  cur.count += 1;
  return cur.count > RATE_LIMIT_PER_MIN;
}

function generateToken(): string {
  // base64url, 16 bytes = 22 chars — matches AccessiScan's pattern
  return randomBytes(16).toString("base64url");
}

function sanitizeLabel(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw.trim().slice(0, 80).replace(/[\r\n\t]+/g, " ");
  return cleaned.length > 0 ? cleaned : null;
}

function sanitizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.length === 0 || trimmed.length > 254) return null;
  // Basic shape — reject obvious junk; let Postgres reject the rest if any
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(trimmed)) return null;
  return trimmed;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", message: "Too many requests" },
      { status: 429 },
    );
  }

  let body: SaveBody;
  try {
    body = (await req.json()) as SaveBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!VALID_TIERS.includes(body.classification)) {
    return NextResponse.json(
      { ok: false, error: "invalid_classification" },
      { status: 400 },
    );
  }
  if (!Array.isArray(body.answers) || body.answers.length === 0 || body.answers.length > 30) {
    return NextResponse.json({ ok: false, error: "invalid_answers" }, { status: 400 });
  }

  const systemLabel = sanitizeLabel(body.system_label);
  const email = sanitizeEmail(body.email);

  const token = generateToken();
  const admin = createAdminClient();

  // Cast: public_quiz_results may not be in generated Database types yet
  // (migration shipped same session). Use loose typing — RLS handles auth.
  type LooseDb = { from: (t: string) => any }; // eslint-disable-line @typescript-eslint/no-explicit-any
  const db = admin as unknown as LooseDb;

  const { error } = await db.from("public_quiz_results").insert({
    id: token,
    classification: body.classification,
    answers: body.answers,
    quiz_version: "v1-2026-05-13",
    system_label: systemLabel,
    email_captured: email,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: "insert_failed", message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      token,
      share_url: `https://aicomply.piposlab.com/quiz-result/${token}`,
    },
    { status: 200 },
  );
}
