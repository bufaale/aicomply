"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import {
  AppMobileNav,
  AppSidebar,
  AppTopbar,
} from "@/components/aicomply/atoms";

const PATH_TO_CRUMBS: Array<{ prefix: string; crumbs: readonly string[] }> = [
  { prefix: "/dashboard/ai-systems", crumbs: ["WORKSPACE", "AI SYSTEMS"] },
  { prefix: "/dashboard/risk", crumbs: ["WORKSPACE", "RISK REGISTER"] },
  { prefix: "/dashboard/annex-iv", crumbs: ["WORKSPACE", "ANNEX IV"] },
  { prefix: "/dashboard/literacy", crumbs: ["WORKSPACE", "ARTICLE 4 LITERACY"] },
  { prefix: "/dashboard/dpia", crumbs: ["WORKSPACE", "DPIA"] },
  { prefix: "/dashboard/fria", crumbs: ["WORKSPACE", "FRIA"] },
  { prefix: "/dashboard/discovery", crumbs: ["WORKSPACE", "DISCOVERY"] },
  { prefix: "/dashboard/trust", crumbs: ["WORKSPACE", "TRUST"] },
  { prefix: "/dashboard", crumbs: ["WORKSPACE", "DASHBOARD"] },
  { prefix: "/settings/billing", crumbs: ["ACCOUNT", "BILLING"] },
  { prefix: "/settings/api-keys", crumbs: ["ACCOUNT", "API KEYS"] },
  { prefix: "/settings/profile", crumbs: ["ACCOUNT", "PROFILE"] },
  { prefix: "/settings", crumbs: ["ACCOUNT", "SETTINGS"] },
];

function crumbsFor(pathname: string): readonly string[] {
  for (const { prefix, crumbs } of PATH_TO_CRUMBS) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return crumbs;
  }
  return ["WORKSPACE"];
}

interface DashboardShellProps {
  workspaceName: string;
  workspacePlan: string;
  workspaceInitials: string;
  userInitials: string;
  children: React.ReactNode;
}

export function DashboardShell({
  workspaceName,
  workspacePlan,
  workspaceInitials,
  userInitials,
  children,
}: DashboardShellProps) {
  const pathname = usePathname() ?? "";
  const crumbs = crumbsFor(pathname);

  return (
    <div className="aic-app">
      <AppSidebar
        activePath={pathname}
        workspaceName={workspaceName}
        workspacePlan={workspacePlan}
        workspaceInitials={workspaceInitials}
      />
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AppTopbar crumbs={[...crumbs]} userInitials={userInitials} />
        <main className="aic-app-content">{children}</main>
      </div>
      <AppMobileNav activePath={pathname} />
    </div>
  );
}
