import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { type Product, stockStatus } from "@/lib/products";
import { formatPrice, useWishlist } from "@/lib/store";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const toggle = useWishlist((s) => s.toggle);
  const ids = useWishlist((s) => s.ids);
  const liked = ids.includes(product.id);
  const [hover, setHover] = useState(false);

  const status = stockStatus(product.stock);
  const primary = product.images[0] ?? "/products/product-aurelian.jpg";
  const swap = product.images[1] ?? primary;

  const badge = product.isNewArrival
    ? "New"
    : product.isBestSeller
    ? "Best Seller"
    : product.isFeatured
    ? "Featured"
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div
          className="relative aspect-[4/5] overflow-hidden bg-card mb-4"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <img
            src={primary}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${hover && swap !== primary ? "opacity-0" : "opacity-100"}`}
          />
          {swap !== primary && (
            <img
              src={swap}
              alt=""
              loading="lazy"
              aria-hidden
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${hover ? "opacity-100 scale-105" : "opacity-0"}`}
            />
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {badge && (
              <span className="bg-obsidian/80 backdrop-blur-md eyebrow text-champagne px-2 py-1 w-fit">
                {badge}
              </span>
            )}
            {product.discountPercent && (
              <span className="bg-champagne text-obsidian eyebrow px-2 py-1 w-fit">
                −{product.discountPercent}%
              </span>
            )}
            {status.tone === "out" && (
              <span className="bg-obsidian/80 backdrop-blur-md eyebrow text-pearl/70 px-2 py-1 w-fit">
                Sold Out
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
            }}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-3 right-3 size-9 rounded-full bg-obsidian/60 backdrop-blur-md border border-pearl/10 flex items-center justify-center text-pearl/80 hover:text-champagne transition-colors"
          >
            <Heart className={`size-4 ${liked ? "fill-champagne text-champagne" : ""}`} />
          </button>

          {status.tone === "low" && (
            <span className="absolute bottom-3 left-3 bg-obsidian/80 backdrop-blur-md eyebrow text-champagne px-2 py-1">
              {status.label}
            </span>
          )}
        </div>

        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            {product.collection && (
              <p className="eyebrow text-pearl/40 mb-1.5 truncate">{product.collection}</p>
            )}
            <h3 className="font-serif text-base md:text-lg truncate">{product.name}</h3>
          </div>
          <div className="text-right whitespace-nowrap pt-1">
            <span className="text-sm text-champagne block">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-pearl/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
