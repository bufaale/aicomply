/**
 * E2E smoke for the shareable quiz-permalink feature (shipped 2026-05-13).
 *
 * Coverage:
 *   1. POST /api/free/risk-checker/save with valid body → 200 + share_url.
 *   2. POST /api/free/risk-checker/save with junk body → 400.
 *   3. GET the returned share_url → 200, renders the verdict tier.
 *   4. /free/risk-checker (alias for /v2/risk-checker) renders the quiz
 *      and exposes the data-testid hooks the share-card relies on.
 */

import { test, expect, request } from "@playwright/test";

const BASE = process.env.TEST_BASE_URL ?? "https://app-16-aicomply.vercel.app";

test.describe("AI Act quiz permalink — shipped 2026-05-13", () => {
  test("/free/risk-checker renders quiz + reaches result via 10 yes-clicks", async ({
    page,
  }) => {
    await page.goto(`${BASE}/free/risk-checker`);
    await expect(page.getByText(/One verdict/i).first()).toBeVisible();
    // Click "Yes" 10 times to traverse all 10 questions
    for (let i = 0; i < 10; i++) {
      await page.getByRole("button", { name: /^Yes/i }).first().click();
      await page.waitForTimeout(260);
    }
    // After 10 yes-answers, classification is "prohibited" (3 Art.5 yes-weights)
    await expect(page.getByText(/Prohibited/i).first()).toBeVisible();
    // Share card visible
    await expect(page.getByTestId("quiz-share-card")).toBeVisible();
    await expect(page.getByTestId("quiz-save-share")).toBeVisible();
  });

  test("POST /api/free/risk-checker/save with valid body → 200 + share_url", async () => {
    const ctx = await request.newContext();
    const r = await ctx.post(`${BASE}/api/free/risk-checker/save`, {
      data: {
        classification: "high",
        answers: ["yes", "no", "no", "yes", "no", "no", "no", "no", "no", "yes"],
        system_label: "E2E smoke — resume screener",
      },
    });
    expect(r.status()).toBe(200);
    const body = await r.json();
    expect(body.ok).toBe(true);
    expect(typeof body.token).toBe("string");
    expect(body.token.length).toBeGreaterThanOrEqual(16);
    expect(body.share_url).toMatch(/\/quiz-result\/[A-Za-z0-9_-]+$/);
  });

  test("POST /api/free/risk-checker/save with invalid classification → 400", async () => {
    const ctx = await request.newContext();
    const r = await ctx.post(`${BASE}/api/free/risk-checker/save`, {
      data: {
        classification: "definitely-not-a-tier",
        answers: ["yes"],
      },
    });
    expect(r.status()).toBe(400);
  });

  test("POST /api/free/risk-checker/save with non-array answers → 400", async () => {
    const ctx = await request.newContext();
    const r = await ctx.post(`${BASE}/api/free/risk-checker/save`, {
      data: { classification: "high", answers: "not-an-array" },
    });
    expect(r.status()).toBe(400);
  });

  test("/quiz-result/[token] renders public verdict for a saved row", async ({
    page,
    request: req,
  }) => {
    // Seed a row, then visit it.
    const r = await req.post(`${BASE}/api/free/risk-checker/save`, {
      data: {
        classification: "limited",
        answers: ["no", "no", "no", "no", "no", "no", "yes", "no", "no", "yes"],
        system_label: "E2E permalink render test",
      },
    });
    expect(r.status()).toBe(200);
    const body = await r.json();
    expect(body.share_url).toBeTruthy();

    await page.goto(body.share_url);
    await expect(page.getByText(/Limited risk/i).first()).toBeVisible();
    await expect(page.getByText(/E2E permalink render test/)).toBeVisible();
    await expect(page.getByText(/Your obligations/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Save verdict/i })).toBeVisible();
  });

  test("/quiz-result/<bogus-token> → 404", async ({ page }) => {
    const r = await page.goto(`${BASE}/quiz-result/this-token-does-not-exist-xx`);
    expect(r?.status()).toBe(404);
  });
});
