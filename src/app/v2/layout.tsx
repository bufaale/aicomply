import "../aicomply-v2.css";
import { MktFooter } from "@/components/aicomply/atoms";
import { MarketingHeader } from "@/components/aicomply/marketing-header";

/**
 * AIComply v2 layout — outside the (marketing) route group so the v2
 * MktHeader / MktFooter atoms own all chrome (no double navbar). Once
 * /v2 has been promoted to /, this layout still renders v2/* paths as
 * canonical alias URLs (handy for partners/auditors who already
 * bookmarked them).
 */
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingHeader />
      {children}
      <MktFooter />
    </>
  );
}
