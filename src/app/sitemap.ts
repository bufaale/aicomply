import type { MetadataRoute } from "next";

const BASE = "https://aicomply.piposlab.com";

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFreq: "daily" | "weekly" | "monthly" }> = [
  { path: "/", priority: 1.0, changeFreq: "weekly" },
  { path: "/pricing", priority: 0.9, changeFreq: "weekly" },
  { path: "/free/risk-checker", priority: 0.9, changeFreq: "weekly" },
  { path: "/fria-generator", priority: 0.7, changeFreq: "monthly" },
  { path: "/dpia-generator", priority: 0.7, changeFreq: "monthly" },
  { path: "/blog", priority: 0.7, changeFreq: "weekly" },
  { path: "/login", priority: 0.4, changeFreq: "monthly" },
  { path: "/signup", priority: 0.5, changeFreq: "monthly" },
  { path: "/terms", priority: 0.3, changeFreq: "monthly" },
  { path: "/privacy", priority: 0.3, changeFreq: "monthly" },
  { path: "/refund", priority: 0.3, changeFreq: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_ROUTES.map(({ path, priority, changeFreq }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: changeFreq,
    priority,
  }));
}
