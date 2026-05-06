import { chromium } from "@playwright/test";
import { readFileSync, mkdirSync } from "node:fs";
const env = readFileSync("c:/Projects/apps-portfolio/.shared/.env.keys", "utf8");
for (const line of env.split("\n")) { const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2]; }

mkdirSync("c:/Projects/apps-portfolio/fotos-verificar/bug-fixes", { recursive: true });
const SUPA = "https://rshqimfeuegioegfokmd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const email = `verify-${Date.now()}@test.example.com`;
const password = "TestE2E_Pass123!";
const r = await fetch(`${SUPA}/auth/v1/admin/users`, { method:"POST", headers:{ Authorization:`Bearer ${KEY}`, apikey:KEY, "Content-Type":"application/json" }, body: JSON.stringify({ email, password, email_confirm: true })});
const u = await r.json();
console.log("user creation:", r.status, u.id, u.error_description || "ok");

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 1600 }})).newPage();

try {
  // 1. Landing — verify €35M + italic heading
  await page.goto("https://aicomply.piposlab.com/?nocache=" + Date.now());
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(2500);
  await page.screenshot({ path: "c:/Projects/apps-portfolio/fotos-verificar/bug-fixes/01-landing-stats-fixed.png", fullPage: true });
  console.log("✓ landing");

  // 2. Login + dashboard — verify search hidden, bell + avatar clickable, no white strip
  await page.goto("https://aicomply.piposlab.com/login?nocache=" + Date.now());
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1500);
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.screenshot({ path: "c:/Projects/apps-portfolio/fotos-verificar/bug-fixes/login-form-prep.png" });
  await page.getByRole("button", { name: /sign in/i }).click();
  await Promise.race([
    page.waitForURL(/\/dashboard/, { timeout: 30000 }).catch(() => null),
    page.waitForTimeout(15000),
  ]);
  if (!page.url().includes("/dashboard")) {
    await page.screenshot({ path: "c:/Projects/apps-portfolio/fotos-verificar/bug-fixes/login-failed.png" });
    throw new Error("login did not redirect; URL=" + page.url());
  }
  await page.getByRole("heading", { level: 1 }).first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "c:/Projects/apps-portfolio/fotos-verificar/bug-fixes/02-dashboard-fixed.png", fullPage: true });
  console.log("✓ dashboard");

  // 3. Click bell + JK avatar — both should navigate to /settings
  await page.getByRole("link", { name: /Account settings/i }).first().click();
  await page.waitForURL(/\/settings/, { timeout: 10000 });
  await page.screenshot({ path: "c:/Projects/apps-portfolio/fotos-verificar/bug-fixes/03-avatar-clicked-settings.png" });
  console.log("✓ avatar→settings");
} finally {
  await browser.close();
  await fetch(`${SUPA}/auth/v1/admin/users/${u.id}`, { method:"DELETE", headers:{ Authorization:`Bearer ${KEY}`, apikey:KEY }});
}
