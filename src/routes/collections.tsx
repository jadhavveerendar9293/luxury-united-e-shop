import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { collections } from "@/lib/products";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Luxury United" },
      { name: "description", content: "Browse our curated jewelry collections, each crafted with purpose." },
    ],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="The House" title="Collections" description="Each collection is built around a singular point of view — a metal, a stone, a feeling." />
      <section className="container-luxury pb-24 md:pb-32 space-y-20 md:space-y-32">
        {collections.map((c, i) => (
          <Reveal key={c.id}>
            <div className={`grid md:grid-cols-2 gap-10 md:gap-20 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className="aspect-[4/5] overflow-hidden bg-card">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div>
                <p className="eyebrow text-champagne mb-4">0{i + 1} — Collection</p>
                <h2 className="font-serif text-4xl md:text-5xl mb-6">{c.name}</h2>
                <p className="text-pearl/60 leading-relaxed mb-8 max-w-md">{c.description}</p>
                <Link to="/shop" className="eyebrow hairline-link text-champagne">Shop the collection</Link>
              </div>
            </div>
          </Reveal>
        ))}
      </section>
    </PageShell>
  );
}
