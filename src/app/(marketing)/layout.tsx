import "../aicomply-v2.css";
import { MktFooter } from "@/components/aicomply/atoms";
import { MarketingHeader } from "@/components/aicomply/marketing-header";

/**
 * Marketing route group layout — owns the v2 chrome (MktHeader/MktFooter).
 * Inner pages (page, pricing, free/risk-checker, blog, terms, privacy,
 * refund, dpia-generator, fria-generator) render only their content.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingHeader />
      {children}
      <MktFooter />
    </>
  );
}
