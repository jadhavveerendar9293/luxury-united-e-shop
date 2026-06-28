import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { formatPrice } from "@/lib/store";
import { getOrder } from "@/lib/razorpay";
import { CircleCheck as CheckCircle2, Package, Truck, Calendar } from "lucide-react";

export const Route = createFileRoute("/order-confirmation/$id")({
  head: () => ({ meta: [{ title: "Order Confirmation — Luxury United" }] }),
  component: OrderConfirmationPage,
});

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  payment_status: string;
  status: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  created_at: string;
  order_items: OrderItem[];
}

function OrderConfirmationPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await getOrder(id);

        if (!orderData) {
          setError("Order not found");
          toast.error("Order not found");
          return;
        }

        setOrder(orderData);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load order";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <PageShell>
        <PageHeader eyebrow="Processing" title="Order Confirmation" />
        <section className="container-luxury pb-24">
          <div className="flex justify-center items-center h-64">
            <p className="text-pearl/60">Loading order details...</p>
          </div>
        </section>
      </PageShell>
    );
  }

  if (error || !order) {
    return (
      <PageShell>
        <PageHeader eyebrow="Error" title="Order Not Found" />
        <section className="container-luxury pb-24">
          <div className="max-w-2xl mx-auto text-center py-12">
            <p className="text-pearl/60 mb-8">{error || "We couldn't find your order. Please check your email for confirmation."}</p>
            <button onClick={() => navigate({ to: "/" })} className="px-8 py-3 bg-champagne text-obsidian eyebrow">
              Return to Home
            </button>
          </div>
        </section>
      </PageShell>
    );
  }

  const estimatedDelivery = new Date(order.created_at);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return (
    <PageShell>
      <PageHeader eyebrow="Success" title="Order Confirmed" />
      <section className="container-luxury pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-champagne/10 to-champagne/5 border border-champagne/20 rounded-lg p-8 mb-12 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-champagne" />
            </div>
            <h2 className="font-serif text-2xl mb-2">Thank You for Your Order</h2>
            <p className="text-pearl/60">We've received your payment and your order is being prepared.</p>
          </div>

          {/* Order Number and Status */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card/40 p-6 rounded-lg">
              <p className="text-pearl/60 text-sm mb-1">Order Number</p>
              <p className="font-serif text-2xl text-champagne mb-4">{order.order_number}</p>
              <p className="text-pearl/60 text-sm mb-1">Order Date</p>
              <p className="text-sm">{new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>

            <div className="bg-card/40 p-6 rounded-lg">
              <p className="text-pearl/60 text-sm mb-1">Payment Status</p>
              <p className="font-serif text-xl mb-4">
                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full uppercase eyebrow">
                  {order.payment_status === "paid" ? "Paid" : "Pending"}
                </span>
              </p>
              <p className="text-pearl/60 text-sm mb-1">Order Status</p>
              <p className="text-sm capitalize">{order.status}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-card/40 p-8 rounded-lg mb-12">
            <h3 className="font-serif text-xl mb-6">What's Next</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <Package className="w-5 h-5 text-champagne mb-2" />
                  <div className="w-px h-12 bg-champagne/30" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Order Confirmed</p>
                  <p className="text-sm text-pearl/60">We've received and confirmed your order</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <Truck className="w-5 h-5 text-champagne mb-2" />
                  <div className="w-px h-12 bg-pearl/10" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Preparing for Shipment</p>
                  <p className="text-sm text-pearl/60">We're carefully preparing your items</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <Calendar className="w-5 h-5 text-pearl/40" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Estimated Delivery</p>
                  <p className="text-sm text-pearl/60">{estimatedDelivery.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card/40 p-8 rounded-lg mb-12">
            <h3 className="font-serif text-xl mb-6">Order Summary</h3>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {order.order_items && order.order_items.length > 0 ? (
                order.order_items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-pearl/10 last:border-0">
                    {item.product_image && <img src={item.product_image} alt={item.product_name} className="w-20 h-20 object-cover rounded bg-card" />}
                    <div className="flex-1">
                      <p className="font-semibold mb-1">{item.product_name}</p>
                      <p className="text-sm text-pearl/60">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(item.total_price)}</p>
                      <p className="text-xs text-pearl/60">{formatPrice(item.unit_price)} each</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-pearl/60">No items in this order</p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-pearl/10 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-pearl/60">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.shipping_cost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-pearl/60">Shipping</span>
                  <span>{formatPrice(order.shipping_cost)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-pearl/60">Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
              )}
              <div className="flex justify-between font-serif text-lg pt-2 border-t border-pearl/10">
                <span>Total</span>
                <span className="text-champagne">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card/40 p-8 rounded-lg mb-12">
            <h3 className="font-serif text-xl mb-4">Shipping Address</h3>
            <div className="text-sm space-y-1">
              <p>
                {order.shipping_first_name} {order.shipping_last_name}
              </p>
              <p>{order.shipping_address}</p>
              <p>
                {order.shipping_city}, {order.shipping_postal_code}
              </p>
              <p>{order.shipping_country}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate({ to: "/account" })}
              className="px-8 py-3 border border-pearl/15 eyebrow hover:border-champagne transition-colors"
            >
              View All Orders
            </button>
            <button
              onClick={() => navigate({ to: "/shop" })}
              className="px-8 py-3 bg-champagne text-obsidian eyebrow hover:bg-pearl transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {/* Support Note */}
          <div className="mt-12 pt-8 border-t border-pearl/10 text-center">
            <p className="text-pearl/60 text-sm mb-2">Questions about your order?</p>
            <p className="text-sm">
              <a href="mailto:support@luxuryunited.com" className="text-champagne hover:underline">
                Contact our concierge team
              </a>
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
