import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "AI Literacy (Art. 4) | AIComply",
};

export default function LiteracyPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <GraduationCap className="h-6 w-6" /> AI Literacy (Art. 4)
        </h1>
        <p className="text-muted-foreground mt-1">
          Track that staff who use your high-risk AI systems have received appropriate training.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>
            AI Literacy training register (Art. 4 EU AI Act).
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Article 4 requires providers and deployers to ensure that their staff
            who operate or use AI systems have a sufficient level of AI literacy
            — including the technical knowledge, experience, education, and
            training needed to understand the capabilities, risks, and limitations
            of the AI system.
          </p>
          <p>
            Upload training records, track completion per employee and per AI
            system, and export an attestation PDF for auditors. Arriving in the
            next sprint.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
