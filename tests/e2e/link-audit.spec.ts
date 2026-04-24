import { test, expect, type Page } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  loginViaUI,
  auditPageLinks,
} from "../helpers/test-utils";

let user: { id: string; email: string };

test.beforeAll(async () => {
  user = await createTestUser("linkaudit");
});

test.afterAll(async () => {
  if (user?.id) await deleteTestUser(user.id);
});

async function auditAndAssert(page: Page, path: string) {
  const results = await auditPageLinks(page, {
    ignore: [/^\/logout/, /^\/api\//, /^\/auth\/confirm/, /^\/trust\//],
  });
  const broken = results.filter((r) => r.status === 404);
  if (broken.length) console.log(`Broken links on ${path}:`, broken);
  expect(broken, `Broken links on ${path}: ${JSON.stringify(broken)}`).toEqual([]);
}

test.describe("Link audit — authenticated pages", () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, user.email);
  });

  for (const path of [
    "/dashboard",
    "/dashboard/ai-systems",
    "/dashboard/ai-systems/new",
    "/dashboard/discovery",
    "/dashboard/fria",
    "/dashboard/fria/new",
    "/dashboard/dpia",
    "/dashboard/dpia/new",
    "/dashboard/annex-iv",
    "/dashboard/annex-iv/new",
    "/dashboard/trust",
    "/settings",
    "/settings/billing",
  ]) {
    test(`${path} has no broken internal links`, async ({ page }) => {
      await page.goto(path);
      await auditAndAssert(page, path);
    });
  }
});

test.describe("Link audit — marketing pages", () => {
  for (const path of [
    "/",
    "/terms",
    "/privacy",
    "/refund",
    "/dpia-generator",
    "/fria-generator",
    "/blog",
  ]) {
    test(`${path} has no broken internal links`, async ({ page }) => {
      await page.goto(path);
      await auditAndAssert(page, path);
    });
  }
});
