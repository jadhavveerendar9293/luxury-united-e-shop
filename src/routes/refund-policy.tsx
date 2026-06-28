import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({ meta: [{ title: "Refund Policy — Luxury United" }] }),
  component: () => (
    <PolicyLayout eyebrow="Care" title="Refund Policy" updated="June 2026">
      <p>We want every piece to be cherished. If yours isn't, we accept returns within 30 days of delivery.</p>
      <h2>Eligibility</h2>
      <p>Items must be unworn, in original condition, with all packaging and certificates intact. Engraved and bespoke pieces are final sale.</p>
      <h2>Process</h2>
      <p>Email concierge@luxuryunited.com to initiate a return. We'll send a prepaid, insured shipping label.</p>
      <h2>Refunds</h2>
      <p>Refunds are issued to the original payment method within 7 business days of receipt and inspection.</p>
      <h2>Exchanges</h2>
      <p>We're happy to exchange pieces for a different size or design. Just include a note with your return.</p>
    </PolicyLayout>
  ),
});
