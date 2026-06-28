import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — Luxury United" }] }),
  component: FaqPage,
});

const FAQS = [
  { q: "Where are your pieces made?", a: "All Luxury United pieces are crafted in our Paris atelier by master jewelers with decades of experience." },
  { q: "What materials do you use?", a: "We work exclusively in 18k solid gold, platinum, and ethically sourced gemstones." },
  { q: "Do you offer warranty?", a: "Every piece includes a lifetime guarantee covering craftsmanship and complimentary annual care." },
  { q: "Can I return a piece?", a: "Yes — we offer 30-day returns on unworn items in original packaging." },
  { q: "Do you offer bespoke commissions?", a: "Absolutely. Visit our Contact page to begin a private consultation with our atelier." },
  { q: "How do I care for my jewelry?", a: "Avoid contact with perfumes and chemicals. We include a care guide and provide complimentary professional cleaning twice yearly." },
];

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PageShell>
      <PageHeader eyebrow="Help" title="Frequently Asked" />
      <section className="container-luxury pb-24 md:pb-32 max-w-3xl mx-auto">
        <div className="divide-y divide-pearl/10 border-y border-pearl/10">
          {FAQS.map((f, i) => (
            <div key={f.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
              >
                <span className="font-serif text-lg md:text-xl group-hover:text-champagne transition-colors">{f.q}</span>
                {open === i ? <Minus className="size-4 text-champagne shrink-0" /> : <Plus className="size-4 text-pearl/60 shrink-0" />}
              </button>
              {open === i && (
                <p className="pb-6 text-sm text-pearl/60 leading-relaxed max-w-2xl">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
