import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { EmptyProducts } from "./EmptyProducts";
import { ProductGridSkeleton } from "./ProductCardSkeleton";

export function ProductGrid({
  products,
  isLoading = false,
  columns = "shop",
  emptyTitle,
  emptyDescription,
}: {
  products: Product[];
  isLoading?: boolean;
  columns?: "shop" | "featured";
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const grid =
    columns === "featured"
      ? "grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12"
      : "grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12";

  if (isLoading) return <ProductGridSkeleton count={columns === "featured" ? 4 : 6} />;

  if (products.length === 0) {
    return <EmptyProducts title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={grid}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
