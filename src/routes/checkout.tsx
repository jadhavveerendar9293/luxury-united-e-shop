import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { useCart, formatPrice } from "@/lib/store";
import {
  initializeRazorpayCheckout,
  createOrder,
  updateOrderPaymentStatus,
  type RazorpayPaymentResponse,
  type OrderData,
} from "@/lib/razorpay";

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
  const [isProcessing, setIsProcessing] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    state: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlace = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Validate required fields
      if (!formData.email || !formData.phone) {
        toast.error("Please fill in contact details");
        setIsProcessing(false);
        return;
      }

      if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.postalCode || !formData.country) {
        toast.error("Please fill in shipping address");
        setIsProcessing(false);
        return;
      }

      // Create order in database
      const orderData: OrderData = {
        email: formData.email,
        phone: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        state: formData.state,
        subtotal: subtotal,
        items: items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.qty,
          unit_price: item.product.price,
          product_image: item.product.images?.[0],
        })),
      };

      const order = await createOrder(orderData);

      if (!order) {
        toast.error("Failed to create order. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Initialize Razorpay checkout
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

      if (!razorpayKeyId) {
        toast.error("Payment configuration error. Please contact support.");
        setIsProcessing(false);
        return;
      }

      const checkoutOptions = {
        key: razorpayKeyId,
        amount: Math.round(subtotal * 100),
        currency: "INR",
        order_id: order.id,
        name: "Luxury United",
        description: `Order #${order.order_number}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        prefill: {
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#C5A059", // champagne color
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
      };

      // Initialize Razorpay checkout
      await initializeRazorpayCheckout(
        checkoutOptions,
        async (response: RazorpayPaymentResponse) => {
          try {
            // Payment successful - update order
            await updateOrderPaymentStatus(order.id, response.razorpay_payment_id, "paid", response.razorpay_signature);

            // Clear cart
            clear();

            // Show success message
            toast.success("Payment successful! Order confirmed.");

            // Redirect to order confirmation
            navigate({
              to: `/order-confirmation/$id`,
              params: { id: order.id },
            });
          } catch (error) {
            console.error("Payment confirmation error:", error);
            toast.error("Payment successful but confirmation failed. Please contact support.");
            setIsProcessing(false);
          }
        },
        (error: Error) => {
          console.error("Payment error:", error);
          toast.error("Payment failed. Please try again.");
          setIsProcessing(false);
        },
      );
    } catch (error) {
      console.error("Order creation error:", error);
      const message = error instanceof Error ? error.message : "Failed to create order";
      toast.error(message);
      setIsProcessing(false);
    }
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
                <Field label="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                <Field label="Phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
              </Section>
            )}
            {step === 2 && (
              <Section title="Shipping Address">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                  <Field label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
                <Field label="Address" name="address" value={formData.address} onChange={handleInputChange} required />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City" name="city" value={formData.city} onChange={handleInputChange} required />
                  <Field label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
                </div>
                <Field label="Country" name="country" value={formData.country} onChange={handleInputChange} required />
                <Field label="State (Optional)" name="state" value={formData.state} onChange={handleInputChange} />
              </Section>
            )}
            {step === 3 && (
              <Section title="Payment">
                <div className="bg-card/30 border border-champagne/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-pearl/70">
                    Click "Place Order" to proceed to payment. You'll be redirected to Razorpay's secure payment gateway.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-pearl/60">Total Amount</p>
                  <p className="text-2xl font-serif text-champagne">{formatPrice(subtotal)}</p>
                </div>
              </Section>
            )}

            <div className="flex justify-between gap-3">
              {step > 1 ? (
                <button type="button" onClick={() => setStep((step - 1) as 1 | 2 | 3)} disabled={isProcessing} className="px-6 py-3 border border-pearl/15 eyebrow disabled:opacity-50">
                  Back
                </button>
              ) : <div />}
              {step < 3 ? (
                <button type="button" onClick={() => setStep((step + 1) as 1 | 2 | 3)} disabled={isProcessing} className="px-8 py-3 bg-champagne text-obsidian eyebrow disabled:opacity-50">
                  Continue
                </button>
              ) : (
                <button type="submit" disabled={isProcessing || items.length === 0} className="px-8 py-3 bg-champagne text-obsidian eyebrow disabled:opacity-50 disabled:cursor-not-allowed">
                  {isProcessing ? "Processing..." : "Place Order"}
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

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="eyebrow text-pearl/60 mb-2 block">{label}</span>
      <input
        {...props}
        className="w-full bg-transparent border-b border-pearl/15 py-3 text-sm focus:outline-none focus:border-champagne transition-colors disabled:opacity-50"
      />
    </label>
  );
}
