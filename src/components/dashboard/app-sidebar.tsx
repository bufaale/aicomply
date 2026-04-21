"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Boxes,
  GraduationCap,
  Settings,
  CreditCard,
  ShieldAlert,
  Scale,
  Globe,
  FileCheck,
  FileArchive,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";

const mainNav = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "AI Systems", href: "/dashboard/ai-systems", icon: Boxes },
  { title: "Add System", href: "/dashboard/ai-systems/new", icon: PlusCircle },
  { title: "Risk Review", href: "/dashboard/risk", icon: ShieldAlert },
  { title: "FRIA (Art. 27)", href: "/dashboard/fria", icon: Scale },
  { title: "DPIA (GDPR Art. 35)", href: "/dashboard/dpia", icon: FileCheck },
  { title: "Annex IV (Art. 11)", href: "/dashboard/annex-iv", icon: FileArchive },
  { title: "AI Literacy (Art. 4)", href: "/dashboard/literacy", icon: GraduationCap },
  { title: "Public trust page", href: "/dashboard/trust", icon: Globe },
];

const settingsNav = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Billing", href: "/settings/billing", icon: CreditCard },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href="/dashboard" className="text-lg font-bold">
          {siteConfig.name}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href)
                    }
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          {siteConfig.name} v1.0
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
