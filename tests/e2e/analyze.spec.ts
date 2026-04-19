import { test, expect } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  loginViaUI,
  setUserPlan,
} from "../helpers/test-utils";

test.describe("Red-Flag Detection", () => {
  let testUser: { id: string; email: string };

  test.beforeAll(async () => {
    testUser = await createTestUser("analyze");
  });

  test.afterAll(async () => {
    await deleteTestUser(testUser.id);
  });

  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, testUser.email);
    await page.getByRole("link", { name: "Analyze" }).click();
    await expect(page).toHaveURL(/\/dashboard\/analyze/);
  });

  test("displays analyze page with heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /red-flag detection/i, level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByText(/paste a contract you received/i),
    ).toBeVisible();
  });

  test("has contract text textarea", async ({ page }) => {
    await expect(
      page.getByPlaceholder(/paste the full contract text/i),
    ).toBeVisible();
  });

  test("analyze button is disabled when text is too short", async ({
    page,
  }) => {
    const analyzeBtn = page.getByRole("button", { name: /analyze contract/i });
    await expect(analyzeBtn).toBeDisabled();

    // Type short text
    await page
      .getByPlaceholder(/paste the full contract text/i)
      .fill("Short text");
    await expect(analyzeBtn).toBeDisabled();
  });

  test("analyze button enables with enough text", async ({ page }) => {
    const longText =
      "This Agreement is entered into between Party A and Party B for the purpose of establishing the terms and conditions of their business relationship. " +
      "Party A agrees to provide services as described herein and Party B agrees to compensate Party A for said services.";

    await page
      .getByPlaceholder(/paste the full contract text/i)
      .fill(longText);

    const analyzeBtn = page.getByRole("button", { name: /analyze contract/i });
    await expect(analyzeBtn).toBeEnabled();
  });

  test("shows character count", async ({ page }) => {
    await page
      .getByPlaceholder(/paste the full contract text/i)
      .fill("Hello world test text for counting");
    await expect(page.getByText(/\d+ characters/)).toBeVisible();
  });

  test("has analysis history section", async ({ page }) => {
    await expect(page.getByText(/analysis history/i)).toBeVisible();
  });
});
