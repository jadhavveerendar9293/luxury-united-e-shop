import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, useWishlist } from "@/lib/store";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/collections", label: "Collections" },
  { to: "/categories", label: "Categories" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCart((s) => s.items.reduce((a, b) => a + b.qty, 0));
  const wishCount = useWishlist((s) => s.ids.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-obsidian/85 backdrop-blur-xl border-b border-pearl/5"
          : "bg-transparent"
      }`}
    >
      <div className="container-luxury flex items-center justify-between h-16 md:h-20">
        <button
          aria-label="Menu"
          onClick={() => setOpen(true)}
          className="md:hidden p-2 -ml-2 text-pearl"
        >
          <Menu className="size-5" />
        </button>

        <Link
          to="/"
          className="font-serif text-base md:text-xl tracking-[0.25em] uppercase text-pearl"
        >
          Luxury United
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="eyebrow text-pearl/70 hover:text-champagne transition-colors"
              activeProps={{ className: "eyebrow text-champagne" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2 text-pearl">
          <Link to="/shop" aria-label="Search" className="p-2 hover:text-champagne transition-colors">
            <Search className="size-[18px]" />
          </Link>
          <Link
            to="/account"
            aria-label="Account"
            className="hidden md:inline-flex p-2 hover:text-champagne transition-colors"
          >
            <User className="size-[18px]" />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist" className="relative p-2 hover:text-champagne transition-colors">
            <Heart className="size-[18px]" />
            {wishCount > 0 && (
              <span className="absolute top-1 right-1 size-1.5 rounded-full bg-champagne" />
            )}
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative p-2 hover:text-champagne transition-colors">
            <ShoppingBag className="size-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-champagne text-obsidian text-[9px] font-medium flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-obsidian md:hidden"
          >
            <div className="container-luxury flex items-center justify-between h-16">
              <span className="font-serif tracking-[0.25em] uppercase">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close" className="p-2 -mr-2">
                <X className="size-5" />
              </button>
            </div>
            <nav className="container-luxury pt-12 flex flex-col gap-6">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  <Link
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="font-serif text-4xl text-pearl hover:text-champagne"
                  >
                    {n.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-8 pt-8 border-t border-pearl/10 flex flex-col gap-4 eyebrow text-pearl/60">
                <Link to="/account" onClick={() => setOpen(false)}>Account</Link>
                <Link to="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>
                <Link to="/cart" onClick={() => setOpen(false)}>Cart</Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
