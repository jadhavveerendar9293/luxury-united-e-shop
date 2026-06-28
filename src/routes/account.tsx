import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { useAuth, useCart, useWishlist } from "@/lib/store";
import { useProducts } from "@/lib/products-api";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — Luxury United" }] }),
  component: AccountPage,
});

function AccountPage() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const wishlist = useWishlist((s) => s.ids);
  const cartCount = useCart((s) => s.items.length);
  const navigate = useNavigate();
  const { data: products = [] } = useProducts();

  if (!user) {
    return (
      <PageShell>
        <div className="container-luxury py-32 text-center">
          <h1 className="font-serif text-4xl mb-6">Welcome back</h1>
          <p className="text-pearl/50 mb-8">Sign in to view your account.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/login" className="bg-champagne text-obsidian px-8 py-4 eyebrow">Sign In</Link>
            <Link to="/signup" className="border border-pearl/20 px-8 py-4 eyebrow">Create Account</Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader eyebrow={`Hello, ${user.name}`} title="Your Account" />
      <section className="container-luxury pb-24">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Stat label="Orders" value="3" />
          <Stat label="Wishlist" value={String(wishlist.length)} />
          <Stat label="Bag" value={String(cartCount)} />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <Panel title="Profile">
            <Row k="Name" v={user.name} />
            <Row k="Email" v={user.email} />
            <button
              onClick={() => { logout(); navigate({ to: "/" }); }}
              className="mt-6 eyebrow text-champagne hairline-link"
            >
              Sign Out
            </button>
          </Panel>

          <Panel title="Recent Orders">
            <div className="space-y-4">
              {products.slice(0, 2).map((p) => (
                <div key={p.id} className="flex gap-4 items-center pb-4 border-b border-pearl/10 last:border-0">
                  <img src={p.images[0]} className="size-14 object-cover bg-card" alt="" />
                  <div className="flex-1">
                    <p className="text-sm">{p.name}</p>
                    <p className="text-xs text-pearl/40">Delivered · 2 weeks ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card/40 p-8">
      <p className="eyebrow text-pearl/50 mb-3">{label}</p>
      <p className="font-serif text-4xl text-champagne">{value}</p>
    </div>
  );
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card/40 p-8">
      <h3 className="font-serif text-2xl mb-6">{title}</h3>
      {children}
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between py-3 border-b border-pearl/10 last:border-0">
      <span className="eyebrow text-pearl/50">{k}</span>
      <span className="text-sm">{v}</span>
    </div>
  );
}
