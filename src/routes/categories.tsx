import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { useCategories } from "@/lib/products-api";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Luxury United" },
      { name: "description", content: "Explore rings, earrings, bracelets, and necklaces." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <PageShell>
      <PageHeader eyebrow="Shop By" title="Categories" />
      <section className="container-luxury pb-24 md:pb-32">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/3] bg-pearl/5 animate-pulse rounded" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-pearl/50">No categories available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {categories.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.08}>
                <Link to="/shop" search={{ category: c.slug }} className="block group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-card">
                    {c.imageUrl ? (
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-pearl/10 flex items-center justify-center">
                        <span className="text-4xl font-serif text-pearl/30">{c.name[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                      <h2 className="font-serif text-3xl md:text-4xl mb-2">{c.name}</h2>
                      <p className="text-pearl/60 text-sm">{c.tagline || c.description}</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
