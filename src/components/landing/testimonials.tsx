import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "I used to pay my lawyer $500 every time I needed a new NDA or service agreement. ClauseForge generates them in a minute and they're solid.",
    name: "Sarah Mitchell",
    role: "Freelance Developer",
    initials: "SM",
  },
  {
    quote:
      "The red-flag detection saved me from signing a contract with an unlimited liability clause. Worth every penny of the subscription.",
    name: "Mark Stevens",
    role: "Design Agency Owner",
    initials: "MS",
  },
  {
    quote:
      "The e-signature portal is seamless. Clients just click a link, review the contract, and sign. No more back-and-forth PDFs over email.",
    name: "Lisa Chen",
    role: "Marketing Consultant",
    initials: "LC",
  },
];

export function Testimonials() {
  return (
    <section className="bg-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Trusted by freelancers</h2>
          <p className="text-muted-foreground mt-4 mx-auto max-w-2xl">
            See what freelancers and agencies are saying about ClauseForge.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-muted-foreground text-sm leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
