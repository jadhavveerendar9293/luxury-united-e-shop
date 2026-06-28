import type { ReactNode } from "react";
import { PageShell, PageHeader } from "./PageShell";

export function PolicyLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <PageShell>
      <PageHeader eyebrow={eyebrow} title={title} />
      <article className="container-luxury pb-24 md:pb-32 max-w-3xl mx-auto">
        <p className="eyebrow text-pearl/40 mb-12">Last updated · {updated}</p>
        <div className="space-y-8 text-pearl/70 leading-relaxed text-[15px] [&_h2]:font-serif [&_h2]:text-pearl [&_h2]:text-2xl [&_h2]:mt-12 [&_h2]:mb-4 [&_p]:mb-4">
          {children}
        </div>
      </article>
    </PageShell>
  );
}
