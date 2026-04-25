import { test, expect } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  loginViaUI,
  type Tier,
} from "../helpers/test-utils";

type TierUser = { id: string; email: string; tier: Tier };
let users: Record<Tier, TierUser>;

test.beforeAll(async () => {
  const [free, pro, business, regulated] = await Promise.all([
    createTestUser("tier-free", "free"),
    createTestUser("tier-pro", "pro"),
    createTestUser("tier-business", "business"),
    createTestUser("tier-regulated", "regulated"),
  ]);
  users = {
    free: { ...free, tier: "free" },
    pro: { ...pro, tier: "pro" },
    business: { ...business, tier: "business" },
    regulated: { ...regulated, tier: "regulated" },
  };
});

test.afterAll(async () => {
  await Promise.all(
    Object.values(users || {}).map((u) => (u.id ? deleteTestUser(u.id) : Promise.resolve())),
  );
});

test.describe("Tier gating — DPIA generator (Pro+)", () => {
  test.setTimeout(120_000);

  test("free user: POST /api/dpia returns 402 (paid feature)", async ({ page }) => {
    await loginViaUI(page, users.free.email);
    const res = await page.request.post("/api/dpia", {
      data: {
        processing_name: "test",
        processing_purpose: "test purpose for DPIA generation",
      },
      timeout: 90_000,
    });
    // Either 402 (payment required) or 403 (forbidden) is acceptable gating.
    expect([402, 403]).toContain(res.status());
  });

  for (const tier of ["pro", "business", "regulated"] as const) {
    test(`${tier} user: POST /api/dpia passes the tier gate (not 402)`, async ({ page }) => {
      await loginViaUI(page, users[tier].email);
      const res = await page.request.post("/api/dpia", {
        data: {
          processing_name: "E2E test processing",
          processing_purpose: "Verify that Pro+ tiers can access the DPIA generator endpoint without hitting paywall",
        },
        timeout: 90_000,
      });
      const status = res.status();
      if (status === 402) {
        const body = await res.text().catch(() => "<no body>");
        console.log(`[${tier}] unexpected 402 on /api/dpia:`, body);
      }
      // The assertion we care about: user is NOT tier-gated. Any non-402
      // status (including 400 for bad input, 429 for rate limit, 500 for
      // AI errors) proves they passed the tier check.
      expect(status, `got ${status}`).not.toBe(402);
    });
  }
});

test.describe("Tier gating — FRIA generator (Pro+)", () => {
  test.setTimeout(120_000);

  test("free user: POST /api/fria returns 402", async ({ page }) => {
    await loginViaUI(page, users.free.email);
    const res = await page.request.post("/api/fria", {
      data: { system_name: "test", system_purpose: "test" },
      timeout: 90_000,
    });
    expect([402, 403]).toContain(res.status());
  });

  for (const tier of ["pro", "business", "regulated"] as const) {
    test(`${tier} user: POST /api/fria passes the tier gate (not 402)`, async ({ page }) => {
      await loginViaUI(page, users[tier].email);
      const res = await page.request.post("/api/fria", {
        data: {
          system_name: "E2E system",
          system_purpose: "Verify FRIA tier access",
          deployer_type: "private_sector",
        },
        timeout: 90_000,
      });
      const status = res.status();
      if (status === 402) {
        const body = await res.text().catch(() => "<no body>");
        console.log(`[${tier}] unexpected 402 on /api/fria:`, body);
      }
      expect(status, `got ${status}`).not.toBe(402);
    });
  }
});

test.describe("Tier gating — Annex IV generator (Regulated ONLY)", () => {
  test.setTimeout(120_000);

  // Per /api/annex-iv/route.ts:40 the check is `plan !== "regulated"` so every
  // lower tier (free/pro/business) must receive 402.
  for (const tier of ["free", "pro", "business"] as const) {
    test(`${tier} user: POST /api/annex-iv returns 402`, async ({ page }) => {
      await loginViaUI(page, users[tier].email);
      const res = await page.request.post("/api/annex-iv", {
        data: { system_name: "test", system_purpose: "test" },
        timeout: 90_000,
      });
      expect(res.status()).toBe(402);
    });
  }

  test("regulated user: POST /api/annex-iv passes the tier gate", async ({ page }) => {
    // test.setTimeout handled at describe level; kept here for clarity
    await loginViaUI(page, users.regulated.email);
    const res = await page.request.post("/api/annex-iv", {
      data: {
        system_name: "E2E system",
        system_purpose: "Verify Annex IV tier access",
        annex_iii_category: "biometric_identification",
      },
      timeout: 90_000,
    });
    const status = res.status();
    if (status === 402) {
      const body = await res.text().catch(() => "<no body>");
      console.log(`[regulated] unexpected 402 on /api/annex-iv:`, body);
    }
    expect(status, `got ${status}`).not.toBe(402);
  });
});

test.describe("Tier gating — billing page shows correct plan", () => {
  for (const tier of ["free", "pro", "business", "regulated"] as const) {
    test(`${tier} user's billing shows "${tier}"`, async ({ page }) => {
      await loginViaUI(page, users[tier].email);
      await page.goto("/settings/billing");
      const regex = new RegExp(`\\b${tier}\\b`, "i");
      await expect(page.getByText(regex).first()).toBeVisible();
    });
  }
});
