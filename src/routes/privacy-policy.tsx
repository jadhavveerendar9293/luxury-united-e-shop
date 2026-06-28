import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Luxury United" }] }),
  component: () => (
    <PolicyLayout eyebrow="Legal" title="Privacy Policy" updated="June 2026">
      <p>This Privacy Policy describes how Luxury United collects, uses, and protects information when you visit our website or place an order.</p>
      <h2>Information we collect</h2>
      <p>We collect information you provide directly, such as your name, email, shipping address, and payment details. We also collect technical information about your visit, including IP address and browsing behavior.</p>
      <h2>How we use information</h2>
      <p>We use your information to process orders, communicate about your account, improve our services, and — only with your consent — send marketing communications.</p>
      <h2>Sharing</h2>
      <p>We share data only with trusted partners required to fulfill your order: payment processors, shipping providers, and analytics tools. We never sell your data.</p>
      <h2>Your rights</h2>
      <p>You may request access, correction, or deletion of your personal data at any time by writing to concierge@luxuryunited.com.</p>
      <h2>Cookies</h2>
      <p>We use cookies to remember your preferences and analyze usage. You can disable cookies in your browser settings.</p>
    </PolicyLayout>
  ),
});
