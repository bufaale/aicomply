import { test, expect } from "@playwright/test";

// Anonymous-access coverage for DPIA (GDPR Art. 35 Data Protection
// Impact Assessment). Authenticated flows depend on a seeded ai_systems
// row — deferred.

const DUMMY_UUID = "00000000-0000-0000-0000-000000000000";

test.describe("dpia route — anonymous access", () => {
  test("list page redirects to login", async ({ page }) => {
    await page.goto("/dashboard/dpia");
    await expect(page).toHaveURL(/\/login/);
  });

  test("new page redirects to login", async ({ page }) => {
    await page.goto("/dashboard/dpia/new");
    await expect(page).toHaveURL(/\/login/);
  });

  test("detail page redirects to login", async ({ page }) => {
    await page.goto(`/dashboard/dpia/${DUMMY_UUID}`);
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("dpia API — anonymous access", () => {
  test("GET /api/dpia returns 401", async ({ request }) => {
    const res = await request.get("/api/dpia");
    expect(res.status()).toBe(401);
  });

  test("POST /api/dpia returns 401", async ({ request }) => {
    const res = await request.post("/api/dpia", {
      data: { ai_system_id: DUMMY_UUID },
    });
    expect(res.status()).toBe(401);
  });

  test("GET /api/dpia/[id] returns 401", async ({ request }) => {
    const res = await request.get(`/api/dpia/${DUMMY_UUID}`);
    expect(res.status()).toBe(401);
  });
});
