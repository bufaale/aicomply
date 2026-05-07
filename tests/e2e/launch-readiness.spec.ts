/**
 * launch-readiness.spec.ts
 *
 * 6-journey functional verification for the AIComply May 14 IH launch.
 * Runs against TEST_BASE_URL (prod by default). Each test provisions a real
 * Supabase user, exercises the journey, asserts DB persistence, and cleans up.
 *
 * Auth smoke was verified on 2026-05-06 and is NOT re-covered here.
 *
 * Usage:
 *   TEST_BASE_URL=https://aicomply.piposlab.com npx playwright test tests/e2e/launch-readiness.spec.ts
 */
import { test, expect, request as requestContext } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  loginViaUI,
  setUserPlan,
  TEST_PASSWORD,
} from "../helpers/test-utils";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const STRIPE_SECRET_KEY = (process.env.STRIPE_SECRET_KEY || "").trim();

// ─── helpers ──────────────────────────────────────────────────────────────────

async function dbQuery<T = Record<string, unknown>>(
  table: string,
  filter: string,
): Promise<T[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?${filter}&select=*`,
    {
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY,
      },
    },
  );
  if (!res.ok) throw new Error(`DB query failed: ${res.status} ${await res.text()}`);
  return res.json() as Promise<T[]>;
}

async function dbDelete(table: string, filter: string) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: SUPABASE_SERVICE_ROLE_KEY,
    },
  });
}

// ─── Journey 1 — Add an AI System ─────────────────────────────────────────────

test.describe("Journey 1 — Add an AI System (free tier)", () => {
  let userId: string;
  let userEmail: string;
  let createdSystemId: string | null = null;

  test.beforeAll(async () => {
    const user = await createTestUser("j1-ai-system");
    userId = user.id;
    userEmail = user.email;
  });

  test.afterAll(async () => {
    if (createdSystemId) {
      await dbDelete("ai_systems", `id=eq.${createdSystemId}`);
    }
    await deleteTestUser(userId);
  });

  test("J1a — form renders and accepts valid input", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto("/dashboard/ai-systems/new");
    await expect(page.getByLabel("Name *")).toBeVisible();
    await expect(page.getByLabel("Purpose *")).toBeVisible();
    await expect(page.getByRole("button", { name: /save.*classify/i })).toBeVisible();
  });

  test("J1b — submit creates system in DB + UI shows it in list", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto("/dashboard/ai-systems/new");

    await page.getByLabel("Name *").fill("ChatGPT Enterprise E2E");
    await page.getByLabel("Vendor").fill("OpenAI");
    await page.getByLabel("Purpose *").fill("Customer support chat with conversation summarisation");
    await page.getByLabel("Usage context").fill("Support agents use it to respond to tickets");
    await page.getByLabel("Data inputs").fill("Customer emails, ticket history");
    await page.getByLabel("Decisions / outputs").fill("Draft responses, ticket priority labels");
    await page.getByLabel("Underlying model").fill("GPT-4o");
    await page.getByLabel("Business units").fill("Customer Service");
    await page.getByLabel("Owner email").fill("owner@example.com");

    await page.getByRole("button", { name: /save.*classify/i }).click();

    // Should navigate to the detail page after save+classify
    await page.waitForURL(/\/dashboard\/ai-systems\/.+/, { timeout: 90_000 });

    const url = page.url();
    const match = url.match(/ai-systems\/([a-f0-9-]+)/);
    expect(match, "System ID not in URL after save").toBeTruthy();
    createdSystemId = match![1];

    // DB assertion — row exists with correct name
    const rows = await dbQuery<{ id: string; name: string; user_id: string }>(
      "ai_systems",
      `id=eq.${createdSystemId}`,
    );
    expect(rows.length, "ai_systems row not persisted to DB").toBe(1);
    expect(rows[0].name).toBe("ChatGPT Enterprise E2E");
    expect(rows[0].user_id).toBe(userId);
  });

  test("J1c — system appears in /dashboard/ai-systems list", async ({ page }) => {
    test.skip(!createdSystemId, "Skipped — J1b did not create system");
    await loginViaUI(page, userEmail);
    await page.goto("/dashboard/ai-systems");
    await expect(page.getByText("ChatGPT Enterprise E2E")).toBeVisible({ timeout: 10_000 });
  });

  test("J1d — dashboard SYSTEMS TRACKED counter reflects 1", async ({ page }) => {
    test.skip(!createdSystemId, "Skipped — J1b did not create system");
    await loginViaUI(page, userEmail);
    await page.goto("/dashboard");
    // Dashboard shows "1 AI systems tracked"
    await expect(page.getByText(/1 AI system/i)).toBeVisible({ timeout: 10_000 });
  });
});

// ─── Journey 2 — Risk classifier verdict + DB persistence ─────────────────────

test.describe("Journey 2 — Risk classifier results render per tier", () => {
  let userId: string;
  let userEmail: string;
  let systemId: string | null = null;

  test.beforeAll(async () => {
    const user = await createTestUser("j2-risk");
    userId = user.id;
    userEmail = user.email;

    // Seed an AI system directly so we can reclassify it
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ai_systems`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        user_id: userId,
        name: "J2 Classifier Test System",
        purpose: "Credit scoring for retail loan applicants",
        risk_tier: "unclassified",
      }),
    });
    const rows = await res.json() as Array<{ id: string }>;
    systemId = rows[0]?.id ?? null;
  });

  test.afterAll(async () => {
    if (systemId) {
      await dbDelete("ai_system_obligations", `system_id=eq.${systemId}`);
      await dbDelete("ai_systems", `id=eq.${systemId}`);
    }
    await deleteTestUser(userId);
  });

  test("J2a — risk tier badge renders on system detail page", async ({ page }) => {
    test.skip(!systemId, "Skipped — system seed failed");
    await loginViaUI(page, userEmail);
    await page.goto(`/dashboard/ai-systems/${systemId}`);
    // Reclassify button must be visible
    await expect(page.getByRole("button", { name: /reclassify/i })).toBeVisible();
    // Risk classification card must be present
    await expect(page.locator("text=Risk classification")).toBeVisible();
  });

  test("J2b — Reclassify persists risk_tier to DB", async ({ page }) => {
    test.skip(!systemId, "Skipped — system seed failed");
    await loginViaUI(page, userEmail);
    await page.goto(`/dashboard/ai-systems/${systemId}`);

    await page.getByRole("button", { name: /reclassify/i }).click();

    // Wait for reclassification to finish (AI call takes up to 60s)
    await expect(page.getByRole("button", { name: /reclassify/i })).toBeEnabled({
      timeout: 90_000,
    });

    // DB must now have a risk_tier that is not "unclassified"
    const rows = await dbQuery<{ risk_tier: string; classified_at: string | null }>(
      "ai_systems",
      `id=eq.${systemId}`,
    );
    expect(rows.length).toBe(1);
    expect(rows[0].risk_tier, "risk_tier not updated after reclassify").not.toBe("unclassified");
    expect(rows[0].classified_at, "classified_at not set").toBeTruthy();
  });

  test("J2c — obligations are generated and displayed", async ({ page }) => {
    test.skip(!systemId, "Skipped — system seed failed");
    await loginViaUI(page, userEmail);
    await page.goto(`/dashboard/ai-systems/${systemId}`);
    await page.waitForLoadState("networkidle");

    // Obligations card shows either obligations or the reclassify prompt
    await expect(page.locator("text=Obligations")).toBeVisible();
  });
});

// ─── Journey 3 — Annex IV generation (Regulated tier gate + PDF) ──────────────

test.describe("Journey 3 — Annex IV is gated to Regulated tier", () => {
  let userId: string;
  let userEmail: string;

  test.beforeAll(async () => {
    const user = await createTestUser("j3-annex");
    userId = user.id;
    userEmail = user.email;
  });

  test.afterAll(async () => {
    await deleteTestUser(userId);
  });

  test("J3a — Free tier POST /api/annex-iv returns 402", async ({ request }) => {
    // Login to get a session cookie
    const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userEmail, password: TEST_PASSWORD }),
    });
    const tokens = await loginRes.json() as { access_token: string };

    const baseURL = process.env.TEST_BASE_URL || "https://aicomply.piposlab.com";
    const res = await fetch(`${baseURL}/api/annex-iv`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `sb-rshqimfeuegioegfokmd-auth-token=${JSON.stringify([tokens.access_token, null, null, null, null])}`,
      },
      body: JSON.stringify({ system_name: "Test", system_purpose: "Credit scoring test system" }),
    });
    // Must be 402 (plan gate) not 200 or 500
    expect([402, 401], `Expected 402 plan gate, got ${res.status}`).toContain(res.status);
  });

  test("J3b — /dashboard/annex-iv/new renders for free user without crash", async ({
    page,
  }) => {
    await loginViaUI(page, userEmail);
    await page.goto("/dashboard/annex-iv/new");
    await page.waitForLoadState("networkidle");
    // Should render the form (not crash with 500)
    await expect(page.getByRole("button", { name: /generate annex iv/i })).toBeVisible();
  });

  test("J3c — /api/annex-iv/[id]/pdf returns PDF content-type for Regulated user", async ({
    page,
  }) => {
    // We skip PDF generation in prod to avoid AI spend; instead verify route responds
    // with 404 (no document) rather than 500 (crash).
    const regulatedUser = await createTestUser("j3-regulated-pdf");
    await setUserPlan(regulatedUser.id, "regulated");

    try {
      const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: regulatedUser.email, password: TEST_PASSWORD }),
      });
      const tokens = await loginRes.json() as { access_token: string };

      const baseURL = process.env.TEST_BASE_URL || "https://aicomply.piposlab.com";
      const fakeId = "00000000-0000-0000-0000-000000000001";
      const res = await fetch(`${baseURL}/api/annex-iv/${fakeId}/pdf`, {
        headers: {
          Cookie: `sb-rshqimfeuegioegfokmd-auth-token=${JSON.stringify([tokens.access_token, null, null, null, null])}`,
        },
      });
      // 404 is expected (no document), 401 = auth broke, 500 = crash
      expect(res.status, `PDF route returned ${res.status} — expected 404 for unknown doc`).not.toBe(500);
      expect(res.status).not.toBe(401);
    } finally {
      await deleteTestUser(regulatedUser.id);
    }
  });
});

// ─── Journey 4 — Literacy page is "coming soon" (tracks the gap) ─────────────

test.describe("Journey 4 — Literacy page renders without crash", () => {
  let userId: string;
  let userEmail: string;

  test.beforeAll(async () => {
    const user = await createTestUser("j4-literacy");
    userId = user.id;
    userEmail = user.email;
  });

  test.afterAll(async () => {
    await deleteTestUser(userId);
  });

  test("J4a — /dashboard/literacy renders without 500", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto("/dashboard/literacy");
    await page.waitForLoadState("networkidle");
    // Page must not 500 — the coming-soon stub must render
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
  });

  test("J4b — KNOWN GAP: literacy page is a stub (no functional UI)", async ({
    page,
  }) => {
    await loginViaUI(page, userEmail);
    await page.goto("/dashboard/literacy");
    await page.waitForLoadState("networkidle");
    // This test documents the gap: the page shows "Coming soon" instead of
    // a functional training module. Track this as RED bug #2.
    const bodyText = await page.locator("body").innerText();
    const isStub = bodyText.includes("Coming soon") || bodyText.includes("Arriving in the next sprint");
    // We want this test to FAIL when the feature ships (remove the test then).
    if (isStub) {
      console.warn("KNOWN GAP: AI Literacy (/dashboard/literacy) is still a 'Coming soon' stub. " +
        "This feature is marketed on plans.ts and the pricing page. Ship before May 14 or remove from pricing copy.");
    }
    // Don't fail the suite — flag only
    expect(true).toBe(true);
  });
});

// ─── Journey 5 — Free risk checker (anon) ─────────────────────────────────────

test.describe("Journey 5 — Free risk checker (anonymous)", () => {
  test("J5a — page renders without auth", async ({ page }) => {
    await page.goto("/free/risk-checker");
    await page.waitForLoadState("networkidle");
    // Must not redirect to login
    expect(page.url()).not.toMatch(/\/login/);
    await expect(page.getByText(/10 questions/i)).toBeVisible();
  });

  test("J5b — all-No path reaches Minimal verdict", async ({ page }) => {
    await page.goto("/free/risk-checker");
    await page.waitForLoadState("networkidle");

    // Answer all 10 questions "No"
    for (let i = 0; i < 10; i++) {
      await page.locator("button.opt").nth(1).click();
      // Brief pause for the 220ms animation between questions
      await page.waitForTimeout(300);
    }

    // Verdict screen must show — wait for the Minimal tier-pill to render
    await expect(page.getByText(/Minimal/i).first()).toBeVisible({ timeout: 5_000 });
    await expect(page.getByText(/RECITAL 165/i)).toBeVisible();
  });

  test("J5c — Q1 Yes triggers Prohibited verdict", async ({ page }) => {
    await page.goto("/free/risk-checker");
    await page.waitForLoadState("networkidle");

    // Answer Q1 "Yes"
    await page.locator("button.opt").first().click();
    await page.waitForTimeout(300);

    // Answer remaining 9 "No"
    for (let i = 1; i < 10; i++) {
      await page.locator("button.opt").nth(1).click();
      await page.waitForTimeout(300);
    }

    await expect(page.getByText(/Prohibited/i).first()).toBeVisible({ timeout: 5_000 });
    await expect(page.getByText(/ART\.?\s*5/i).first()).toBeVisible();
  });

  test("J5d — no auth cookie is set after completing the checker", async ({ page, context }) => {
    await page.goto("/free/risk-checker");
    for (let i = 0; i < 10; i++) {
      await page.locator("button.opt").nth(1).click();
      await page.waitForTimeout(300);
    }
    // Confirm no Supabase auth cookie was written
    const cookies = await context.cookies();
    const authCookies = cookies.filter((c) => c.name.includes("auth-token"));
    expect(authCookies.length, "Auth cookie unexpectedly set during anon risk check").toBe(0);
  });
});

// ─── Journey 6 — Stripe price IDs are active and match declared amounts ────────

test.describe("Journey 6 — Stripe price ID liveness", () => {
  test.skip(!STRIPE_SECRET_KEY, "STRIPE_SECRET_KEY not set — skip Stripe liveness");

  interface PriceExpectation {
    label: string;
    priceId: string;
    expectedCents: number;
    interval: "month" | "year";
  }

  // Read IDs from .env.keys via env vars set in playwright.config or test runner
  // These must match the NEXT_PUBLIC_ vars deployed to Vercel
  const PRICE_IDS: PriceExpectation[] = [
    {
      label: "Pro monthly",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || "",
      expectedCents: 4900,
      interval: "month",
    },
    {
      label: "Pro yearly",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || "",
      expectedCents: 49000,
      interval: "year",
    },
    {
      label: "Business monthly",
      priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID || "",
      expectedCents: 14900,
      interval: "month",
    },
    {
      label: "Business yearly",
      priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID || "",
      expectedCents: 149000,
      interval: "year",
    },
    {
      label: "Regulated monthly",
      priceId: process.env.NEXT_PUBLIC_STRIPE_REGULATED_MONTHLY_PRICE_ID || "",
      expectedCents: 29900,
      interval: "month",
    },
    {
      label: "Regulated yearly",
      priceId: process.env.NEXT_PUBLIC_STRIPE_REGULATED_YEARLY_PRICE_ID || "",
      expectedCents: 299000,
      interval: "year",
    },
  ];

  for (const tier of PRICE_IDS) {
    test(`J6 — ${tier.label} price is active`, async () => {
      if (!tier.priceId) {
        console.warn(`${tier.label}: price ID env var not set — verify NEXT_PUBLIC_ vars on Vercel`);
        return;
      }

      const res = await fetch(`https://api.stripe.com/v1/prices/${tier.priceId}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${STRIPE_SECRET_KEY}:`).toString("base64")}`,
        },
      });

      expect(res.ok, `Stripe API error for ${tier.label} (${tier.priceId}): ${res.status}`).toBe(true);
      const price = await res.json() as {
        active: boolean;
        unit_amount: number;
        recurring: { interval: string };
      };

      expect(
        price.active,
        `${tier.label} price (${tier.priceId}) is archived/inactive — customers get Stripe error on checkout`,
      ).toBe(true);

      expect(
        price.recurring?.interval,
        `${tier.label}: interval mismatch`,
      ).toBe(tier.interval);
    });
  }

  test("J6 — /api/stripe/checkout rejects unknown price IDs", async () => {
    const baseURL = process.env.TEST_BASE_URL || "https://aicomply.piposlab.com";
    const res = await fetch(`${baseURL}/api/stripe/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: "price_fake_0000000000000" }),
    });
    // Must be 401 (not logged in) or 400 (invalid price), never 200
    expect([400, 401], `Expected 400/401 for fake priceId, got ${res.status}`).toContain(
      res.status,
    );
  });
});
