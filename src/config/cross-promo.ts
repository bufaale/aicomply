/**
 * Canonical production URLs for cross-promo blocks across all Pipo Labs apps.
 * Centralized here so a domain change requires editing one file per app.
 *
 * Per CLAUDE.md "no symlinks between apps" — copy this file to each app and
 * keep them in sync manually.
 */

export const PIPO_LABS_URLS = {
  portfolio: "https://piposlab.com",
  accessiscan: "https://accessiscan.app",
  callspark: "https://callspark.app",
  aicomply: "https://aicomply.us",
} as const;

export interface CrossPromoApp {
  name: string;
  tagline: string;
  price: string;
  href: string;
}

/**
 * Cross-promo cards shown in this app's footer pointing to OTHER Pipo Labs
 * products. Always exclude the current app from the list.
 */
export const CROSS_PROMO_OTHER_APPS: CrossPromoApp[] = [
  {
    name: "AccessiScan",
    tagline: "WCAG 2.2 + VPAT 2.5 + GitHub Action",
    price: "From $19/mo",
    href: PIPO_LABS_URLS.accessiscan,
  },
  {
    name: "CallSpark",
    tagline: "Bilingual AI voice agent · warm transfer",
    price: "From $69/mo",
    href: PIPO_LABS_URLS.callspark,
  },
  {
    name: "See all 16 tools",
    tagline: "Pipo Labs · SaaS suite for operators",
    price: "piposlab.com",
    href: PIPO_LABS_URLS.portfolio,
  },
];
