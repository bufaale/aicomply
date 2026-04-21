-- AIComply — Data Protection Impact Assessment (DPIA) per GDPR Article 35.
--
-- DPIAs are required by Art. 35(1) "where a type of processing is likely to
-- result in a high risk to the rights and freedoms of natural persons".
-- Common triggers (Art. 35(3)): large-scale profiling, processing special
-- category data, monitoring public areas, and the supervisory authority's
-- positive list (Art. 35(4)) — which in most EU member states is broad.
--
-- Per Art. 35(7), a DPIA must contain:
--   (a) systematic description of the envisaged processing + purposes
--   (b) assessment of necessity and proportionality
--   (c) assessment of the risks to the rights and freedoms of data subjects
--   (d) measures envisaged to address the risks
--
-- This table mirrors the FRIA structure — deployer owner, status lifecycle,
-- optional link to an ai_system. Keeping DPIA separate from FRIA because a
-- single processing operation can require a DPIA (GDPR) AND a FRIA (AI Act)
-- concurrently.

create table if not exists dpia_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  system_id uuid references ai_systems(id) on delete set null,

  -- Art. 35(7)(a) — systematic description + purposes
  processing_description text,
  processing_purposes text,
  data_categories text,
  data_subjects text,
  recipients text,
  retention_period text,
  international_transfers text,

  -- Art. 35(7)(b) — necessity and proportionality
  legal_basis text,
  necessity_justification text,
  proportionality_assessment text,
  data_minimisation text,

  -- Art. 35(7)(c) — risks to rights and freedoms
  rights_at_risk text,
  risk_scenarios text,
  likelihood_severity text,

  -- Art. 35(7)(d) — mitigation measures
  technical_measures text,
  organisational_measures text,
  data_subject_rights text,
  breach_procedure text,
  dpo_consultation text,

  -- Meta
  status text not null default 'draft'
    check (status in ('draft', 'in_review', 'approved', 'superseded')),
  reviewer_email text,
  reviewed_at timestamptz,
  supervisory_authority_consulted boolean not null default false,
  supervisory_consultation_date timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dpia_user_idx on dpia_assessments(user_id, updated_at desc);
create index if not exists dpia_system_idx on dpia_assessments(system_id);

alter table dpia_assessments enable row level security;

create policy "dpia_owner" on dpia_assessments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger set_dpia_updated_at
  before update on dpia_assessments
  for each row execute function update_updated_at();

comment on table dpia_assessments is 'GDPR Article 35 Data Protection Impact Assessment. Required when processing is likely high-risk to data subjects.';
comment on column dpia_assessments.supervisory_authority_consulted is 'Art. 36 mandates prior consultation with the supervisory authority when residual risk remains high after mitigation.';
