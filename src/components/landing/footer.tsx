import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { CROSS_PROMO_OTHER_APPS as crossPromo } from "@/config/cross-promo";

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Refund Policy", href: "/refund" },
    ],
  },
  social: {
    title: "Social",
    links: [
      { label: "GitHub", href: siteConfig.links.github },
      { label: "Twitter", href: siteConfig.links.twitter },
    ],
  },
};


export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <section aria-labelledby="cross-promo" className="mt-12 border-t pt-8">
          <p
            id="cross-promo"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            More from Pipo Labs
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {crossPromo.map((app) => (
              <a
                key={app.name}
                href={app.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{app.name}</span>
                  <ArrowUpRight
                    className="text-muted-foreground h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {app.tagline}
                </p>
                <p className="text-muted-foreground mt-auto pt-3 font-mono text-xs">
                  {app.price}
                </p>
              </a>
            ))}
          </div>
        </section>

        <Separator className="my-8" />
        <p className="text-muted-foreground text-center text-sm">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
