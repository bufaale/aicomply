/**
 * Canonical production URLs for cross-promo blocks across all Pipo Labs apps.
 * Centralized here so a domain change requires editing one file per app.
 *
 * Per CLAUDE.md "no symlinks between apps" — copy this file to each app and
 * keep them in sync manually.
 *
 * 2026-05-13: Cross-promo cards now point at the SIBLING app's /free tool
 * (not its homepage) so portfolio-wide footer traffic lands on a working
 * no-signup demo.
 */

export const PIPO_LABS_URLS = {
  portfolio: "https://piposlab.com",
  accessiscan: "https://accessiscan.piposlab.com",
  callspark: "https://callspark.piposlab.com",
  aicomply: "https://aicomply.piposlab.com",
} as const;

export const FREE_TOOL_URLS = {
  accessiscan: "https://accessiscan.piposlab.com/free/wcag-scanner",
  callspark: "https://callspark.piposlab.com/free/transcript-check",
  aicomply: "https://aicomply.piposlab.com/free/risk-checker",
} as const;

export interface CrossPromoApp {
  name: string;
  tagline: string;
  price: string;
  href: string;
}

/**
 * Cross-promo cards shown in this app's footer pointing to OTHER Pipo Labs
 * products. Always exclude the current app from the list. Each card lands
 * visitors on the sibling app's /free tool, not its homepage.
 */
export const CROSS_PROMO_OTHER_APPS: CrossPromoApp[] = [
  {
    name: "AccessiScan",
    tagline: "Free WCAG 2.1 AA scanner — score any site in 5 seconds",
    price: "Free · no signup",
    href: FREE_TOOL_URLS.accessiscan,
  },
  {
    name: "CallSpark",
    tagline: "Free call-transcript analyzer — sentiment + red flags",
    price: "Free · no signup",
    href: FREE_TOOL_URLS.callspark,
  },
  {
    name: "See all 16 tools",
    tagline: "Pipo Labs · SaaS suite for operators",
    price: "piposlab.com",
    href: PIPO_LABS_URLS.portfolio,
  },
];
