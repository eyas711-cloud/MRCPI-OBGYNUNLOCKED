import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Foundation",
    price: "Free",
    priceSub: "No card required",
    description: "Get started with a curated set of stations across each domain — enough to understand the platform and structure your preparation.",
    features: [
      "12 stations (2 per domain)",
      "Full mark-scheme feedback",
      "Candidate brief and examiner view",
      "Timed station mode",
      "Domain performance summary",
    ],
    cta: "Start for free",
    ctaHref: "#",
    highlight: false,
  },
  {
    name: "Full Access",
    price: "€49",
    priceSub: "per 3 months",
    description: "Complete access to all 78 stations, mock OSCE circuits, and the full mark-scheme library. Most candidates use this for the final 8–12 weeks of preparation.",
    features: [
      "All 78 stations unlocked",
      "Full mark-scheme library",
      "Mock OSCE circuit (12 stations)",
      "Domain progress tracking",
      "Timed and untimed modes",
      "Examiner commentary per station",
      "Difficulty progression tracking",
    ],
    cta: "Get full access",
    ctaHref: "#",
    highlight: true,
  },
  {
    name: "Extended",
    price: "€79",
    priceSub: "per 6 months",
    description: "The same full access, extended to six months. Better value for candidates who want to work at a steady pace or who have an earlier exam date.",
    features: [
      "Everything in Full Access",
      "6 months of access",
      "New stations added as released",
      "Early access to new domains",
    ],
    cta: "Get extended access",
    ctaHref: "#",
    highlight: false,
  },
];

const faqs = [
  {
    q: "Is this affiliated with the RCPI or an official MRCPI resource?",
    a: "No. This is an independent preparation platform. It is not affiliated with, endorsed by, or officially connected to the Royal College of Physicians of Ireland. The MRCPI examination is set and assessed by RCPI.",
  },
  {
    q: "What format are the stations in?",
    a: "Each station includes a candidate task sheet (what you would receive in the real exam), an examiner instructions sheet, a simulated patient brief, and a mark scheme. Stations are designed to run for 8 minutes in timed mode.",
  },
  {
    q: "Can I use this on mobile?",
    a: "Yes. The platform is fully responsive and works on phones and tablets. Station text and mark schemes are legible on smaller screens.",
  },
  {
    q: "Are new stations added over time?",
    a: "Yes. New stations are added as they are written and reviewed. Full Access and Extended subscribers receive access to new stations as they are released.",
  },
  {
    q: "Is there a refund policy?",
    a: "If you are unsatisfied within the first 7 days of a paid subscription, contact us for a full refund — no questions asked.",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section className="py-16 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal-bright)" }}>
            Access & Pricing
          </p>
          <h1 className="font-serif text-white font-semibold mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Simple, transparent pricing
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
            Start free. Upgrade when you&apos;re ready to work through the full station library.
          </p>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-xl border p-7 flex flex-col"
                style={{
                  borderColor: tier.highlight ? "var(--teal-bright)" : "rgba(15,76,92,0.2)",
                  backgroundColor: tier.highlight ? "var(--navy)" : "rgba(255,255,255,0.7)",
                  boxShadow: tier.highlight ? "0 0 30px rgba(21,176,151,0.12)" : undefined,
                }}
              >
                {tier.highlight && (
                  <p
                    className="font-mono-data text-xs uppercase tracking-widest mb-4 pb-3 border-b"
                    style={{ color: "var(--teal-bright)", borderColor: "rgba(21,176,151,0.2)" }}
                  >
                    Most popular
                  </p>
                )}
                <p
                  className="font-mono-data text-xs uppercase tracking-widest mb-3"
                  style={{ color: tier.highlight ? "rgba(255,255,255,0.5)" : "var(--teal)" }}
                >
                  {tier.name}
                </p>
                <div className="mb-3">
                  <span
                    className="font-serif font-semibold"
                    style={{ fontSize: "2.5rem", color: tier.highlight ? "white" : "var(--navy)" }}
                  >
                    {tier.price}
                  </span>
                  {tier.price !== "Free" && (
                    <span
                      className="font-mono-data text-xs ml-2"
                      style={{ color: tier.highlight ? "rgba(255,255,255,0.4)" : "rgba(26,26,26,0.45)" }}
                    >
                      {tier.priceSub}
                    </span>
                  )}
                </div>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: tier.highlight ? "rgba(255,255,255,0.55)" : "rgba(26,26,26,0.65)" }}
                >
                  {tier.description}
                </p>
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        size={14}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: "var(--teal-bright)" }}
                      />
                      <span style={{ color: tier.highlight ? "rgba(255,255,255,0.7)" : "rgba(26,26,26,0.7)" }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.ctaHref}
                  className="block text-center px-5 py-3 rounded font-semibold text-sm transition-all"
                  style={
                    tier.highlight
                      ? { backgroundColor: "var(--teal-bright)", color: "var(--navy)" }
                      : {
                          backgroundColor: "transparent",
                          color: "var(--teal)",
                          border: "1px solid var(--teal)",
                        }
                  }
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Gold distinction note */}
          <div
            className="mt-8 px-6 py-4 rounded border flex items-start gap-4"
            style={{ borderColor: "rgba(201,162,39,0.3)", backgroundColor: "rgba(201,162,39,0.05)" }}
          >
            <div
              className="w-1 rounded-full self-stretch flex-shrink-0"
              style={{ backgroundColor: "var(--gold)" }}
            />
            <p className="text-sm" style={{ color: "rgba(26,26,26,0.65)" }}>
              <strong style={{ color: "var(--navy)" }}>Distinction-level preparation:</strong> Candidates who work through all 78 stations with mark-scheme review and complete at least one timed mock circuit consistently report feeling significantly more confident in the real exam. The platform does not guarantee any outcome — but structured repetition works.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6" style={{ backgroundColor: "rgba(11,30,61,0.03)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>
              Frequently Asked Questions
            </p>
            <h2 className="font-serif font-semibold" style={{ fontSize: "1.8rem", color: "var(--navy)" }}>
              Common questions
            </h2>
          </div>
          <div className="flex flex-col gap-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border"
                style={{ borderColor: "rgba(15,76,92,0.15)", backgroundColor: "rgba(255,255,255,0.6)" }}
              >
                <h3 className="font-serif font-semibold text-base mb-2" style={{ color: "var(--navy)" }}>
                  {faq.q}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(26,26,26,0.65)" }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
