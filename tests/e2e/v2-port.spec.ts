/**
 * v2 port — exercises every /v2/* route plus the rebranded auth pages
 * end-to-end. This is the regression baseline that flips when we swap
 * /v2 to /. Before the swap, every /v2/* route serves the new design;
 * after the swap, /v2/* should redirect to / and the assertions here
 * move to the existing landing.spec.ts / pricing-page.spec.ts files.
 */
import { test, expect } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  loginViaUI,
} from "../helpers/test-utils";

test.describe("v2 marketing landing (/v2)", () => {
  test("hero serif headline + 4-tier risk pyramid render", async ({ page }) => {
    await page.goto("/v2");

    // EU AI Act eyebrow with deadline
    await expect(
      page.getByText(/EU AI ACT · ART\. 4 · IN FORCE 02 AUG 2026/i).first(),
    ).toBeVisible();

    // Fraunces hero h1 (4 risk tiers · auditor packet)
    await expect(
      page.getByRole("heading", { level: 1, name: /Classify every AI system/i }),
    ).toBeVisible();
    await expect(page.getByText(/4 risk tiers/i).first()).toBeVisible();

    // Pyramid leitmotif renders all four tier rows
    await expect(page.getByText("Prohibited").first()).toBeVisible();
    await expect(page.getByText("High-risk").first()).toBeVisible();
    await expect(page.getByText("Limited risk").first()).toBeVisible();
    await expect(page.getByText("Minimal risk").first()).toBeVisible();

    // CTAs hit risk-checker + pricing
    const riskCta = page.getByRole("link", {
      name: /Run the 10-question check/i,
    });
    await expect(riskCta).toHaveAttribute("href", "/v2/risk-checker");
    const pricingCta = page.getByRole("link", { name: /^See pricing$/i }).first();
    await expect(pricingCta).toHaveAttribute("href", "/v2/pricing");
  });

  test("4-step 'how it works' + cross-walk strip", async ({ page }) => {
    await page.goto("/v2");
    for (const step of ["Inventory", "Classify risk", "Train + log", "Hand over packet"]) {
      await expect(page.getByText(step).first()).toBeVisible();
    }
    await expect(page.getByText(/CROSS-WALK · PRE-SATISFIED/i).first()).toBeVisible();
  });

  test("pricing teaser shows all 4 tiers", async ({ page }) => {
    await page.goto("/v2");
    await expect(page.getByText("$49").first()).toBeVisible();
    await expect(page.getByText("$149").first()).toBeVisible();
    await expect(page.getByText("$399").first()).toBeVisible();
    await expect(page.getByText(/Most picked/i).first()).toBeVisible();
  });
});

test.describe("v2 pricing (/v2/pricing)", () => {
  test("4 tier cards + feature matrix renders", async ({ page }) => {
    await page.goto("/v2/pricing");
    await expect(
      page.getByRole("heading", { level: 1, name: /Per workspace\. Per month\./ }),
    ).toBeVisible();
    // 4 tiers
    for (const t of ["Pro", "Business", "Regulated", "Enterprise"]) {
      await expect(page.getByText(t).first()).toBeVisible();
    }
    // Section headers in feature matrix (5 groups)
    await expect(page.getByText(/AI systems & inventory/).first()).toBeVisible();
    await expect(page.getByText(/Article 4 literacy/).first()).toBeVisible();
    await expect(page.getByText(/Audit & evidence/).first()).toBeVisible();
  });

  test("Enterprise CTA goes to mailto sales address", async ({ page }) => {
    await page.goto("/v2/pricing");
    const enterpriseCta = page
      .getByRole("link", { name: /Talk to sales/i })
      .first();
    const href = await enterpriseCta.getAttribute("href");
    expect(href).toMatch(/^mailto:/);
    expect(href).toContain("Enterprise");
  });
});

test.describe("v2 risk checker (/v2/risk-checker)", () => {
  test("10-question flow: all-no answers classify as Minimal", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto("/v2/risk-checker");
    await expect(
      page.getByRole("heading", { level: 1, name: /10 questions/i }),
    ).toBeVisible();

    // Answer "No" to all 10. Each click auto-advances after a 220ms timeout.
    for (let i = 0; i < 10; i++) {
      // Wait for the "No" button to appear in the active question card
      const noBtn = page.getByRole("button", { name: /^No$/ }).first();
      await noBtn.waitFor({ state: "visible", timeout: 5000 });
      await noBtn.click();
      // Allow the 220ms auto-advance + paint
      await page.waitForTimeout(280);
    }

    // Verdict heading should now be one of the 4 tiers — for all-no, "Minimal"
    await expect(
      page.getByRole("heading", { level: 2, name: /Minimal/i }).first(),
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/RECITAL 165/i).first()).toBeVisible();

    // Save-verdict CTA links to /signup
    const saveCta = page.getByRole("link", { name: /Save verdict/i });
    await expect(saveCta).toHaveAttribute("href", "/signup");
  });

  test("answering yes to a high-risk question lands on High-risk verdict", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.goto("/v2/risk-checker");

    // Q1, Q2, Q3 = No (skip prohibited triggers)
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: /^No$/ }).first().click();
      await page.waitForTimeout(280);
    }
    // Q4 = Yes (regulated product safety component → high-risk)
    await page.getByRole("button", { name: /^Yes$/ }).first().click();
    await page.waitForTimeout(280);
    // Remaining Q5-Q10 = No
    for (let i = 0; i < 6; i++) {
      await page.getByRole("button", { name: /^No$/ }).first().click();
      await page.waitForTimeout(280);
    }

    await expect(
      page.getByRole("heading", { level: 2, name: /^High-risk$/i }).first(),
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/ART\. 6 · ANNEX III/i).first()).toBeVisible();
  });

  test("re-run check resets the question flow", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto("/v2/risk-checker");
    // Race through with all No
    for (let i = 0; i < 10; i++) {
      await page.getByRole("button", { name: /^No$/ }).first().click();
      await page.waitForTimeout(280);
    }
    await page.getByRole("button", { name: /Re-run check/i }).click();
    await expect(page.getByText(/QUESTION 01 \/ 10/i).first()).toBeVisible();
  });
});

test.describe("v2 trust public (/v2/trust)", () => {
  test("trust page shows operator + classification + documentation", async ({
    page,
  }) => {
    await page.goto("/v2/trust");
    await expect(
      page.getByRole("heading", { level: 1, name: /Triage Copilot/i }),
    ).toBeVisible();
    await expect(page.getByText(/COMPLIANT · LAST REVIEWED/i).first()).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /^High-risk$/i }).first(),
    ).toBeVisible();
    await expect(page.getByText(/PUBLIC DOCUMENTATION/i).first()).toBeVisible();
    await expect(page.getByText(/FINGERPRINT/i).first()).toBeVisible();
  });
});

test.describe("v2 marketing chrome — header + footer", () => {
  test("MktHeader links navigate between v2 surfaces", async ({ page }) => {
    await page.goto("/v2");
    // Click "Pricing" in nav
    await page.getByRole("link", { name: /^Pricing$/i }).first().click();
    await expect(page).toHaveURL(/\/v2\/pricing/);
    // Click "Risk checker"
    await page.getByRole("link", { name: /Risk checker/i }).first().click();
    await expect(page).toHaveURL(/\/v2\/risk-checker/);
  });

  test("Footer regulatory line + tier columns render", async ({ page }) => {
    await page.goto("/v2");
    await expect(
      page.getByText(/SOC 2 TYPE II · ISO 27001 · REGULATION \(EU\) 2024\/1689/i),
    ).toBeVisible();
    // Footer columns
    await expect(page.getByText(/REG\. NO\. AIC-2026/i).first()).toBeVisible();
  });
});

test.describe("v2 auth — split-panel chrome on /login /signup /forgot-password", () => {
  test("/login renders AuthSide hero + Continue with Google + email/password", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { level: 1, name: /Welcome back\./i }),
    ).toBeVisible();
    // The dark AuthSide pane includes the EU AI Act in-force eyebrow
    await expect(
      page.getByText(/EU AI ACT · ART\. 4 · IN FORCE 02 AUG 2026/i).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Continue with Google/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("/signup renders ToS gate that disables submit until accepted", async ({
    page,
  }) => {
    await page.goto("/signup");
    await expect(
      page.getByRole("heading", { level: 1, name: /Start your AI Act register/i }),
    ).toBeVisible();
    const submit = page.getByRole("button", { name: /Create workspace/i });
    // ToS checkbox starts unchecked → submit disabled
    const tos = page.locator("#tos");
    await expect(tos).not.toBeChecked();
    await expect(submit).toBeDisabled();
    await tos.check();
    await expect(submit).toBeEnabled();
  });

  test("/forgot-password shows reset form + back-to-login link", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Forgot your password\?/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Send reset link/i }),
    ).toBeVisible();
    const backLink = page.getByRole("link", { name: /Back to sign in/i });
    await expect(backLink).toHaveAttribute("href", "/login");
  });
});

test.describe("v2 dashboard — gold-accent AppShell", () => {
  test("authenticated /dashboard renders sidebar + serif greeting + risk pyramid", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    const user = await createTestUser("v2-dash", "free");
    try {
      await loginViaUI(page, user.email);
      await page.goto("/dashboard");

      // Fraunces serif greeting (uses first-name; fallback "there" when full_name missing)
      await expect(
        page.getByRole("heading", { level: 1, name: /Good morning,/i }),
      ).toBeVisible({ timeout: 15_000 });

      // Sidebar workspace label + Dashboard active item
      await expect(page.getByText(/Workspace/i).first()).toBeVisible();
      await expect(
        page.getByRole("link", { name: /Dashboard/i }).first(),
      ).toBeVisible();

      // Pyramid risk leitmotif present (dark variant, with the 4 tier labels)
      await expect(page.getByText(/RISK PYRAMID/i).first()).toBeVisible();

      // Cross-walk coverage card
      await expect(page.getByText(/CROSS-WALK COVERAGE/i).first()).toBeVisible();
    } finally {
      await deleteTestUser(user.id);
    }
  });
});
