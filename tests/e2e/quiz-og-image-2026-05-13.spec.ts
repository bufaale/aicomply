/**
 * E2E for /quiz-result/[token]/opengraph-image (shipped 2026-05-13).
 *
 * Asserts the Edge-rendered OG image returns 200 + PNG content-type
 * for both a real saved token and a bogus token (graceful fallback).
 */

import { test, expect, request } from "@playwright/test";

const BASE = process.env.TEST_BASE_URL ?? "https://aicomply.piposlab.com";

test.describe("AIComply quiz-result OG image — shipped 2026-05-13", () => {
  test("bogus token → 200 + PNG (fallback card)", async () => {
    const ctx = await request.newContext();
    const r = await ctx.get(`${BASE}/quiz-result/bogus-token-xyz/opengraph-image`, {
      timeout: 30_000,
    });
    expect(r.status()).toBe(200);
    expect(r.headers()["content-type"]).toMatch(/image\/png/);
    const buf = await r.body();
    expect(buf.length).toBeGreaterThan(1000); // any real PNG ≥ 1KB
  });

  test("real saved token → 200 + PNG", async ({ request: req }) => {
    // Seed a row
    const seed = await req.post(`${BASE}/api/free/risk-checker/save`, {
      data: {
        classification: "high",
        answers: ["yes", "no", "no", "yes", "no", "no", "no", "no", "no", "yes"],
        system_label: "OG image E2E smoke",
      },
    });
    expect(seed.status()).toBe(200);
    const body = await seed.json();
    expect(body.token).toBeTruthy();

    const r = await req.get(`${BASE}/quiz-result/${body.token}/opengraph-image`, {
      timeout: 30_000,
    });
    expect(r.status()).toBe(200);
    expect(r.headers()["content-type"]).toMatch(/image\/png/);
    const buf = await r.body();
    expect(buf.length).toBeGreaterThan(1000);
  });
});
