import aurelian from "@/assets/product-aurelian.jpg";
import solitaire from "@/assets/product-solitaire.jpg";
import pearlDrops from "@/assets/product-pearl-drops.jpg";
import emeraldPendant from "@/assets/product-emerald-pendant.jpg";
import tennis from "@/assets/product-tennis.jpg";
import eternity from "@/assets/product-eternity.jpg";
import sapphire from "@/assets/product-sapphire.jpg";
import catRings from "@/assets/cat-rings.jpg";
import catEarrings from "@/assets/cat-earrings.jpg";
import catBracelets from "@/assets/cat-bracelets.jpg";
import catNecklaces from "@/assets/cat-necklaces.jpg";

export type Category = "rings" | "earrings" | "bracelets" | "necklaces";

export interface Product {
  id: string;
  slug: string;
  name: string;
  collection: string;
  category: Category;
  price: number;
  description: string;
  details: string[];
  images: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  popularity: number;
  createdAt: string;
  badge?: string;
}

export const categories: { id: Category; name: string; image: string; tagline: string }[] = [
  { id: "rings", name: "Rings", image: catRings, tagline: "Eternal silhouettes" },
  { id: "earrings", name: "Earrings", image: catEarrings, tagline: "Light, captured" },
  { id: "bracelets", name: "Bracelets", image: catBracelets, tagline: "Quiet gestures" },
  { id: "necklaces", name: "Necklaces", image: catNecklaces, tagline: "Heirloom presence" },
];

export const collections = [
  { id: "eternal", name: "The Eternal", description: "Foundational pieces designed to outlast the season.", image: aurelian },
  { id: "aurelian", name: "Aurelian Series", description: "Hammered gold with a hand-finished glow.", image: tennis },
  { id: "noir", name: "Noir Edit", description: "Obsidian-toned stones set in deep gold.", image: emeraldPendant },
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "aurelian-bracelet",
    name: "Aurelian Bracelet",
    collection: "Aurelian Series",
    category: "bracelets",
    price: 2450,
    description:
      "Crafted in 18k solid gold, the Aurelian Bracelet features a distinctive hammer-textured finish that catches the light from every angle.",
    details: ["18k solid gold", "Hand-hammered finish", "Adjustable 6.5\"–7.5\"", "Lifetime guarantee"],
    images: [aurelian, catBracelets, tennis],
    stock: 6,
    rating: 4.9,
    reviewsCount: 124,
    popularity: 98,
    createdAt: "2026-04-12",
    badge: "Best Seller",
  },
  {
    id: "p2",
    slug: "solitaire-aura-ring",
    name: "Solitaire Aura Ring",
    collection: "The Eternal",
    category: "rings",
    price: 4280,
    description: "A single brilliant-cut diamond cradled in a whisper-thin band of 18k gold.",
    details: ["1.0ct lab-grown diamond", "VS1 clarity", "18k gold band", "Sizes 4–10"],
    images: [solitaire, catRings, eternity],
    stock: 3,
    rating: 5.0,
    reviewsCount: 88,
    popularity: 95,
    createdAt: "2026-05-02",
    badge: "New",
  },
  {
    id: "p3",
    slug: "lunar-pearl-drops",
    name: "Lunar Pearl Drops",
    collection: "Noir Edit",
    category: "earrings",
    price: 1690,
    description: "Lustrous freshwater pearls suspended from a refined gold thread.",
    details: ["Freshwater pearls 9mm", "18k gold thread", "Push-back closure"],
    images: [pearlDrops, catEarrings, solitaire],
    stock: 12,
    rating: 4.8,
    reviewsCount: 64,
    popularity: 82,
    createdAt: "2026-03-20",
  },
  {
    id: "p4",
    slug: "emerald-vesper-pendant",
    name: "Emerald Vesper Pendant",
    collection: "Noir Edit",
    category: "necklaces",
    price: 3120,
    description: "A single emerald in bezel setting on an 18-inch chain.",
    details: ["0.8ct emerald", "18k gold bezel", "18\" cable chain"],
    images: [emeraldPendant, catNecklaces, sapphire],
    stock: 5,
    rating: 4.7,
    reviewsCount: 41,
    popularity: 76,
    createdAt: "2026-02-15",
  },
  {
    id: "p5",
    slug: "tennis-bracelet-classique",
    name: "Tennis Bracelet Classique",
    collection: "The Eternal",
    category: "bracelets",
    price: 5890,
    description: "A continuous line of brilliant-cut diamonds in a four-prong setting.",
    details: ["3.5ct total weight", "VS clarity", "18k white gold"],
    images: [tennis, catBracelets, solitaire],
    stock: 2,
    rating: 4.9,
    reviewsCount: 53,
    popularity: 89,
    createdAt: "2026-04-29",
    badge: "Limited",
  },
  {
    id: "p6",
    slug: "eternity-trio-rings",
    name: "Eternity Trio Rings",
    collection: "Aurelian Series",
    category: "rings",
    price: 2980,
    description: "A stackable set of three hand-finished gold bands.",
    details: ["Set of 3", "18k gold", "Sizes 4–10"],
    images: [eternity, catRings, aurelian],
    stock: 8,
    rating: 4.8,
    reviewsCount: 37,
    popularity: 71,
    createdAt: "2026-01-09",
  },
  {
    id: "p7",
    slug: "sapphire-nocturne",
    name: "Sapphire Nocturne",
    collection: "Noir Edit",
    category: "necklaces",
    price: 4620,
    description: "Deep blue sapphire on a delicate gold chain.",
    details: ["1.2ct sapphire", "18k gold", "16\"–18\" adjustable"],
    images: [sapphire, catNecklaces, emeraldPendant],
    stock: 4,
    rating: 4.9,
    reviewsCount: 29,
    popularity: 78,
    createdAt: "2026-05-18",
    badge: "New",
  },
  {
    id: "p8",
    slug: "petite-orbit-studs",
    name: "Petite Orbit Studs",
    collection: "The Eternal",
    category: "earrings",
    price: 890,
    description: "Everyday diamond studs in a minimal four-prong setting.",
    details: ["0.5ct total", "18k gold", "Screw-back closure"],
    images: [pearlDrops, catEarrings, solitaire],
    stock: 18,
    rating: 4.7,
    reviewsCount: 211,
    popularity: 92,
    createdAt: "2026-01-22",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getRelated = (p: Product) =>
  products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
