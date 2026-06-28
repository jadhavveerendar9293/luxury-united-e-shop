import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { formatPrice, useWishlist } from "@/lib/store";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const toggle = useWishlist((s) => s.toggle);
  const ids = useWishlist((s) => s.ids);
  const liked = ids.includes(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-card mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-obsidian/80 backdrop-blur-md eyebrow text-champagne px-2 py-1">
              {product.badge}
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
            }}
            aria-label="Toggle wishlist"
            className="absolute top-3 right-3 size-9 rounded-full bg-obsidian/60 backdrop-blur-md border border-pearl/10 flex items-center justify-center text-pearl/80 hover:text-champagne transition-colors"
          >
            <Heart className={`size-4 ${liked ? "fill-champagne text-champagne" : ""}`} />
          </button>
        </div>
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <p className="eyebrow text-pearl/40 mb-1.5 truncate">{product.collection}</p>
            <h3 className="font-serif text-base md:text-lg truncate">{product.name}</h3>
          </div>
          <span className="text-sm text-champagne whitespace-nowrap pt-1">{formatPrice(product.price)}</span>
        </div>
      </Link>
    </motion.div>
  );
}
