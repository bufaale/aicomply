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
