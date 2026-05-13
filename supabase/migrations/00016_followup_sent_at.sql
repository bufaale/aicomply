-- 00016_followup_sent_at — per-row state for /api/cron/lead-followups.
--
-- After a visitor claims their quiz verdict by email, we wait 3 days
-- then send a polite "did the verdict help — want to chat about
-- compliance tooling?" follow-up. This column records when that nudge
-- went out so we never double-send.

alter table public.public_quiz_results
  add column if not exists followup_sent_at timestamptz;

comment on column public.public_quiz_results.followup_sent_at is
  '3-day captured-email follow-up tracker. Set when /api/cron/lead-followups sends the nudge email.';

create index if not exists idx_public_quiz_results_followup_pending
  on public.public_quiz_results (created_at)
  where email_captured is not null and followup_sent_at is null;
