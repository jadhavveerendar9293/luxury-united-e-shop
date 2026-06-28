import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Package } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { useAuth, formatPrice } from "@/lib/store";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Order History — Luxury United" }] }),
  component: OrdersPage,
});

interface OrderItem {
  id: string;
  productName: string;
  image: string;
  price: number;
  qty: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: "pending" | "confirmed" | "processing" | "packed" | "shipped" | "delivered";
  total: number;
  items: OrderItem[];
  createdAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
}

// Mock orders data
const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    status: "delivered",
    total: 4250,
    items: [
      { id: "1", productName: "Aurelian Pendant", image: "/products/product-aurelian.jpg", price: 2150, qty: 1 },
      { id: "2", productName: "Lumina Ring", image: "/products/product-lumina.jpg", price: 2100, qty: 1 },
    ],
    createdAt: new Date("2024-01-15"),
    estimatedDelivery: new Date("2024-01-22"),
    trackingNumber: "1Z999AA10123456784",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    status: "shipped",
    total: 2150,
    items: [
      { id: "3", productName: "Celestial Bracelet", image: "/products/product-celestial.jpg", price: 2150, qty: 1 },
    ],
    createdAt: new Date("2024-01-18"),
    estimatedDelivery: new Date("2024-01-25"),
    trackingNumber: "1Z999BB20234567895",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    status: "processing",
    total: 6400,
    items: [
      { id: "4", productName: "Regal Tiara", image: "/products/product-regal.jpg", price: 4250, qty: 1 },
      { id: "5", productName: "Diamond Collar", image: "/products/product-diamond.jpg", price: 2150, qty: 1 },
    ],
    createdAt: new Date("2024-01-20"),
    estimatedDelivery: new Date("2024-01-28"),
  },
];

function OrdersPage() {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();

  if (!user) {
    return (
      <PageShell>
        <div className="container-luxury py-32 text-center">
          <h1 className="font-serif text-4xl mb-6">Order History</h1>
          <p className="text-pearl/50 mb-8">Sign in to view your orders.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/login" className="bg-champagne text-obsidian px-8 py-4 eyebrow">Sign In</Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const statusColor = (status: Order["status"]) => {
    const colors: Record<Order["status"], string> = {
      pending: "bg-pearl/10 text-pearl/70",
      confirmed: "bg-blue-500/10 text-blue-400",
      processing: "bg-amber-500/10 text-amber-400",
      packed: "bg-purple-500/10 text-purple-400",
      shipped: "bg-green-500/10 text-green-400",
      delivered: "bg-emerald-500/10 text-emerald-400",
    };
    return colors[status];
  };

  const statusLabel = (status: Order["status"]) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusDescription = (status: Order["status"]) => {
    const descriptions: Record<Order["status"], string> = {
      pending: "Awaiting confirmation",
      confirmed: "Order confirmed",
      processing: "Being prepared",
      packed: "Ready to ship",
      shipped: "On the way",
      delivered: "Delivered",
    };
    return descriptions[status];
  };

  return (
    <PageShell>
      <PageHeader eyebrow="Your Account" title="Order History" />
      <section className="container-luxury pb-24">
        {MOCK_ORDERS.length === 0 ? (
          <div className="text-center py-16">
            <Package className="size-12 text-pearl/30 mx-auto mb-4" />
            <p className="text-pearl/50 mb-6">No orders yet</p>
            <Link to="/shop" className="text-champagne eyebrow hover:text-pearl transition-colors">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {MOCK_ORDERS.map((order) => (
              <div
                key={order.id}
                className="bg-card/40 border border-pearl/10 rounded overflow-hidden hover:border-pearl/20 transition-colors"
              >
                {/* Header */}
                <div className="p-6 border-b border-pearl/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="font-serif text-lg">{order.orderNumber}</h3>
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${statusColor(order.status)}`}>
                        {statusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-pearl/60">
                      Placed on {order.createdAt.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-xl text-champagne mb-2">{formatPrice(order.total)}</p>
                    <button
                      onClick={() => navigate({ to: `/orders/${order.id}` })}
                      className="text-champagne eyebrow text-xs hover:text-pearl transition-colors flex items-center gap-1 ml-auto"
                    >
                      View Details
                      <ChevronRight className="size-3" />
                    </button>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="p-6 bg-card/20">
                  <div className="space-y-3">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex gap-3 items-center">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="size-12 object-cover bg-card rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-pearl truncate">{item.productName}</p>
                          <p className="text-xs text-pearl/40">Qty {item.qty}</p>
                        </div>
                        <p className="text-sm text-pearl/70">{formatPrice(item.price)}</p>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-pearl/50 pt-2">+{order.items.length - 2} more items</p>
                    )}
                  </div>
                </div>

                {/* Status & Tracking */}
                <div className="p-6 bg-card/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-pearl/60 mb-1">Status</p>
                    <p className="text-sm text-pearl">{getStatusDescription(order.status)}</p>
                    {order.estimatedDelivery && (
                      <p className="text-xs text-pearl/50 mt-2">
                        Est. delivery {order.estimatedDelivery.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {order.trackingNumber && (
                    <div className="text-right">
                      <p className="text-xs text-pearl/60 mb-1">Tracking</p>
                      <p className="font-mono text-sm text-champagne">{order.trackingNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
