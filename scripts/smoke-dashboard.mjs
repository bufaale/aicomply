/**
 * One-shot prod smoke: provision a Supabase user, login via UI, screenshot
 * /dashboard, delete the user. Run after a v2 deploy to confirm AppShell
 * + sidebar + Pyramid + cross-walk all render under live data.
 *
 * Usage:  node scripts/smoke-dashboard.mjs
 */
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";

const env = readFileSync("c:/Projects/apps-portfolio/.shared/.env.keys", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const SUPA = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPA || !KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.keys");
  process.exit(1);
}

const email = `smoke-aic-${Date.now()}@test.example.com`;
const password = "SmokeTest123!";

const created = await fetch(`${SUPA}/auth/v1/admin/users`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${KEY}`,
    apikey: KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password, email_confirm: true }),
});
const user = await created.json();
if (!user.id) {
  console.error("Failed to provision user:", user);
  process.exit(1);
}
console.log("provisioned user:", user.id);

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

try {
  await page.goto("https://aicomply.piposlab.com/login");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 15000 });
  // Dashboard has live polling (audit feed, cross-walk progress) so
  // networkidle never settles. Wait for the serif greeting heading
  // instead — that's the marker the AppShell finished hydrating.
  await page.getByRole("heading", { level: 1 }).first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: "verify-aic-dashboard-styling.png",
    fullPage: true,
  });
  console.log("dashboard screenshot: verify-aic-dashboard-styling.png");
} finally {
  await browser.close();
  await fetch(`${SUPA}/auth/v1/admin/users/${user.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${KEY}`, apikey: KEY },
  });
  console.log("user cleaned up");
}
