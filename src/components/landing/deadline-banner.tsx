"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

const DEADLINE = new Date("2026-08-02T00:00:00Z");

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  past: boolean;
}

function getCountdown(): Countdown {
  const diff = DEADLINE.getTime() - Date.now();
  const past = diff <= 0;
  const abs = Math.abs(diff);
  return {
    past,
    days: Math.floor(abs / 86_400_000),
    hours: Math.floor((abs % 86_400_000) / 3_600_000),
    minutes: Math.floor((abs % 3_600_000) / 60_000),
    seconds: Math.floor((abs % 60_000) / 1_000),
  };
}

export function DeadlineBanner() {
  const [c, setC] = useState<Countdown | null>(null);

  useEffect(() => {
    setC(getCountdown());
    const id = setInterval(() => setC(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!c) return null;

  return (
    <section className="bg-red-950 text-white border-y border-red-900">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-300 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-base">
                EU AI Act deployer obligations enter into force
              </p>
              <p className="text-sm text-red-200">
                August 2, 2026 · €15M or 3% global turnover, stacked on top of GDPR penalties
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TimeBlock label="Days" value={c.days} />
            <TimeBlock label="Hrs" value={c.hours} />
            <TimeBlock label="Min" value={c.minutes} />
            <TimeBlock label="Sec" value={c.seconds} />
          </div>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-1 rounded-md bg-white text-red-950 px-4 py-2 text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            Audit my AI stack
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TimeBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-red-900/60 rounded px-3 py-2 text-center min-w-[58px]">
      <div className="text-xl font-bold tabular-nums">{String(value).padStart(2, "0")}</div>
      <div className="text-[10px] uppercase tracking-wider text-red-200">{label}</div>
    </div>
  );
}
