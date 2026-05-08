# Quality Audit Report — AIComply Pre-Launch (May 14, 2026)

**Run:** 2026-05-08T18:25Z  
**Auditor:** app-quality-auditor agent  
**Scope:** Full landing-to-checkout user journey simulation + 8-point Supabase checklist  
**Launch date:** May 14, 2026 (6 days out)

---

## Summary

| Category | Count |
|---|---|
| Bugs found | 6 |
| Fixed + committed | 4 (commits 255274c, 9c61aea, 4574a8f, 9ace7e1) |
| Flagged (need decision) | 1 |
| Documented only | 1 |
| Pre-launch readiness | Ship-blockers resolved — conditional green |

---

## Fixed bugs (committed to main, deploying via Vercel)

### FIX-1 — Signup page "14-DAY TRIAL" label (CRITICAL)
**Commit:** `255274c`  
**File:** `src/components/auth/signup-form.tsx:131`  
**What:** The signup form header read "CREATE WORKSPACE · 14-DAY TRIAL". Stripe has no `trial_period_days` set on any AIComply price — the first billing happens immediately on signup. CLAUDE.md explicitly flags this exact pattern as a launch anti-pattern. Prior commit `8c6fa2e` killed it from `/pricing` and the homepage but missed the signup form component.  
**Fix:** Changed to "CREATE WORKSPACE · FREE TIER INCLUDED" (accurate: Free tier requires no card).

### FIX-2 — Footer missing Refund Policy link (HIGH)
**Commit:** `9c61aea`  
**File:** `src/components/aicomply/atoms.tsx:427`  
**What:** CLAUDE.md requires all 3 legal pages (Terms, Privacy, Refund) in the footer before accepting payments. The `MktFooter` atom had Terms and Privacy but not Refund. The `/refund` page itself exists and returns 200.  
**Fix:** Added `{ label: "Refund Policy", href: "/refund" }` to the Legal section, replacing the non-functional SOC 2 placeholder.

### FIX-3 — Hero CTAs link to `/v2/risk-checker` and `/v2/pricing` (HIGH)
**Commit:** `4574a8f`  
**File:** `src/app/v2/page.tsx`  
**What:** Four `<Link href>` values on the landing page pointed at `/v2/risk-checker` instead of `/free/risk-checker` (canonical URL, proper SEO title), and `/v2/pricing` instead of `/pricing`. The `/v2/pricing` route is canonical and works, but the nav bar links to `/pricing` — split destinations create inconsistent experience. The `/v2/risk-checker` route renders without the proper page title "Free EU AI Act Risk Checker — instant classification | AIComply".  
**Also fixed:** Homepage pricing teaser tier descriptions corrected to match plans.ts:
- Pro: "starter · 5 systems" → "up to 20 systems · FRIA" (plans.ts `systems_max=20`, `fria_export=true`)
- Business: "up to 50 · cross-walk" → "unlimited · DPIA + FRIA" (plans.ts `systems_max=Infinity`, `dpia_export=true`)
- Regulated: "unlimited · DPIA + FRIA" → "unlimited · Annex IV pack" (differentiator from Business now)

### FIX-4 — /pricing feature matrix drifted from plans.ts + API gates (CRITICAL)
**Commit:** `9ace7e1`  
**File:** `src/app/v2/pricing/page.tsx`  
**What:** Three independent errors in the hardcoded feature matrix vs the actual code gates:

| Feature | /pricing showed | plans.ts truth | API gate truth |
|---|---|---|---|
| Pro — Tracked systems | 5 | 20 (`systems_max`) | no cap in code at 5 |
| Business — Tracked systems | 50 | Unlimited (`Infinity`) | no cap in code at 50 |
| FRIA generator | Pro: "—", Business: "—" | Pro: `fria_export=true`, Business: `fria_export=true` | `route.ts` blocks `free` only |
| DPIA generator | Business: "—" | Business: `dpia_export=true` | `route.ts` requires `business`+ |

A Pro customer paying $49/mo and successfully generating FRIAs would see "—" on the pricing page they came from — this breaks trust and creates support tickets.  
**Fix:** Matrix corrected to: Pro "20" systems, Business "Unlimited"; FRIA: Pro "3/mo", Business "Unlimited"; DPIA: Business "✓". Pro/Business tier card bullets updated to match.

---

## 8-Point Supabase Launch Checklist — Results

| Check | Result |
|---|---|
| 1. Supabase site_url = aicomply.piposlab.com | PASS |
| 2. SMTP host = smtp.resend.com | PASS |
| 3. rate_limit_email_sent >= 50 (actual: 100) | PASS |
| 4. smtp_admin_email = no-reply@piposlab.com | PASS |
| 5. profiles.subscription_plan default = 'free'::text | PASS |
| 6. /sitemap.xml returns 200 | PASS |
| 7. /robots.txt returns 200 | PASS |
| 8. Footer entity = "Pipo's Lab LLC" (not "AIComply, Inc.") | PASS |
| 9. emailRedirectTo in signup-form.tsx | PASS |
| 10. /terms + /privacy + /refund all return 200 | PASS |
| 11. No "14-day trial" copy anywhere in src/ | PASS (after FIX-1) |
| 12. No "14-day trial" on live /pricing or homepage | PASS |
| 13. Stripe LIVE prices $49/$149/$399 active | PASS |

---

## Flagged (needs operator decision)

### FLAG-1 — Nav "Trust" link goes to /v2/trust (demo data)
**Where:** `src/components/aicomply/marketing-header.tsx` (or inline in atoms)  
**What:** The top-nav "Trust" link goes to `/v2/trust`, which is a static Claude Designs prototype page showing "acme-health/triage-copilot" mock data. This is a design showcase, not a real user's trust page. Real user trust pages live at `/trust/[slug]`. Any visitor clicking "Trust" in the nav sees the mock data page.

**Options:**
- **Option A (recommended):** Remove the Trust link from the marketing nav entirely before launch. Add it back post-launch when a real paying customer has a populated trust page. Zero code risk.
- **Option B:** Point the nav link to `/free/risk-checker` or `/pricing` — repurpose the slot for a higher-conversion destination.
- **Option C:** Build a `/trust` landing page that explains the feature with a "See example →" link to the demo + a "Start free" CTA. Adds 1–2 hours of work.

Recommendation: Option A. A broken or misleading Trust demo seen by launch-day IH visitors damages credibility more than having no Trust link.

---

## Documented only (not blocking launch)

### DOC-1 — /v2/trust shows "acme-health" placeholder data
The `/v2/trust` route renders the Claude Designs prototype with hardcoded "Acme Health" company name and "triage-copilot" system. No crash, no 404. This is the same boilerplate-clone issue caught on May 6 for the dashboard. It matters post-launch when customers share their trust URL — but the nav-level impact is covered by FLAG-1. No code change made here.

---

## Stripe verification (final state)

| Tier | Env var | LIVE Price ID | Amount | Active |
|---|---|---|---|---|
| Pro monthly | `NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID` | price_1TUUqCCl2tU6PW4hfbaDNgMf | $49 | True |
| Business monthly | `NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID` | price_1TUUqZCl2tU6PW4hUxK6UEgM | $149 | True |
| Regulated monthly | `NEXT_PUBLIC_STRIPE_REGULATED_MONTHLY_PRICE_ID` | price_1TUUqcCl2tU6PW4hA5Ktju3K | $399 | True |

Old prices (infrastructure.md "CURRENT" entries at $79/$199/$399) are superseded by the May 7 autopilot rebuild. Infrastructure.md needs updating — the $49/$149 prices are the actual Vercel production values now.

---

## Pre-launch checklist

- [x] All Critical bugs fixed (FIX-1 "14-day trial", FIX-4 pricing matrix)  
- [x] All High bugs fixed (FIX-2 refund link, FIX-3 hero CTA links)  
- [x] 4 commits pushed to main → Vercel auto-deploying  
- [x] Supabase Auth: custom SMTP + 100/hr rate limit + correct site_url  
- [x] Postgres subscription_plan default = 'free' (no NULL revenue leak)  
- [x] emailRedirectTo present in signup form (confirm → /dashboard)  
- [x] /sitemap.xml, /robots.txt both return 200  
- [x] Footer: "Pipo's Lab LLC" entity correct  
- [x] Footer: Terms + Privacy + Refund all linked  
- [x] No "14-day trial" copy anywhere  
- [x] Stripe LIVE prices $49/$149/$399 verified active  
- [ ] FLAG-1: decide on "Trust" nav link (Option A = remove, recommended)  
- [ ] infrastructure.md: update App-16 section with new price IDs (cosmetic, not launch-blocking)  

**Pre-launch readiness: CONDITIONAL GREEN** — 4 fixes committed and deploying. One operator decision needed (FLAG-1 Trust nav link). No known ship-blockers remain after current deploy.
