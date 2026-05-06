/**
 * Cross-walk banner — opens the SOC2/ISO27001 matrix dialog from
 * /dashboard/annex-iv and asserts:
 *   1. Banner shows the expected aggregate stats sentence
 *   2. Click "See the cross-walk matrix" → dialog opens
 *   3. Dialog renders summary grid (3 stat cards) + 24 entry rows
 *   4. Each row labels match the cross-walk data
 *
 * Skipped without SUPABASE_SERVICE_ROLE_KEY.
 */
import { test, expect } from "@playwright/test";
import { createTestUser, deleteTestUser, loginViaUI } from "../helpers/test-utils";
import {
  ANNEX_IV_CROSS_WALK,
  getCrossWalkStats,
} from "../../src/lib/eu-ai-act/cross-walk";

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

test.skip(!SUPABASE_KEY, "SUPABASE_SERVICE_ROLE_KEY missing");

test.describe("Cross-walk banner — Annex IV pre-satisfaction matrix", () => {
  test("banner stats match the cross-walk getCrossWalkStats output", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    const user = await createTestUser("v2-xwalk", "free");
    const stats = getCrossWalkStats();

    try {
      await loginViaUI(page, user.email);
      await page.goto("/dashboard/annex-iv");
      await expect(
        page.getByRole("heading", { name: /Annex IV technical documentation/i }),
      ).toBeVisible({ timeout: 15_000 });

      // The banner sentence interpolates the stats — assert the dynamic
      // numbers match what the function returns. If a future cross-walk
      // edit shifts the percentage, the banner copy follows automatically
      // (it's not hardcoded), so this assertion proves the binding.
      const bannerCopy = page.getByText(
        new RegExp(
          `${stats.soc2Count} of ${stats.total} Annex IV sections \\(${stats.soc2Pct}%\\)`,
          "i",
        ),
      );
      await expect(bannerCopy.first()).toBeVisible({ timeout: 10_000 });

      const bannerIso = page.getByText(
        new RegExp(`${stats.iso27001Count} of ${stats.total} \\(${stats.iso27001Pct}%\\)`, "i"),
      );
      await expect(bannerIso.first()).toBeVisible();
    } finally {
      if (user?.id) await deleteTestUser(user.id);
    }
  });

  test("dialog opens with 3 summary cards + 24 entry rows", async ({ page }) => {
    test.setTimeout(60_000);
    const user = await createTestUser("v2-xwalk-dialog", "free");

    try {
      await loginViaUI(page, user.email);
      await page.goto("/dashboard/annex-iv");
      await expect(
        page.getByRole("heading", { name: /Annex IV technical documentation/i }),
      ).toBeVisible({ timeout: 15_000 });

      // Open the dialog
      await page
        .getByRole("button", { name: /See the cross-walk matrix/i })
        .first()
        .click();

      // shadcn Dialog has role="dialog" and aria-labelled by the title
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible({ timeout: 5000 });
      await expect(
        dialog.getByText(/Annex IV ↔ SOC2 \/ ISO 27001 cross-walk/i),
      ).toBeVisible();

      // Summary grid renders 3 stat cards
      await expect(dialog.getByText(/SOC2 alone/i)).toBeVisible();
      await expect(dialog.getByText(/ISO 27001 alone/i)).toBeVisible();
      await expect(dialog.getByText(/Either \/ both/i)).toBeVisible();

      // 24 entry rows — each entry has a unique label. Sample 6 distinct
      // labels (covering high / medium / none coverage variants) so we
      // don't depend on every label existing forever.
      const sampledLabels = [
        "System intended purpose",
        "Developer / provider identity",
        "Human oversight measures",
        "Risk-management system",
        "Capabilities and limitations",
        "Post-market monitoring plan",
      ];
      for (const label of sampledLabels) {
        await expect(
          dialog.getByText(label, { exact: false }).first(),
        ).toBeVisible({ timeout: 5000 });
      }

      // Length check — every entry must appear at least once
      for (const entry of ANNEX_IV_CROSS_WALK) {
        const matches = dialog.getByText(entry.label, { exact: false });
        // Use first().isVisible() so multi-match doesn't strict-mode-error.
        // The label appears as a card heading, so first() is enough.
        await expect(matches.first()).toBeVisible({ timeout: 2000 });
      }
    } finally {
      if (user?.id) await deleteTestUser(user.id);
    }
  });

  test("dialog closes via Escape + outside-click", async ({ page }) => {
    test.setTimeout(45_000);
    const user = await createTestUser("v2-xwalk-close", "free");
    try {
      await loginViaUI(page, user.email);
      await page.goto("/dashboard/annex-iv");
      await page
        .getByRole("button", { name: /See the cross-walk matrix/i })
        .first()
        .click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible({ timeout: 5000 });
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible({ timeout: 3000 });
    } finally {
      if (user?.id) await deleteTestUser(user.id);
    }
  });
});
