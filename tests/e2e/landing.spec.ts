import { test, expect } from "@playwright/test";

test.describe("AIComply landing — EU AI Act deadline messaging", () => {
  test("deadline banner shows Aug 2, 2026 countdown with all time blocks", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/EU AI Act/).first()).toBeVisible();
    await expect(page.getByText(/August 2, 2026/).first()).toBeVisible();
    await expect(page.getByText("Days", { exact: true })).toBeVisible();
    await expect(page.getByText("Hrs", { exact: true })).toBeVisible();
    await expect(page.getByText("Min", { exact: true })).toBeVisible();
    await expect(page.getByText("Sec", { exact: true })).toBeVisible();
  });

  test("hero advertises EU AI Act compliance for SMBs", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /EU AI Act compliance/i }),
    ).toBeVisible();
    await expect(page.getByText(/Vanta charges/).first()).toBeVisible();
  });

  test("features highlight Article 4 register and DPIA", async ({ page }) => {
    await page.goto("/#features");

    // CardTitle renders as div — plain text matchers
    await expect(page.getByText("Article 4 AI Literacy Register").first()).toBeVisible();
    await expect(page.getByText("DPIA + Evidence Vault").first()).toBeVisible();
    await expect(page.getByText("Auto Risk Classification").first()).toBeVisible();
  });

  test("pricing shows three tiers at $0, $49, $149", async ({ page }) => {
    await page.goto("/#pricing");

    await expect(page.getByText("Pro", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Business", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("$49").first()).toBeVisible();
    await expect(page.getByText("$149").first()).toBeVisible();
  });
});

test.describe("AIComply authenticated routes reject anonymous access", () => {
  test("dashboard redirects to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("ai-systems list redirects to login", async ({ page }) => {
    await page.goto("/dashboard/ai-systems");
    await expect(page).toHaveURL(/\/login/);
  });

  test("ai-systems API returns 401 for anonymous GET", async ({ request }) => {
    const res = await request.get("/api/ai-systems");
    expect(res.status()).toBe(401);
  });

  test("classify endpoint returns 401 for anonymous POST", async ({ request }) => {
    const res = await request.post(
      "/api/ai-systems/00000000-0000-0000-0000-000000000000/classify",
    );
    expect(res.status()).toBe(401);
  });
});
