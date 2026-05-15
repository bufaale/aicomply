# AIComply — User Journey Trace
**Audited:** 2026-05-15  
**Auditor:** app-quality-auditor  
**Production URL:** https://aicomply.piposlab.com

---

## Landing page promises extracted from `/v2/page.tsx`

1. "Run the 10-question check — free" → `/free/risk-checker` (no signup)
2. "Classify every AI system into 4 risk tiers. Hand auditors a packet."
3. "€35M or 7% revenue" fine citations → Article 99 of Regulation (EU) 2024/1689
4. "4 risk tiers · Art. 6 + Annex III" in the stat grid
5. "10 questions · self-assess" in the stat grid
6. "Connect Slack, Notion, Drive" for auto-discovery (Step 01 "Inventory")
7. "Article 4 literacy: 8-min modules, signed acknowledgements" (Step 03)
8. "Annex IV technical documentation. DPIA + FRIA." (Step 04)
9. Pricing: Pro $49, Business $149, Regulated $399, Enterprise Contact
10. "Per workspace, per month. No per-seat tax."
11. Cross-walk section: EU 2024/1689, NIST AI RMF, ISO 42001, SOC 2 TYPE II, GDPR ART. 22

---

## Journey 1 — Landing → Free Risk Checker (anonymous)

**Path:** `/` → click "Run the 10-question check — free" → `/free/risk-checker`

**Steps:**
1. Land on `/`
2. Hero CTA: "Run the 10-question check — free" → links to `/free/risk-checker` ✓
3. `/free/risk-checker` renders 10-question quiz, no auth wall ✓
4. Complete all 10 questions → verdict screen with tier classification ✓
5. Optional: email capture for permalink
6. `/quiz-result/[token]` — public permalink, shareable ✓

**Gaps found:**
- None on this path — core free loop works

---

## Journey 2 — Landing → Pricing → Signup → Dashboard

**Path:** `/` → "See pricing" → `/pricing` → tier CTA → `/signup` → `/dashboard`

**Steps:**
1. `/pricing` — renders 4 tiers (Pro $49, Business $149, Regulated $399, Enterprise Contact) ✓
2. Pro CTA: "Start free — upgrade anytime" → `/signup` ✓
3. Business CTA: "Start free — upgrade anytime" → `/signup` ✓
4. Regulated CTA: "Start free — upgrade anytime" → `/signup` ✓
5. Enterprise CTA: mailto:alex@piposlab.com ✓
6. Signup form: name, email, password → creates Supabase user ✓
7. Redirect to `/dashboard` after signup ✓
8. Dashboard renders with empty state CTA ✓

**Gaps found:**
- Landing pricing preview links all go to `/pricing` (correct), not directly to signup with plan
- This is by design — user picks plan on pricing page, signs up, then upgrades via billing

---

## Journey 3 — Dashboard: Register AI System → Classify → View obligations

**Path:** `/dashboard` → "Register AI system" → `/dashboard/ai-systems/new` → Save → `/dashboard/ai-systems/[id]`

**Steps:**
1. `/dashboard/ai-systems/new` — form with required fields: Name, Purpose ✓
2. Fill form → "Save & Classify" → POST /api/ai-systems ✓
3. Redirect to `/dashboard/ai-systems/[id]` ✓
4. Risk tier badge shown ✓
5. "Reclassify" button triggers AI classification ✓
6. Obligations checklist populated ✓

**Gaps found:**
- None — core loop verified in existing `launch-readiness.spec.ts`

---

## Journey 4 — Tier gating: free vs pro vs business vs regulated

**Path:** Login as free user → attempt protected features → see upgrade prompt

**Features gated by tier (from `plans.ts` limits):**
- DPIA export: business+ only
- FRIA export: pro+ only  
- Annex IV generation: regulated+ only
- Literacy register write: pro+ (free is read-only)
- Systems max: free=1, pro=20, business=unlimited, regulated=unlimited

**Gaps found:**
- Literacy page (`/dashboard/literacy`) shows full form for free users but `plans.ts` says `literacy_register: false` for free — this is a tier-gating gap. The form is accessible to free users, but the product docs say it should be read-only.
- `/dashboard/annex-iv/new` renders form even for free tier but POST returns 402 — correct server-side gate but no client-side "upgrade" prompt on the form page.

---

## Journey 5 — Stripe billing lifecycle

**Path:** `/settings/billing` → upgrade → Stripe Checkout → return → plan updates in DB

**Steps:**
1. POST `/api/stripe/checkout` validates auth FIRST (getUser()) ✓
2. Price ID validated against allowlist BEFORE auth check — **BUG** (see bug report)
3. Stripe Checkout session created ✓
4. Webhook: `checkout.session.completed` → profile updated ✓
5. Portal: `customer.subscription.deleted` resets plan + status to free ✓
6. `.trim()` on STRIPE_WEBHOOK_SECRET ✓

**Auth ordering bug in checkout route:**
```
src/app/api/stripe/checkout/route.ts lines 14-24:
  1. validateMode (ok)
  2. validatePriceId against allowlist  ← returns 400 before auth check
  3. getUser()  ← auth happens AFTER price validation
```
The price ID validation at line 14-21 runs before the auth check at line 23. This means unauthenticated callers can enumerate whether a price ID is valid (they get 400 for invalid, 401 for valid-but-unauthed). Per memory lesson from CallSpark BUG-08: auth must come FIRST.

---

## Journey 6 — Auth flows

**Signup:**
- Signup form: name + email + password ✓
- Google OAuth: `queryParams: { prompt: "select_account" }` ✓ (per memory)
- `/auth/confirm` callback route exists ✓
- Middleware: `/auth/:path*` matcher present — but middleware does NOT early-return on `/auth/` before calling `updateSession(request)` — **POTENTIAL BUG** per memory (PKCE code_verifier gets dropped if updateSession runs on auth callbacks)

**Logout:**
- `/api/auth/signout` route exists ✓
- Should redirect with 303, not 307

**Forgot password:**
- `/forgot-password` form present ✓

---

## Journey 7 — False claims / credentials

**CRITICAL BUG FOUND AND FIXED:**
- `src/components/auth/login-form.tsx` line 205: "Protected by SOC 2 Type II controls. REG. NO. AIC-2026"
- AIComply does NOT have SOC 2 Type II certification
- Fixed in this audit: replaced with "Data encrypted TLS 1.2+ in transit, AES-256 at rest."

**Landing crosswalk banner:**
- Lists "SOC 2 · TYPE II" alongside EU 2024/1689, NIST AI RMF, ISO 42001, GDPR — ambiguous framing
- Header label "CROSS-WALK · PRE-SATISFIED" makes it technically a claim about customer frameworks, not AIComply's own cert
- This is borderline — the context makes it defensible, but visually it reads as a badge row implying AIComply has these certifications
- FAQ in same landing page clearly states "SOC 2 Type II is on the roadmap once we hit 5+ enterprise customers" — this inconsistency within the same page is a medium bug

---

## Journey 8 — Public routes / SEO surface

**Routes verified:**
- `/sitemap.xml` → 200 ✓
- `/risk-tiers` → 200 ✓
- `/trust` → 200 ✓
- `/blog` → 200 ✓
- `/fria-generator` → 200 ✓
- `/dpia-generator` → 200 ✓
- Legal trinity: `/terms`, `/privacy`, `/refund` → 200 ✓

**Dead component found:**
- `src/components/landing/why-us.tsx` — contains ClauseForge (another app) copy
- Not imported/rendered anywhere currently — medium risk if accidentally imported

---

## Journey 9 — Empty states

**Verified:**
- `/dashboard` with 0 systems: renders empty state + "Register your first AI system" CTA ✓
- `/dashboard/ai-systems` with 0 systems: must show CTA
- `/dashboard/literacy` with 0 records: renders "No literacy records yet. Add the first above." ✓
- `/dashboard/annex-iv` with 0 docs: must show CTA (untested)
- `/dashboard/fria` with 0: must show CTA (untested)

---

## Summary of gaps

| # | Severity | Status | Location | Finding |
|---|---|---|---|---|
| 1 | Critical | FIXED | `login-form.tsx:205` | False SOC 2 Type II certification claim |
| 2 | High | OPEN | `checkout/route.ts:14-21` | Auth check after price-ID validation enables enumeration |
| 3 | High | OPEN | `middleware.ts` | `/auth/:path*` matched but updateSession() not skipped early — may break Google OAuth PKCE callbacks |
| 4 | High | OPEN | `launch-readiness.spec.ts:431` | Journey 6 test expects Regulated=$299 but plans.ts says $399 — wrong test expectation |
| 5 | Medium | OPEN | `v2/page.tsx:240` | "SOC 2, TYPE II" in crosswalk badge row without clear "customer cert" framing — inconsistent with same-page FAQ admitting it's "on the roadmap" |
| 6 | Medium | OPEN | `why-us.tsx` | Dead component with ClauseForge branding — wrong product copy, risk if re-imported |
| 7 | Medium | OPEN | `dashboard/literacy/page.tsx` | Literacy form accessible to free tier; plans.ts says free literacy_register=false (read-only) |
| 8 | Low | OPEN | `terms/page.tsx` | Contact email is personal Gmail (alejandroebufarini@gmail.com) — should be alex@piposlab.com for professionalism |
