import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-obsidian text-pearl">
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 pt-16 md:pt-20"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="container-luxury py-16 md:py-24 text-center">
      {eyebrow && <p className="eyebrow text-champagne mb-6">{eyebrow}</p>}
      <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] max-w-3xl mx-auto">
        {title}
      </h1>
      {description && (
        <p className="text-pearl/50 max-w-xl mx-auto mt-6 text-sm md:text-base leading-relaxed">
          {description}
        </p>
      )}
    </section>
  );
}
