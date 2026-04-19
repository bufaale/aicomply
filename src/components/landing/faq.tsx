import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Who does the EU AI Act apply to?",
    a: "Any organisation that deploys or markets AI systems to users in the European Union — regardless of where the organisation is established. A US SaaS with even one EU customer is a deployer under Article 3 and must comply.",
  },
  {
    q: "What is the August 2, 2026 deadline?",
    a: "Most deployer obligations — including transparency notices, human oversight, logging, and risk classification — become enforceable on August 2, 2026. Article 4 (AI literacy) has been in force since February 2, 2025.",
  },
  {
    q: "What are the fines?",
    a: "Up to €35M or 7% of global annual turnover for prohibited practices (Art. 5). €15M or 3% for non-compliance with other obligations. These sit on top of GDPR fines — not instead of them.",
  },
  {
    q: "Can AIComply replace a lawyer or a consultancy like Vanta?",
    a: "No. AIComply is a compliance operations tool — it keeps your inventory, classifications, literacy records, and DPIAs up to date so your own lawyer or auditor has an audit-ready artefact to work from. For complex high-risk systems (Article 6 + Annex III) you should still work with qualified counsel.",
  },
  {
    q: "Which AI tools does the classifier understand?",
    a: "Any AI system you describe in plain English — from public LLM chats like ChatGPT and Claude, to internal RAG systems, to specialised vertical tools like CV screeners, credit scoring engines, or deepfake generators. The classifier maps against Articles 5, 6, 50 and Annex III of the regulation.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-3xl font-bold text-center">Frequently asked</h2>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
