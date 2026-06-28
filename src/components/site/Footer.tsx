import { Link } from "@tanstack/react-router";

const COLS = [
  {
    title: "Collections",
    links: [
      { to: "/collections", label: "New Arrivals" },
      { to: "/collections", label: "Signature" },
      { to: "/collections", label: "Bridal" },
    ],
  },
  {
    title: "House",
    links: [
      { to: "/contact", label: "Our Story" },
      { to: "/contact", label: "Craftsmanship" },
      { to: "/contact", label: "Boutiques" },
    ],
  },
  {
    title: "Care",
    links: [
      { to: "/faq", label: "FAQ" },
      { to: "/shipping-policy", label: "Shipping" },
      { to: "/refund-policy", label: "Returns" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy-policy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
      { to: "/refund-policy", label: "Refund" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-32 border-t border-pearl/5 bg-obsidian">
      <div className="container-luxury pt-20 pb-10">
        <div className="max-w-md mb-16">
          <span className="eyebrow text-champagne">Join the Circle</span>
          <h3 className="font-serif text-2xl md:text-3xl mt-4 mb-4">Private access to new pieces.</h3>
          <p className="text-pearl/50 text-sm leading-relaxed mb-6">
            Subscribe for early releases, private events, and atelier dispatches.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative border-b border-pearl/20 focus-within:border-champagne transition-colors"
          >
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-transparent py-3 text-sm focus:outline-none placeholder:text-pearl/30 pr-16"
            />
            <button className="absolute right-0 bottom-3 eyebrow text-champagne">Join</button>
          </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {COLS.map((col) => (
            <div key={col.title} className="space-y-4">
              <p className="eyebrow text-pearl">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-pearl/50 hover:text-champagne transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-pearl/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-serif text-lg tracking-[0.25em] uppercase">Luxury United</div>
          <p className="text-[10px] tracking-[0.2em] text-pearl/30 uppercase">
            © {new Date().getFullYear()} Luxury United International
          </p>
        </div>
      </div>
    </footer>
  );
}
