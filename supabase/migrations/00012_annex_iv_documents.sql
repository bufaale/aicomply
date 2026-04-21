-- AIComply — Annex IV technical documentation pack (EU AI Act Art. 11).
--
-- Providers of high-risk AI systems must maintain technical documentation per
-- Article 11 of Regulation (EU) 2024/1689. Annex IV lists the nine mandatory
-- sections. This is a PROVIDER-side obligation, distinct from Art. 27 FRIA
-- (deployer-side). Deployers may still need this pack when they fine-tune a
-- GPAI model (which makes them a provider per Art. 3(68)(b)) or when they
-- build their own high-risk system.

create table if not exists annex_iv_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  system_id uuid references ai_systems(id) on delete set null,

  -- Annex IV § 1 — general description
  system_intended_purpose text,
  system_developer_identity text,
  system_version_and_date text,
  system_interaction_with_hardware text,
  system_software_versions text,
  system_deployment_forms text,
  system_hardware_description text,

  -- Annex IV § 2 — design and development
  design_methods_and_steps text,
  design_specifications text,
  system_architecture text,
  data_requirements text,
  human_oversight_assessment text,
  accuracy_and_performance_metrics text,

  -- Annex IV § 3 — monitoring, functioning, control
  capabilities_and_limitations text,
  degrees_of_accuracy text,
  foreseeable_unintended_outcomes text,
  specifications_input_data text,

  -- Annex IV § 4 — risk management system (Art. 9)
  risk_management_description text,

  -- Annex IV § 5 — lifecycle changes
  lifecycle_changes text,

  -- Annex IV § 6 — harmonised standards
  harmonised_standards_applied text,

  -- Annex IV § 7 — conformity assessment
  conformity_assessment_procedure text,
  conformity_assessment_changes text,

  -- Annex IV § 8 — post-market monitoring
  post_market_monitoring_plan text,

  -- Annex IV § 9 — additional information
  additional_information text,

  status text not null default 'draft'
    check (status in ('draft', 'in_review', 'approved', 'superseded')),
  reviewer_email text,
  reviewed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists annex_iv_user_idx on annex_iv_documents(user_id, updated_at desc);
create index if not exists annex_iv_system_idx on annex_iv_documents(system_id);

alter table annex_iv_documents enable row level security;

create policy "annex_iv_owner" on annex_iv_documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger set_annex_iv_updated_at
  before update on annex_iv_documents
  for each row execute function update_updated_at();

comment on table annex_iv_documents is 'EU AI Act Art. 11 + Annex IV technical documentation for providers of high-risk AI systems. Must be kept current through the system lifecycle.';
