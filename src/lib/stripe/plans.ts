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
    literacy_register: boolean;
    team_seats: number;
  };
  highlighted?: boolean;
  cta: string;
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
      literacy_register: false,
      team_seats: 1,
    },
    cta: "Start free",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For SMBs with a handful of AI tools",
    price: { monthly: 49, yearly: 490 },
    stripePriceId: {
      monthly: (process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || "").trim(),
      yearly: (process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || "").trim(),
    },
    features: [
      "Up to 20 AI systems tracked",
      "Unlimited re-classification",
      "Article 4 AI literacy register",
      "Compliance checklist per system",
      "PDF export of inventory",
      "Email support",
    ],
    limits: {
      systems_max: 20,
      classifications_per_month: Infinity,
      dpia_export: false,
      literacy_register: true,
      team_seats: 3,
    },
    highlighted: true,
    cta: "Start 14-day trial",
  },
  {
    id: "business",
    name: "Business",
    description: "For teams with high-risk systems under Article 6",
    price: { monthly: 149, yearly: 1490 },
    stripePriceId: {
      monthly: (process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID || "").trim(),
      yearly: (process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID || "").trim(),
    },
    features: [
      "Unlimited AI systems",
      "DPIA generator (GDPR Art. 35)",
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
      literacy_register: true,
      team_seats: 10,
    },
    cta: "Go Business",
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
