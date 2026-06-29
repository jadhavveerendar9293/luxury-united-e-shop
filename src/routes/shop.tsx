import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { ProductGrid } from "@/components/site/ProductGrid";
import { useProducts, useCategories } from "@/lib/products-api";

const searchSchema = z.object({
  category: fallback(z.string(), "all").default("all"),
  sort: fallback(
    z.enum(["featured", "newest", "price-asc", "price-desc", "best-selling", "rating"]),
    "featured",
  ).default("featured"),
  q: fallback(z.string(), "").default(""),
  max: fallback(z.number(), 100000).default(100000),
  availability: fallback(z.enum(["all", "in-stock"]), "all").default("all"),
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
  const { data: products = [], isPending: productsLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const filtered = useMemo(() => {
    let list = products.slice();
    if (search.category !== "all") list = list.filter((p) => p.category === search.category);
    if (search.q.trim()) {
      const q = search.q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.collection ?? "").toLowerCase().includes(q) ||
          (p.sku ?? "").toLowerCase().includes(q),
      );
    }
    list = list.filter((p) => p.price <= search.max);
    if (search.availability === "in-stock") list = list.filter((p) => p.stock > 0);

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
      case "best-selling":
        list.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || b.popularity - a.popularity);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
        break;
      default:
        list.sort(
          (a, b) =>
            Number(b.isFeatured) - Number(a.isFeatured) || b.popularity - a.popularity,
        );
    }
    return list;
  }, [products, search]);

  const update = (patch: Partial<typeof search>) =>
    navigate({ search: (prev: typeof search) => ({ ...prev, ...patch }) });

  const hasFilters =
    search.category !== "all" ||
    search.q !== "" ||
    search.max < 100000 ||
    search.availability !== "all";

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
              placeholder="Search pieces, collections, SKU"
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
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="best-selling">Best Selling</option>
              <option value="rating">Highest Rated</option>
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
                  active={search.category === c.slug}
                  onClick={() => update({ category: c.slug })}
                >
                  {c.name}
                </FilterChip>
              ))}
            </FilterGroup>

            <FilterGroup title="Availability">
              <FilterChip active={search.availability === "all"} onClick={() => update({ availability: "all" })}>
                All
              </FilterChip>
              <FilterChip
                active={search.availability === "in-stock"}
                onClick={() => update({ availability: "in-stock" })}
              >
                In stock only
              </FilterChip>
            </FilterGroup>

            <FilterGroup title={`Max Price · $${search.max.toLocaleString()}`}>
              <input
                type="range"
                min={500}
                max={100000}
                step={500}
                value={search.max}
                onChange={(e) => update({ max: Number(e.target.value) })}
                className="w-full accent-champagne"
              />
              <div className="flex justify-between text-[10px] text-pearl/40 mt-2">
                <span>$500</span>
                <span>$100,000</span>
              </div>
            </FilterGroup>

            {hasFilters && (
              <button
                onClick={() =>
                  update({ category: "all", q: "", max: 100000, availability: "all" })
                }
                className="flex items-center gap-2 eyebrow text-champagne"
              >
                <X className="size-3" /> Clear filters
              </button>
            )}
          </aside>

          <div>
            <p className="text-xs text-pearl/40 mb-6">{filtered.length} pieces</p>
            <ProductGrid
              products={filtered}
              isLoading={productsLoading}
              emptyTitle={hasFilters ? "Nothing matches" : "No Products Available"}
              emptyDescription={
                hasFilters
                  ? "Try adjusting your filters to discover more pieces."
                  : "Our atelier is preparing the next collection."
              }
            />
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
