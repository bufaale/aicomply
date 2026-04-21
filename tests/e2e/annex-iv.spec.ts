import { test, expect } from "@playwright/test";

// Anonymous-access coverage for Annex IV technical documentation (the
// mandatory deliverable for high-risk AI systems under the EU AI Act).
// Authenticated generation flows are deferred until the test fixture
// seeds a compliant ai_systems row.

const DUMMY_UUID = "00000000-0000-0000-0000-000000000000";

test.describe("annex-iv route — anonymous access", () => {
  test("list page redirects to login", async ({ page }) => {
    await page.goto("/dashboard/annex-iv");
    await expect(page).toHaveURL(/\/login/);
  });

  test("new page redirects to login", async ({ page }) => {
    await page.goto("/dashboard/annex-iv/new");
    await expect(page).toHaveURL(/\/login/);
  });

  test("detail page redirects to login", async ({ page }) => {
    await page.goto(`/dashboard/annex-iv/${DUMMY_UUID}`);
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("annex-iv API — anonymous access", () => {
  test("GET /api/annex-iv returns 401", async ({ request }) => {
    const res = await request.get("/api/annex-iv");
    expect(res.status()).toBe(401);
  });

  test("POST /api/annex-iv returns 401", async ({ request }) => {
    const res = await request.post("/api/annex-iv", {
      data: { ai_system_id: DUMMY_UUID },
    });
    expect(res.status()).toBe(401);
  });

  test("GET /api/annex-iv/[id] returns 401", async ({ request }) => {
    const res = await request.get(`/api/annex-iv/${DUMMY_UUID}`);
    expect(res.status()).toBe(401);
  });
});
