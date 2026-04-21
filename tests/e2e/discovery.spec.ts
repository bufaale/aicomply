import { test, expect } from "@playwright/test";

// Anonymous-access coverage for shadow-AI discovery (org-wide scan of
// sanctioned + unsanctioned AI tools in use, with CSV import).
// Authenticated import flows deferred — need uploaded CSV fixture.

test.describe("discovery route — anonymous access", () => {
  test("page redirects to login", async ({ page }) => {
    await page.goto("/dashboard/discovery");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("discovery API — anonymous access", () => {
  test("GET /api/discovery returns 401", async ({ request }) => {
    const res = await request.get("/api/discovery");
    expect(res.status()).toBe(401);
  });

  test("POST /api/discovery/import returns 401", async ({ request }) => {
    const res = await request.post("/api/discovery/import", {
      data: { rows: [] },
    });
    expect(res.status()).toBe(401);
  });
});
