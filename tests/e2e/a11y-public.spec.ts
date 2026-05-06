/**
 * a11y-public — axe-core scan against every public v2 surface.
 *
 * Runs the WCAG 2.1 AA + 2.0 AA + 2.1 A + 2.0 A rule set against each
 * unauthenticated route and asserts ZERO `critical` or `serious`
 * violations. `moderate` and `minor` are reported in console but do not
 * fail the build — those are good-housekeeping items that can land in
 * iterative polish.
 *
 * If any route fails, run the audit-a11y-detail script (see
 * .shared/launch playbook) with A11Y_PATH=<route> to get per-violation
 * selector + suggested fix breakdown.
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PUBLIC_ROUTES = [
  "/v2",
  "/v2/pricing",
  "/v2/risk-checker",
  "/v2/trust",
  "/login",
  "/signup",
  "/forgot-password",
];

for (const route of PUBLIC_ROUTES) {
  test(`a11y: no critical/serious WCAG violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const blocking = result.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    if (blocking.length > 0) {
      const summary = blocking
        .map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.nodes.length} node(s) — ${v.help}`,
        )
        .join("\n");
      console.log(`\n=== a11y blocking violations on ${route} ===\n${summary}`);
    }
    expect(blocking, `Blocking violations on ${route}`).toHaveLength(0);
  });
}
