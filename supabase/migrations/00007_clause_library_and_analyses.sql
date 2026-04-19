-- ============================================================
-- Clause Library (reusable clauses)
-- ============================================================
create table public.clause_library (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  title text not null,
  category text not null,
  content text not null,
  contract_type text check (contract_type in ('nda', 'service_agreement', 'sow', 'freelance', 'custom')),
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.clause_library enable row level security;
create policy "Users can view system and own clauses" on public.clause_library
  for select using (is_system = true or auth.uid() = user_id);
create policy "Users can insert own clauses" on public.clause_library
  for insert with check (auth.uid() = user_id and is_system = false);
create policy "Users can update own clauses" on public.clause_library
  for update using (auth.uid() = user_id and is_system = false);
create policy "Users can delete own clauses" on public.clause_library
  for delete using (auth.uid() = user_id and is_system = false);

-- ============================================================
-- Contract Analyses (red-flag detection results)
-- ============================================================
create table public.contract_analyses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  contract_id uuid references public.contracts(id) on delete set null,
  original_text text not null,
  analysis jsonb not null default '{}'::jsonb,
  risk_score integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.contract_analyses enable row level security;
create policy "Users can manage own analyses" on public.contract_analyses
  for all using (auth.uid() = user_id);

-- ============================================================
-- Seed system clauses (20 standard legal clauses)
-- ============================================================
insert into public.clause_library (user_id, title, category, content, contract_type, is_system) values
(null, 'Confidentiality', 'protection', 'Each party agrees to maintain the confidentiality of all proprietary and confidential information disclosed by the other party. Confidential Information shall not be disclosed to any third party without the prior written consent of the disclosing party. This obligation shall survive the termination of this Agreement for a period of two (2) years.', null, true),

(null, 'Non-Disclosure', 'protection', 'The Receiving Party shall not, without the prior written consent of the Disclosing Party, disclose any Confidential Information to any person or entity, except to its employees, agents, or representatives who have a need to know such information and who are bound by obligations of confidentiality at least as restrictive as those set forth herein.', 'nda', true),

(null, 'Non-Compete', 'restriction', 'During the term of this Agreement and for a period of twelve (12) months following its termination, the Contractor agrees not to engage in any business or activity that directly competes with the Client''s business within the defined geographic area.', 'freelance', true),

(null, 'Non-Solicitation', 'restriction', 'For a period of twelve (12) months following the termination of this Agreement, neither party shall directly or indirectly solicit, recruit, or hire any employee, contractor, or consultant of the other party who was involved in the performance of this Agreement.', null, true),

(null, 'Indemnification', 'liability', 'Each party (the "Indemnifying Party") shall indemnify, defend, and hold harmless the other party (the "Indemnified Party") from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys'' fees) arising out of or relating to the Indemnifying Party''s breach of this Agreement or negligent acts or omissions.', null, true),

(null, 'Limitation of Liability', 'liability', 'IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO THIS AGREEMENT. THE TOTAL AGGREGATE LIABILITY OF EITHER PARTY SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE UNDER THIS AGREEMENT DURING THE TWELVE (12) MONTHS PRECEDING THE CLAIM.', null, true),

(null, 'Termination for Cause', 'termination', 'Either party may terminate this Agreement immediately upon written notice if the other party: (a) materially breaches any provision of this Agreement and fails to cure such breach within thirty (30) days after receiving written notice thereof; or (b) becomes insolvent, files for bankruptcy, or has a receiver appointed for its assets.', null, true),

(null, 'Termination for Convenience', 'termination', 'Either party may terminate this Agreement for any reason or no reason upon thirty (30) days'' prior written notice to the other party. Upon such termination, the Client shall pay the Contractor for all services performed and expenses incurred through the effective date of termination.', 'service_agreement', true),

(null, 'Intellectual Property Assignment', 'ip', 'All work product, deliverables, inventions, and materials created by the Contractor in connection with this Agreement shall be considered "work made for hire" and shall be the sole and exclusive property of the Client. To the extent any work product does not qualify as work made for hire, the Contractor hereby irrevocably assigns all right, title, and interest therein to the Client.', 'freelance', true),

(null, 'Work for Hire', 'ip', 'The parties acknowledge and agree that all works of authorship, including but not limited to software, documentation, and creative content, created by the Service Provider under this Agreement are "works made for hire" as defined by the U.S. Copyright Act. All intellectual property rights in such works shall vest exclusively in the Client from the moment of creation.', null, true),

(null, 'Payment Terms', 'financial', 'The Client shall pay the Contractor within thirty (30) days of receipt of each invoice. All invoices shall itemize the services performed and expenses incurred. Payment shall be made via bank transfer or other mutually agreed-upon method. Overdue payments shall accrue interest at the rate of 1.5% per month or the maximum rate permitted by law, whichever is less.', null, true),

(null, 'Late Payment', 'financial', 'If any payment is not received within fifteen (15) days after the due date, the Service Provider may: (a) charge interest on the overdue amount at the rate of 1.5% per month; (b) suspend performance of services until all outstanding payments are received; and (c) recover all costs of collection, including reasonable attorneys'' fees.', null, true),

(null, 'Force Majeure', 'general', 'Neither party shall be liable for any failure or delay in performing its obligations under this Agreement if such failure or delay results from circumstances beyond the reasonable control of that party, including but not limited to acts of God, natural disasters, war, terrorism, riots, epidemics, government actions, power failures, or internet disruptions.', null, true),

(null, 'Dispute Resolution - Arbitration', 'dispute', 'Any dispute, controversy, or claim arising out of or relating to this Agreement shall be settled by binding arbitration administered by the American Arbitration Association in accordance with its Commercial Arbitration Rules. The arbitration shall be conducted in [City, State], and the decision of the arbitrator shall be final and binding upon both parties.', null, true),

(null, 'Dispute Resolution - Mediation', 'dispute', 'In the event of any dispute arising out of or relating to this Agreement, the parties shall first attempt to resolve the dispute through good faith negotiation. If the dispute cannot be resolved within thirty (30) days, the parties agree to submit the dispute to mediation before resorting to arbitration or litigation.', null, true),

(null, 'Governing Law', 'general', 'This Agreement shall be governed by and construed in accordance with the laws of the State of [State], without regard to its conflict of laws principles. Any legal action or proceeding arising under this Agreement shall be brought exclusively in the courts located in [County], [State].', null, true),

(null, 'Entire Agreement', 'general', 'This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior negotiations, representations, warranties, commitments, offers, contracts, and writings, whether written or oral, with respect to the subject matter hereof.', null, true),

(null, 'Amendment', 'general', 'This Agreement may not be amended, modified, or supplemented except by a written instrument signed by both parties. No waiver of any provision of this Agreement shall be effective unless made in writing and signed by the waiving party.', null, true),

(null, 'Severability', 'general', 'If any provision of this Agreement is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such invalidity shall not affect the validity of the remaining provisions, which shall continue in full force and effect. The parties agree to negotiate in good faith a substitute provision that most nearly reflects the original intent.', null, true),

(null, 'Waiver', 'general', 'The failure of either party to enforce any provision of this Agreement shall not be construed as a waiver of such provision or the right to enforce it at a later time. No waiver of any breach shall be deemed a waiver of any subsequent breach of the same or a different provision.', null, true);
