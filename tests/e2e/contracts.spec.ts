import { test, expect } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  loginViaUI,
} from "../helpers/test-utils";

test.describe("Contracts", () => {
  let testUser: { id: string; email: string };

  test.beforeAll(async () => {
    testUser = await createTestUser("contracts");
  });

  test.afterAll(async () => {
    await deleteTestUser(testUser.id);
  });

  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, testUser.email);
  });

  test("contracts page shows empty state", async ({ page }) => {
    await page.getByRole("link", { name: "Contracts" }).click();
    await expect(page).toHaveURL(/\/dashboard\/contracts/);
    await expect(
      page.getByText(/no contracts yet/i),
    ).toBeVisible();
  });

  test("new contract page loads with form", async ({ page }) => {
    await page.getByRole("link", { name: "New Contract" }).click();
    await expect(page).toHaveURL(/\/dashboard\/contracts\/new/);
    await expect(page.getByText(/contract type/i).first()).toBeVisible();
  });

  test("new contract form has contract type selector", async ({ page }) => {
    await page.goto("/dashboard/contracts/new");
    await expect(page.getByText(/NDA/i).first()).toBeVisible();
  });

  test("new contract form has generate button", async ({ page }) => {
    await page.goto("/dashboard/contracts/new");
    await expect(
      page.getByRole("button", { name: /generate/i }),
    ).toBeVisible();
  });
});
