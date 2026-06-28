import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { PageShell } from "@/components/site/PageShell";
import { useProductsRealtime } from "@/lib/products-api";
import { AuthProvider } from "@/hooks/use-auth";

function NotFoundComponent() {
  return (
    <PageShell>
      <div className="container-luxury py-32 text-center">
        <p className="eyebrow text-champagne mb-6">Error 404</p>
        <h1 className="font-serif text-6xl md:text-8xl mb-6">Page not found</h1>
        <p className="text-pearl/50 max-w-md mx-auto mb-10">
          The page you're looking for has been moved or never existed.
        </p>
        <Link
          to="/"
          className="inline-block bg-champagne text-obsidian px-10 py-4 eyebrow hover:bg-pearl transition-colors"
        >
          Return Home
        </Link>
      </div>
    </PageShell>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian text-pearl px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow text-champagne mb-6">Something went wrong</p>
        <h1 className="font-serif text-3xl mb-4">This page didn't load</h1>
        <p className="text-pearl/50 text-sm mb-8">Please try again or return home.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-champagne text-obsidian px-6 py-3 eyebrow"
          >
            Try again
          </button>
          <a href="/" className="border border-pearl/20 px-6 py-3 eyebrow">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Luxury United — Fine Jewelry, Crafted Without Compromise" },
      {
        name: "description",
        content:
          "Luxury United is a modern jewelry house creating timeless rings, earrings, bracelets, and necklaces in 18k gold and ethically sourced stones.",
      },
      { property: "og:title", content: "Luxury United — Fine Jewelry" },
      { property: "og:description", content: "Timeless pieces crafted in 18k gold." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RealtimeBridge />
        <Outlet />
        <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#0A0A0B", border: "1px solid rgba(255,255,255,0.08)", color: "#FDFCFB" } }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RealtimeBridge() {
  // Subscribes once to product table changes and invalidates queries automatically.
  // Must live inside QueryClientProvider.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useProductsRealtime();
  return null;
}
