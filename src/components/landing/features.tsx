import {
  Boxes,
  ShieldAlert,
  GraduationCap,
  FileText,
  Sparkles,
  Scale,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const features = [
  {
    icon: Boxes,
    title: "Unified AI Inventory",
    description:
      "Track every ChatGPT subscription, Copilot seat, Claude API key, custom model, and informal BYO usage in one register.",
  },
  {
    icon: Sparkles,
    title: "Auto Risk Classification",
    description:
      "Claude analyses each system against Articles 5, 6, 50 and Annex III of the EU AI Act and assigns the correct tier in seconds.",
  },
  {
    icon: ShieldAlert,
    title: "Obligation Checklists",
    description:
      "Concrete obligations per system — not generic advice. Transparency notices, logging, human oversight, conformity assessment.",
  },
  {
    icon: GraduationCap,
    title: "Article 4 AI Literacy Register",
    description:
      "Record who received AI literacy training, when, on which topics. Required for every organisation deploying AI in the EU since Feb 2025.",
  },
  {
    icon: FileText,
    title: "DPIA + Evidence Vault",
    description:
      "One-click DPIA generator (GDPR Art. 35) and a vault for every policy, log, and screenshot your auditor will ask for.",
  },
  {
    icon: Scale,
    title: "Priced for SMBs",
    description:
      "Vanta, OneTrust and PwC start at €50,000/year. AIComply has a Free tier and Pro starts at $49/mo, scaling to 100-person teams. Same legal outcome, different business model.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            Everything you need before August 2, 2026
          </h2>
          <p className="text-muted-foreground mt-4 mx-auto max-w-2xl">
            Built specifically for SMBs and SaaS teams. No €50K consulting
            engagement. No 200-page framework. Just the controls regulators
            will actually ask for.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="bg-primary/10 mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                  <f.icon className="text-primary h-5 w-5" />
                </div>
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
