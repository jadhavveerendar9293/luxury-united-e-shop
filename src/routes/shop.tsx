import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { ProductCard } from "@/components/site/ProductCard";
import { products, categories, type Category } from "@/lib/products";

const searchSchema = z.object({
  category: fallback(z.enum(["rings", "earrings", "bracelets", "necklaces", "all"]), "all").default("all"),
  sort: fallback(z.enum(["popular", "newest", "price-asc", "price-desc"]), "popular").default("popular"),
  q: fallback(z.string(), "").default(""),
  max: fallback(z.number(), 10000).default(10000),
});

export const Route = createFileRoute("/shop")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Shop — Luxury United" },
      { name: "description", content: "Browse the full Luxury United jewelry catalog." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.slice();
    if (search.category !== "all") list = list.filter((p) => p.category === search.category);
    if (search.q.trim()) {
      const q = search.q.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.collection.toLowerCase().includes(q),
      );
    }
    list = list.filter((p) => p.price <= search.max);
    switch (search.sort) {
      case "newest":
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        list.sort((a, b) => b.popularity - a.popularity);
    }
    return list;
  }, [search]);

  const update = (patch: Partial<typeof search>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  return (
    <PageShell>
      <PageHeader eyebrow="Catalog" title="Shop" description="All pieces. Filter, search, and find yours." />
      <section className="container-luxury pb-24 md:pb-32">
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-pearl/40" />
            <input
              type="search"
              value={search.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Search pieces and collections"
              className="w-full bg-card border border-pearl/10 pl-11 pr-4 py-3 text-sm placeholder:text-pearl/30 focus:outline-none focus:border-champagne transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="md:hidden flex-1 flex items-center justify-center gap-2 border border-pearl/15 px-4 py-3 eyebrow"
            >
              <SlidersHorizontal className="size-3.5" /> Filters
            </button>
            <select
              value={search.sort}
              onChange={(e) => update({ sort: e.target.value as typeof search.sort })}
              className="bg-card border border-pearl/10 px-4 py-3 text-sm focus:outline-none focus:border-champagne"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-[220px_1fr] gap-10">
          <aside className={`${filtersOpen ? "block" : "hidden"} md:block space-y-10`}>
            <FilterGroup title="Category">
              <FilterChip active={search.category === "all"} onClick={() => update({ category: "all" })}>
                All
              </FilterChip>
              {categories.map((c) => (
                <FilterChip
                  key={c.id}
                  active={search.category === c.id}
                  onClick={() => update({ category: c.id as Category })}
                >
                  {c.name}
                </FilterChip>
              ))}
            </FilterGroup>

            <FilterGroup title={`Max Price · $${search.max.toLocaleString()}`}>
              <input
                type="range"
                min={500}
                max={10000}
                step={100}
                value={search.max}
                onChange={(e) => update({ max: Number(e.target.value) })}
                className="w-full accent-champagne"
              />
              <div className="flex justify-between text-[10px] text-pearl/40 mt-2">
                <span>$500</span>
                <span>$10,000</span>
              </div>
            </FilterGroup>

            {(search.category !== "all" || search.q || search.max < 10000) && (
              <button
                onClick={() => update({ category: "all", q: "", max: 10000 })}
                className="flex items-center gap-2 eyebrow text-champagne"
              >
                <X className="size-3" /> Clear filters
              </button>
            )}
          </aside>

          <div>
            <p className="text-xs text-pearl/40 mb-6">{filtered.length} pieces</p>
            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-serif text-2xl mb-3">Nothing matches.</p>
                <p className="text-pearl/50 text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow text-pearl mb-4">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left text-sm py-1.5 transition-colors ${
        active ? "text-champagne" : "text-pearl/60 hover:text-pearl"
      }`}
    >
      {children}
    </button>
  );
}
