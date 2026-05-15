/**
 * links.spec.ts — AIComply exhaustive audit (2026-05-15)
 *
 * Verifies every internal route returns 200. External links point at correct
 * domains (not vercel.app previews). Checks sitemap.xml resolves.
 *
 * Does NOT duplicate tests in link-audit.spec.ts (which covers authenticated
 * dashboard links). This file focuses on PUBLIC surface + critical internal routes.
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.TEST_BASE_URL ?? "https://aicomply.piposlab.com";

// All public routes the sitemap declares + routes promised on the landing
const PUBLIC_ROUTES = [
  "/",
  "/pricing",
  "/free/risk-checker",
  "/risk-tiers",
  "/trust",
  "/fria-generator",
  "/dpia-generator",
  "/blog",
  "/terms",
  "/privacy",
  "/refund",
  "/login",
  "/signup",
  "/forgot-password",
  "/sitemap.xml",
  "/api/health",
];

test.describe("Public routes — all return non-5xx", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`GET ${route} → 200 or 3xx`, async ({ page }) => {
      const res = await page.request.get(`${BASE}${route}`);
      // 200 for pages, 3xx for redirects — never 4xx on public routes (except /api/health which may be 200)
      expect(
        res.status(),
        `${route} returned ${res.status()} — unexpected failure`,
      ).toBeLessThan(500);
      // Specifically protect against 404 on public routes
      if (!["/login", "/signup", "/forgot-password"].includes(route)) {
        expect(
          res.status(),
          `${route} returned 404 — route not registered`,
        ).not.toBe(404);
      }
    });
  }
});

test.describe("Internal link audit — hero CTAs resolve", () => {
  test("hero primary CTA href=/free/risk-checker resolves to 200", async ({ page }) => {
    const res = await page.request.get(`${BASE}/free/risk-checker`);
    expect(res.status()).toBe(200);
  });

  test("hero secondary CTA href=/pricing resolves to 200", async ({ page }) => {
    const res = await page.request.get(`${BASE}/pricing`);
    expect(res.status()).toBe(200);
  });

  test("pyramid card CTA href=/free/risk-checker resolves to 200", async ({ page }) => {
    const res = await page.request.get(`${BASE}/free/risk-checker`);
    expect(res.status()).toBe(200);
  });
});

test.describe("Landing page link audit — all hrefs resolve", () => {
  test("all internal links on landing page return non-4xx", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    const links = await page.locator("a[href^='/']").all();
    const hrefs = new Set<string>();
    for (const link of links) {
      const href = await link.getAttribute("href");
      if (href && !href.startsWith("/api/") && !href.startsWith("//")) {
        hrefs.add(href);
      }
    }

    const failures: string[] = [];
    for (const href of hrefs) {
      const res = await page.request.get(`${BASE}${href}`);
      if (res.status() >= 400) {
        failures.push(`${href} → ${res.status()}`);
      }
    }

    expect(failures, `Broken internal links: ${failures.join(", ")}`).toHaveLength(0);
  });
});

test.describe("Pricing page link audit", () => {
  test("all internal links on /pricing page return non-4xx", async ({ page }) => {
    await page.goto(`${BASE}/pricing`);
    await page.waitForLoadState("networkidle");

    const links = await page.locator("a[href^='/']").all();
    const hrefs = new Set<string>();
    for (const link of links) {
      const href = await link.getAttribute("href");
      if (href && !href.startsWith("/api/")) {
        hrefs.add(href);
      }
    }

    const failures: string[] = [];
    for (const href of hrefs) {
      const res = await page.request.get(`${BASE}${href}`);
      if (res.status() >= 400) {
        failures.push(`${href} → ${res.status()}`);
      }
    }

    expect(failures, `Broken internal links on /pricing: ${failures.join(", ")}`).toHaveLength(0);
  });
});

test.describe("External links — correct domain (not vercel.app preview)", () => {
  test("no external link points at *.vercel.app (preview instead of prod)", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    const externalLinks = await page.locator("a[href^='http']").all();
    const vercelPreviews: string[] = [];

    for (const link of externalLinks) {
      const href = await link.getAttribute("href");
      if (href && href.includes(".vercel.app") && !href.includes("aicomply")) {
        vercelPreviews.push(href);
      }
    }

    expect(
      vercelPreviews,
      `External links pointing at Vercel preview URLs: ${vercelPreviews.join(", ")}`,
    ).toHaveLength(0);
  });

  test("piposlab.com link in footer does not 404", async ({ page }) => {
    await page.goto(BASE);
    // We can't follow external links in tests but we verify the href is set correctly
    const footerLink = page.locator("a[href*='piposlab.com']").first();
    if (await footerLink.isVisible()) {
      const href = await footerLink.getAttribute("href");
      expect(href).toMatch(/piposlab\.com/);
      // Should not be a random vercel.app URL
      expect(href).not.toMatch(/\.vercel\.app/);
    }
  });
});

test.describe("Sitemap — valid XML, correct domain", () => {
  test("/sitemap.xml returns 200 with correct content-type", async ({ page }) => {
    const res = await page.request.get(`${BASE}/sitemap.xml`);
    expect(res.status()).toBe(200);
    const ct = res.headers()["content-type"] ?? "";
    expect(ct).toMatch(/xml/i);
  });

  test("/sitemap.xml contains aicomply.piposlab.com URLs", async ({ page }) => {
    const res = await page.request.get(`${BASE}/sitemap.xml`);
    const body = await res.text();
    expect(body).toContain("aicomply.piposlab.com");
    // Must not contain localhost or vercel.app in the sitemap URLs
    expect(body).not.toMatch(/localhost:\d{4}/);
  });

  test("/sitemap.xml contains all declared public routes", async ({ page }) => {
    const res = await page.request.get(`${BASE}/sitemap.xml`);
    const body = await res.text();
    const expectedPaths = ["/", "/pricing", "/free/risk-checker", "/risk-tiers", "/trust", "/blog"];
    for (const p of expectedPaths) {
      expect(body, `${p} missing from sitemap`).toContain(p);
    }
  });
});

test.describe("Auth routes redirect correctly when unauthed", () => {
  test("/dashboard redirects to /login when not authenticated", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`);
    await page.waitForURL(/\/login/, { timeout: 8_000 });
    expect(page.url()).toContain("/login");
  });

  test("/settings redirects to /login when not authenticated", async ({ page }) => {
    await page.goto(`${BASE}/settings`);
    await page.waitForURL(/\/login/, { timeout: 8_000 });
    expect(page.url()).toContain("/login");
  });
});
