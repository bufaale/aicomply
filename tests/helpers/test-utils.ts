import type { Page } from "@playwright/test";

// --- Constants ---
export const TEST_PASSWORD = "TestE2E_Pass123!";
export const STRIPE_TEST_CARD = "4242424242424242";
export const STRIPE_TEST_EXPIRY = "1228";
export const STRIPE_TEST_CVC = "123";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

// --- Test User Management ---

/**
 * Create a confirmed test user. Optionally seed a tier in one call — the tier
 * must be defined AFTER createTestUser returns because the handle_new_user
 * trigger creates the profile row asynchronously; setUserPlan retries until
 * the row exists.
 */
export async function createTestUser(prefix: string, tier: Tier = "free") {
  const email = `e2e-${prefix}-${Date.now()}@test.example.com`;

  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: `E2E ${prefix}` },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to create test user: ${res.status} ${body}`);
  }

  const data = await res.json();
  const userId = data.id as string;

  if (tier !== "free") {
    await setUserPlan(userId, tier);
  }

  return { id: userId, email };
}

export async function deleteTestUser(userId: string) {
  const res = await fetch(
    `${SUPABASE_URL}/auth/v1/admin/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY,
      },
    },
  );

  if (!res.ok) {
    console.warn(`Failed to delete test user ${userId}: ${res.status}`);
  }
}

// --- Auth Helpers ---

export async function loginViaUI(
  page: Page,
  email: string,
  password = TEST_PASSWORD,
) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard**", { timeout: 15_000 });
}

export async function loginViaAPI(
  page: Page,
  email: string,
  password = TEST_PASSWORD,
) {
  const res = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    },
  );

  if (!res.ok) throw new Error(`Login API failed: ${res.status}`);

  const tokens = await res.json();
  const baseURL = process.env.TEST_BASE_URL || "http://localhost:3015";

  const domain = new URL(baseURL).hostname;
  await page.context().addCookies([
    {
      name: "sb-wykrtwszjejfmrjppzgn-auth-token",
      value: JSON.stringify([
        tokens.access_token,
        tokens.refresh_token,
        null,
        null,
        null,
      ]),
      domain,
      path: "/",
    },
  ]);

  await page.goto("/dashboard");
  await page.waitForURL("**/dashboard**", { timeout: 10_000 });
}

// --- Plan Management ---

export type Tier = "free" | "pro" | "business" | "regulated";
export const ALL_TIERS: Tier[] = ["free", "pro", "business", "regulated"];
export const PAID_TIERS: Tier[] = ["pro", "business", "regulated"];

/**
 * Set the user's subscription tier directly on the profiles row.
 *
 * PATCH with Prefer: return=minimal returns 204 whether rows were updated or
 * not — so we use return=representation and verify the row came back. If the
 * array is empty, the profile row wasn't there yet (the handle_new_user
 * trigger hadn't fired); we wait for the trigger to land and retry.
 */
export async function setUserPlan(userId: string, plan: Tier) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          subscription_plan: plan,
          subscription_status: plan === "free" ? "free" : "active",
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to set plan: ${res.status} ${body}`);
    }
    const rows = await res.json();
    if (Array.isArray(rows) && rows.length > 0 && rows[0].subscription_plan === plan) {
      return;
    }
    // Profile row not present yet — wait for the trigger and retry.
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`setUserPlan: profile for ${userId} never accepted plan=${plan} after 5 attempts`);
}

// --- Data Helpers ---

export async function createTestClient(userId: string, name: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/clients`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      user_id: userId,
      name,
      email: `${name.toLowerCase().replace(/\s/g, "")}@example.com`,
      company: `${name} Inc.`,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to create test client: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data[0] as { id: string; name: string };
}

export async function deleteTestClient(clientId: string) {
  await fetch(`${SUPABASE_URL}/rest/v1/clients?id=eq.${clientId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: SUPABASE_SERVICE_ROLE_KEY,
    },
  });
}

// --- Link audit ---

/**
 * Return the HTTP status of every internal link on the current page.
 * Skips external, mailto:, tel:, hash-only, and API routes. Used by
 * link-audit.spec.ts to assert no 404s ship.
 */
export async function auditPageLinks(
  page: Page,
  opts: { ignore?: RegExp[] } = {},
): Promise<Array<{ href: string; status: number }>> {
  const anchors = await page.locator("a[href]").all();
  const raw: string[] = [];
  for (const a of anchors) {
    const h = await a.getAttribute("href");
    if (h) raw.push(h);
  }
  const hrefs = Array.from(
    new Set(
      raw.filter(
        (h) => h.startsWith("/") && !h.startsWith("//") && !h.startsWith("/api/"),
      ),
    ),
  );
  const ignore = opts.ignore || [];
  const filtered = hrefs.filter((h) => !ignore.some((re) => re.test(h)));
  const baseURL = page.url().split("/").slice(0, 3).join("/");
  const cookieHeader = (await page.context().cookies())
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const out: Array<{ href: string; status: number }> = [];
  for (const href of filtered) {
    try {
      const r = await fetch(baseURL + href, {
        method: "GET",
        headers: { Cookie: cookieHeader },
        redirect: "manual",
      });
      out.push({ href, status: r.status });
    } catch {
      out.push({ href, status: 0 });
    }
  }
  return out;
}
