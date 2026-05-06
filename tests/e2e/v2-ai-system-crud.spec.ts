/**
 * AI Systems CRUD — full create flow with DB persistence assert.
 *
 *   1. Provision user via admin API
 *   2. Login → /dashboard/ai-systems → click "Add AI System"
 *   3. Fill the new-system form (name, purpose, vendor, etc.)
 *   4. Submit → expect either redirect to /[id] OR success toast
 *   5. Assert ai_systems row exists with correct user_id + matching fields
 *   6. Cleanup user (cascade deletes the system row via FK ON DELETE CASCADE)
 *
 * Skipped without SUPABASE_SERVICE_ROLE_KEY.
 */
import { test, expect } from "@playwright/test";
import { createTestUser, deleteTestUser, loginViaUI } from "../helpers/test-utils";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

test.skip(
  !SUPABASE_KEY || !SUPABASE_URL,
  "SUPABASE_SERVICE_ROLE_KEY missing",
);

interface SystemRow {
  id: string;
  user_id: string;
  name: string;
  vendor: string | null;
  purpose: string;
  usage_context: string | null;
  data_inputs: string | null;
  data_outputs: string | null;
  business_units: string | null;
  ai_provider: string | null;
  base_model: string | null;
  deployment_type: string;
  owner_email: string | null;
  risk_tier: string | null;
}

async function fetchSystems(userId: string): Promise<SystemRow[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/ai_systems?user_id=eq.${userId}&select=*`,
    {
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
        apikey: SUPABASE_KEY,
      },
    },
  );
  if (!res.ok) return [];
  return (await res.json()) as SystemRow[];
}

test.describe("AI Systems — create flow with DB persistence", () => {
  test("user fills form, submits, ai_systems row inserts with all fields", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const stamp = Date.now();
    const user = await createTestUser("v2-aisys", "free");

    // Concrete data the user types — every value is asserted on the
    // ai_systems row after submit.
    const data = {
      name: `Triage Bot ${stamp}`,
      vendor: "Anthropic",
      purpose:
        "Routes inbound patient inquiries to the right specialist department after a clinician final review.",
      usage_context: "Internal Acme Health staff portal, weekday 7am-7pm CET",
      data_inputs: "De-identified inquiry text + queue metadata",
      data_outputs: "Suggested specialty (Cardio / Derm / etc.) + confidence score",
      business_units: "Clinical operations, Quality assurance",
      base_model: "claude-sonnet-4.6",
      owner_email: "dpo@acme.health",
    };

    try {
      await loginViaUI(page, user.email);

      // ---- Stage 1: navigate to /dashboard/ai-systems/new -------------
      await page.goto("/dashboard/ai-systems/new");
      await expect(
        page.getByRole("heading", { name: /Add an AI System/i }),
      ).toBeVisible({ timeout: 15_000 });

      // ---- Stage 2: fill required + meaningful optional fields ------
      await page.locator("#name").fill(data.name);
      await page.locator("#vendor").fill(data.vendor);
      await page.locator("#purpose").fill(data.purpose);
      await page.locator("#usage_context").fill(data.usage_context);
      await page.locator("#data_inputs").fill(data.data_inputs);
      await page.locator("#data_outputs").fill(data.data_outputs);
      await page.locator("#business_units").fill(data.business_units);
      await page.locator("#base_model").fill(data.base_model);
      await page.locator("#owner_email").fill(data.owner_email);

      // Submit — the page calls POST /api/ai-systems then POST classify,
      // then router.push to /dashboard/ai-systems/{id}. Classification is
      // best-effort, may fail without breaking the insert. We assert only
      // the insert side-effect.
      await page
        .getByRole("button", { name: /add system|save|create/i })
        .first()
        .click();

      // ---- Stage 3: assert DB row exists with all fields --------------
      // Allow a generous window — the POST + redirect can take a few
      // seconds on Vercel cold-start.
      const deadline = Date.now() + 20_000;
      let rows: SystemRow[] = [];
      while (Date.now() < deadline) {
        rows = await fetchSystems(user.id);
        if (rows.length > 0) break;
        await page.waitForTimeout(750);
      }
      expect(
        rows.length,
        `ai_systems row did not appear within 20s. Either POST /api/ai-systems failed silently, or the form submit handler swallowed an error. Check the toast on the form for an inline error.`,
      ).toBe(1);

      const row = rows[0]!;
      expect(row.user_id).toBe(user.id);
      expect(row.name).toBe(data.name);
      expect(row.vendor).toBe(data.vendor);
      expect(row.purpose).toBe(data.purpose);
      expect(row.usage_context).toBe(data.usage_context);
      expect(row.data_inputs).toBe(data.data_inputs);
      expect(row.data_outputs).toBe(data.data_outputs);
      expect(row.business_units).toBe(data.business_units);
      expect(row.base_model).toBe(data.base_model);
      expect(row.owner_email).toBe(data.owner_email);
      // deployment_type defaults to 'saas' when not set explicitly
      expect(["saas", "self_hosted", "api", "plugin", "informal"]).toContain(
        row.deployment_type,
      );
      // risk_tier starts as 'unclassified' until /classify completes
      expect(["unclassified", "minimal", "limited", "high", "unacceptable"]).toContain(
        row.risk_tier ?? "unclassified",
      );
    } finally {
      if (user?.id) await deleteTestUser(user.id);
    }
  });

  test("required-field validation: empty name + purpose blocks submit", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    const user = await createTestUser("v2-aisys-validate", "free");
    try {
      await loginViaUI(page, user.email);
      await page.goto("/dashboard/ai-systems/new");
      await expect(
        page.getByRole("heading", { name: /Add an AI System/i }),
      ).toBeVisible({ timeout: 15_000 });

      // Submit empty form — HTML required attribute should block (no row created)
      await page
        .getByRole("button", { name: /add system|save|create/i })
        .first()
        .click();
      // Browser will not navigate; URL remains the form page.
      await page.waitForTimeout(1500);
      expect(page.url()).toMatch(/\/dashboard\/ai-systems\/new/);

      // Confirm no row was inserted.
      const rows = await fetchSystems(user.id);
      expect(rows.length).toBe(0);
    } finally {
      if (user?.id) await deleteTestUser(user.id);
    }
  });
});
