-- AIComply — Public trust page support.
--
-- Lets a deployer expose a read-only summary of their AI Act compliance posture
-- under a custom slug (aicomply.app/trust/<slug>). No PII, only aggregates:
-- system counts, readiness score, FRIA count, Article 4 literacy records.
--
-- Analogous to Vanta's Trust Center but free on every tier — the hook is that
-- procurement teams increasingly ask for a public compliance page during vendor
-- qualification, and this is the SMB-scale answer.

alter table profiles
  add column if not exists trust_slug text unique,
  add column if not exists trust_enabled boolean not null default false,
  add column if not exists trust_display_name text,
  add column if not exists trust_website text;

create index if not exists profiles_trust_slug_idx on profiles(trust_slug) where trust_slug is not null;

-- Public read policy: anyone (anon included) can see the subset of profile
-- columns needed to render a trust page, BUT ONLY if trust_enabled = true
-- and a trust_slug is set. This intentionally bypasses the owner-only policy
-- because the point is public shareability.
drop policy if exists "public_trust_pages_readable" on profiles;
create policy "public_trust_pages_readable" on profiles
  for select
  using (trust_enabled = true and trust_slug is not null);

comment on column profiles.trust_slug is 'URL slug for the public trust page (aicomply.app/trust/<slug>). Unique. Only exposed when trust_enabled is true.';
comment on column profiles.trust_enabled is 'Master switch for the public trust page. When false, the page returns 404 even if trust_slug is set.';
