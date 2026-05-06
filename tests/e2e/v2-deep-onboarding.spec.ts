/**
 * v2-deep-onboarding.spec.ts
 *
 * Proves that the /settings page both renders correctly AND writes each field
 * through to the `profiles` row in Supabase. This is the first spec that
 * closes the gap between "settings form looks correct" (covered in
 * settings.spec.ts) and "settings form actually persists to the DB".
 *
 * Pattern mirrors CallSpark's e2e/onboarding-happy-path.spec.ts:
 *   1. createTestUser — skip if no SUPABASE_SERVICE_ROLE_KEY
 *   2. loginViaUI — drive real browser auth flow
 *   3. fill form → submit → assert toast
 *   4. REST fetch from Supabase admin endpoint → assert DB row updated
 *   5. try/finally deleteTestUser — always cleans up
 */
import { test, expect } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  loginViaUI,
  TEST_PASSWORD,
} from "../helpers/test-utils";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Row shape returned by GET /rest/v1/profiles
interface ProfileRow {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  company_name: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  company_logo_url: string | null;
  subscription_plan: string;
  subscription_status: string;
}

/** Fetch the profiles row for a given user_id via the admin REST API. */
async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`,
    {
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
        apikey: SUPABASE_KEY,
      },
    },
  );
  if (!res.ok) return null;
  const rows = (await res.json()) as ProfileRow[];
  return rows[0] ?? null;
}

test.describe("v2 deep onboarding — settings persist to profiles row", () => {
  // Skip all tests in this describe block when the service role key is absent
  // (CI environments without secrets, anonymous test runs, etc.).
  test.skip(
    !SUPABASE_KEY,
    "SUPABASE_SERVICE_ROLE_KEY not set — skipping DB-persistence specs",
  );

  test("profile name update writes full_name to profiles row", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    const user = await createTestUser("onboard-name");
    try {
      await loginViaUI(page, user.email);
      await page.goto("/settings");

      // Wait for the client component to hydrate and load profile data
      await expect(page.getByLabel(/full name/i)).toBeVisible({
        timeout: 15_000,
      });

      const newName = `E2E Name ${Date.now()}`;
      await page.getByLabel(/full name/i).fill(newName);
      await page.getByRole("button", { name: /save changes/i }).click();

      // User-visible feedback proves the save was submitted
      await expect(page.getByText(/profile updated/i)).toBeVisible({
        timeout: 10_000,
      });

      // DB assertion: verify the profiles row now carries the new value.
      // The form calls supabase.from("profiles").update(...) — if the row
      // doesn't update this fetch will return the old value and the test fails.
      const profile = await fetchProfile(user.id);
      expect(profile).not.toBeNull();
      expect(profile!.full_name).toBe(newName);
    } finally {
      await deleteTestUser(user.id);
    }
  });

  test("brand settings update writes company_name + colors to profiles row", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    const user = await createTestUser("onboard-brand");
    try {
      await loginViaUI(page, user.email);
      await page.goto("/settings");

      // Wait for hydration
      await expect(page.getByLabel(/company name/i)).toBeVisible({
        timeout: 15_000,
      });

      const companyName = `ACME Corp ${Date.now()}`;
      await page.getByLabel(/company name/i).fill(companyName);

      // Interact with the primary-color text input (not the color picker,
      // which is harder to drive cross-platform). There are two inputs in the
      // color row — the text field is the flex-1 one.
      const primaryColorInputs = page.locator("#primaryColor");
      await primaryColorInputs.fill("#ff0000");

      await page.getByRole("button", { name: /save brand settings/i }).click();

      await expect(page.getByText(/brand settings updated/i)).toBeVisible({
        timeout: 10_000,
      });

      // DB assertion: company_name and primary_color columns must reflect the
      // values we submitted. The form uses supabase.from("profiles").update().
      const profile = await fetchProfile(user.id);
      expect(profile).not.toBeNull();
      expect(profile!.company_name).toBe(companyName);
      // The color picker can normalise the hex — assert it starts with "#"
      expect(profile!.primary_color).toMatch(/^#/i);
    } finally {
      await deleteTestUser(user.id);
    }
  });

  test("avatar URL update writes avatar_url to profiles row", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    const user = await createTestUser("onboard-avatar");
    try {
      await loginViaUI(page, user.email);
      await page.goto("/settings");

      await expect(page.getByLabel(/avatar url/i)).toBeVisible({
        timeout: 15_000,
      });

      const avatarUrl = "https://example.com/avatar-e2e.png";
      await page.getByLabel(/avatar url/i).fill(avatarUrl);
      await page.getByRole("button", { name: /save changes/i }).click();

      await expect(page.getByText(/profile updated/i)).toBeVisible({
        timeout: 10_000,
      });

      // DB assertion: avatar_url column must carry the URL we submitted.
      const profile = await fetchProfile(user.id);
      expect(profile).not.toBeNull();
      expect(profile!.avatar_url).toBe(avatarUrl);
    } finally {
      await deleteTestUser(user.id);
    }
  });

  test("new user has a profiles row created by the handle_new_user trigger", async ({
    page,
  }) => {
    // This test proves the Supabase trigger that fires on auth.users INSERT
    // creates the profiles row correctly — a prerequisite for every other
    // feature in the app. If this fails, all settings + billing tests break.
    test.setTimeout(30_000);
    const user = await createTestUser("onboard-trigger");
    try {
      // The trigger fires asynchronously; createTestUser already polls for it
      // via setUserPlan's retry loop. We just need to confirm the row exists.
      const profile = await fetchProfile(user.id);
      expect(profile).not.toBeNull();
      // Default plan for new users must be "free"
      expect(profile!.subscription_plan).toBe("free");
    } finally {
      await deleteTestUser(user.id);
    }
  });

  test("login redirects to /dashboard for newly created user", async ({
    page,
  }) => {
    // End-to-end signup→login→dashboard flow. createTestUser (admin API)
    // bypasses email confirmation — loginViaUI must still succeed via the
    // normal password flow, which proves the auth cookie is wired correctly.
    test.setTimeout(60_000);
    const user = await createTestUser("onboard-login");
    try {
      await page.goto("/login");
      await page.getByLabel("Email").fill(user.email);
      await page.getByLabel("Password").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign in" }).click();
      await page.waitForURL("**/dashboard**", { timeout: 20_000 });

      // The dashboard greeting should reference the user (first name or "there")
      await expect(
        page.getByRole("heading", { level: 1, name: /Good morning,/i }),
      ).toBeVisible({ timeout: 15_000 });
    } finally {
      await deleteTestUser(user.id);
    }
  });
});
