-- AIComply — Fundamental Rights Impact Assessment (FRIA) per EU AI Act Article 27.
--
-- FRIA is a deployer obligation for high-risk AI systems referenced in Annex III,
-- specifically for public bodies and for private actors using high-risk systems in
-- credit scoring, life/health insurance pricing, and certain other cases.
--
-- This table stores the five-part FRIA artifact required by Art. 27(1)(a)-(e),
-- plus metadata for review and export. Deployer obligations enter into force on
-- August 2, 2026.

create table if not exists fria_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  system_id uuid references ai_systems(id) on delete set null,

  -- Art. 27(1)(a) — description of the deployer's processes
  system_description text,
  deployment_purpose text,
  deployment_duration text,
  affected_groups text,
  frequency_of_use text,

  -- Art. 27(1)(b) — specific risks to fundamental rights
  rights_at_risk text,
  harm_scenarios text,

  -- Art. 27(1)(c) — human oversight measures per Art. 14
  oversight_measures text,
  oversight_personnel text,

  -- Art. 27(1)(d) — mitigation measures if risks materialize
  mitigation_measures text,
  escalation_procedure text,

  -- Art. 27(1)(e) — governance + complaint mechanisms per Art. 26
  governance_framework text,
  complaint_mechanism text,

  -- Meta
  status text not null default 'draft'
    check (status in ('draft', 'in_review', 'approved', 'superseded')),
  reviewer_email text,
  reviewed_at timestamptz,
  notified_authority_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fria_user_idx on fria_assessments(user_id, updated_at desc);
create index if not exists fria_system_idx on fria_assessments(system_id);

alter table fria_assessments enable row level security;

create policy "fria_owner" on fria_assessments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger set_fria_updated_at
  before update on fria_assessments
  for each row execute function update_updated_at();

comment on table fria_assessments is 'Article 27 Fundamental Rights Impact Assessment. Deployer obligation for high-risk AI systems, enforceable Aug 2, 2026.';
comment on column fria_assessments.status is 'draft = work in progress; in_review = handed to reviewer; approved = signed off; superseded = replaced by a newer assessment for the same system.';
comment on column fria_assessments.notified_authority_at is 'Timestamp when the national market surveillance authority was notified per Art. 27(3) — required on completion.';
