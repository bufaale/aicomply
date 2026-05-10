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
  test("GET /api/discovery returns 405 (route is POST-only)", async ({
    request,
  }) => {
    // The discovery endpoint accepts POST for inserting findings — GET is
    // intentionally unimplemented. Method-not-allowed is the correct response
    // and is checked BEFORE the auth guard runs (Next.js App Router behaviour),
    // so anonymous GET sees 405 rather than 401.
    const res = await request.get("/api/discovery");
    expect(res.status()).toBe(405);
  });

  test("POST /api/discovery returns 401 (auth-gated)", async ({ request }) => {
    const res = await request.post("/api/discovery", {
      data: { rows: [] },
    });
    expect(res.status()).toBe(401);
  });

  test("POST /api/discovery/import returns 401", async ({ request }) => {
    const res = await request.post("/api/discovery/import", {
      data: { rows: [] },
    });
    expect(res.status()).toBe(401);
  });
});
