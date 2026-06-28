// Product domain types + static taxonomy (categories & collections).
// Product data itself is fetched from the database — see `products-api.ts`.

export type Category = "rings" | "earrings" | "bracelets" | "necklaces";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  collection: string | null;
  category: Category;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  discountPercent: number | null;
  images: string[];
  details: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  popularity: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  createdAt: string;
}

export const categories: { id: Category; name: string; image: string; tagline: string }[] = [
  { id: "rings", name: "Rings", image: "/products/cat-rings.jpg", tagline: "Eternal silhouettes" },
  { id: "earrings", name: "Earrings", image: "/products/cat-earrings.jpg", tagline: "Light, captured" },
  { id: "bracelets", name: "Bracelets", image: "/products/cat-bracelets.jpg", tagline: "Quiet gestures" },
  { id: "necklaces", name: "Necklaces", image: "/products/cat-necklaces.jpg", tagline: "Heirloom presence" },
];

export const collections = [
  { id: "eternal", name: "The Eternal", description: "Foundational pieces designed to outlast the season.", image: "/products/product-aurelian.jpg" },
  { id: "aurelian", name: "Aurelian Series", description: "Hammered gold with a hand-finished glow.", image: "/products/product-tennis.jpg" },
  { id: "noir", name: "Noir Edit", description: "Obsidian-toned stones set in deep gold.", image: "/products/product-emerald-pendant.jpg" },
];

export function computeDiscountPercent(price: number, compareAt: number | null): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function stockStatus(stock: number): { label: string; tone: "in" | "low" | "out" } {
  if (stock <= 0) return { label: "Out of Stock", tone: "out" };
  if (stock <= 5) return { label: `Only ${stock} left`, tone: "low" };
  return { label: "In Stock", tone: "in" };
}
