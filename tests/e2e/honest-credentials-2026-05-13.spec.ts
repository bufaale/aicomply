/**
 * Pre-launch honesty audit (shipped 2026-05-13, before Thu May 14 IH launch).
 *
 * Asserts the footer + FAQ no longer claim SOC 2 Type II or ISO 27001
 * certifications that AIComply doesn't actually hold. Both were
 * pre-existing false-credentialing copy that would have been a
 * launch-blocker if a procurement officer ran a quick due-diligence
 * check on the IH post.
 */

import { test, expect } from "@playwright/test";

const BASE = process.env.TEST_BASE_URL ?? "https://aicomply.piposlab.com";

test.describe("AIComply credentials honesty — shipped 2026-05-13", () => {
  test("homepage footer does NOT claim SOC 2 or ISO 27001 cert", async ({ page }) => {
    await page.goto(BASE);
    // The footer originally said "SOC 2 TYPE II · ISO 27001 · REGULATION (EU) 2024/1689".
    // Replaced with the regulation-only line.
    const html = await page.content();
    expect(html).not.toContain("SOC 2 TYPE II · ISO 27001");
    expect(html).toContain("REGULATION (EU) 2024/1689");
  });

  test("v2 marketing page FAQ no longer claims SOC 2 Type II since Nov 2025", async ({ page }) => {
    await page.goto(`${BASE}/v2`);
    const html = await page.content();
    expect(html).not.toContain("SOC 2 Type II since November 2025");
    expect(html).not.toContain("ISO 27001 since June 2024");
    // New honest answer mentions the security posture
    expect(html).toMatch(/security posture|TLS|AES-256|least-privilege|on the roadmap/i);
  });

  test("cross-walk banner still correctly frames SOC2/ISO as CUSTOMER cert", async ({ page }) => {
    // The cross-walk banner only renders inside the authenticated dashboard,
    // so just verify the marketing pages don't accidentally render it. The
    // banner copy ("Already SOC2 or ISO 27001 certified?") is correct
    // because it frames these as the customer's certifications.
    await page.goto(BASE);
    const html = await page.content();
    // Either the banner isn't present on marketing routes (correct) OR
    // if it is, the framing is the "Already certified?" question form
    if (html.includes("SOC2") || html.includes("ISO 27001")) {
      expect(html).toMatch(/Already SOC2 or ISO 27001 certified/);
    }
  });
});
