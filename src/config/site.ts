export const siteConfig = {
  name: "AIComply",
  description:
    "EU AI Act compliance tracker for SMBs. Inventory every AI tool, auto-classify risk, generate Article 4 AI literacy registers and DPIAs — before the August 2, 2026 deadline.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    github: "https://github.com/bufaale/aicomply",
    twitter: "https://twitter.com/aicomply",
  },
} as const;
