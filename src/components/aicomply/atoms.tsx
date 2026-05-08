"use client";

/**
 * AIComply v2 UI Kit — shared atoms
 *
 * Ported from the Claude Designs export at
 *   `Downloads/AiComply/components.jsx`
 *
 * If you want to update one of these, update the source design system
 * first (re-run Claude Designs), then re-port — don't drift values
 * silently. The visual tokens live in `src/app/globals.css` under the
 * "AIComply v2 design system" section. The layout-specific CSS used by
 * these atoms lives in `src/app/aicomply-v2.css` and must be imported
 * by any layout.tsx that renders v2 chrome.
 */
import Link from "next/link";
import { Fragment, type ReactNode } from "react";

// =============================================================================
// Mark — square compass glyph used in headers, sidebar, auth shell, footer
// =============================================================================

export interface MarkProps {
  size?: number;
  /** CSS color string. Falls back to currentColor so the parent can drive it. */
  color?: string;
}

export function Mark({ size = 24, color }: MarkProps) {
  const stroke = color ?? "currentColor";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="2" y="2" width="28" height="28" stroke={stroke} strokeWidth={1.5} />
      <circle cx="16" cy="16" r="9" stroke={stroke} strokeWidth={1.25} />
      <path d="M16 7 L18 16 L16 25 L14 16 Z" fill={stroke} opacity={0.95} />
      <path d="M7 16 L16 14 L25 16 L16 18 Z" fill={stroke} opacity={0.45} />
      <circle cx="16" cy="16" r={1.4} fill={stroke} />
    </svg>
  );
}

// =============================================================================
// Icon — generic stroke icon with a fixed registry of named glyphs (Lucide-ish)
// =============================================================================

export type IconName =
  | "home"
  | "layers"
  | "shield"
  | "doc"
  | "users"
  | "file"
  | "settings"
  | "search"
  | "plus"
  | "arrow"
  | "chevron"
  | "download"
  | "check"
  | "x"
  | "bell"
  | "book"
  | "list"
  | "grid"
  | "google";

export interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  /** Optional accessible label. When omitted the SVG is treated as decorative. */
  ariaLabel?: string;
}

const ICON_PATHS: Record<IconName, ReactNode> = {
  home: <path d="M3 11 L12 4 L21 11 V20 a1 1 0 0 1-1 1 H4 a1 1 0 0 1-1-1 Z" />,
  layers: (
    <>
      <path d="M12 3 L21 8 L12 13 L3 8 Z" />
      <path d="M3 12 L12 17 L21 12" />
      <path d="M3 16 L12 21 L21 16" />
    </>
  ),
  shield: <path d="M12 3 L20 6 V12 c0 5-3.5 8-8 9-4.5-1-8-4-8-9 V6 Z" />,
  doc: (
    <>
      <path d="M14 3 H6 a1 1 0 0 0-1 1 V20 a1 1 0 0 0 1 1 H18 a1 1 0 0 0 1-1 V8 Z" />
      <path d="M14 3 V8 H19" />
      <path d="M8 13 H16 M8 17 H13" />
    </>
  ),
  users: (
    <>
      <circle cx={9} cy={8} r={3} />
      <path d="M3 20 c0-3 3-5 6-5 s6 2 6 5" />
      <circle cx={17} cy={9} r={2.5} />
      <path d="M14.5 14.5 c2-0.5 6 1 6 4.5" />
    </>
  ),
  file: (
    <>
      <path d="M14 3 H6 V21 H18 V8 Z" />
      <path d="M14 3 V8 H19" />
    </>
  ),
  settings: (
    <>
      <circle cx={12} cy={12} r={3} />
      <path d="M12 2 V5 M12 19 V22 M2 12 H5 M19 12 H22 M5 5 L7 7 M17 17 L19 19 M5 19 L7 17 M17 7 L19 5" />
    </>
  ),
  search: (
    <>
      <circle cx={11} cy={11} r={7} />
      <path d="M16.5 16.5 L21 21" />
    </>
  ),
  plus: <path d="M12 5 V19 M5 12 H19" />,
  arrow: <path d="M5 12 H19 M13 6 L19 12 L13 18" />,
  chevron: <path d="M9 6 L15 12 L9 18" />,
  download: <path d="M12 4 V16 M6 11 L12 17 L18 11 M5 20 H19" />,
  check: <path d="M5 12 L10 17 L19 7" />,
  x: <path d="M6 6 L18 18 M18 6 L6 18" />,
  bell: (
    <>
      <path d="M6 16 V11 c0-3 2-6 6-6 s6 3 6 6 V16 L20 18 H4 Z" />
      <path d="M10 21 c0 1 1 2 2 2 s2-1 2-2" />
    </>
  ),
  book: (
    <>
      <path d="M4 5 V20 a1 1 0 0 0 1 1 H20 V4 H5 a1 1 0 0 0-1 1 Z" />
      <path d="M4 17 H20" />
    </>
  ),
  list: (
    <>
      <path d="M8 6 H21 M8 12 H21 M8 18 H21" />
      <circle cx={4} cy={6} r={1} />
      <circle cx={4} cy={12} r={1} />
      <circle cx={4} cy={18} r={1} />
    </>
  ),
  grid: (
    <>
      <rect x={4} y={4} width={7} height={7} />
      <rect x={13} y={4} width={7} height={7} />
      <rect x={4} y={13} width={7} height={7} />
      <rect x={13} y={13} width={7} height={7} />
    </>
  ),
  google: (
    <>
      <path
        d="M21 12 c0-.8-.1-1.5-.2-2.2 H12 v4.2 H17 c-.2 1.2-.9 2.2-1.9 2.9 v2.4 H18 c1.8-1.7 3-4.2 3-7.3 Z"
        fill="#4285f4"
        stroke="none"
      />
      <path
        d="M12 21 c2.7 0 5-.9 6.6-2.4 L15.5 16.2 c-.9.6-2 1-3.5 1-2.7 0-5-1.8-5.8-4.3 H3 v2.7 C4.7 19 8.1 21 12 21 Z"
        fill="#34a853"
        stroke="none"
      />
      <path
        d="M6.2 13 c-.2-.6-.3-1.3-.3-2 s.1-1.4.3-2 V6.3 H3 C2.4 7.6 2 9.2 2 11 s.4 3.4 1 4.7 L6.2 13 Z"
        fill="#fbbc05"
        stroke="none"
      />
      <path
        d="M12 5.5 c1.5 0 2.9.5 3.9 1.5 L18.7 4.2 C16.9 2.6 14.7 1.7 12 1.7 8.1 1.7 4.7 4 3 7.3 L6.2 9 c.8-2.5 3.1-3.5 5.8-3.5 Z"
        fill="#ea4335"
        stroke="none"
      />
    </>
  ),
};

export function Icon({ name, size = 16, stroke = 1.5, ariaLabel }: IconProps) {
  // Conditionally spread a11y attributes — undefined props trip linters.
  const a11yProps = ariaLabel
    ? { role: "img" as const, "aria-label": ariaLabel }
    : { "aria-hidden": true as const };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="square"
      strokeLinejoin="miter"
      style={{ flexShrink: 0 }}
      {...a11yProps}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

// =============================================================================
// Brand wordmark — Mark + "AIComply" text. Stand-alone reusable atom.
// =============================================================================

export interface BrandProps {
  size?: number;
  href?: string;
  /** CSS color for the wordmark text. */
  color?: string;
  className?: string;
}

export function Brand({ size = 24, href = "/v2", color, className }: BrandProps) {
  const wordColor = color ?? "var(--aic-fg-l-1)";
  return (
    <Link
      href={href}
      className={className}
      style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
    >
      <Mark size={size} color={wordColor} />
      <span
        style={{
          fontFamily: "var(--aic-font-serif)",
          fontSize: size === 22 ? 18 : 20,
          fontWeight: 600,
          letterSpacing: "-.02em",
          color: wordColor,
        }}
      >
        AIComply
      </span>
    </Link>
  );
}

// =============================================================================
// Marketing Header — desktop + mobile pair. The active link gets the
// "active" class so the header CSS can underline it.
// =============================================================================

const MKT_LINKS: Array<{ href: string; label: string; matchPaths?: string[] }> = [
  { href: "/", label: "Product", matchPaths: ["/", "/v2"] },
  { href: "/free/risk-checker", label: "Risk checker", matchPaths: ["/free/risk-checker", "/v2/risk-checker"] },
  { href: "/pricing", label: "Pricing", matchPaths: ["/pricing", "/v2/pricing"] },
  { href: "/v2/trust", label: "Trust", matchPaths: ["/v2/trust"] },
];

export interface MktHeaderProps {
  /** Current pathname — used to highlight the active link. */
  activePath?: string;
}

export function MktHeader({ activePath = "" }: MktHeaderProps) {
  const isActive = (href: string, matchPaths?: string[]): boolean => {
    if (matchPaths) return matchPaths.includes(activePath);
    return activePath.startsWith(href);
  };
  return (
    <Fragment>
      <header className="aic-mkt-header">
        <Brand size={24} href="/v2" />
        <nav>
          {MKT_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={isActive(l.href, l.matchPaths) ? "active" : ""}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="actions">
          <Link
            href="/login"
            style={{ fontSize: 14, color: "var(--aic-fg-l-2)", textDecoration: "none" }}
          >
            Sign in
          </Link>
          <Link href="/signup" className="aic-btn aic-btn--primary aic-btn--sm">
            Start free
          </Link>
        </div>
      </header>
      <header className="aic-mkt-header-mobile">
        <Brand size={22} href="/v2" />
        <Link href="/signup" className="aic-btn aic-btn--primary aic-btn--sm">
          Start free
        </Link>
      </header>
    </Fragment>
  );
}

// =============================================================================
// Marketing Footer — 4-column grid + meta strip
// =============================================================================

interface FooterColLink {
  label: string;
  href: string | null;
}

function FooterCol({ title, links }: { title: string; links: FooterColLink[] }) {
  return (
    <div>
      <div
        style={{
          font: "var(--aic-mono-sm)",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "var(--aic-fg-l-4)",
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map((l) =>
          l.href ? (
            <Link
              key={l.label}
              href={l.href}
              style={{
                color: "var(--aic-fg-l-2)",
                fontSize: 14,
                textDecoration: "none",
                minHeight: 24,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {l.label}
            </Link>
          ) : (
            <span
              key={l.label}
              style={{
                color: "var(--aic-fg-l-4)",
                fontSize: 14,
                minHeight: 24,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {l.label}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

export function MktFooter() {
  return (
    <footer
      style={{
        borderTop: "2px solid var(--aic-paper-line)",
        padding: "40px 0 24px",
        background: "var(--aic-paper-0)",
      }}
    >
      <div className="aic-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 40,
          }}
        >
          <div>
            <Brand size={22} href="/v2" />
            <p
              style={{
                margin: "12px 0 0",
                color: "var(--aic-fg-l-3)",
                fontSize: 13,
                lineHeight: 1.55,
                maxWidth: 300,
              }}
            >
              EU AI Act compliance for SMBs. Inventory, classify, train, document — audit-ready in 7 days.
            </p>
            <div
              style={{
                font: "var(--aic-mono-sm)",
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "var(--aic-fg-l-4)",
                marginTop: 18,
              }}
            >
              REG. NO. AIC-2026 · v1.4
            </div>
          </div>
          <FooterCol
            title="Product"
            links={[
              { label: "Risk checker", href: "/free/risk-checker" },
              { label: "AI inventory", href: "/dashboard/ai-systems" },
              { label: "Pricing", href: "/pricing" },
              { label: "Trust", href: "/v2/trust" },
            ]}
          />
          <FooterCol
            title="Compliance"
            links={[
              { label: "EU AI Act", href: null },
              { label: "Annex IV", href: null },
              { label: "Article 4 literacy", href: null },
              { label: "DPIA & FRIA", href: null },
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { label: "Terms", href: "/terms" },
              { label: "Privacy", href: "/privacy" },
              { label: "DPA", href: null },
              { label: "SOC 2", href: null },
            ]}
          />
        </div>
        <div
          style={{
            marginTop: 32,
            paddingTop: 18,
            borderTop: "1px solid var(--aic-paper-line-soft)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            color: "var(--aic-fg-l-4)",
            fontSize: 12,
          }}
        >
          <span>© 2026 Pipo&apos;s Lab LLC · AIComply&trade;</span>
          <span style={{ font: "var(--aic-mono-sm)", letterSpacing: ".1em" }}>
            SOC 2 TYPE II · ISO 27001 · REGULATION (EU) 2024/1689
          </span>
        </div>
      </div>
    </footer>
  );
}

// =============================================================================
// App sidebar (desktop) + mobile bottom nav + topbar — all driven by the
// active route. Caller is responsible for passing `activePath`.
// =============================================================================

interface SidebarItem {
  href: string;
  label: string;
  icon: IconName;
}

const SIDEBAR_PRIMARY: SidebarItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/dashboard/ai-systems", label: "AI systems", icon: "layers" },
  { href: "/dashboard/risk", label: "Risk register", icon: "shield" },
  { href: "/dashboard/annex-iv", label: "Annex IV pack", icon: "doc" },
  { href: "/dashboard/literacy", label: "Article 4", icon: "book" },
  { href: "/dashboard/dpia", label: "DPIA & FRIA", icon: "file" },
];

export interface AppSidebarProps {
  activePath?: string;
  workspaceName?: string;
  workspacePlan?: string;
  workspaceInitials?: string;
  /** Public trust page slug for this workspace, when trust_enabled=true. Null/undefined falls back to settings. */
  trustSlug?: string | null;
}

export function AppSidebar({
  activePath = "",
  workspaceName = "Acme Health",
  workspacePlan = "Business · 47 systems",
  workspaceInitials = "AH",
  trustSlug = null,
}: AppSidebarProps) {
  const isActive = (href: string): boolean =>
    activePath === href || activePath.startsWith(`${href}/`);
  return (
    <aside className="aic-app-sidebar">
      <Link href="/dashboard" className="brand">
        <Mark size={22} color="#fff" />
        <span className="brand-name">AIComply</span>
      </Link>
      <div className="group">Workspace</div>
      {SIDEBAR_PRIMARY.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={`nav-item${isActive(it.href) ? " active" : ""}`}
        >
          <span className="icon">
            <Icon name={it.icon} size={14} />
          </span>
          {it.label}
        </Link>
      ))}
      <div className="group">Account</div>
      <Link
        href="/settings"
        className={`nav-item${isActive("/settings") ? " active" : ""}`}
      >
        <span className="icon">
          <Icon name="settings" size={14} />
        </span>
        Settings
      </Link>
      <Link
        href={trustSlug ? `/trust/${trustSlug}` : "/settings"}
        className="nav-item"
        title={trustSlug ? "View your public trust page" : "Configure trust page in settings"}
      >
        <span className="icon">
          <Icon name="shield" size={14} />
        </span>
        {trustSlug ? "Public trust page" : "Set up trust page"}
      </Link>
      <div className="ws">
        <div className="ws-avatar">{workspaceInitials}</div>
        <div style={{ minWidth: 0 }}>
          <div className="ws-name">{workspaceName}</div>
          <div className="ws-plan">{workspacePlan}</div>
        </div>
      </div>
    </aside>
  );
}

const MOBILE_TABS: SidebarItem[] = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/dashboard/ai-systems", label: "Systems", icon: "layers" },
  { href: "/dashboard/annex-iv", label: "Docs", icon: "doc" },
  { href: "/dashboard/literacy", label: "Literacy", icon: "book" },
  { href: "/settings", label: "More", icon: "settings" },
];

export function AppMobileNav({ activePath = "" }: { activePath?: string }) {
  const isActive = (href: string): boolean =>
    activePath === href || activePath.startsWith(`${href}/`);
  return (
    <nav className="aic-app-tabbar">
      <div className="tabs">
        {MOBILE_TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`tab${isActive(t.href) ? " active" : ""}`}
          >
            <span className="ic">
              <Icon name={t.icon} size={20} />
            </span>
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export interface AppTopbarProps {
  crumbs: string[];
  /** Initials shown in the top-right avatar tile. */
  userInitials?: string;
}

export function AppTopbar({ crumbs, userInitials = "AC" }: AppTopbarProps) {
  // Production wiring of the topbar widgets:
  // - Bell → /settings (where notification toggles live; full notifications
  //   centre is a follow-up build, the link here at least lands somewhere
  //   meaningful when a user clicks).
  // - Avatar → /settings (profile + brand settings).
  // - Search bar — hidden until the global search index ships. Showing a
  //   non-functional ⌘K input was misleading users.
  return (
    <Fragment>
      <div className="aic-app-mobile-header">
        <Link href="/dashboard" className="brand">
          <Mark size={20} color="#fff" />
          <span className="brand-name">AIComply</span>
        </Link>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link
            href="/settings"
            aria-label="Notifications"
            style={{ color: "rgba(255,255,255,.85)", display: "inline-flex" }}
          >
            <Icon name="bell" size={18} />
          </Link>
        </div>
      </div>
      <div className="aic-app-topbar">
        <div className="crumbs">
          {crumbs.map((c, i) => (
            <Fragment key={`${i}-${c}`}>
              {i > 0 && <span className="sep">/</span>}
              <span className={i === crumbs.length - 1 ? "now" : ""}>{c}</span>
            </Fragment>
          ))}
        </div>
        <div className="right">
          <Link
            href="/settings"
            aria-label="Notifications"
            className="aic-btn aic-btn--ghost-dark-soft aic-btn--sm aic-hide-mobile"
          >
            <Icon name="bell" size={14} />
          </Link>
          <Link
            href="/settings"
            aria-label="Account settings"
            style={{
              width: 30,
              height: 30,
              borderRadius: 2,
              background: "var(--aic-gold-soft)",
              border: "1px solid rgba(212,175,55,.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              font: "600 11px var(--aic-font-mono)",
              color: "var(--aic-gold)",
              textDecoration: "none",
              transition: "background .14s ease",
            }}
          >
            {userInitials}
          </Link>
        </div>
      </div>
    </Fragment>
  );
}

// =============================================================================
// Pyramid leitmotif — 4-tier risk schematic. Used on landing, dashboard, and
// risk-detail. Renders as vertical stacked bars on desktop; PyramidBar
// alternative gives a horizontal 4-segment progress bar on mobile.
// =============================================================================

export type RiskTier = "prohibited" | "high" | "limited" | "minimal";

interface TierMeta {
  id: RiskTier;
  num: string;
  label: string;
  sub: string;
  obligation: string;
}

const TIERS: TierMeta[] = [
  {
    id: "prohibited",
    num: "01",
    label: "Prohibited",
    sub: "Banned uses (Art. 5) — social scoring, real-time biometric ID",
    obligation: "Cease use",
  },
  {
    id: "high",
    num: "02",
    label: "High-risk",
    sub: "Annex III — recruitment, credit scoring, medical devices, education",
    obligation: "Conformity assessment",
  },
  {
    id: "limited",
    num: "03",
    label: "Limited risk",
    sub: "Transparency duties — chatbots, deepfakes, emotion recognition",
    obligation: "Disclose to users",
  },
  {
    id: "minimal",
    num: "04",
    label: "Minimal risk",
    sub: "Spam filters, AI-enabled video games — voluntary code of conduct",
    obligation: "None",
  },
];

export interface PyramidProps {
  dark?: boolean;
  hideOnMobile?: boolean;
  hideOnDesktop?: boolean;
  /** Optional tier→count map used in dashboard contexts (e.g. inventory totals). */
  counts?: Partial<Record<RiskTier, string | number>>;
}

export function Pyramid({ dark, hideOnMobile, hideOnDesktop, counts }: PyramidProps) {
  const className = [
    "aic-pyramid",
    dark ? "aic-pyramid--dark" : "",
    hideOnMobile ? "aic-hide-mobile" : "",
    hideOnDesktop ? "aic-show-mobile" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={className}>
      {TIERS.map((t) => (
        <div key={t.id} className="row" data-tier={t.id}>
          <span className="num">{t.num}</span>
          <span>
            <span className="lbl">{t.label}</span>
            <div className="sub">{t.sub}</div>
          </span>
          <span className="meta">{counts?.[t.id] ?? t.obligation}</span>
        </div>
      ))}
    </div>
  );
}

export interface PyramidBarProps {
  dark?: boolean;
  current?: RiskTier;
}

export function PyramidBar({ dark, current }: PyramidBarProps) {
  const tiers: RiskTier[] = ["prohibited", "high", "limited", "minimal"];
  const labels: Record<RiskTier, string> = {
    prohibited: "Prohibited",
    high: "High",
    limited: "Limited",
    minimal: "Minimal",
  };
  return (
    <div>
      <div className={`aic-tier-progress${dark ? " aic-tier-progress--dark" : ""}`}>
        {tiers.map((t) => (
          <div
            key={t}
            className="seg"
            data-tier={t}
            style={{ opacity: current && current !== t ? 0.25 : 0.95 }}
          />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 4,
          marginTop: 6,
        }}
      >
        {tiers.map((t) => (
          <div
            key={t}
            style={{
              font: "var(--aic-mono-sm)",
              letterSpacing: ".06em",
              textTransform: "uppercase",
              color: dark
                ? current === t
                  ? "#fff"
                  : "rgba(255,255,255,.55)"
                : current === t
                  ? "var(--aic-fg-l-1)"
                  : "var(--aic-fg-l-3)",
              textAlign: "center",
              fontWeight: current === t ? 700 : 500,
            }}
          >
            {labels[t]}
          </div>
        ))}
      </div>
    </div>
  );
}

export interface TierBadgeProps {
  tier: RiskTier;
  dark?: boolean;
  /** Override the default label (e.g. for shorter tabular contexts). */
  label?: string;
}

const TIER_LABELS: Record<RiskTier, string> = {
  prohibited: "Prohibited",
  high: "High-risk",
  limited: "Limited",
  minimal: "Minimal",
};

export function TierBadge({ tier, dark, label }: TierBadgeProps) {
  return (
    <span
      className={`aic-tier-badge${dark ? " aic-tier-badge--dark" : ""}`}
      data-tier={tier}
    >
      <span className="dot" />
      {label ?? TIER_LABELS[tier]}
    </span>
  );
}

// =============================================================================
// AuthSide — dark split-panel right pane used by /login, /signup, /forgot
// =============================================================================

export interface AuthSideProps {
  /** Override the headline body when sign-up vs login wants different framing. */
  headline?: ReactNode;
  /** Override the supporting paragraph. */
  description?: ReactNode;
}

export function AuthSide({ headline, description }: AuthSideProps) {
  return (
    <aside className="aic-auth-side">
      <div className="grid-bg" />
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Mark size={26} color="#fff" />
          <span
            style={{
              fontFamily: "var(--aic-font-serif)",
              fontSize: 20,
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "-.02em",
            }}
          >
            AIComply
          </span>
        </div>
      </div>
      <div style={{ position: "relative", maxWidth: 420 }}>
        <div className="aic-eyebrow-line" style={{ marginBottom: 14 }}>
          <span className="live-dot" />
          EU AI ACT · ART. 4 · IN FORCE 02 AUG 2026
        </div>
        <h1
          style={{
            font: "500 40px/1.06 var(--aic-font-serif)",
            letterSpacing: "-.025em",
            margin: 0,
            color: "#fff",
          }}
        >
          {headline ?? (
            <>
              The AI Act{" "}
              <em style={{ color: "var(--aic-gold)", fontStyle: "italic" }}>register</em> your
              auditor reads in 30 seconds.
            </>
          )}
        </h1>
        <p
          style={{
            font: "15px/1.55 var(--aic-font-sans)",
            color: "rgba(255,255,255,.72)",
            marginTop: 18,
          }}
        >
          {description ?? (
            <>
              Inventory every AI system, auto-classify the four risk tiers, satisfy Article 4
              literacy, and hand auditors a packet — fines up to €35M or 7% of revenue.
            </>
          )}
        </p>
      </div>
      <div
        style={{
          position: "relative",
          font: "var(--aic-mono-sm)",
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,.45)",
        }}
      >
        REGULATION (EU) 2024/1689 · CHAPTER I · ARTICLE 99
      </div>
    </aside>
  );
}
