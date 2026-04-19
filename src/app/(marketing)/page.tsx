import { Hero } from "@/components/landing/hero";
import { DeadlineBanner } from "@/components/landing/deadline-banner";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";

export default function HomePage() {
  return (
    <>
      <DeadlineBanner />
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
    </>
  );
}
