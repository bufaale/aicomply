import { test, expect } from "@playwright/test";

// Anonymous-access coverage for FRIA (Fundamental Rights Impact
// Assessment — required for high-risk public-sector AI deployments
// under the EU AI Act). Authenticated flows require a seeded high-risk
// ai_systems row.

const DUMMY_UUID = "00000000-0000-0000-0000-000000000000";

test.describe("fria route — anonymous access", () => {
  test("list page redirects to login", async ({ page }) => {
    await page.goto("/dashboard/fria");
    await expect(page).toHaveURL(/\/login/);
  });

  test("new page redirects to login", async ({ page }) => {
    await page.goto("/dashboard/fria/new");
    await expect(page).toHaveURL(/\/login/);
  });

  test("detail page redirects to login", async ({ page }) => {
    await page.goto(`/dashboard/fria/${DUMMY_UUID}`);
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("fria API — anonymous access", () => {
  test("GET /api/fria returns 401", async ({ request }) => {
    const res = await request.get("/api/fria");
    expect(res.status()).toBe(401);
  });

  test("POST /api/fria returns 401", async ({ request }) => {
    const res = await request.post("/api/fria", {
      data: { ai_system_id: DUMMY_UUID },
    });
    expect(res.status()).toBe(401);
  });

  test("GET /api/fria/[id] returns 401", async ({ request }) => {
    const res = await request.get(`/api/fria/${DUMMY_UUID}`);
    expect(res.status()).toBe(401);
  });
});
