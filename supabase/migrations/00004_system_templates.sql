insert into public.templates (user_id, name, description, contract_type, clauses_schema, is_public) values
(
  null,
  'Non-Disclosure Agreement (NDA)',
  'Standard mutual or unilateral NDA for protecting confidential information between parties.',
  'nda',
  '[
    {"type": "definitions", "title": "Definitions", "prompt_hint": "Define Confidential Information, Disclosing Party, Receiving Party"},
    {"type": "obligations", "title": "Obligations of Receiving Party", "prompt_hint": "Non-disclosure, non-use, and protection obligations"},
    {"type": "exclusions", "title": "Exclusions from Confidential Information", "prompt_hint": "Public knowledge, independent development, prior possession, authorized disclosure"},
    {"type": "term", "title": "Term and Termination", "prompt_hint": "Duration of the agreement and survival period"},
    {"type": "return_materials", "title": "Return of Materials", "prompt_hint": "Obligations to return or destroy confidential materials"},
    {"type": "remedies", "title": "Remedies", "prompt_hint": "Injunctive relief and damages for breach"},
    {"type": "general", "title": "General Provisions", "prompt_hint": "Governing law, entire agreement, amendments, severability"}
  ]'::jsonb,
  true
),
(
  null,
  'Service Agreement',
  'General services agreement covering deliverables, payment terms, and standard legal protections.',
  'service_agreement',
  '[
    {"type": "scope", "title": "Scope of Services", "prompt_hint": "Define the services to be provided, deliverables, and exclusions"},
    {"type": "payment", "title": "Payment Terms", "prompt_hint": "Fees, payment schedule, invoicing, late payment penalties"},
    {"type": "timeline", "title": "Timeline and Milestones", "prompt_hint": "Project timeline, key milestones, and delivery dates"},
    {"type": "ip", "title": "Intellectual Property", "prompt_hint": "IP ownership, work for hire, license grants"},
    {"type": "confidentiality", "title": "Confidentiality", "prompt_hint": "Mutual confidentiality obligations"},
    {"type": "termination", "title": "Termination", "prompt_hint": "Termination for cause, for convenience, and effects of termination"},
    {"type": "liability", "title": "Limitation of Liability", "prompt_hint": "Cap on liability, exclusion of consequential damages"},
    {"type": "general", "title": "General Provisions", "prompt_hint": "Governing law, dispute resolution, force majeure, notices"}
  ]'::jsonb,
  true
),
(
  null,
  'Statement of Work (SOW)',
  'Project-specific scope document with milestones, acceptance criteria, and deliverable timelines.',
  'sow',
  '[
    {"type": "overview", "title": "Project Overview", "prompt_hint": "High-level summary of the project, objectives, and success criteria"},
    {"type": "scope", "title": "Scope of Work", "prompt_hint": "Detailed scope including in-scope and out-of-scope items"},
    {"type": "deliverables", "title": "Deliverables", "prompt_hint": "List all deliverables with descriptions and acceptance criteria"},
    {"type": "milestones", "title": "Milestones and Timeline", "prompt_hint": "Project phases, milestones, deadlines, and dependencies"},
    {"type": "resources", "title": "Resources and Responsibilities", "prompt_hint": "Team assignments, client responsibilities, and key contacts"},
    {"type": "payment", "title": "Payment Schedule", "prompt_hint": "Milestone-based payment schedule with amounts"},
    {"type": "acceptance", "title": "Acceptance Criteria", "prompt_hint": "Testing and approval process for each deliverable"},
    {"type": "change_management", "title": "Change Management", "prompt_hint": "Process for handling scope changes and change orders"}
  ]'::jsonb,
  true
),
(
  null,
  'Freelance Contract',
  'Independent contractor agreement with IP assignment, payment schedule, and clear work boundaries.',
  'freelance',
  '[
    {"type": "engagement", "title": "Engagement Terms", "prompt_hint": "Nature of relationship, independent contractor status, no employment relationship"},
    {"type": "scope", "title": "Services and Deliverables", "prompt_hint": "Detailed description of work, deliverables, and quality standards"},
    {"type": "payment", "title": "Compensation and Payment", "prompt_hint": "Rate, payment schedule, invoicing, expenses, taxes"},
    {"type": "ip", "title": "Intellectual Property Assignment", "prompt_hint": "Full IP assignment, work for hire, moral rights waiver"},
    {"type": "confidentiality", "title": "Confidentiality", "prompt_hint": "Non-disclosure obligations during and after engagement"},
    {"type": "non_compete", "title": "Non-Compete and Non-Solicitation", "prompt_hint": "Restrictions on competing work and client solicitation"},
    {"type": "termination", "title": "Termination", "prompt_hint": "Notice period, payment on termination, deliverable handover"},
    {"type": "general", "title": "General Provisions", "prompt_hint": "Governing law, dispute resolution, indemnification, insurance"}
  ]'::jsonb,
  true
),
(
  null,
  'Custom Contract',
  'Blank contract template — define your own clauses from scratch or import from the clause library.',
  'custom',
  '[
    {"type": "recitals", "title": "Recitals", "prompt_hint": "Background and purpose of the agreement"},
    {"type": "terms", "title": "Terms and Conditions", "prompt_hint": "Core terms of the agreement"},
    {"type": "obligations", "title": "Obligations", "prompt_hint": "Obligations of each party"},
    {"type": "general", "title": "General Provisions", "prompt_hint": "Governing law, severability, entire agreement, amendments"}
  ]'::jsonb,
  true
);
