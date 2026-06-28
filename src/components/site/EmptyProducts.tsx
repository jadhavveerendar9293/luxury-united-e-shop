import { Gem } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function EmptyProducts({
  title = "No Products Available",
  description = "Our atelier is preparing the next collection. Please return soon.",
  showCta = false,
}: {
  title?: string;
  description?: string;
  showCta?: boolean;
}) {
  return (
    <div className="py-24 md:py-32 text-center">
      <div className="size-16 mx-auto mb-8 rounded-full border border-champagne/30 flex items-center justify-center">
        <Gem className="size-6 text-champagne" />
      </div>
      <h2 className="font-serif text-2xl md:text-3xl mb-3">{title}</h2>
      <p className="text-pearl/50 max-w-md mx-auto text-sm">{description}</p>
      {showCta && (
        <Link
          to="/contact"
          className="inline-block mt-8 eyebrow hairline-link text-champagne"
        >
          Request a private viewing
        </Link>
      )}
    </div>
  );
}
