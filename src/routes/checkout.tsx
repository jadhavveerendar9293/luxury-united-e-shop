import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { useCart, formatPrice } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Luxury United" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handlePlace = (e: React.FormEvent) => {
    e.preventDefault();
    clear();
    toast.success("Order placed — confirmation sent.");
    navigate({ to: "/account" });
  };

  return (
    <PageShell>
      <PageHeader eyebrow="Secure" title="Checkout" />
      <section className="container-luxury pb-24">
        <div className="flex gap-2 mb-12 eyebrow text-pearl/40">
          {["Contact", "Shipping", "Payment"].map((label, i) => (
            <button
              key={label}
              onClick={() => setStep((i + 1) as 1 | 2 | 3)}
              className={`flex-1 py-3 border-t-2 transition-colors ${step === i + 1 ? "border-champagne text-champagne" : "border-pearl/10"}`}
            >
              0{i + 1} · {label}
            </button>
          ))}
        </div>

        <form onSubmit={handlePlace} className="grid md:grid-cols-[1fr_400px] gap-12">
          <div className="space-y-10">
            {step === 1 && (
              <Section title="Contact">
                <Field label="Email" type="email" required />
                <Field label="Phone" type="tel" />
              </Section>
            )}
            {step === 2 && (
              <Section title="Shipping Address">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" required />
                  <Field label="Last Name" required />
                </div>
                <Field label="Address" required />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City" required />
                  <Field label="Postal Code" required />
                </div>
                <Field label="Country" required />
              </Section>
            )}
            {step === 3 && (
              <Section title="Payment">
                <Field label="Card Number" required placeholder="•••• •••• •••• ••••" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Expiry" required placeholder="MM / YY" />
                  <Field label="CVC" required placeholder="•••" />
                </div>
              </Section>
            )}

            <div className="flex justify-between gap-3">
              {step > 1 ? (
                <button type="button" onClick={() => setStep((step - 1) as 1 | 2 | 3)} className="px-6 py-3 border border-pearl/15 eyebrow">
                  Back
                </button>
              ) : <div />}
              {step < 3 ? (
                <button type="button" onClick={() => setStep((step + 1) as 1 | 2 | 3)} className="px-8 py-3 bg-champagne text-obsidian eyebrow">
                  Continue
                </button>
              ) : (
                <button type="submit" className="px-8 py-3 bg-champagne text-obsidian eyebrow">
                  Place Order
                </button>
              )}
            </div>
          </div>

          <aside className="bg-card/40 p-8 space-y-5 md:sticky md:top-28 md:self-start">
            <h2 className="font-serif text-xl">Your Order</h2>
            <div className="space-y-4 max-h-80 overflow-auto">
              {items.map((i) => (
                <div key={i.id} className="flex gap-3 items-center">
                  <img src={i.product.images[0]} className="size-14 object-cover bg-card" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{i.product.name}</p>
                    <p className="text-xs text-pearl/40">Qty {i.qty}</p>
                  </div>
                  <p className="text-sm text-champagne">{formatPrice(i.product.price * i.qty)}</p>
                </div>
              ))}
            </div>
            <div className="h-px bg-pearl/10" />
            <div className="flex justify-between text-sm">
              <span className="text-pearl/60">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-pearl/60">Shipping</span>
              <span>Complimentary</span>
            </div>
            <div className="flex justify-between font-serif text-lg pt-3 border-t border-pearl/10">
              <span>Total</span>
              <span className="text-champagne">{formatPrice(subtotal)}</span>
            </div>
          </aside>
        </form>
      </section>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="font-serif text-2xl mb-6">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="eyebrow text-pearl/60 mb-2 block">{label}</span>
      <input
        {...props}
        className="w-full bg-transparent border-b border-pearl/15 py-3 text-sm focus:outline-none focus:border-champagne transition-colors"
      />
    </label>
  );
}
