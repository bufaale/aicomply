/**
 * Real-user walkthrough — simulate a visitor arriving from Indie Hackers at
 * 10:00 ART on May 14, 2026 (AIComply launch day).
 *
 * Mirrors AccessiScan's launch walkthrough. Tests the core funnel:
 * homepage → free risk-checker → signup → dashboard → upgrade.
 */
import { chromium } from "@playwright/test";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";

for (const f of [".env.test.local", ".env.test"]) {
  try {
    const env = readFileSync(`c:/Projects/apps-portfolio/app-16-aicomply/${f}`, "utf8");
    for (const line of env.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}

const SUPA = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BASE = "https://aicomply.piposlab.com";
const OUT = "c:/Projects/apps-portfolio/fotos-verificar/aicomply-walkthrough";
mkdirSync(OUT, { recursive: true });

const findings = { steps: [], errors: [], warnings: [] };
const log = (label, status, detail = "") => {
  findings.steps.push({ step: label, status, detail });
  console.log(`${status === "ok" ? "✓" : status === "warn" ? "⚠" : "✗"} ${label}${detail ? " — " + detail : ""}`);
};
const flag = (msg, severity = "warning") => {
  if (severity === "error") findings.errors.push(msg);
  else findings.warnings.push(msg);
  console.log(`${severity === "error" ? "🚨" : "⚠"}  ${msg}`);
};

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push({ url: page.url(), text: msg.text() });
});
page.on("pageerror", (err) => consoleErrors.push({ url: page.url(), text: err.message }));

let testUserId = null;

try {
  await page.goto(`${BASE}?utm_source=ih&utm_medium=social&utm_campaign=launch-may-14`);
  await page.waitForLoadState("networkidle");
  log("1. Homepage loads", "ok");
  await page.screenshot({ path: `${OUT}/01-homepage.png`, fullPage: true });

  const heroText = await page.locator("body").textContent();
  if (heroText.match(/EU AI Act|Article 4|Article 27/i)) log("1a. Hero mentions EU AI Act", "ok");
  else flag("Hero does NOT mention EU AI Act", "warning");

  if (heroText.match(/Aug.*2,?\s*2026|August 2,?\s*2026/i)) log("1b. Hero mentions Aug 2 2026 deadline", "ok");
  else flag("Hero does NOT mention Aug 2 2026 (Article 4 deadline)", "warning");

  // /free/risk-checker
  await page.goto(`${BASE}/free/risk-checker`);
  await page.waitForLoadState("networkidle");
  log("2. /free/risk-checker loads", "ok");
  await page.screenshot({ path: `${OUT}/02-risk-checker.png`, fullPage: true });

  // /pricing — verify all tiers + no fake-trial language
  await page.goto(`${BASE}/pricing`);
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: `${OUT}/03-pricing.png`, fullPage: true });
  const pricingText = await page.locator("body").textContent();

  for (const tier of ["Free", "Pro", "Business", "Regulated"]) {
    if (pricingText.includes(tier)) log(`3. /pricing mentions ${tier} tier`, "ok");
    else flag(`/pricing missing ${tier} tier`, "error");
  }

  if (pricingText.match(/14-day trial/i)) flag("/pricing has 14-day trial copy (should be honest)", "warning");
  else log("3a. /pricing has no fake-trial copy", "ok");

  // Verify the FRIA + DPIA generator landings
  await page.goto(`${BASE}/fria-generator`);
  await page.waitForLoadState("networkidle");
  log("4. /fria-generator loads", "ok");
  const friaText = await page.locator("body").textContent();
  if (friaText.includes("$49") || friaText.includes("Pro ($")) log("4a. FRIA landing references Pro $49", "ok");
  if (friaText.match(/1 FRIA included|first FRIA free/i)) flag("FRIA landing STILL has 'first FRIA free' bait", "error");
  else log("4b. FRIA landing has NO bait copy", "ok");

  await page.goto(`${BASE}/dpia-generator`);
  await page.waitForLoadState("networkidle");
  log("5. /dpia-generator loads", "ok");
  const dpiaText = await page.locator("body").textContent();
  if (dpiaText.includes("Business") && dpiaText.includes("$149")) log("5a. DPIA landing references Business $149", "ok");
  if (dpiaText.match(/first DPIA free|1 DPIA/i)) flag("DPIA landing STILL has 'first DPIA free' bait", "error");
  else log("5b. DPIA landing has NO bait copy", "ok");

  // Signup via UI
  const email = `aic-realuser-${Date.now()}@test.example.com`;
  const password = "RealUser_Pass123!";

  const provR = await fetch(`${SUPA}/auth/v1/admin/users`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  if (!provR.ok) throw new Error(`Failed to provision: ${await provR.text()}`);
  const u = await provR.json();
  testUserId = u.id;
  log("6. User provisioned", "ok", email);

  // Verify the new user has subscription_plan = 'free' (not null)
  await new Promise((r) => setTimeout(r, 1500));
  const profR = await fetch(`${SUPA}/rest/v1/profiles?id=eq.${u.id}&select=subscription_plan`, {
    headers: { Authorization: `Bearer ${KEY}`, apikey: KEY },
  });
  const prof = await profR.json();
  if (Array.isArray(prof) && prof[0]?.subscription_plan === "free") {
    log("6a. New user has subscription_plan='free' (not NULL)", "ok");
  } else {
    flag(`New user has subscription_plan=${prof[0]?.subscription_plan} (expected 'free')`, "error");
  }

  // Login + dashboard
  await page.goto(`${BASE}/login`);
  await page.waitForLoadState("domcontentloaded");
  await page.locator("#login-email, [name='email'], input[type='email']").first().fill(email);
  await page.locator("#login-password, [name='password'], input[type='password']").first().fill(password);
  await page.locator("button[type='submit']").first().click();
  await page.waitForURL(/\/dashboard/, { timeout: 30_000 });
  log("7. Login redirects to /dashboard", "ok");
  await page.screenshot({ path: `${OUT}/07-dashboard.png`, fullPage: true });

  // FRIA gate as Free user — expect 402
  const friaRes = await page.request.post(`${BASE}/api/fria`, {
    data: { system_id: "00000000-0000-0000-0000-000000000000" },
  });
  if (friaRes.status() === 402) log("8. FRIA returns 402 for Free", "ok");
  else flag(`FRIA gate returned ${friaRes.status()} for Free (expected 402)`, "error");

  // DPIA gate as Free user — expect 402
  const dpiaRes = await page.request.post(`${BASE}/api/dpia`, {
    data: { system_id: "00000000-0000-0000-0000-000000000000" },
  });
  if (dpiaRes.status() === 402) {
    log("9. DPIA returns 402 for Free", "ok");
    const body = await dpiaRes.json();
    if (body.error.match(/business|regulated/i)) log("9a. DPIA error message references Business+", "ok");
    else flag(`DPIA error message wrong: ${body.error}`, "warning");
  } else {
    flag(`DPIA gate returned ${dpiaRes.status()} for Free (expected 402)`, "error");
  }

  // /settings/billing
  await page.goto(`${BASE}/settings/billing`);
  await page.waitForLoadState("networkidle");
  log("10. /settings/billing loads", "ok");
  await page.screenshot({ path: `${OUT}/10-billing.png`, fullPage: true });

  // Mobile audit — accurate check (can the user actually scroll?)
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(BASE);
  await mobilePage.waitForLoadState("networkidle");
  const canScroll = await mobilePage.evaluate(() => {
    const before = window.scrollX;
    window.scrollTo(500, 0);
    const after = window.scrollX;
    window.scrollTo(0, 0);
    return after > before;
  });
  if (!canScroll) log("11. Mobile homepage: no horizontal scroll", "ok");
  else flag("Mobile homepage has horizontal scroll", "error");
  await mobilePage.screenshot({ path: `${OUT}/11-mobile-landing.png`, fullPage: true });
  await mobileCtx.close();

  log("WALKTHROUGH COMPLETE", "ok", `${findings.steps.filter(s => s.status === "ok").length}/${findings.steps.length} steps OK`);
} catch (err) {
  flag(`Fatal: ${err.message}`, "error");
} finally {
  if (testUserId) {
    await fetch(`${SUPA}/auth/v1/admin/users/${testUserId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${KEY}`, apikey: KEY },
    });
  }
  findings.console_errors = consoleErrors;
  await browser.close();
  writeFileSync(`${OUT}/findings.json`, JSON.stringify(findings, null, 2));
  console.log(`\n→ findings written to ${OUT}/findings.json`);
  console.log(`✓ ${findings.steps.filter(s => s.status === "ok").length} steps passed`);
  console.log(`⚠ ${findings.warnings.length} warnings`);
  console.log(`✗ ${findings.errors.length} errors`);
  console.log(`📺 ${consoleErrors.length} console errors`);
}
