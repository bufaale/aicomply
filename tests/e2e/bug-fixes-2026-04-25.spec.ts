import { test, expect } from "@playwright/test";
import { pricingPlans } from "@/lib/stripe/plans";

/**
 * Regression tests for the bug-hunt fixes shipped on 2026-04-25.
 */

test.describe("Bug #1 — Pro plan CTA does not advertise fake trial", () => {
  test("no plan has 'Start 14-day trial' as CTA", () => {
    for (const p of pricingPlans) {
      expect(p.cta).not.toContain("14-day trial");
      expect(p.cta).not.toContain("14 day trial");
    }
  });
});

test.describe("Bug #3 — landing footer has no dead 'href=#' links", () => {
  test("footer renders without href=# placeholder links", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();
    const deadLinks = (html.match(/href="#"/g) ?? []).length;
    expect(deadLinks).toBe(0);
  });

  test("footer source no longer has 'company' section with placeholder links", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const file = path.resolve(process.cwd(), "src/components/landing/footer.tsx");
    const src = await fs.readFile(file, "utf8");
    expect(src).not.toContain('"About"');
    expect(src).not.toContain('"Blog"');
    expect(src).not.toContain('"Contact"');
    expect(src).not.toContain('"Docs"');
    expect(src).not.toContain('href: "#"');
  });
});
