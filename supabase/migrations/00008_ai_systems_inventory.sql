-- AIComply — EU AI Act inventory schema
-- Every AI tool, plugin, or informal usage the organization relies on.
-- Risk tier maps to the EU AI Act 4-tier taxonomy (unacceptable / high / limited / minimal).

create table if not exists ai_systems (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  vendor text,
  purpose text not null,
  usage_context text,
  data_inputs text,
  data_outputs text,
  business_units text,
  ai_provider text,
  base_model text,
  deployment_type text not null default 'saas'
    check (deployment_type in ('saas', 'self_hosted', 'api', 'plugin', 'informal')),
  owner_email text,
  risk_tier text check (risk_tier in ('unacceptable', 'high', 'limited', 'minimal', 'unclassified'))
    not null default 'unclassified',
  risk_rationale text,
  classified_at timestamptz,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_systems_user_idx on ai_systems(user_id);
create index if not exists ai_systems_risk_idx on ai_systems(user_id, risk_tier);

create table if not exists ai_system_obligations (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references ai_systems(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  article text not null,
  title text not null,
  description text,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed', 'not_applicable')),
  evidence_url text,
  notes text,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists ai_system_obligations_system_idx on ai_system_obligations(system_id);
create index if not exists ai_system_obligations_user_idx on ai_system_obligations(user_id, status);

create table if not exists ai_literacy_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  person_name text not null,
  role text,
  department text,
  training_topic text not null,
  training_date date not null,
  evidence_url text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists ai_literacy_user_idx on ai_literacy_records(user_id, training_date desc);

alter table ai_systems enable row level security;
alter table ai_system_obligations enable row level security;
alter table ai_literacy_records enable row level security;

create policy "ai_systems_owner" on ai_systems
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ai_system_obligations_owner" on ai_system_obligations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ai_literacy_owner" on ai_literacy_records
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger set_ai_systems_updated_at
  before update on ai_systems
  for each row execute function update_updated_at();

comment on table ai_systems is 'AI tools tracked for EU AI Act compliance. Risk tier follows Articles 5-8 taxonomy.';
comment on column ai_systems.risk_tier is 'unacceptable (Art. 5, prohibited), high (Art. 6, Annex III), limited (transparency obligations Art. 50), minimal (no obligations beyond Art. 4 literacy).';
comment on table ai_system_obligations is 'Concrete compliance actions per AI system — documentation, DPIA, transparency notice, etc.';
comment on table ai_literacy_records is 'Article 4 AI literacy training evidence. Required for all staff using AI systems since February 2, 2025.';
