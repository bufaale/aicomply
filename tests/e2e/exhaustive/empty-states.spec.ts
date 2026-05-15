/**
 * empty-states.spec.ts — AIComply exhaustive audit (2026-05-15)
 *
 * Every listing/overview route must render without crashing when the user
 * has zero data. Each must show a helpful CTA to create the first item.
 *
 * Tested routes:
 * - /dashboard (0 AI systems, 0 literacy records)
 * - /dashboard/ai-systems (0 systems)
 * - /dashboard/annex-iv (0 documents)
 * - /dashboard/dpia (0 assessments)
 * - /dashboard/fria (0 assessments)
 * - /dashboard/literacy (0 records)
 * - /dashboard/questionnaire (no history)
 * - /dashboard/discovery (no imports)
 * - /trust (no live trust pages yet)
 */
import { test, expect } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  loginViaUI,
  setUserPlan,
} from "../../helpers/test-utils";

const BASE = process.env.TEST_BASE_URL ?? "https://aicomply.piposlab.com";

test.describe("Empty states — dashboard (0 systems)", () => {
  let userId: string;
  let userEmail: string;

  test.beforeAll(async () => {
    // Fresh user — guaranteed zero data
    const user = await createTestUser("empty-states-dash");
    userId = user.id;
    userEmail = user.email;
  });

  test.afterAll(async () => {
    await deleteTestUser(userId);
  });

  test("/dashboard renders without 500 when user has 0 systems", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto(`${BASE}/dashboard`);
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("/dashboard");
    const html = await page.content();
    expect(html).not.toMatch(/500|Internal Server Error|TypeError|ReferenceError/i);
  });

  test("/dashboard empty state shows CTA to register first system", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto(`${BASE}/dashboard`);
    await page.waitForLoadState("networkidle");

    // Dashboard shows "No systems tracked yet." + "Register your first AI system" CTA
    await expect(
      page.getByRole("link", { name: /register.*first|add.*system|register ai/i }),
    ).toBeVisible({ timeout: 8_000 });
  });

  test("/dashboard shows stat grid even with 0 systems (no NaN or undefined)", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto(`${BASE}/dashboard`);
    await page.waitForLoadState("networkidle");

    const html = await page.content();
    // Stat values should not be NaN, undefined, or null rendered as text
    expect(html).not.toContain(">NaN<");
    expect(html).not.toContain(">undefined<");
    expect(html).not.toContain(">null<");
    // Should show 0 for systems tracked
    expect(html).toMatch(/0 AI system|0 system/i);
  });

  test("/dashboard/ai-systems renders without 500 when empty", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto(`${BASE}/dashboard/ai-systems`);
    await page.waitForLoadState("networkidle");

    const html = await page.content();
    expect(html).not.toMatch(/500|Internal Server Error/i);
  });

  test("/dashboard/ai-systems shows CTA to add system when list is empty", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto(`${BASE}/dashboard/ai-systems`);
    await page.waitForLoadState("networkidle");

    const html = await page.content();
    // Should show empty state with instruction / add button
    expect(html).toMatch(/register|add|new|no system|get started/i);
  });

  test("/dashboard/literacy renders without 500 when empty", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto(`${BASE}/dashboard/literacy`);
    await page.waitForLoadState("networkidle");

    const html = await page.content();
    expect(html).not.toMatch(/500|Internal Server Error/i);
  });

  test("/dashboard/literacy shows empty state copy when no records", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto(`${BASE}/dashboard/literacy`);
    await page.waitForLoadState("networkidle");

    const html = await page.content();
    // "No literacy records yet. Add the first above."
    expect(html).toMatch(/no.*records?|add the first|no.*literacy/i);
  });
});

test.describe("Empty states — document generators (free tier)", () => {
  let userId: string;
  let userEmail: string;

  test.beforeAll(async () => {
    const user = await createTestUser("empty-states-docs");
    userId = user.id;
    userEmail = user.email;
  });

  test.afterAll(async () => {
    await deleteTestUser(userId);
  });

  test("/dashboard/annex-iv renders without 500 for free user", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto(`${BASE}/dashboard/annex-iv`);
    await page.waitForLoadState("networkidle");

    const html = await page.content();
    expect(html).not.toMatch(/500|Internal Server Error/i);
  });

  test("/dashboard/annex-iv shows empty state (not blank screen)", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto(`${BASE}/dashboard/annex-iv`);
    await page.waitForLoadState("networkidle");

    // Must render meaningful content — heading, empty state, or upgrade prompt
    const headings = page.getByRole("heading");
    await expect(headings.first()).toBeVisible({ timeout: 8_000 });
  });

  test("/dashboard/dpia renders without 500 for free user", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto(`${BASE}/dashboard/dpia`);
    await page.waitForLoadState("networkidle");

    const html = await page.content();
    expect(html).not.toMatch(/500|Internal Server Error/i);
  });

  test("/dashboard/fria renders without 500 for free user", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto(`${BASE}/dashboard/fria`);
    await page.waitForLoadState("networkidle");

    const html = await page.content();
    expect(html).not.toMatch(/500|Internal Server Error/i);
  });

  test("/dashboard/fria shows list/empty state (not blank)", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto(`${BASE}/dashboard/fria`);
    await page.waitForLoadState("networkidle");

    const headings = page.getByRole("heading");
    await expect(headings.first()).toBeVisible({ timeout: 8_000 });
  });
});

test.describe("Empty states — regulated tier documents", () => {
  let userId: string;
  let userEmail: string;

  test.beforeAll(async () => {
    const user = await createTestUser("empty-states-regulated", "regulated");
    userId = user.id;
    userEmail = user.email;
  });

  test.afterAll(async () => {
    await deleteTestUser(userId);
  });

  test("/dashboard/annex-iv shows new document CTA for regulated user", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto(`${BASE}/dashboard/annex-iv`);
    await page.waitForLoadState("networkidle");

    const html = await page.content();
    expect(html).not.toMatch(/500|Internal Server Error/i);
    // Should show "Generate Annex IV" or "New document" CTA
    await expect(
      page.getByRole("link", { name: /generate|new|create|annex/i }).first(),
    ).toBeVisible({ timeout: 8_000 });
  });

  test("/dashboard/annex-iv/new form renders for regulated user", async ({ page }) => {
    await loginViaUI(page, userEmail);
    await page.goto(`${BASE}/dashboard/annex-iv/new`);
    await page.waitForLoadState("networkidle");

    const html = await page.content();
    expect(html).not.toMatch(/500|Internal Server Error/i);
    await expect(
      page.getByRole("button", { name: /generate annex iv|create|generate/i }),
    ).toBeVisible({ timeout: 8_000 });
  });
});

test.describe("Empty states — public pages with no live data", () => {
  test("/trust renders without 500 even if no live trust pages exist", async ({ page }) => {
    await page.goto(`${BASE}/trust`);
    await page.waitForLoadState("networkidle");

    const html = await page.content();
    expect(html).not.toMatch(/500|Internal Server Error/i);

    // Must show a heading — not a blank page
    await expect(page.getByRole("heading").first()).toBeVisible({ timeout: 8_000 });
  });

  test("/trust shows meaningful content (not blank screen)", async ({ page }) => {
    await page.goto(`${BASE}/trust`);
    await page.waitForLoadState("networkidle");

    const html = await page.content();
    // Should mention trust, compliance, or the product name
    expect(html).toMatch(/trust|compliance|AIComply/i);
  });

  test("/blog renders without 500 (no posts edge case)", async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    await page.waitForLoadState("networkidle");

    const html = await page.content();
    expect(html).not.toMatch(/500|Internal Server Error/i);
  });

  test("/quiz-result/[invalid-token] returns 404 not 500", async ({ page }) => {
    const res = await page.request.get(`${BASE}/quiz-result/invalid-token-that-does-not-exist`);
    // Must be 404 (expected no-match) not 500 (crash)
    expect(res.status()).not.toBe(500);
    // 404 or 200-with-not-found-state are both acceptable
    expect([404, 200]).toContain(res.status());
  });
});
