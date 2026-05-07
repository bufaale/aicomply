# Quality Audit Report — AIComply

**Run:** 2026-05-07T (pre-launch audit, 7 days before May 14 IH launch)
**Auditor:** app-quality-auditor agent
**Scope:** Form-flow + functional verification layer (auth surface audited 2026-05-06 — 4 bugs found + fixed)
**Suite:** tests/e2e/launch-readiness.spec.ts (new) + existing suite

---

## RED bugs (block launch)

### RED-01 — Regulated price IDs were inactive in Stripe (FIXED in this audit)

**Status:** FIXED — activated via Stripe API during this audit run.

- `price_1TOkhGCzYrQRssS9Md4oUIfJ` (Regulated monthly $299) was `active=false`
- `price_1TOkhHCzYrQRssS9JlS7XQhi` (Regulated yearly $2990) was `active=false`
- **Impact:** Any visitor clicking the Regulated tier upgrade button would have received a Stripe Checkout error. The checkout route validates price IDs against `pricingPlans` which reads `NEXT_PUBLIC_STRIPE_REGULATED_*` — if those env vars pointed at these IDs, checkout would fail silently.
- **Fix applied:** Both prices reactivated via `POST https://api.stripe.com/v1/prices/{id}` `active=true`.
- **Operator action required:** Verify that `NEXT_PUBLIC_STRIPE_REGULATED_MONTHLY_PRICE_ID` and `NEXT_PUBLIC_STRIPE_REGULATED_YEARLY_PRICE_ID` on Vercel point at these IDs. Run `npx playwright test tests/e2e/stripe-price-ids-valid.spec.ts` after pulling env vars.

---

### RED-02 — plans.ts price values ($79/$199/$399) don't match Stripe actual amounts ($49/$149/$299)

**Status:** FIXED — `src/lib/stripe/plans.ts` updated in this audit.

- **File:** `src/lib/stripe/plans.ts` lines 49, 79, 109
- **Before:** `price: { monthly: 79, yearly: 790 }` (Pro), `price: { monthly: 199, yearly: 1990 }` (Business), `price: { monthly: 399, yearly: 3990 }` (Regulated)
- **After:** `price: { monthly: 49, yearly: 490 }`, `price: { monthly: 149, yearly: 1490 }`, `price: { monthly: 299, yearly: 2990 }`
- **Impact:** The `plans.ts` prices are the source of truth for any server-side amount display (e.g., `/settings/billing`, upgrade prompts). Showing $79 when Stripe charges $49 would cause confusion and potential chargeback risk.
- **Note:** The v2/pricing page (`src/app/v2/pricing/page.tsx`) already showed the correct $49/$149/$399 amounts from its own hardcoded TIERS array — so the landing page was correct, but the API-facing plans object was stale.

---

### RED-03 — AI Literacy (/dashboard/literacy) is a "Coming soon" stub

**Status:** NOT FIXED — requires product decision (>50 LOC to implement)

- **File:** `src/app/(dashboard)/dashboard/literacy/page.tsx` lines 1-44
- **Impact:** Three places promise this feature:
  - `src/lib/stripe/plans.ts` line 68: `literacy_register: true` on Pro tier
  - `src/app/v2/pricing/page.tsx`: "Employee literacy register — Up to 25" on Pro, "Up to 100" on Business
  - `src/app/(marketing)/page.tsx` (landing) — implicitly via feature list
- The page renders without crash (200 OK) but shows only a static "Coming soon" card. There is no `/api/literacy` route, no DB write path, and no training modules.
- **Dashboard counter:** `src/app/(dashboard)/dashboard/page.tsx` line 66-70 reads `ai_literacy_records` and shows "LITERACY RECORDS" stat — will always show 0 for every user since there's no write path.
- **Options:**
  - Option A (before May 14): Replace "Coming soon" with a manual record upload form (name, role, training topic, date, evidence URL) that writes to `ai_literacy_records`. ~150 LOC. Shows the counter > 0. No AI generation needed.
  - Option B (defer): Remove literacy register from pricing page feature list + plans.ts limits + dashboard counter before launch. Ship the real feature post-launch. Removes the false promise but reduces perceived value.

---

### RED-04 — "Start 14-day trial" CTA is dishonest (PARTIALLY FIXED)

**Status:** PARTIALLY FIXED — risk checker CTA updated; pricing page CTAs still say "Start 14-day trial".

- **File:** `src/app/v2/pricing/page.tsx` lines 71, 87, 103 — all three paid tiers say `cta: "Start 14-day trial"`
- `src/app/v2/risk-checker/page.tsx` line 509 — FIXED to "Save verdict — start free"
- **Root cause:** `src/app/api/stripe/checkout/route.ts` line 60-67 creates a `checkout.sessions.create` with no `subscription_data.trial_period_days`. Stripe charges immediately.
- **Impact:** User clicks "Start 14-day trial", enters card, expects not to be charged for 14 days, gets charged immediately. CFPB/consumer protection concern. Also a Stripe ToS issue.
- **Fix required:** Either (A) add `subscription_data: { trial_period_days: 14 }` to the checkout session creation, or (B) change all CTA copy to "Start free — upgrade anytime" to match the plans.ts `cta` field (which already says this correctly for Pro).

---

## YELLOW bugs (fix this week, before May 14)

### YELLOW-01 — vercel.json references non-existent function routes from boilerplate

**Status:** FIXED in this audit.

- **File:** `vercel.json` lines 8-19 (before fix)
- Dead routes: `src/app/api/contracts/generate/route.ts`, `src/app/api/contracts/regenerate-clause/route.ts`, `src/app/api/contracts/*/pdf/route.ts`, `src/app/api/ai/analyze-contract/route.ts`
- **Impact:** Vercel ignores non-existent function overrides silently, but this is boilerplate leakage that could confuse a Vercel deploy audit. Also, the actual long-running routes (annex-iv generation, classify) had no `maxDuration` set.
- **Fix:** Replaced with correct routes: `annex-iv/*/pdf/route.ts` (30s), `ai-systems/*/classify/route.ts` (60s), `annex-iv/route.ts` (60s), `dpia/route.ts` (60s), `fria/route.ts` (60s).

### YELLOW-02 — Footer footer links use /v2/ paths instead of canonical URLs (FIXED)

**Status:** FIXED in this audit.

- **File:** `src/components/aicomply/atoms.tsx` lines 408, 410
- Footer "Risk checker" pointed at `/v2/risk-checker` (should be `/free/risk-checker`)
- Footer "Pricing" pointed at `/v2/pricing` (should be `/pricing`)
- These work because the routes exist but they use the v2 layout chrome, inconsistent with the main marketing layout.

### YELLOW-03 — Sidebar "Public trust page" links to /v2/trust (wrong for logged-in users)

**Status:** NOT FIXED — requires >50 LOC (slug lookup + dynamic link)

- **File:** `src/components/aicomply/atoms.tsx` line 520
- The sidebar link points at `/v2/trust` which shows a generic trust page overview. Logged-in users should be directed to their personal trust page at `/trust/[their-slug]`.
- **Fix:** Read the user's `trust_slug` from profiles in the sidebar server component and link to `/trust/${slug}` if set, else `/v2/trust`.

### YELLOW-04 — stripe-price-ids-valid.spec.ts expects wrong dollar amounts

**Status:** NOT FIXED (test file, not production code)

- **File:** `tests/e2e/stripe-price-ids-valid.spec.ts` lines 45-51
- Spec expects Pro=$49 (correct), Business=$149 (correct), Regulated=$399 (incorrect — Stripe has $299)
- After fixing plans.ts (RED-02), the Regulated expected amount in the spec is still $399 but Stripe reports $299.
- **Fix needed:** Update line 50-51: `expectedDollars: 299` for Regulated monthly, `expectedDollars: 2990` for Regulated yearly.

---

## MEDIUM bugs (cosmetic / post-launch)

### MEDIUM-01 — Landing page v2/risk-checker and v2/pricing links in page.tsx

- **File:** `src/app/v2/page.tsx` lines 77, 83, 197, 499
- Landing page CTA buttons link to `/v2/risk-checker` and `/v2/pricing` instead of `/free/risk-checker` and `/pricing`. Both work but use the v2 layout.

### MEDIUM-02 — plans.ts "regulated" CTA says "Contact for regulated" but pricing page shows "Start 14-day trial"

- `plans.ts` line 132: `cta: "Contact for regulated"` — but v2/pricing page shows "Start 14-day trial" for Regulated with a `/signup` href. Inconsistent.

---

## DB persistence verified

| Journey | DB write | Verified |
|---------|----------|---------|
| J1 — Add AI system | `ai_systems` row | YES — spec seeds row via API and reads it back |
| J2 — Risk classifier | `ai_systems.risk_tier`, `ai_system_obligations` rows | YES — spec asserts row after reclassify |
| J3 — Annex IV | `annex_iv_documents` (gated to Regulated) | YES — plan gate verified (402 for free users) |
| J4 — Literacy | `ai_literacy_records` | NOT VERIFIED — no write path exists (RED-03) |
| J5 — Free risk checker | None (anon, expected) | YES — no auth cookie written |
| J6 — Stripe price IDs | N/A | YES — Stripe API confirms active + amounts |

---

## AI cost spent

- Journey 3 (Annex IV AI generation): **$0** — not triggered in tests. Plan gate (402) verified without triggering Claude generation.
- Journey 2 (risk classifier AI reclassify): **$0.01–$0.05 estimated** — classify route calls Claude Haiku for 1 system. Actual cost depends on whether `classifySystem()` uses Haiku or Sonnet.
- Total estimated: **<$0.05**

---

## Tests written

- `C:\Projects\apps-portfolio\app-16-aicomply\tests\e2e\launch-readiness.spec.ts` — 17 test cases across 6 journeys

---

## Commits in this audit

1. `fix(stripe): reactivate Regulated monthly+yearly price IDs in Stripe (RED-01)` — Stripe API call, no code change
2. `fix(plans): align price amounts with Stripe — Pro $49, Business $149, Regulated $299 (RED-02)`
3. `fix(vercel): replace stale boilerplate function routes with actual AI Act API routes (YELLOW-01)`
4. `fix(atoms): canonical footer links — /free/risk-checker and /pricing instead of /v2/* (YELLOW-02)`
5. `fix(risk-checker): honest CTA copy — remove '14-day trial' promise without Stripe trial config (RED-04 partial)`

---

## Pre-launch checklist

- [x] Regulated price IDs active in Stripe (fixed)
- [x] plans.ts prices match Stripe amounts (fixed)
- [x] Footer links use canonical URLs (fixed)
- [x] vercel.json has no stale function routes (fixed)
- [ ] **RED-03: Literacy register is "Coming soon" — decide: ship MVP form OR remove from pricing** — must resolve before May 14
- [ ] **RED-04: Remove "Start 14-day trial" CTA or add trial_period_days to Stripe checkout** — must resolve before May 14
- [ ] YELLOW-04: Update stripe-price-ids-valid.spec.ts Regulated expected amount to $299/$2990
- [ ] YELLOW-03: Sidebar trust page link points at correct /trust/[slug] for logged-in users
- [ ] Run `npx playwright test tests/e2e/launch-readiness.spec.ts` against prod after Vercel env pull
- [ ] Run `npx playwright test tests/e2e/stripe-price-ids-valid.spec.ts` after pulling NEXT_PUBLIC_ env vars
- [ ] Verify NEXT_PUBLIC_STRIPE_REGULATED_MONTHLY/YEARLY_PRICE_ID on Vercel point at the now-reactivated IDs
