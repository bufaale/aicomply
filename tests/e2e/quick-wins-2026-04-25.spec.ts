import { test, expect } from "@playwright/test";
import { calculateExposure } from "@/components/landing/roi-calculator";
import { calcDelta } from "@/components/dashboard/last-30-days-widget";

test.describe("AIComply EU AI Act fine-exposure calculator", () => {
  test("renders on / with the fine-exposure heading", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /What's your maximum fine exposure under EU AI Act\?/i }),
    ).toBeVisible();
  });

  test("shows result with euro amount on initial render", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[data-testid="roi-result"]')).toContainText("€");
  });

  test("CTA links to /signup with turnover + risk params", async ({ page }) => {
    await page.goto("/");
    const cta = page.locator('[data-testid="roi-result"] a').first();
    const href = await cta.getAttribute("href");
    expect(href).toMatch(/^\/signup\?turnover=\w+&risk=\w+$/);
  });
});

test.describe("Unit: AIComply calculateExposure", () => {
  test("returns null on unknown turnover/risk", () => {
    expect(calculateExposure("nope", "high_risk")).toBeNull();
    expect(calculateExposure("medium", "nope")).toBeNull();
  });

  test("prohibited use has higher cap than transparency", () => {
    const p = calculateExposure("medium", "prohibited")!;
    const t = calculateExposure("medium", "transparency")!;
    expect(p.fine_eur).toBeGreaterThan(t.fine_eur);
  });

  test("enterprise turnover never decreases the fine vs small", () => {
    const sm = calculateExposure("small", "high_risk")!;
    const en = calculateExposure("enterprise", "high_risk")!;
    expect(en.fine_eur).toBeGreaterThanOrEqual(sm.fine_eur);
  });

  test("returns at least the fixed cap (Article 99 floor)", () => {
    // For small turnover, the % calc would be tiny; the fixed cap should kick in.
    const sm = calculateExposure("small", "high_risk")!;
    expect(sm.fine_eur).toBeGreaterThanOrEqual(15_000_000);
  });
});

test.describe("Unit: AIComply calcDelta", () => {
  test("0 prev with current > 0 -> 100% up", () => {
    expect(calcDelta(5, 0)).toEqual({ pct: 100, direction: "up" });
  });
  test("equal -> flat", () => {
    expect(calcDelta(3, 3)).toEqual({ pct: 0, direction: "flat" });
  });
  test("up direction", () => {
    expect(calcDelta(120, 100)).toEqual({ pct: 20, direction: "up" });
  });
  test("down direction (absolute pct)", () => {
    expect(calcDelta(80, 100)).toEqual({ pct: 20, direction: "down" });
  });
});
