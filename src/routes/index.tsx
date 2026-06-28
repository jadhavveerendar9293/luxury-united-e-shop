import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { products, categories, collections } from "@/lib/products";
import heroImg from "@/assets/hero-necklace.jpg";
import bannerImg from "@/assets/banner-editorial.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luxury United — Fine Jewelry, Crafted Without Compromise" },
      { name: "description", content: "Discover timeless jewelry in 18k gold and ethically sourced stones." },
      { property: "og:title", content: "Luxury United — Fine Jewelry" },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Home,
});

function Home() {
  const bestSellers = products.slice(0, 4);
  const newArrivals = products.filter((p) => p.badge === "New" || p.badge === "Limited");

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative">
        <div className="container-luxury pt-6 md:pt-10">
          <div className="relative aspect-[4/5] md:aspect-[16/9] overflow-hidden">
            <motion.img
              src={heroImg}
              alt="The Eternal Collection"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
            <div className="absolute inset-0 flex items-end md:items-center">
              <div className="container-luxury pb-10 md:pb-0">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-lg"
                >
                  <p className="eyebrow text-champagne mb-6">The Eternal Collection</p>
                  <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.02] mb-6">
                    Timeless<br />
                    <span className="italic text-champagne">Excellence</span>
                  </h1>
                  <p className="text-pearl/60 text-sm md:text-base max-w-sm mb-8 leading-relaxed">
                    Curated, hand-crafted pieces designed for those who seek the extraordinary.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 bg-champagne text-obsidian px-8 py-4 eyebrow hover:bg-pearl transition-colors group"
                    >
                      Explore Now
                      <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/collections"
                      className="inline-flex items-center px-8 py-4 eyebrow border border-pearl/20 hover:bg-pearl/5 transition-colors"
                    >
                      View Collections
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="container-luxury py-24 md:py-32">
        <Reveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="eyebrow text-champagne mb-4">Featured</p>
              <h2 className="font-serif text-3xl md:text-5xl">Our Collections</h2>
            </div>
            <Link to="/collections" className="eyebrow hairline-link text-champagne hidden md:inline-block">
              View All
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08}>
              <Link to="/collections" className="block group">
                <div className="relative aspect-[3/4] overflow-hidden bg-card mb-4">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-serif text-2xl md:text-3xl text-pearl">{c.name}</h3>
                    <p className="text-pearl/60 text-sm mt-2">{c.description}</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-card/40 py-24 md:py-32">
        <div className="container-luxury">
          <Reveal>
            <div className="text-center mb-16">
              <p className="eyebrow text-champagne mb-4">Shop By</p>
              <h2 className="font-serif text-3xl md:text-5xl">Categories</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.06}>
                <Link to="/shop" search={{ category: c.id }} className="group block">
                  <div className="aspect-square overflow-hidden bg-card mb-4">
                    <img
                      src={c.image}
                      alt={c.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                  </div>
                  <p className="eyebrow text-pearl group-hover:text-champagne transition-colors">{c.name}</p>
                  <p className="text-xs text-pearl/40 mt-1.5">{c.tagline}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container-luxury py-24 md:py-32">
        <Reveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="eyebrow text-champagne mb-4">Most Loved</p>
              <h2 className="font-serif text-3xl md:text-5xl">Best Sellers</h2>
            </div>
            <Link to="/shop" className="eyebrow hairline-link text-champagne hidden md:inline-block">
              Shop All
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
          {bestSellers.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="container-luxury">
        <Reveal>
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-card">
            <img src={bannerImg} alt="Atelier" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/50 to-transparent" />
            <div className="relative h-full flex items-center">
              <div className="container-luxury">
                <p className="eyebrow text-champagne mb-4">Bespoke</p>
                <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl max-w-xl leading-tight mb-6">
                  Personalized <span className="italic">artistry</span>, made for you.
                </h2>
                <p className="text-pearl/60 max-w-md text-sm md:text-base mb-8">
                  Consult with our master artisans to create an heirloom that carries your story.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-champagne text-obsidian px-8 py-4 eyebrow hover:bg-pearl transition-colors"
                >
                  Book an Appointment
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container-luxury py-24 md:py-32">
          <Reveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="eyebrow text-champagne mb-4">Just In</p>
                <h2 className="font-serif text-3xl md:text-5xl">New Arrivals</h2>
              </div>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="bg-card/40 py-24 md:py-32">
        <div className="container-luxury">
          <Reveal>
            <p className="eyebrow text-champagne text-center mb-4">Voices</p>
            <h2 className="font-serif text-3xl md:text-5xl text-center mb-16">Words from our circle</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <figure className="space-y-6">
                  <div className="flex gap-1 text-champagne">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="size-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="font-serif text-xl md:text-2xl leading-relaxed text-pearl/90">
                    "{t.quote}"
                  </blockquote>
                  <figcaption>
                    <p className="eyebrow text-pearl">{t.name}</p>
                    <p className="text-xs text-pearl/40 mt-1">{t.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

const TESTIMONIALS = [
  { name: "Amelia R.", role: "Collector, NYC", quote: "Every piece arrives like an heirloom — weighted, intentional, and quietly extraordinary." },
  { name: "Hideo T.", role: "Architect, Tokyo", quote: "The craftsmanship rewards close attention. These are objects you can live with for decades." },
  { name: "Léa M.", role: "Curator, Paris", quote: "Luxury United understands restraint. Nothing is performative. Everything is considered." },
];
