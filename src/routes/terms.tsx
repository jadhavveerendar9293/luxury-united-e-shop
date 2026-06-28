import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — Luxury United" }] }),
  component: () => (
    <PolicyLayout eyebrow="Legal" title="Terms & Conditions" updated="June 2026">
      <p>By accessing the Luxury United website you agree to these terms. Please read them carefully.</p>
      <h2>Use of site</h2>
      <p>You agree to use this site only for lawful purposes and in a way that does not infringe the rights of any third party.</p>
      <h2>Orders</h2>
      <p>All orders are subject to acceptance and availability. Prices and product details are subject to change without notice.</p>
      <h2>Intellectual property</h2>
      <p>All content, designs, images, and marks on this site are the property of Luxury United and may not be reproduced without permission.</p>
      <h2>Limitation of liability</h2>
      <p>Luxury United is not liable for indirect damages arising from the use of this site or its products.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of France. Disputes shall be resolved in the courts of Paris.</p>
    </PolicyLayout>
  ),
});
