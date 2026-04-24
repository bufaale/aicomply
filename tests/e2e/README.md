# AIComply E2E tests

End-to-end tests that run against production. Pattern: when you add a new
feature, **add one spec here** and coverage stays honest.

## Running locally

```bash
npm install
npx playwright install --with-deps chromium

npx playwright test                         # cheap smoke tests
RUN_GENERATOR_TESTS=1 npx playwright test   # + live Claude API DPIA/FRIA/Annex IV calls (~$0.03/run)
```

Requires `.env.test.local` (not committed) with Supabase admin creds.

## Coverage map

| Spec | What it covers |
|---|---|
| `auth.spec.ts` | login / signup / forgot-password render |
| `landing.spec.ts` | public marketing pages |
| `navigation.spec.ts` | sidebar nav, dashboard pages |
| `link-audit.spec.ts` | **no 404s** on any internal link across every auth + marketing page |
| `tier-gating.spec.ts` | per-tier matrix (free/pro/business/regulated) × DPIA/FRIA/Annex IV gating (402) × billing label |
| `generators.spec.ts` | **regression test for the 2026-04-24 "AI response did not contain JSON" bug** — POSTs real payloads to /api/dpia, /api/fria, /api/annex-iv and asserts the 16/14/23 required JSON fields. Gated by `RUN_GENERATOR_TESTS=1` because live Claude calls cost money. |
| `dpia.spec.ts` / `fria.spec.ts` / `annex-iv.spec.ts` | 401 on anonymous API calls |
| `ai-systems.spec.ts` | anonymous access blocked |
| `discovery.spec.ts` | Shadow-AI discovery anonymous access |
| `settings.spec.ts` | settings page anonymous access |
| `trust.spec.ts` | public trust page renders |
| `billing.spec.ts` | billing anonymous redirect |

## AIComply tiers

| Tier | Price | Key features |
|---|---|---|
| `free` | $0 | 1 system, 3 classifications/mo |
| `pro` | $79/mo | 20 systems, DPIA + FRIA generators |
| `business` | $199/mo | unlimited, + Annex IV (industrial/high-risk) |
| `regulated` | $399/mo | everything + conformity assessment handoff |

## Adding a test for a new feature

Every new feature MUST ship with at least one spec. Template in the root
monorepo README or `tests/helpers/test-utils.ts`.

## Running the generator regression suite (paid)

The DPIA/FRIA/Annex IV generators each hit Claude Haiku 4.5; a full run of
`generators.spec.ts` costs roughly $0.03. Run it:

- Manually before cutting a release that touches any generator file
- Nightly via CI (the workflow sets `RUN_GENERATOR_TESTS=1` only on
  `schedule` events — see `.github/workflows/e2e.yml`)

These tests were added specifically to prevent the 2026-04-24 regression
where Claude's response occasionally came back with leading prose and the
regex-based JSON extractor crashed with "AI response did not contain JSON".
Fixed with the assistant-prefill pattern in:
- `src/lib/gdpr/dpia-generator.ts`
- `src/lib/eu-ai-act/fria-generator.ts`
- `src/lib/eu-ai-act/annex-iv-generator.ts`
