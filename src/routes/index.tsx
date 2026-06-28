import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { ProductGrid } from "@/components/site/ProductGrid";
import { Reveal } from "@/components/site/Reveal";
import { useProducts, useCategories, useCollections, useWebsiteSettings } from "@/lib/products-api";
const heroImg = "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1600";
const bannerImg = "https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=1600";

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
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: collections = [] } = useCollections();
  const { data: settings } = useWebsiteSettings();

  const bestSellers = products
    .filter((p) => p.isBestSeller)
    .slice(0, 4);
  const featured = bestSellers.length > 0 ? bestSellers : products.slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  const heroTitle = settings?.hero_title || "Timeless";
  const heroSubtitle = settings?.hero_subtitle || "Curated, hand-crafted pieces designed for those who seek the extraordinary.";
  const heroCollectionName = settings?.hero_collection_name || "The Eternal Collection";
  const heroCtaText = settings?.hero_cta_text || "Explore Now";
  const heroCtaLink = settings?.hero_cta_link || "/shop";
  const siteName = settings?.site_name || "Luxury United";

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
                  <p className="eyebrow text-champagne mb-6">{heroCollectionName}</p>
                  <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.02] mb-6">
                    {heroTitle.split(' ').map((word, i, arr) => (
                      i === arr.length - 1 ? (
                        <span key={i} className="italic text-champagne">{word}</span>
                      ) : (
                        <span key={i}>{word} </span>
                      )
                    ))}
                  </h1>
                  <p className="text-pearl/60 text-sm md:text-base max-w-sm mb-8 leading-relaxed">
                    {heroSubtitle}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={heroCtaLink}
                      className="inline-flex items-center gap-2 bg-champagne text-obsidian px-8 py-4 eyebrow hover:bg-pearl transition-colors group"
                    >
                      {heroCtaText}
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
                    src={c.imageUrl || bannerImg}
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
                <Link to="/shop" search={{ category: c.slug }} className="group block">
                  <div className="aspect-square overflow-hidden bg-card mb-4">
                    {c.imageUrl ? (
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-pearl/10 flex items-center justify-center">
                        <span className="text-pearl/30 text-2xl font-serif">{c.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <p className="eyebrow text-pearl group-hover:text-champagne transition-colors">{c.name}</p>
                  <p className="text-xs text-pearl/40 mt-1.5">{c.tagline || c.description}</p>
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
        <ProductGrid
          products={featured}
          isLoading={isLoading}
          columns="featured"
          emptyTitle="No Products Available"
          emptyDescription="The collection is being prepared. Please return shortly."
        />
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
          <ProductGrid products={newArrivals} columns="featured" />
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
