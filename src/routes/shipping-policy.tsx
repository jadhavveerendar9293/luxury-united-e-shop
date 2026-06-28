import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({ meta: [{ title: "Shipping Policy — Luxury United" }] }),
  component: () => (
    <PolicyLayout eyebrow="Care" title="Shipping Policy" updated="June 2026">
      <p>Every Luxury United order is shipped complimentary, fully insured, and signed-for delivery worldwide.</p>
      <h2>Processing</h2>
      <p>In-stock items ship within 2 business days. Made-to-order pieces require 3–4 weeks.</p>
      <h2>Domestic delivery</h2>
      <p>Within France: 1–2 business days. EU: 2–4 business days.</p>
      <h2>International delivery</h2>
      <p>Worldwide express: 3–7 business days. Duties and import taxes are calculated at checkout.</p>
      <h2>Tracking</h2>
      <p>You'll receive a tracking link by email as soon as your order leaves our atelier.</p>
    </PolicyLayout>
  ),
});
