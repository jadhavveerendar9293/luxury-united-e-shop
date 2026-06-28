import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { useCart, formatPrice } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Luxury United" }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const update = useCart((s) => s.update);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());

  if (items.length === 0) {
    return (
      <PageShell>
        <div className="container-luxury py-32 text-center">
          <ShoppingBag className="size-10 text-champagne mx-auto mb-6" />
          <h1 className="font-serif text-4xl mb-4">Your bag is empty</h1>
          <p className="text-pearl/50 mb-10">Discover pieces worth carrying home.</p>
          <Link to="/shop" className="inline-block bg-champagne text-obsidian px-10 py-4 eyebrow hover:bg-pearl transition-colors">
            Browse Shop
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader eyebrow="Your Selection" title="Shopping Bag" />
      <section className="container-luxury pb-24">
        <div className="grid md:grid-cols-[1fr_400px] gap-12">
          <div className="space-y-6">
            {items.map((i) => (
              <div key={i.id} className="flex gap-5 pb-6 border-b border-pearl/10">
                <Link to="/product/$slug" params={{ slug: i.product.slug }} className="shrink-0">
                  <img src={i.product.images[0]} alt={i.product.name} className="size-24 md:size-32 object-cover bg-card" />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="eyebrow text-pearl/40 mb-1">{i.product.collection}</p>
                  <h3 className="font-serif text-lg md:text-xl mb-3 truncate">{i.product.name}</h3>
                  <p className="text-champagne mb-4">{formatPrice(i.product.price)}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-pearl/15">
                      <button onClick={() => update(i.id, i.qty - 1)} className="p-2"><Minus className="size-3" /></button>
                      <span className="w-8 text-center text-sm">{i.qty}</span>
                      <button onClick={() => update(i.id, i.qty + 1)} className="p-2"><Plus className="size-3" /></button>
                    </div>
                    <button onClick={() => remove(i.id)} className="text-pearl/50 hover:text-champagne text-xs flex items-center gap-1.5">
                      <X className="size-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="md:sticky md:top-28 md:self-start bg-card/40 p-8 space-y-6">
            <h2 className="font-serif text-2xl">Summary</h2>
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Shipping" value="Complimentary" />
            <div className="h-px bg-pearl/10" />
            <Row label="Total" value={formatPrice(subtotal)} large />
            <Link to="/checkout" className="block text-center bg-champagne text-obsidian py-4 eyebrow hover:bg-pearl transition-colors">
              Checkout
            </Link>
            <Link to="/shop" className="block text-center eyebrow text-pearl/60 hover:text-champagne">Continue Shopping</Link>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function Row({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className={large ? "font-serif text-lg" : "eyebrow text-pearl/60"}>{label}</span>
      <span className={large ? "font-serif text-xl text-champagne" : "text-sm"}>{value}</span>
    </div>
  );
}
