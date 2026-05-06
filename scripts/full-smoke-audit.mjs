/**
 * Full manual smoke audit — visits every clickable surface across both
 * AIComply + CallSpark prod, screenshots each, dumps page errors to log.
 * Surfaces issues a v2-port spec wouldn't catch: visual polish, dead
 * links, broken interactivity, console errors.
 */
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = "c:/Projects/apps-portfolio/fotos-verificar/full-smoke";
mkdirSync(OUT, { recursive: true });

const findings = [];
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 1600 } });
const page = await ctx.newPage();

const issues = [];
page.on("pageerror", (err) => issues.push({ type: "pageerror", msg: err.message }));
page.on("console", (msg) => {
  if (msg.type() === "error") issues.push({ type: "console.error", msg: msg.text() });
});

const ROUTES = [
  // AIComply public surfaces (post-v2-swap)
  { app: "aicomply", path: "/", waitFor: "h1" },
  { app: "aicomply", path: "/pricing", waitFor: "h1" },
  { app: "aicomply", path: "/free/risk-checker", waitFor: "h1" },
  { app: "aicomply", path: "/v2/trust", waitFor: "h1" },
  { app: "aicomply", path: "/login", waitFor: "h1" },
  { app: "aicomply", path: "/signup", waitFor: "h1" },
  { app: "aicomply", path: "/forgot-password", waitFor: "h1" },
  { app: "aicomply", path: "/blog", waitFor: null },
  { app: "aicomply", path: "/terms", waitFor: null },
  { app: "aicomply", path: "/privacy", waitFor: null },
  { app: "aicomply", path: "/refund", waitFor: null },

  // CallSpark public surfaces (post-v2-swap)
  { app: "callspark", path: "/", waitFor: "h1" },
  { app: "callspark", path: "/pricing", waitFor: "h1" },
  { app: "callspark", path: "/login", waitFor: "h1" },
  { app: "callspark", path: "/signup", waitFor: "h1" },
  { app: "callspark", path: "/forgot-password", waitFor: "h1" },
  { app: "callspark", path: "/terms", waitFor: null },
  { app: "callspark", path: "/privacy", waitFor: null },
];

const APPS = {
  aicomply: "https://aicomply.piposlab.com",
  callspark: "https://callspark.piposlab.com",
};

for (const r of ROUTES) {
  const url = APPS[r.app] + r.path + "?nocache=" + Date.now();
  issues.length = 0; // reset per-route
  try {
    const resp = await page.goto(url, { timeout: 20000, waitUntil: "domcontentloaded" });
    if (resp && resp.status() >= 400) {
      findings.push({ route: r.path, app: r.app, severity: "high", note: `HTTP ${resp.status()}` });
      continue;
    }
    if (r.waitFor) {
      try {
        await page.locator(r.waitFor).first().waitFor({ timeout: 8000 });
      } catch {
        findings.push({ route: r.path, app: r.app, severity: "medium", note: `waitFor "${r.waitFor}" timeout — page may be broken` });
      }
    }
    await page.waitForTimeout(1200);
    const fname = `${r.app}__${r.path.replace(/[/?]/g, "_")}.png`;
    await page.screenshot({ path: `${OUT}/${fname}`, fullPage: true });
    if (issues.length > 0) {
      findings.push({
        route: r.path,
        app: r.app,
        severity: "medium",
        note: `${issues.length} console errors`,
        details: issues.slice(0, 3).map((i) => `[${i.type}] ${i.msg.slice(0, 200)}`),
      });
    }
    console.log(`✓ ${r.app}${r.path}`);
  } catch (e) {
    findings.push({ route: r.path, app: r.app, severity: "high", note: `navigation error: ${e.message.slice(0, 100)}` });
  }
}

writeFileSync(`${OUT}/findings.json`, JSON.stringify(findings, null, 2));
console.log("\n=== findings ===");
for (const f of findings) console.log(`  [${f.severity}] ${f.app}${f.route} — ${f.note}`);
console.log(`\nTotal: ${findings.length} issues across ${ROUTES.length} routes`);
console.log(`Screenshots in: ${OUT}`);

await browser.close();
