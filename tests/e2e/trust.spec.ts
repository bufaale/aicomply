import { test, expect } from "@playwright/test";

// Trust covers two surfaces:
//  1. /dashboard/trust — authenticated settings page for the public trust profile
//  2. /trust/[slug]    — public posture page (unauthenticated, intentional)
// Anonymous access tests only. Auth'd settings editing deferred.

test.describe("trust settings route — anonymous access", () => {
  test("dashboard trust page redirects to login", async ({ page }) => {
    await page.goto("/dashboard/trust");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("trust API — anonymous access", () => {
  test("GET /api/trust returns 401", async ({ request }) => {
    const res = await request.get("/api/trust");
    expect(res.status()).toBe(401);
  });

  test("PATCH /api/trust returns 401", async ({ request }) => {
    const res = await request.patch("/api/trust", {
      data: { trust_enabled: true },
    });
    expect(res.status()).toBe(401);
  });
});

test.describe("public trust page — unauthenticated", () => {
  test("unknown slug returns 404", async ({ page }) => {
    const res = await page.goto("/trust/does-not-exist-slug-12345");
    expect(res?.status()).toBe(404);
  });
});
