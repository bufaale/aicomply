import "../aicomply-v2.css";

/**
 * AIComply v2 layout — outside the (marketing) route group so the v2
 * MktHeader / AppSidebar atoms own all chrome (no double navbar). The
 * v2 design system stylesheet loads only here, leaving v1 / production
 * routes unchanged until the final swap.
 */
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return children;
}
