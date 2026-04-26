import { test, expect } from "@playwright/test";
import { pricingPlans } from "@/lib/stripe/plans";

/**
 * Pricing update 2026-04-26 per .shared/brainstorming/2026-04-25/DIGEST.md:
 *  - Free / Pro $79 / Business $199 / Regulated $399 ($399 = the
 *    "Professional" tier the digest recommended)
 *  - NEW: Enterprise tier at $4,999/mo with contact-sales CTA targeting
 *    multi-jurisdiction compliance + GPAI + indemnity insurance partners
 */

test.describe("AIComply pricing structure (post 2026-04-26 update)", () => {
  test("all 5 tiers exist", () => {
    const ids = pricingPlans.map((p) => p.id);
    expect(ids).toEqual(["free", "pro", "business", "regulated", "enterprise"]);
  });

  test("Pro stays at $79 (acquisition tier)", () => {
    const pro = pricingPlans.find((p) => p.id === "pro");
    expect(pro!.price.monthly).toBe(79);
  });

  test("Regulated remains at $399 (Professional-tier price point)", () => {
    const reg = pricingPlans.find((p) => p.id === "regulated");
    expect(reg!.price.monthly).toBe(399);
  });

  test("Enterprise tier added at $4,999/mo with contact-sales", () => {
    const ent = pricingPlans.find((p) => p.id === "enterprise");
    expect(ent).toBeDefined();
    expect(ent!.price.monthly).toBe(4999);
    expect(ent!.price.yearly).toBe(49990);
    expect(ent!.contactSales).toBe(true);
    expect(ent!.cta).toBe("Contact sales");
    expect(ent!.stripePriceId.monthly).toBe("");
    expect(ent!.stripePriceId.yearly).toBe("");
  });

  test("Enterprise features include indemnity insurance + multi-jurisdiction", () => {
    const ent = pricingPlans.find((p) => p.id === "enterprise");
    expect(ent!.features.some((f) => /indemnity insurance/i.test(f))).toBe(true);
    expect(ent!.features.some((f) => /Multi-jurisdiction/i.test(f))).toBe(true);
  });

  test("no plan has 'Start 14-day trial' (regression on bug #1)", () => {
    for (const p of pricingPlans) {
      expect(p.cta).not.toContain("14-day trial");
    }
  });
});

test.describe("AIComply pricing landing rendering", () => {
  test("Enterprise tier visible with contact-sales CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Enterprise", { exact: true }).first()).toBeVisible();
  });

  test("Enterprise CTA links to mailto, not Stripe", async ({ page }) => {
    await page.goto("/");
    // Find the Enterprise card's button and check its href
    const html = await page.content();
    expect(html).toContain("AIComply%20Enterprise%20tier%20inquiry");
  });
});
