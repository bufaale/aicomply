export interface Profile {
  [key: string]: unknown;
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  company_name: string | null;
  company_logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  stripe_customer_id: string | null;
  subscription_status: "active" | "trialing" | "past_due" | "canceled" | "free";
  subscription_plan: string | null;
  role: "user" | "admin";
  // Public trust page (migration 00010)
  trust_slug: string | null;
  trust_enabled: boolean;
  trust_display_name: string | null;
  trust_website: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnnexIvDocument {
  [key: string]: unknown;
  id: string;
  user_id: string;
  system_id: string | null;
  system_intended_purpose: string | null;
  system_developer_identity: string | null;
  system_version_and_date: string | null;
  system_interaction_with_hardware: string | null;
  system_software_versions: string | null;
  system_deployment_forms: string | null;
  system_hardware_description: string | null;
  design_methods_and_steps: string | null;
  design_specifications: string | null;
  system_architecture: string | null;
  data_requirements: string | null;
  human_oversight_assessment: string | null;
  accuracy_and_performance_metrics: string | null;
  capabilities_and_limitations: string | null;
  degrees_of_accuracy: string | null;
  foreseeable_unintended_outcomes: string | null;
  specifications_input_data: string | null;
  risk_management_description: string | null;
  lifecycle_changes: string | null;
  harmonised_standards_applied: string | null;
  conformity_assessment_procedure: string | null;
  conformity_assessment_changes: string | null;
  post_market_monitoring_plan: string | null;
  additional_information: string | null;
  status: "draft" | "in_review" | "approved" | "superseded";
  reviewer_email: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DpiaAssessment {
  [key: string]: unknown;
  id: string;
  user_id: string;
  system_id: string | null;
  processing_description: string | null;
  processing_purposes: string | null;
  data_categories: string | null;
  data_subjects: string | null;
  recipients: string | null;
  retention_period: string | null;
  international_transfers: string | null;
  legal_basis: string | null;
  necessity_justification: string | null;
  proportionality_assessment: string | null;
  data_minimisation: string | null;
  rights_at_risk: string | null;
  risk_scenarios: string | null;
  likelihood_severity: string | null;
  technical_measures: string | null;
  organisational_measures: string | null;
  data_subject_rights: string | null;
  breach_procedure: string | null;
  dpo_consultation: string | null;
  status: "draft" | "in_review" | "approved" | "superseded";
  reviewer_email: string | null;
  reviewed_at: string | null;
  supervisory_authority_consulted: boolean;
  supervisory_consultation_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface FriaAssessment {
  [key: string]: unknown;
  id: string;
  user_id: string;
  system_id: string | null;
  system_description: string | null;
  deployment_purpose: string | null;
  deployment_duration: string | null;
  affected_groups: string | null;
  frequency_of_use: string | null;
  rights_at_risk: string | null;
  harm_scenarios: string | null;
  oversight_measures: string | null;
  oversight_personnel: string | null;
  mitigation_measures: string | null;
  escalation_procedure: string | null;
  governance_framework: string | null;
  complaint_mechanism: string | null;
  status: "draft" | "in_review" | "approved" | "superseded";
  reviewer_email: string | null;
  reviewed_at: string | null;
  notified_authority_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  [key: string]: unknown;
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  status: "active" | "trialing" | "past_due" | "canceled" | "incomplete";
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export type RiskTier =
  | "unacceptable"
  | "high"
  | "limited"
  | "minimal"
  | "unclassified";

export type DeploymentType =
  | "saas"
  | "self_hosted"
  | "api"
  | "plugin"
  | "informal";

export interface AISystem {
  [key: string]: unknown;
  id: string;
  user_id: string;
  name: string;
  vendor: string | null;
  purpose: string;
  usage_context: string | null;
  data_inputs: string | null;
  data_outputs: string | null;
  business_units: string | null;
  ai_provider: string | null;
  base_model: string | null;
  deployment_type: DeploymentType;
  owner_email: string | null;
  risk_tier: RiskTier;
  risk_rationale: string | null;
  classified_at: string | null;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AISystemObligation {
  [key: string]: unknown;
  id: string;
  system_id: string;
  user_id: string;
  article: string;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed" | "not_applicable";
  evidence_url: string | null;
  notes: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface AILiteracyRecord {
  [key: string]: unknown;
  id: string;
  user_id: string;
  person_name: string;
  role: string | null;
  department: string | null;
  training_topic: string;
  training_date: string;
  evidence_url: string | null;
  notes: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; email: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      subscriptions: {
        Row: Subscription;
        Insert: Partial<Subscription> & {
          user_id: string;
          stripe_subscription_id: string;
          stripe_price_id: string;
        };
        Update: Partial<Subscription>;
        Relationships: [];
      };
      ai_systems: {
        Row: AISystem;
        Insert: Partial<AISystem> & {
          user_id: string;
          name: string;
          purpose: string;
        };
        Update: Partial<AISystem>;
        Relationships: [];
      };
      ai_system_obligations: {
        Row: AISystemObligation;
        Insert: Partial<AISystemObligation> & {
          system_id: string;
          user_id: string;
          article: string;
          title: string;
        };
        Update: Partial<AISystemObligation>;
        Relationships: [];
      };
      ai_literacy_records: {
        Row: AILiteracyRecord;
        Insert: Partial<AILiteracyRecord> & {
          user_id: string;
          person_name: string;
          training_topic: string;
          training_date: string;
        };
        Update: Partial<AILiteracyRecord>;
        Relationships: [];
      };
      fria_assessments: {
        Row: FriaAssessment;
        Insert: Partial<FriaAssessment> & { user_id: string };
        Update: Partial<FriaAssessment>;
        Relationships: [];
      };
      dpia_assessments: {
        Row: DpiaAssessment;
        Insert: Partial<DpiaAssessment> & { user_id: string };
        Update: Partial<DpiaAssessment>;
        Relationships: [];
      };
      annex_iv_documents: {
        Row: AnnexIvDocument;
        Insert: Partial<AnnexIvDocument> & { user_id: string };
        Update: Partial<AnnexIvDocument>;
        Relationships: [];
      };
    };
    /* eslint-disable @typescript-eslint/no-empty-object-type */
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
    /* eslint-enable @typescript-eslint/no-empty-object-type */
  };
  PostgrestVersion: "12";
}
