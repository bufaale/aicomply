import { test, expect } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  loginViaUI,
} from "../helpers/test-utils";

/**
 * Regression coverage for the four auth-surface bugs found via manual
 * smoke audit on 2026-05-06 (commits 2c30097, 3b17777, 4726408, a1f4e33).
 *
 * The pattern: a brand-new Free-tier user with zero AI systems must NOT
 * see any UI element that implies a populated workspace, another company,
 * or features from sibling apps in the portfolio. Every previous bug here
 * was an HTTP-200 + zero-console-error route — these checks live where
 * the smoke suite couldn't reach.
 */
test.describe("Empty workspace honesty", () => {
  let testUser: { id: string; email: string };

  test.beforeAll(async () => {
    testUser = await createTestUser("empty-honesty");
  });

  test.afterAll(async () => {
    await deleteTestUser(testUser.id);
  });

  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, testUser.email);
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("BUG #5 — sidebar shows real workspace, not 'Acme Health'", async ({
    page,
  }) => {
    const sidebar = page.locator(".aic-app-sidebar");
    await expect(sidebar).toBeVisible();

    // Must NOT contain hardcoded mock from atoms.tsx defaults.
    await expect(sidebar).not.toContainText("Acme Health");
    await expect(sidebar).not.toContainText("47 systems");
    await expect(sidebar).not.toContainText("47 SYSTEMS");

    // A brand-new Free user must see "Free plan" and "0 systems" in the
    // workspace footer card.
    await expect(sidebar).toContainText(/Free plan/i);
    await expect(sidebar).toContainText(/0 systems/i);
  });

  test("BUG #6 — dashboard cross-walk panel shows real Annex IV data", async ({
    page,
  }) => {
    // The hardcoded fakes were "27 / 38" / "31 / 38" / "47 / 52" / "59 / 64".
    const main = page.locator("main.aic-app-content");
    await expect(main).not.toContainText("27 / 38");
    await expect(main).not.toContainText("31 / 38");
    await expect(main).not.toContainText("47 / 52");
    await expect(main).not.toContainText("59 / 64");

    // Eyebrow must be the new framework-baseline framing.
    await expect(main).toContainText("ANNEX IV CROSS-WALK · BASELINE");
    // Real registry has 24 Annex IV sections — every row should end in /24.
    await expect(main).toContainText(/\/ 24/);
  });

  test("BUG #7 — content area fills viewport, no dead-zone strip", async ({
    page,
  }) => {
    // AI systems route is the worst offender pre-fix because the empty
    // state card is short — the rest of the viewport was raw .aic-app
    // dark shell.
    await page.goto("/dashboard/ai-systems");
    await page.waitForLoadState("domcontentloaded");

    const main = page.locator("main.aic-app-content");
    const body = page.locator("body");
    const mainBox = await main.boundingBox();
    const bodyBox = await body.boundingBox();
    if (!mainBox || !bodyBox) throw new Error("missing layout boxes");

    // Main must fill at least 90% of the body height — flex:1 guarantees
    // it claims the remaining space below the topbar.
    expect(mainBox.height).toBeGreaterThan(bodyBox.height * 0.9);
  });

  test("BUG #8 — settings copy is AI Act, not contracts/scans/VPATs", async ({
    page,
  }) => {
    await page.goto("/settings");
    await page.waitForLoadState("domcontentloaded");

    const main = page.locator("main.aic-app-content");

    // Sibling-app leakage that must NEVER appear.
    await expect(main).not.toContainText("Sign Contract");
    await expect(main).not.toContainText("scans, VPATs");
    await expect(main).not.toContainText("monitored sites");
    await expect(main).not.toContainText("tracker integrations");
    await expect(main).not.toContainText(
      /Customize your contracts with your company branding/i,
    );

    // Replacement copy that is product-specific.
    await expect(main).toContainText("Workspace Branding");
    await expect(main).toContainText(/Annex IV technical documentation/i);
    await expect(main).toContainText("Download Annex IV PDF");
  });
});
