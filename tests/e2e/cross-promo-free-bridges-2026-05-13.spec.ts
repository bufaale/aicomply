/**
 * E2E for the 2026-05-13 cross-promo refactor on AIComply.
 */

import { test, expect } from "@playwright/test";

const BASE = process.env.TEST_BASE_URL ?? "https://aicomply.piposlab.com";

test.describe("AIComply footer cross-promo — points at sibling /free tools", () => {
  test("footer links to AccessiScan /free/wcag-scanner", async ({ page }) => {
    await page.goto(BASE);
    const link = page.locator('a[href="https://accessiscan.piposlab.com/free/wcag-scanner"]').first();
    await expect(link).toBeVisible();
  });

  test("footer links to CallSpark /free/transcript-check", async ({ page }) => {
    await page.goto(BASE);
    const link = page.locator('a[href="https://callspark.piposlab.com/free/transcript-check"]').first();
    await expect(link).toBeVisible();
  });

  test("AccessiScan cross-promo tagline mentions 'Free'", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.getByText(/Free WCAG 2.1 AA scanner/i).first()).toBeVisible();
  });

  test("CallSpark cross-promo tagline mentions 'Free'", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.getByText(/Free call-transcript analyzer/i).first()).toBeVisible();
  });
});
