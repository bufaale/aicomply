import { test, expect, request } from "@playwright/test";

const BASE = process.env.TEST_BASE_URL ?? "https://aicomply.piposlab.com";
const SECRET = process.env.AICOMPLY_CRON_SECRET ?? process.env.CRON_SECRET ?? "";

test.describe("AIComply lead-followups cron — shipped 2026-05-13", () => {
  test("unauthed GET → 401", async () => {
    const ctx = await request.newContext();
    const r = await ctx.get(`${BASE}/api/cron/lead-followups`);
    expect(r.status()).toBe(401);
  });

  test.describe("bearer-auth", () => {
    test.skip(!SECRET, "Set AICOMPLY_CRON_SECRET or CRON_SECRET to run");

    test("200 + shape", async () => {
      const ctx = await request.newContext();
      const r = await ctx.get(`${BASE}/api/cron/lead-followups`, {
        headers: { Authorization: `Bearer ${SECRET}` },
        timeout: 60_000,
      });
      expect(r.status()).toBe(200);
      const body = await r.json();
      expect(body.ok).toBe(true);
      expect(typeof body.candidates).toBe("number");
      expect(typeof body.sent).toBe("number");
      expect(typeof body.failed).toBe("number");
      expect(Array.isArray(body.details)).toBe(true);
    });
  });
});
