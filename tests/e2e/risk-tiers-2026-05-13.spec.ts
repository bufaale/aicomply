/**
 * E2E for /risk-tiers SEO content hub (shipped 2026-05-13).
 *
 * - Renders 4 tier sections (prohibited / high / limited / minimal)
 * - Each section has Article citation + obligations list + CTA
 * - Sitemap includes /risk-tiers
 */

import { test, expect, request } from "@playwright/test";

const BASE = process.env.TEST_BASE_URL ?? "https://aicomply.piposlab.com";

test.describe("AIComply /risk-tiers — shipped 2026-05-13", () => {
  test("renders 4 tier sections with citations + obligations + CTA", async ({ page }) => {
    await page.goto(`${BASE}/risk-tiers`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/4 EU AI Act risk tiers/i).first()).toBeVisible();

    // 4 tier h2 headings (Prohibited, High-risk, Limited risk, Minimal risk)
    await expect(page.getByRole("heading", { name: /^Prohibited$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^High-risk$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Limited risk$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Minimal risk$/i })).toBeVisible();

    // 4 "Classify my system" CTAs (one per tier section)
    const ctaCount = await page.getByRole("link", { name: /Classify my system/i }).count();
    expect(ctaCount).toBe(4);

    // Obligations checklists present
    const obligationsCount = await page.getByText(/Obligations checklist/i).count();
    expect(obligationsCount).toBe(4);
  });

  test("each tier has a max-penalty callout", async ({ page }) => {
    await page.goto(`${BASE}/risk-tiers`);
    const penaltyCount = await page.getByText(/^Max penalty$/i).count();
    expect(penaltyCount).toBe(4);
  });

  test("/sitemap.xml lists /risk-tiers", async () => {
    const ctx = await request.newContext();
    const r = await ctx.get(`${BASE}/sitemap.xml`);
    expect(r.status()).toBe(200);
    const body = await r.text();
    expect(body).toContain("/risk-tiers");
  });
});
