-- 00015_public_quiz_results — public, shareable verdicts from the EU AI Act
-- risk checker quiz at /free/risk-checker.
--
-- The quiz runs entirely client-side, but capturing the verdict server-side
-- enables (1) shareable permalinks like /quiz-result/[token] (the viral
-- wedge), (2) optional email capture into the lead pipeline, (3) bulk-list
-- consumption by Pilotdeck for cross-portfolio outreach personalization.

set search_path to public, extensions;

create extension if not exists pgcrypto;

create table if not exists public.public_quiz_results (
  id text primary key,
  classification text not null check (
    classification in ('prohibited', 'high', 'limited', 'minimal')
  ),
  -- Yes/no per question. JSONB so the question set can evolve without a schema
  -- change — the renderer reads from a versioned QUIZ_VERSION constant.
  answers jsonb not null,
  quiz_version text not null default 'v1-2026-05-13',
  -- Optional context the visitor types ("ACME Corp's resume screener") shown
  -- on the permalink. Sanitized at write time. Nullable.
  system_label text,
  email_captured text,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days')
);

create index if not exists idx_public_quiz_results_created_at
  on public.public_quiz_results (created_at desc);
create index if not exists idx_public_quiz_results_classification
  on public.public_quiz_results (classification);
create index if not exists idx_public_quiz_results_email_captured
  on public.public_quiz_results (email_captured)
  where email_captured is not null;

-- RLS: rows are publicly readable by token (same model as AccessiScan's
-- public_scan_results). Writes are server-only via service_role.
alter table public.public_quiz_results enable row level security;

drop policy if exists "public_quiz_results read by token" on public.public_quiz_results;
create policy "public_quiz_results read by token"
  on public.public_quiz_results
  for select
  using (true);

comment on table public.public_quiz_results is
  'Public shareable EU AI Act risk-checker verdicts. Powers /quiz-result/[token] permalinks + Pilotdeck lead enrichment. RLS: read-anywhere by token, writes server-only.';
