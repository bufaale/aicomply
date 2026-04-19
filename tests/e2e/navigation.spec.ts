import { test, expect } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  loginViaUI,
} from "../helpers/test-utils";

// --- Public pages (no auth) ---

test.describe("Navigation - Public pages", () => {
  test("landing page loads with hero section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText(/AI-Powered Contracts/i).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /start creating contracts/i }),
    ).toBeVisible();
    await expect(page.getByText(/no credit card required/i)).toBeVisible();
  });

  test("landing page has features section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText(/everything you need/i).first(),
    ).toBeVisible();
  });

  test("landing page has pricing section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/free/i).first()).toBeVisible();
    await expect(page.getByText(/pro/i).first()).toBeVisible();
    await expect(page.getByText(/business/i).first()).toBeVisible();
  });

  test("landing page has comparison section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/how we compare/i).first()).toBeVisible();
  });

  test("landing page has FAQ section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText(/frequently asked questions/i).first(),
    ).toBeVisible();
  });

  test("login page renders", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText(/welcome back/i)).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign in/i }),
    ).toBeVisible();
  });

  test("signup page renders", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByText(/create an account/i)).toBeVisible();
    await expect(page.getByLabel("Full name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign up/i }),
    ).toBeVisible();
  });

  test("forgot password page renders", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.getByLabel("Email")).toBeVisible();
  });

  test("login page has link to signup", async ({ page }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("link", { name: /sign up/i }),
    ).toBeVisible();
  });

  test("signup page has link to login", async ({ page }) => {
    await page.goto("/signup");
    await expect(
      page.getByRole("link", { name: /sign in/i }),
    ).toBeVisible();
  });

  test("legal pages render", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByText(/terms of service/i).first()).toBeVisible();

    await page.goto("/privacy");
    await expect(page.getByText(/privacy policy/i).first()).toBeVisible();

    await page.goto("/refund");
    await expect(page.getByText(/refund/i).first()).toBeVisible();
  });
});

// --- Authenticated pages ---

test.describe("Navigation - Authenticated pages", () => {
  let testUser: { id: string; email: string };

  test.beforeAll(async () => {
    testUser = await createTestUser("nav");
  });

  test.afterAll(async () => {
    await deleteTestUser(testUser.id);
  });

  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, testUser.email);
  });

  test("dashboard loads with heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();
  });

  test("contracts page loads", async ({ page }) => {
    await page.getByRole("link", { name: "Contracts" }).click();
    await expect(page).toHaveURL(/\/dashboard\/contracts/);
    await expect(
      page.getByRole("heading", { name: "Contracts", level: 1 }),
    ).toBeVisible();
  });

  test("clients page loads", async ({ page }) => {
    await page.getByRole("link", { name: "Clients" }).click();
    await expect(page).toHaveURL(/\/dashboard\/clients/);
    await expect(
      page.getByRole("heading", { name: "Clients" }),
    ).toBeVisible();
  });

  test("templates page loads", async ({ page }) => {
    await page.getByRole("link", { name: "Templates" }).click();
    await expect(page).toHaveURL(/\/dashboard\/templates/);
    await expect(
      page.getByRole("heading", { name: "Templates", exact: true }),
    ).toBeVisible();
  });

  test("clause library page loads", async ({ page }) => {
    await page.getByRole("link", { name: "Clause Library" }).click();
    await expect(page).toHaveURL(/\/dashboard\/clause-library/);
    await expect(
      page.getByRole("heading", { name: "Clause Library", level: 1 }),
    ).toBeVisible();
  });

  test("analyze page loads", async ({ page }) => {
    await page.getByRole("link", { name: "Analyze" }).click();
    await expect(page).toHaveURL(/\/dashboard\/analyze/);
    await expect(
      page.getByRole("heading", { name: /red-flag detection/i, level: 1 }),
    ).toBeVisible();
  });

  test("settings page loads", async ({ page }) => {
    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page).toHaveURL(/\/settings/);
    await expect(
      page.getByRole("heading", { name: /profile settings/i }),
    ).toBeVisible();
  });

  test("billing page loads", async ({ page }) => {
    await page.getByRole("link", { name: "Billing" }).click();
    await expect(page).toHaveURL(/\/settings\/billing/);
    await expect(
      page.getByRole("heading", { name: "Billing" }),
    ).toBeVisible();
  });
});
