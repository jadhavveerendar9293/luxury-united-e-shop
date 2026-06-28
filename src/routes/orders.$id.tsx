import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, Check, Clock, Package, Truck, Hop as Home } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useAuth, formatPrice } from "@/lib/store";

export const Route = createFileRoute("/orders/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Order ${params.id} — Luxury United` }],
  }),
  notFoundComponent: () => (
    <PageShell>
      <div className="container-luxury py-32 text-center">
        <h1 className="font-serif text-4xl mb-4">Order not found</h1>
        <Link to="/orders" className="eyebrow text-champagne hairline-link">Back to Orders</Link>
      </div>
    </PageShell>
  ),
  component: OrderDetailPage,
});

interface OrderItem {
  id: string;
  productName: string;
  image: string;
  price: number;
  qty: number;
  sku?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: "pending" | "confirmed" | "processing" | "packed" | "shipped" | "delivered";
  total: number;
  items: OrderItem[];
  createdAt: Date;
  estimatedDelivery?: Date;
  deliveredDate?: Date;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  trackingUrl?: string;
}

// Mock orders data
const MOCK_ORDERS: Record<string, Order> = {
  "1": {
    id: "1",
    orderNumber: "ORD-2024-001",
    status: "delivered",
    total: 4250,
    items: [
      {
        id: "1",
        productName: "Aurelian Pendant",
        image: "/products/product-aurelian.jpg",
        price: 2150,
        qty: 1,
        sku: "AUR-PEND-001",
      },
      {
        id: "2",
        productName: "Lumina Ring",
        image: "/products/product-lumina.jpg",
        price: 2100,
        qty: 1,
        sku: "LUM-RING-001",
      },
    ],
    createdAt: new Date("2024-01-15"),
    estimatedDelivery: new Date("2024-01-22"),
    deliveredDate: new Date("2024-01-21"),
    shippingAddress: {
      firstName: "Sofia",
      lastName: "Martinez",
      address: "123 Elegance Ave",
      city: "San Francisco",
      postalCode: "94105",
      country: "USA",
    },
    trackingNumber: "1Z999AA10123456784",
    trackingUrl: "https://tracking.example.com/1Z999AA10123456784",
  },
  "2": {
    id: "2",
    orderNumber: "ORD-2024-002",
    status: "shipped",
    total: 2150,
    items: [
      {
        id: "3",
        productName: "Celestial Bracelet",
        image: "/products/product-celestial.jpg",
        price: 2150,
        qty: 1,
        sku: "CEL-BRAC-001",
      },
    ],
    createdAt: new Date("2024-01-18"),
    estimatedDelivery: new Date("2024-01-25"),
    shippingAddress: {
      firstName: "James",
      lastName: "Chen",
      address: "456 Luxury Lane",
      city: "New York",
      postalCode: "10001",
      country: "USA",
    },
    trackingNumber: "1Z999BB20234567895",
    trackingUrl: "https://tracking.example.com/1Z999BB20234567895",
  },
  "3": {
    id: "3",
    orderNumber: "ORD-2024-003",
    status: "processing",
    total: 6400,
    items: [
      {
        id: "4",
        productName: "Regal Tiara",
        image: "/products/product-regal.jpg",
        price: 4250,
        qty: 1,
        sku: "REG-TIAR-001",
      },
      {
        id: "5",
        productName: "Diamond Collar",
        image: "/products/product-diamond.jpg",
        price: 2150,
        qty: 1,
        sku: "DIA-COLL-001",
      },
    ],
    createdAt: new Date("2024-01-20"),
    estimatedDelivery: new Date("2024-01-28"),
    shippingAddress: {
      firstName: "Emma",
      lastName: "Wilson",
      address: "789 Premium Blvd",
      city: "Los Angeles",
      postalCode: "90001",
      country: "USA",
    },
  },
};

function OrderDetailPage() {
  const { id } = Route.useParams();
  const user = useAuth((s) => s.user);

  if (!user) {
    return (
      <PageShell>
        <div className="container-luxury py-32 text-center">
          <h1 className="font-serif text-4xl mb-6">Sign In Required</h1>
          <p className="text-pearl/50 mb-8">Please sign in to view order details.</p>
          <Link to="/login" className="bg-champagne text-obsidian px-8 py-4 eyebrow">Sign In</Link>
        </div>
      </PageShell>
    );
  }

  const order = MOCK_ORDERS[id];

  if (!order) throw notFound();

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

  // Status timeline
  const statusSteps: Order["status"][] = ["pending", "confirmed", "processing", "packed", "shipped", "delivered"];
  const currentStepIndex = statusSteps.indexOf(order.status);

  const getStepIcon = (step: Order["status"], index: number) => {
    if (index <= currentStepIndex) {
      switch (step) {
        case "pending":
          return <Clock className="size-4" />;
        case "confirmed":
        case "processing":
        case "packed":
          return <Package className="size-4" />;
        case "shipped":
          return <Truck className="size-4" />;
        case "delivered":
          return <Home className="size-4" />;
      }
    }
    return <Clock className="size-4" />;
  };

  return (
    <PageShell>
      <section className="container-luxury py-16">
        {/* Breadcrumb */}
        <nav className="eyebrow text-pearl/40 mb-12 flex gap-2 items-center">
          <Link to="/account" className="hover:text-champagne">Account</Link>
          <ChevronRight className="size-3" />
          <Link to="/orders" className="hover:text-champagne">Orders</Link>
          <ChevronRight className="size-3" />
          <span className="text-pearl/70">{order.orderNumber}</span>
        </nav>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            {/* Header */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="font-serif text-4xl">{order.orderNumber}</h1>
                <span className={`px-4 py-2 rounded text-sm font-semibold ${statusColor(order.status)}`}>
                  {statusLabel(order.status)}
                </span>
              </div>
              <p className="text-pearl/60 text-sm">
                Placed on {order.createdAt.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Status Timeline */}
            <div className="bg-card/40 p-8 rounded">
              <h2 className="font-serif text-xl mb-8">Order Status</h2>
              <div className="space-y-6">
                {statusSteps.map((step, index) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`size-10 rounded-full flex items-center justify-center mb-2 ${
                          index <= currentStepIndex
                            ? "bg-champagne text-obsidian"
                            : "bg-pearl/10 text-pearl/40"
                        }`}
                      >
                        {getStepIcon(step, index)}
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${
                            index < currentStepIndex ? "bg-champagne" : "bg-pearl/10"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-2">
                      <p className="font-semibold text-pearl mb-1">
                        {step.charAt(0).toUpperCase() + step.slice(1)}
                      </p>
                      <p className="text-sm text-pearl/60">
                        {step === "pending" && "Awaiting confirmation"}
                        {step === "confirmed" && "Order confirmed"}
                        {step === "processing" && "Being prepared for shipment"}
                        {step === "packed" && "Packed and ready to ship"}
                        {step === "shipped" && "On the way to you"}
                        {step === "delivered" && (order.deliveredDate
                          ? `Delivered on ${order.deliveredDate.toLocaleDateString()}`
                          : "Delivered")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking */}
            {order.trackingNumber && (
              <div className="bg-card/40 p-8 rounded">
                <h2 className="font-serif text-xl mb-6">Tracking Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="eyebrow text-pearl/60 mb-2">Tracking Number</p>
                    <p className="font-mono text-lg text-champagne">{order.trackingNumber}</p>
                  </div>
                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-champagne eyebrow hover:text-pearl transition-colors"
                    >
                      Track Package →
                    </a>
                  )}
                  {order.estimatedDelivery && (
                    <div className="pt-4 border-t border-pearl/10">
                      <p className="eyebrow text-pearl/60 mb-2">Estimated Delivery</p>
                      <p className="text-pearl">{order.estimatedDelivery.toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Items */}
            <div className="bg-card/40 p-8 rounded">
              <h2 className="font-serif text-xl mb-6">Order Items</h2>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-6 pb-6 border-b border-pearl/10 last:border-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="size-24 object-cover bg-card rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-pearl mb-2">{item.productName}</h3>
                      {item.sku && (
                        <p className="text-xs text-pearl/50 mb-3">SKU {item.sku}</p>
                      )}
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-sm text-pearl/60 mb-1">Quantity</p>
                          <p className="text-pearl">{item.qty}</p>
                        </div>
                        <p className="font-serif text-lg text-champagne">{formatPrice(item.price * item.qty)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-card/40 p-8 rounded">
              <h3 className="font-serif text-lg mb-6">Shipping Address</h3>
              <div className="space-y-2 text-sm">
                <p className="text-pearl font-semibold">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p className="text-pearl/80">{order.shippingAddress.address}</p>
                <p className="text-pearl/80">
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p className="text-pearl/80">{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-card/40 p-8 rounded">
              <h3 className="font-serif text-lg mb-6">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-pearl/60">Subtotal</span>
                  <span className="text-pearl">{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-pearl/60">Shipping</span>
                  <span className="text-green-400">Complimentary</span>
                </div>
                <div className="h-px bg-pearl/10" />
                <div className="flex justify-between items-center">
                  <span className="text-pearl/60">Total</span>
                  <span className="font-serif text-xl text-champagne">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                to="/orders"
                className="w-full px-6 py-3 border border-pearl/15 eyebrow text-center rounded hover:bg-pearl/5 transition-colors block"
              >
                Back to Orders
              </Link>
              {order.status !== "delivered" && (
                <button className="w-full px-6 py-3 bg-card/40 border border-pearl/15 eyebrow rounded hover:bg-pearl/5 transition-colors">
                  Contact Support
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
