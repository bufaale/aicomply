"use client";

import { usePathname } from "next/navigation";
import { MktHeader } from "@/components/aicomply/atoms";

/**
 * Client wrapper that derives `activePath` from the current pathname so
 * the v2 marketing header can highlight the right nav link. Lives in the
 * marketing layout (server component) because Next.js layouts cannot
 * directly call usePathname().
 */
export function MarketingHeader() {
  const pathname = usePathname() ?? "/";
  return <MktHeader activePath={pathname} />;
}
