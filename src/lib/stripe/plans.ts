export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: { monthly: number; yearly: number };
  stripePriceId: { monthly: string; yearly: string };
  features: string[];
  limits: {
    systems_max: number;
    classifications_per_month: number;
    dpia_export: boolean;
    fria_export: boolean;
    literacy_register: boolean;
    team_seats: number;
  };
  highlighted?: boolean;
  cta: string;
  /** When true, CTA links to contact form instead of Stripe Checkout. */
  contactSales?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Map your first AI system and see what the EU AI Act requires",
    price: { monthly: 0, yearly: 0 },
    stripePriceId: { monthly: "", yearly: "" },
    features: [
      "1 AI system tracked",
      "Auto risk classification",
      "Article 4 literacy register (read-only)",
      "Basic compliance checklist",
    ],
    limits: {
      systems_max: 1,
      classifications_per_month: 3,
      dpia_export: false,
      fria_export: false,
      literacy_register: false,
      team_seats: 1,
    },
    cta: "Start free",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For SMBs with a handful of AI tools",
    price: { monthly: 79, yearly: 790 },
    stripePriceId: {
      monthly: (process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || "").trim(),
      yearly: (process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || "").trim(),
    },
    features: [
      "Up to 20 AI systems tracked",
      "Unlimited re-classification",
      "Article 4 AI literacy register",
      "FRIA generator (Art. 27) — 3 per month",
      "Compliance checklist per system",
      "PDF export of inventory",
      "Public trust page (aicomply.piposlab.com/trust/...)",
      "Email support",
    ],
    limits: {
      systems_max: 20,
      classifications_per_month: Infinity,
      dpia_export: false,
      fria_export: true,
      literacy_register: true,
      team_seats: 3,
    },
    highlighted: true,
    cta: "Start free — upgrade anytime",
  },
  {
    id: "business",
    name: "Business",
    description: "For teams with high-risk systems under Article 6",
    price: { monthly: 199, yearly: 1990 },
    stripePriceId: {
      monthly: (process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID || "").trim(),
      yearly: (process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID || "").trim(),
    },
    features: [
      "Unlimited AI systems",
      "DPIA generator (GDPR Art. 35)",
      "Unlimited FRIAs (Art. 27 EU AI Act)",
      "Audit-ready evidence vault",
      "Public compliance page",
      "White-label PDF reports",
      "API access",
      "Priority support",
    ],
    limits: {
      systems_max: Infinity,
      classifications_per_month: Infinity,
      dpia_export: true,
      fria_export: true,
      literacy_register: true,
      team_seats: 10,
    },
    cta: "Go Business",
  },
  {
    id: "regulated",
    name: "Regulated",
    description: "Public bodies, credit scoring, insurance pricing — full deployer pack",
    price: { monthly: 399, yearly: 3990 },
    stripePriceId: {
      monthly: (process.env.NEXT_PUBLIC_STRIPE_REGULATED_MONTHLY_PRICE_ID || "").trim(),
      yearly: (process.env.NEXT_PUBLIC_STRIPE_REGULATED_YEARLY_PRICE_ID || "").trim(),
    },
    features: [
      "Everything in Business",
      "Annex IV technical documentation pack",
      "Conformity assessment workflow (Annex VI self-cert)",
      "Notified-body handoff package",
      "Harmonised-standards cross-walk (prEN 18286, ISO 42001, NIST AI RMF)",
      "GPAI upstream-model signatory tracking",
      "Authority notification templates (Art. 27(3))",
      "Dedicated DPO reviewer account",
      "Priority SLA — next-business-day",
    ],
    limits: {
      systems_max: Infinity,
      classifications_per_month: Infinity,
      dpia_export: true,
      fria_export: true,
      literacy_register: true,
      team_seats: 25,
    },
    cta: "Contact for regulated",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Multi-jurisdiction compliance ops + GPAI signatory + indemnity insurance",
    price: { monthly: 4999, yearly: 49990 },
    stripePriceId: { monthly: "", yearly: "" },
    features: [
      "Everything in Regulated",
      "Multi-jurisdiction matrix (EU + UK + US state laws)",
      "E&O indemnity insurance partner intro (up to €1M)",
      "Custom Annex IV templates per business unit",
      "GPAI upstream signatory orchestration",
      "Slack Connect channel + dedicated success engineer",
      "Quarterly executive compliance review",
      "Custom SLA + 24/7 incident response",
      "Unlimited team seats",
    ],
    limits: {
      systems_max: Infinity,
      classifications_per_month: Infinity,
      dpia_export: true,
      fria_export: true,
      literacy_register: true,
      team_seats: Infinity,
    },
    cta: "Contact sales",
    contactSales: true,
  },
];

export function getPlanByPriceId(priceId: string): PricingPlan | undefined {
  return pricingPlans.find(
    (p) =>
      p.stripePriceId.monthly === priceId ||
      p.stripePriceId.yearly === priceId,
  );
}

export function getUserPlan(subscriptionPlan: string | null): PricingPlan {
  return pricingPlans.find((p) => p.id === subscriptionPlan) || pricingPlans[0];
}
