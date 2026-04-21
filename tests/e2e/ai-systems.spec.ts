import { test, expect } from "@playwright/test";

// Anonymous-access coverage for the AI Systems register (Article 4 backbone).
// Authenticated UI flows (create / classify / list) require seeding an
// ai_systems row per test and are tracked as follow-up work — noted in
// .shared/security-posture.md §14.

const DUMMY_UUID = "00000000-0000-0000-0000-000000000000";

test.describe("ai-systems route — anonymous access", () => {
  test("list page redirects to login", async ({ page }) => {
    await page.goto("/dashboard/ai-systems");
    await expect(page).toHaveURL(/\/login/);
  });

  test("new-system page redirects to login", async ({ page }) => {
    await page.goto("/dashboard/ai-systems/new");
    await expect(page).toHaveURL(/\/login/);
  });

  test("detail page redirects to login", async ({ page }) => {
    await page.goto(`/dashboard/ai-systems/${DUMMY_UUID}`);
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("ai-systems API — anonymous access", () => {
  test("GET /api/ai-systems returns 401", async ({ request }) => {
    const res = await request.get("/api/ai-systems");
    expect(res.status()).toBe(401);
  });

  test("POST /api/ai-systems returns 401", async ({ request }) => {
    const res = await request.post("/api/ai-systems", {
      data: { name: "test" },
    });
    expect(res.status()).toBe(401);
  });

  test("GET /api/ai-systems/[id] returns 401", async ({ request }) => {
    const res = await request.get(`/api/ai-systems/${DUMMY_UUID}`);
    expect(res.status()).toBe(401);
  });

  test("POST /api/ai-systems/[id]/classify returns 401", async ({ request }) => {
    const res = await request.post(`/api/ai-systems/${DUMMY_UUID}/classify`);
    expect(res.status()).toBe(401);
  });
});
