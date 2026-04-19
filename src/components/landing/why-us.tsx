import { Sparkles, DollarSign, ShieldAlert, Clock } from "lucide-react";

const reasons = [
  {
    icon: Sparkles,
    title: "AI Generates the Entire Contract",
    description:
      "Describe the deal and get a complete contract with numbered clauses, legal language, and signature blocks. PandaDoc and DocuSign are template editors — you still write everything manually.",
  },
  {
    icon: DollarSign,
    title: "Flat Pricing, Not Per-User",
    description:
      "PandaDoc charges $35/user/month. DocuSign charges $25/user/month. 5 team members = $125-175/mo. ClauseForge is one flat price per tier.",
  },
  {
    icon: ShieldAlert,
    title: "Red-Flag Detection Built In",
    description:
      "Paste a contract you received and AI identifies risky clauses — unlimited liability, IP overreach, one-sided termination. No other tool at this price includes contract review.",
  },
  {
    icon: Clock,
    title: "60 Seconds, Not $500",
    description:
      "Stop paying lawyers for standard contracts. Generate NDAs, service agreements, and SOWs in a minute. Edit clauses individually and send via e-signature portal.",
  },
];

export function WhyUs() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            Why ClauseForge over alternatives?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            The only tool that generates complete contracts from a brief and
            reviews contracts you receive — at a flat price.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {reasons.map((reason) => (
            <div key={reason.title} className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <reason.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{reason.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
