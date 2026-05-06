/**
 * Regression guard: every NEXT_PUBLIC_STRIPE_*_PRICE_ID env var must
 * resolve to an active Stripe price.
 *
 * Found 4 orphaned IDs on 2026-05-06 (Pro monthly/yearly + Business
 * monthly/yearly + Regulated monthly/yearly all pointed at non-existent
 * prices from a different Stripe account suffix). Any visitor clicking
 * "Start 14-day trial" on /pricing would have failed Stripe Checkout.
 *
 * This spec hits Stripe's REST API directly using the same env var the
 * prod site reads. If Vercel env rotation accidentally points at a stale
 * ID, this fails before the customer does.
 *
 * Skipped when STRIPE_SECRET_KEY is not in the environment.
 */
import { test, expect } from "@playwright/test";

const STRIPE_KEY = (process.env.STRIPE_SECRET_KEY || "").trim();

test.skip(!STRIPE_KEY, "STRIPE_SECRET_KEY missing — skip price ID guard");

interface PriceShape {
  id: string;
  active: boolean;
  unit_amount: number | null;
  recurring: { interval: string } | null;
  product: string;
}

async function fetchPrice(priceId: string): Promise<PriceShape | null> {
  const res = await fetch(`https://api.stripe.com/v1/prices/${priceId}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${STRIPE_KEY}:`).toString("base64")}` },
  });
  if (!res.ok) return null;
  return (await res.json()) as PriceShape;
}

interface TierExpectation {
  envVar: string;
  expectedDollars: number;
  interval: "month" | "year";
}

const TIERS: TierExpectation[] = [
  { envVar: "NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID", expectedDollars: 49, interval: "month" },
  { envVar: "NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID", expectedDollars: 490, interval: "year" },
  { envVar: "NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID", expectedDollars: 149, interval: "month" },
  { envVar: "NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID", expectedDollars: 1490, interval: "year" },
  { envVar: "NEXT_PUBLIC_STRIPE_REGULATED_MONTHLY_PRICE_ID", expectedDollars: 399, interval: "month" },
  { envVar: "NEXT_PUBLIC_STRIPE_REGULATED_YEARLY_PRICE_ID", expectedDollars: 3990, interval: "year" },
];

test.describe("Stripe price IDs must resolve to active prices with correct $", () => {
  for (const tier of TIERS) {
    test(`${tier.envVar} → $${tier.expectedDollars}/${tier.interval}`, async () => {
      const priceId = (process.env[tier.envVar] || "").trim();
      expect(
        priceId,
        `${tier.envVar} not set in env. Pull via 'vercel env pull --environment=production'.`,
      ).toBeTruthy();

      const price = await fetchPrice(priceId);
      expect(
        price,
        `Price ${priceId} (${tier.envVar}) does not exist in Stripe — orphaned env var. Update Vercel envs to point at a valid active price for this tier.`,
      ).toBeTruthy();
      expect(price?.active, `Price ${priceId} exists but is archived/inactive`).toBe(true);

      const dollars = (price?.unit_amount ?? 0) / 100;
      expect(
        dollars,
        `Price ${priceId} amount $${dollars} does not match expected $${tier.expectedDollars} for ${tier.envVar}`,
      ).toBe(tier.expectedDollars);

      expect(price?.recurring?.interval).toBe(tier.interval);
    });
  }
});
