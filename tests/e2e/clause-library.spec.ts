import { test, expect } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  loginViaUI,
} from "../helpers/test-utils";

test.describe("Clause Library", () => {
  let testUser: { id: string; email: string };

  test.beforeAll(async () => {
    testUser = await createTestUser("clauses");
  });

  test.afterAll(async () => {
    await deleteTestUser(testUser.id);
  });

  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, testUser.email);
    await page.getByRole("link", { name: "Clause Library" }).click();
    await expect(page).toHaveURL(/\/dashboard\/clause-library/);
  });

  test("displays clause library page with heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Clause Library", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByText(/browse and manage reusable/i),
    ).toBeVisible();
  });

  test("shows system clauses section", async ({ page }) => {
    await expect(
      page.getByText(/standard clauses/i).first(),
    ).toBeVisible();
  });

  test("has search input", async ({ page }) => {
    await expect(
      page.getByPlaceholder(/search clauses/i),
    ).toBeVisible();
  });

  test("has category filter", async ({ page }) => {
    await expect(
      page.getByText(/all categories/i).first(),
    ).toBeVisible();
  });

  test("has add clause button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /add clause/i }),
    ).toBeVisible();
  });

  test("add clause dialog opens", async ({ page }) => {
    await page.getByRole("button", { name: /add clause/i }).click();
    await expect(
      page.getByText(/add custom clause/i),
    ).toBeVisible();
    await expect(page.getByLabel(/title/i)).toBeVisible();
    await expect(page.getByLabel(/category/i)).toBeVisible();
    await expect(page.getByLabel(/clause content/i)).toBeVisible();
  });

  test("copy to clipboard button exists on clause cards", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: /copy to clipboard/i }).first(),
    ).toBeVisible();
  });
});
