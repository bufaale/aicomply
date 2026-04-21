import { Landmark, Cpu, Building2, GraduationCap, HeartPulse, Briefcase } from "lucide-react";

const SECTORS = [
  { icon: Cpu, label: "SaaS with EU users" },
  { icon: Briefcase, label: "Consulting firms" },
  { icon: HeartPulse, label: "Health tech" },
  { icon: Building2, label: "Financial services" },
  { icon: GraduationCap, label: "EdTech platforms" },
  { icon: Landmark, label: "Public sector" },
];

export function TrustStrip() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-12">
        <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Sized for organizations with EU users &amp; fewer than 500 employees
        </p>
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {SECTORS.map((s) => (
            <li
              key={s.label}
              className="flex flex-col items-center gap-2 text-slate-500 transition-colors hover:text-[#0b1f3a]"
            >
              <s.icon className="h-8 w-8" strokeWidth={1.3} aria-hidden />
              <p className="text-center text-[11px] font-semibold text-slate-700">
                {s.label}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-[10px] text-slate-400">
          Any deployer of AI systems for EU users under Article 3 of Regulation (EU) 2024/1689
        </p>
      </div>
    </section>
  );
}
