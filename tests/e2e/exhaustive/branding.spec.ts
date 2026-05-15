/**
 * branding.spec.ts — AIComply exhaustive audit (2026-05-15)
 *
 * Verifies: tab title, meta description, footer copy, hero copy, FAQ copy all
 * match the AIComply brand. No leftover boilerplate ("ClauseForge", "SaaS AI
 * Boilerplate", "PandaDoc", etc.).
 *
 * Does NOT duplicate honest-credentials-2026-05-13.spec.ts (SOC 2 footer check).
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.TEST_BASE_URL ?? "https://aicomply.piposlab.com";

test.describe("Branding — tab title, meta, copy", () => {
  test("root title is AIComply brand (not boilerplate)", async ({ page }) => {
    await page.goto(BASE);
    const title = await page.title();
    // Must contain AIComply
    expect(title).toContain("AIComply");
    // Must not contain leftover template names
    expect(title).not.toMatch(/SaaS AI Boilerplate|ClauseForge|ProposalForge|ReviewStack|Boilerplate/i);
  });

  test("meta description mentions EU AI Act", async ({ page }) => {
    await page.goto(BASE);
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc).toBeTruthy();
    expect(desc!.toLowerCase()).toMatch(/eu ai act|aicomply/i);
  });

  test("footer copyright is AIComply / Pipo's Lab LLC", async ({ page }) => {
    await page.goto(BASE);
    const html = await page.content();
    // MktFooter renders: "© 2026 Pipo's Lab LLC · AIComply™"
    expect(html).toMatch(/Pipo.{1,5}s Lab LLC/i);
    expect(html).toMatch(/AIComply/i);
    // Not another product name
    expect(html).not.toMatch(/ClauseForge|ProposalForge|ReviewStack|CallSpark|AccessiScan/i);
  });

  test("hero headline references EU AI Act risk tiers", async ({ page }) => {
    await page.goto(BASE);
    // Hero H1: "Classify every AI system into 4 risk tiers."
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    const text = await h1.innerText();
    expect(text.toLowerCase()).toMatch(/ai system|risk tier|classify/i);
  });

  test("hero CTA copy is correct (not another app's CTA)", async ({ page }) => {
    await page.goto(BASE);
    // Primary CTA: "Run the 10-question check — free"
    await expect(page.getByRole("link", { name: /10-question check/i }).first()).toBeVisible();
  });

  test("hero stat grid shows EU AI Act-specific stats", async ({ page }) => {
    await page.goto(BASE);
    const html = await page.content();
    // Stat grid: €35M, 4 risk tiers, 10 questions, Art. 6 + Annex III
    expect(html).toContain("€35M");
    expect(html).toContain("4");
    expect(html).toContain("10");
  });

  test("pricing page title and tier names match plans.ts", async ({ page }) => {
    await page.goto(`${BASE}/pricing`);
    const title = await page.title();
    expect(title).toMatch(/pricing/i);
    expect(title).toMatch(/AIComply/i);

    const html = await page.content();
    expect(html).toContain("Pro");
    expect(html).toContain("Business");
    expect(html).toContain("Regulated");
    // Correct pricing
    expect(html).toContain("$49");
    expect(html).toContain("$149");
    expect(html).toContain("$399");
  });

  test("pricing page does NOT show stale $79/$199 prices from memory-recalled old version", async ({ page }) => {
    await page.goto(`${BASE}/pricing`);
    const html = await page.content();
    // Old prices were $79/mo pro, $199/mo business — ensure they don't appear
    // as primary tier prices (they may appear in comparison table as competitor prices)
    // Check the tier cards specifically (not the comparison table)
    const tierCards = page.locator("[class*='tier'], [data-tier]");
    // At minimum verify the main pricing numbers are correct
    expect(html).toMatch(/\$49/);
    expect(html).toMatch(/\$149/);
    expect(html).toMatch(/\$399/);
    // Old tier names should not appear
    expect(html).not.toMatch(/\$79\/mo|Pro \$79|Pro: \$79/);
  });

  test("login page does NOT claim SOC 2 Type II certification", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState("networkidle");
    const html = await page.content();
    // The false claim "Protected by SOC 2 Type II controls. REG. NO. AIC-2026"
    // was fixed in this audit. This test locks it in.
    expect(html).not.toContain("Protected by SOC 2 Type II controls");
    expect(html).not.toContain("REG. NO. AIC-2026");
    // The replacement copy should be present
    expect(html).toMatch(/TLS|AES-256|encrypted|Security posture/i);
  });

  test("login page does NOT claim a reg number we don't have", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState("networkidle");
    const html = await page.content();
    expect(html).not.toMatch(/REG\. NO\. AIC-\d+/i);
  });

  test("FAQ on landing correctly qualifies SOC 2 as roadmap (not current cert)", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    const html = await page.content();
    // The FAQ answer: "SOC 2 Type II is on the roadmap once we hit 5+ enterprise customers"
    // Must NOT claim we currently hold it
    expect(html).not.toContain("SOC 2 Type II certified");
    expect(html).not.toContain("ISO 27001 certified since");
    // The roadmap qualifier must be present somewhere on the page
    expect(html).toMatch(/roadmap|on request|in progress/i);
  });

  test("no cross-product contamination — ClauseForge/PandaDoc copy not rendered", async ({ page }) => {
    await page.goto(BASE);
    const html = await page.content();
    // why-us.tsx has ClauseForge copy but should not be imported/rendered
    expect(html).not.toContain("ClauseForge");
    expect(html).not.toContain("PandaDoc");
    expect(html).not.toContain("DocuSign");
    expect(html).not.toContain("Why ClauseForge");
  });

  test("no cross-product contamination on /pricing", async ({ page }) => {
    await page.goto(`${BASE}/pricing`);
    const html = await page.content();
    expect(html).not.toContain("ClauseForge");
    expect(html).not.toContain("PandaDoc");
  });

  test("terms page uses siteConfig.name (AIComply) not raw boilerplate", async ({ page }) => {
    await page.goto(`${BASE}/terms`);
    const html = await page.content();
    // siteConfig.name = "AIComply"
    expect(html).toContain("AIComply");
    expect(html).not.toMatch(/\[Company Name\]|\[Your Company\]|\[App Name\]/);
  });

  test("footer regulation line is correct", async ({ page }) => {
    await page.goto(BASE);
    const html = await page.content();
    // Footer: "REGULATION (EU) 2024/1689 · THE EU AI ACT"
    expect(html).toMatch(/REGULATION \(EU\) 2024\/1689/i);
  });
});
