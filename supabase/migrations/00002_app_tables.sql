-- ============================================================
-- Clients (CRM lite)
-- ============================================================
create table public.clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  email text,
  company text,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.clients enable row level security;
create policy "Users can manage own clients" on public.clients
  for all using (auth.uid() = user_id);

-- ============================================================
-- Templates
-- ============================================================
create table public.templates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  name text not null,
  description text,
  contract_type text check (contract_type in ('nda', 'service_agreement', 'sow', 'freelance', 'custom')),
  clauses_schema jsonb not null default '[]'::jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.templates enable row level security;
create policy "Users can view accessible templates" on public.templates
  for select using (user_id is null or auth.uid() = user_id);
create policy "Users can manage own templates" on public.templates
  for insert with check (auth.uid() = user_id);
create policy "Users can update own templates" on public.templates
  for update using (auth.uid() = user_id);
create policy "Users can delete own templates" on public.templates
  for delete using (auth.uid() = user_id);

-- ============================================================
-- Contracts
-- ============================================================
create table public.contracts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid references public.clients(id) on delete set null,
  template_id uuid references public.templates(id) on delete set null,
  title text not null,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'viewed', 'signed', 'declined')),
  clauses jsonb not null default '[]'::jsonb,
  contract_type text not null default 'custom'
    check (contract_type in ('nda', 'service_agreement', 'sow', 'freelance', 'custom')),
  governing_law text,
  effective_date date,
  expiration_date date,
  share_token text unique,
  share_password text,
  brand_settings jsonb not null default '{}'::jsonb,
  brief jsonb,
  signatory_name text,
  signatory_email text,
  signed_at timestamptz,
  signature_ip text,
  countersigned_at timestamptz,
  countersigner_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contracts enable row level security;
create policy "Users can manage own contracts" on public.contracts
  for all using (auth.uid() = user_id);

create trigger contracts_updated_at
  before update on public.contracts
  for each row execute procedure public.update_updated_at();

create index idx_contracts_share_token on public.contracts(share_token)
  where share_token is not null;

-- ============================================================
-- Contract Events (tracking)
-- ============================================================
create table public.contract_events (
  id uuid primary key default uuid_generate_v4(),
  contract_id uuid references public.contracts(id) on delete cascade not null,
  event_type text not null
    check (event_type in ('viewed', 'signed', 'declined', 'commented')),
  viewer_ip text,
  viewer_ua text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.contract_events enable row level security;
create policy "Contract owners can view events" on public.contract_events
  for select using (
    exists (
      select 1 from public.contracts
      where contracts.id = contract_events.contract_id
        and contracts.user_id = auth.uid()
    )
  );

-- ============================================================
-- Contract Comments
-- ============================================================
create table public.contract_comments (
  id uuid primary key default uuid_generate_v4(),
  contract_id uuid references public.contracts(id) on delete cascade not null,
  author_name text not null,
  author_email text,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.contract_comments enable row level security;
create policy "Contract owners can view comments" on public.contract_comments
  for select using (
    exists (
      select 1 from public.contracts
      where contracts.id = contract_comments.contract_id
        and contracts.user_id = auth.uid()
    )
  );
