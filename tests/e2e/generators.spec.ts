import { test, expect } from "@playwright/test";
import { createTestUser, deleteTestUser, loginViaUI } from "../helpers/test-utils";

// Regression test for the 'AI response did not contain JSON' bug we shipped on
// 2026-04-24. Root cause: the 3 AI generators (DPIA, FRIA, Annex IV) relied on
// regex-based JSON extraction; when Claude's response started with prose the
// indexOf('{') guard threw. Fix: assistant-prefill pattern — first assistant
// message is '{', so responses always parse.
//
// These tests call the real generator endpoints and assert the shape of the
// returned JSON. They cost ~$0.03/run (Haiku 4.5) so they're not in the CI
// smoke path by default — gate with `RUN_GENERATOR_TESTS=1` to opt in.

const RUN_GENERATORS = process.env.RUN_GENERATOR_TESTS === "1";

let proUser: { id: string; email: string };
let businessUser: { id: string; email: string };

test.beforeAll(async () => {
  if (!RUN_GENERATORS) return;
  [proUser, businessUser] = await Promise.all([
    createTestUser("gen-pro", "pro"),
    createTestUser("gen-business", "business"),
  ]);
});

test.afterAll(async () => {
  if (!RUN_GENERATORS) return;
  await Promise.all([
    proUser?.id ? deleteTestUser(proUser.id) : Promise.resolve(),
    businessUser?.id ? deleteTestUser(businessUser.id) : Promise.resolve(),
  ]);
});

test.describe("AI generators — JSON response regression", () => {
  test.skip(!RUN_GENERATORS, "Set RUN_GENERATOR_TESTS=1 to run live AI calls");
  test.setTimeout(120_000);

  test("DPIA generator returns valid JSON with all 16 required fields", async ({ page }) => {
    await loginViaUI(page, proUser.email);
    const res = await page.request.post("/api/dpia", {
      data: {
        processing_name: "E2E DPIA regression test",
        processing_purpose:
          "Verify that the DPIA generator returns structured JSON with the 16 Art. 35(7) fields populated for every call, even when Claude would otherwise lead with prose.",
        data_categories_hint: "email addresses, user profiles, usage analytics",
        data_subjects_hint: "paying SaaS customers",
        lawful_basis_hint: "legitimate_interests",
      },
      timeout: 90_000,
    });
    expect(res.status()).toBeLessThan(400);
    const body = await res.json();
    // The API may return the draft under .draft or directly. Probe both.
    const draft = body.draft ?? body;
    for (const field of [
      "processing_description",
      "processing_purposes",
      "data_categories",
      "data_subjects",
      "legal_basis",
      "risk_scenarios",
      "technical_measures",
      "dpo_consultation",
    ]) {
      expect(draft[field], `DPIA is missing field '${field}'`).toBeDefined();
      expect(typeof draft[field]).toBe("string");
    }
  });

  test("FRIA generator returns valid JSON (Art. 27)", async ({ page }) => {
    await loginViaUI(page, proUser.email);
    const res = await page.request.post("/api/fria", {
      data: {
        system_name: "E2E FRIA regression test",
        system_purpose:
          "AI system used to classify customer support tickets by urgency and route them to the right team — deployer is a private-sector SaaS company deploying this high-risk system under Art. 27.",
        deployer_type: "private_sector",
      },
      timeout: 90_000,
    });
    expect(res.status()).toBeLessThan(400);
    const body = await res.json();
    const draft = body.draft ?? body;
    for (const field of [
      "system_description",
      "affected_groups",
      "rights_at_risk",
      "mitigation_measures",
    ]) {
      expect(draft[field], `FRIA is missing field '${field}'`).toBeDefined();
    }
  });

  test("Annex IV generator returns valid JSON (business tier)", async ({ page }) => {
    await loginViaUI(page, businessUser.email);
    const res = await page.request.post("/api/annex-iv", {
      data: {
        system_name: "E2E Annex IV regression test",
        system_purpose:
          "AI biometric identification system for physical access control in a private office. Annex III category 1. Conformity assessment needed before market placement.",
        annex_iii_category: "biometric_identification",
      },
      timeout: 120_000,
    });
    expect(res.status()).toBeLessThan(400);
    const body = await res.json();
    const draft = body.draft ?? body;
    for (const field of [
      "intended_purpose",
      "system_architecture",
      "risk_management_description",
      "post_market_monitoring_plan",
    ]) {
      expect(draft[field], `Annex IV is missing field '${field}'`).toBeDefined();
    }
  });
});
