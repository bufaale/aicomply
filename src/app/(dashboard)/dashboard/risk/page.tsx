import { ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Risk Review | AIComply",
};

export default function RiskReviewPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldAlert className="h-6 w-6" /> Risk Review
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and re-classify the risk tier of every AI system in your
          inventory. Supports Annex III high-risk categories, limited-risk
          (Art. 50 transparency), and minimal-risk.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>
            Centralised risk dashboard with filters by system, owner, and last
            review date.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Until this page lands, risk tier is assigned via
            <code className="mx-1 rounded bg-muted px-1">POST /api/ai-systems/[id]/classify</code>
            — reachable from each system&apos;s detail page in the AI Systems section.
          </p>
          <p>
            This page will aggregate all classifications and let you bulk-review,
            bulk-reclassify, and export an Annex III risk register for
            internal audit.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
