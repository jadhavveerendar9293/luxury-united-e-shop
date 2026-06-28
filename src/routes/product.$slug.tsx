import { createFileRoute, notFound, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Truck, Shield, RotateCcw, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/site/PageShell";
import { ProductGrid } from "@/components/site/ProductGrid";
import { Reveal } from "@/components/site/Reveal";
import { stockStatus } from "@/lib/products";
import { useProduct, useProducts } from "@/lib/products-api";
import { formatPrice, useCart, useWishlist } from "@/lib/store";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug.replace(/-/g, " ")} — Luxury United` }],
  }),
  notFoundComponent: () => (
    <PageShell>
      <div className="container-luxury py-32 text-center">
        <h1 className="font-serif text-4xl mb-4">Piece not found</h1>
        <Link to="/shop" className="eyebrow text-champagne hairline-link">Back to Shop</Link>
      </div>
    </PageShell>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: all = [] } = useProducts();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wishIds = useWishlist((s) => s.ids);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <PageShell>
        <div className="container-luxury py-32 text-center text-pearl/40 eyebrow">Loading…</div>
      </PageShell>
    );
  }

  if (!product) throw notFound();

  const liked = wishIds.includes(product.id);
  const status = stockStatus(product.stock);
  const outOfStock = status.tone === "out";
  const related = all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    if (outOfStock) return;
    add(product, qty);
    toast.success(`${product.name} added to bag`);
  };
  const handleBuy = () => {
    if (outOfStock) return;
    add(product, qty);
    navigate({ to: "/checkout" });
  };

  const safeImages = product.images.length > 0 ? product.images : ["/products/product-aurelian.jpg"];

  return (
    <PageShell>
      <div className="container-luxury py-10 md:py-16">
        <nav className="eyebrow text-pearl/40 mb-8 flex gap-2">
          <Link to="/shop" className="hover:text-champagne">Shop</Link>
          <span>/</span>
          <span className="text-pearl/70">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16">
          {/* Gallery */}
          <div>
            <div
              className="relative aspect-square bg-card overflow-hidden mb-4 cursor-zoom-in"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
              }}
              onMouseLeave={() => setZoom(null)}
            >
              <motion.img
                key={activeImg}
                src={safeImages[activeImg]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
                style={zoom ? { transform: `scale(2)`, transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              />
              {product.discountPercent && (
                <span className="absolute top-4 left-4 bg-champagne text-obsidian eyebrow px-3 py-1.5">
                  −{product.discountPercent}%
                </span>
              )}
            </div>
            {safeImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {safeImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square overflow-hidden bg-card border transition-colors ${
                      activeImg === i ? "border-champagne" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:sticky md:top-28 md:self-start">
            {product.collection && (
              <p className="eyebrow text-champagne mb-4">{product.collection}</p>
            )}
            <h1 className="font-serif text-3xl md:text-5xl mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-0.5 text-champagne">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className={`size-3.5 ${k < Math.round(product.rating) ? "fill-current" : ""}`} />
                ))}
              </div>
              <span className="text-xs text-pearl/50">
                {product.rating} · {product.reviewsCount} reviews
              </span>
              {product.sku && (
                <span className="text-xs text-pearl/30 ml-auto">SKU {product.sku}</span>
              )}
            </div>
            <div className="flex items-baseline gap-3 mb-8">
              <p className="text-2xl text-champagne">{formatPrice(product.price)}</p>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <p className="text-base text-pearl/40 line-through">
                  {formatPrice(product.compareAtPrice)}
                </p>
              )}
            </div>
            <p className="text-pearl/70 leading-relaxed mb-8">{product.description}</p>

            <div className="mb-8">
              <p
                className={`eyebrow mb-2 ${
                  status.tone === "out"
                    ? "text-pearl/50"
                    : status.tone === "low"
                    ? "text-champagne"
                    : "text-pearl/60"
                }`}
              >
                {status.label}
              </p>
              <div className="h-px bg-pearl/10 relative">
                <div
                  className="absolute inset-y-0 left-0 bg-champagne"
                  style={{ width: `${Math.min(100, (product.stock / 20) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-pearl/15">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3" disabled={outOfStock}>
                  <Minus className="size-3.5" />
                </button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                  className="p-3"
                  disabled={outOfStock}
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
              <button
                onClick={() => toggleWish(product.id)}
                className={`size-12 border flex items-center justify-center transition-colors ${
                  liked ? "border-champagne text-champagne" : "border-pearl/15 text-pearl/70 hover:border-champagne"
                }`}
              >
                <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
              </button>
            </div>

            <div className="space-y-3 mb-10">
              <button
                onClick={handleAdd}
                disabled={outOfStock}
                className="w-full bg-champagne text-obsidian py-4 eyebrow hover:bg-pearl transition-colors flex items-center justify-center gap-2 disabled:bg-pearl/10 disabled:text-pearl/40 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="size-4" /> {outOfStock ? "Out of Stock" : "Add to Bag"}
              </button>
              <button
                onClick={handleBuy}
                disabled={outOfStock}
                className="w-full border border-pearl/20 py-4 eyebrow hover:bg-pearl/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10 pt-8 border-t border-pearl/10">
              <Perk icon={Truck} label="Complimentary shipping" />
              <Perk icon={RotateCcw} label="30-day returns" />
              <Perk icon={Shield} label="Lifetime guarantee" />
            </div>

            {product.details.length > 0 && (
              <div>
                <h3 className="eyebrow text-pearl mb-4">Details</h3>
                <ul className="space-y-2 text-sm text-pearl/60">
                  {product.details.map((d) => (
                    <li key={d} className="flex gap-3"><span className="text-champagne">—</span>{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-24 pt-16 border-t border-pearl/10">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl mb-10">Reviews</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {REVIEWS.map((r) => (
                <div key={r.name} className="bg-card/40 p-8">
                  <div className="flex gap-0.5 text-champagne mb-4">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className={`size-3 ${k < r.rating ? "fill-current" : ""}`} />
                    ))}
                  </div>
                  <p className="text-pearl/80 text-sm leading-relaxed mb-6">"{r.text}"</p>
                  <p className="eyebrow text-pearl">{r.name}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {related.length > 0 && (
          <section className="mt-24">
            <Reveal>
              <h2 className="font-serif text-3xl md:text-4xl mb-10">You may also love</h2>
            </Reveal>
            <ProductGrid products={related} columns="featured" />
          </section>
        )}
      </div>
    </PageShell>
  );
}

function Perk({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="text-center">
      <Icon className="size-4 text-champagne mx-auto mb-2" />
      <p className="text-[10px] text-pearl/60 leading-tight">{label}</p>
    </div>
  );
}

const REVIEWS = [
  { name: "Sofia L.", rating: 5, text: "Even more beautiful in person. The weight and finish are extraordinary." },
  { name: "Marcus B.", rating: 5, text: "A gift that became an heirloom the moment it arrived. Packaging alone is art." },
  { name: "Priya K.", rating: 4, text: "Subtle, refined, and built to last. Wear it daily without a second thought." },
];
