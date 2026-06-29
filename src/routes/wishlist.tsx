import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { ProductGrid } from "@/components/site/ProductGrid";
import { useProducts } from "@/lib/products-api";
import { useWishlist } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Luxury United" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const { data: products = [], isPending: productsLoading } = useProducts();
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <PageShell>
      <PageHeader eyebrow="Saved" title="Wishlist" description="Pieces you're considering." />
      <section className="container-luxury pb-24 md:pb-32">
        {!productsLoading && ids.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="size-10 text-champagne mx-auto mb-6" />
            <p className="font-serif text-2xl mb-3">Nothing saved yet</p>
            <p className="text-pearl/50 mb-8">Tap the heart on any piece to save it here.</p>
            <Link
              to="/shop"
              className="inline-block bg-champagne text-obsidian px-10 py-4 eyebrow"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <ProductGrid
            products={items}
            isLoading={productsLoading}
            columns="featured"
            emptyTitle="Saved pieces unavailable"
            emptyDescription="The items you saved are no longer in the catalog."
          />
        )}
      </section>
    </PageShell>
  );
}
