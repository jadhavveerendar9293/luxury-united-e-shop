import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Search, Plus, CreditCard as Edit2, X, Check, CircleAlert as AlertCircle, Package, Truck } from "lucide-react";
import { toast } from "sonner";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { useAuth, formatPrice } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Order Management — Luxury United" }] }),
  component: AdminOrdersPage,
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
  customerName: string;
  customerEmail: string;
  status: "pending" | "confirmed" | "processing" | "packed" | "shipped" | "delivered";
  total: number;
  items: OrderItem[];
  createdAt: Date;
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
const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customerName: "Sofia Martinez",
    customerEmail: "sofia@example.com",
    status: "shipped",
    total: 4250,
    items: [
      { id: "1", productName: "Aurelian Pendant", image: "/products/product-aurelian.jpg", price: 2150, qty: 1 },
      { id: "2", productName: "Lumina Ring", image: "/products/product-lumina.jpg", price: 2100, qty: 1 },
    ],
    createdAt: new Date("2024-01-15"),
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
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customerName: "James Chen",
    customerEmail: "james@example.com",
    status: "processing",
    total: 2150,
    items: [
      { id: "3", productName: "Celestial Bracelet", image: "/products/product-celestial.jpg", price: 2150, qty: 1 },
    ],
    createdAt: new Date("2024-01-18"),
    shippingAddress: {
      firstName: "James",
      lastName: "Chen",
      address: "456 Luxury Lane",
      city: "New York",
      postalCode: "10001",
      country: "USA",
    },
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customerName: "Emma Wilson",
    customerEmail: "emma@example.com",
    status: "pending",
    total: 6400,
    items: [
      { id: "4", productName: "Regal Tiara", image: "/products/product-regal.jpg", price: 4250, qty: 1 },
      { id: "5", productName: "Diamond Collar", image: "/products/product-diamond.jpg", price: 2150, qty: 1 },
    ],
    createdAt: new Date("2024-01-20"),
    shippingAddress: {
      firstName: "Emma",
      lastName: "Wilson",
      address: "789 Premium Blvd",
      city: "Los Angeles",
      postalCode: "90001",
      country: "USA",
    },
  },
];

function AdminOrdersPage() {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  if (!user) {
    return (
      <PageShell>
        <div className="container-luxury py-32 text-center">
          <h1 className="font-serif text-4xl mb-6">Admin Access Required</h1>
          <p className="text-pearl/50 mb-8">Please sign in as an admin to access this page.</p>
          <Link to="/login" className="bg-champagne text-obsidian px-8 py-4 eyebrow">Sign In</Link>
        </div>
      </PageShell>
    );
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (newStatus: Order["status"]) => {
    if (!selectedOrder) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: newStatus } : o
      )
    );
    setSelectedOrder((prev) =>
      prev ? { ...prev, status: newStatus } : null
    );
    toast.success(`Order status updated to ${newStatus}`);
  };

  const handleAddTracking = () => {
    if (!selectedOrder || !trackingNumber) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id
          ? { ...o, trackingNumber, trackingUrl }
          : o
      )
    );
    setSelectedOrder((prev) =>
      prev
        ? { ...prev, trackingNumber, trackingUrl }
        : null
    );
    toast.success("Tracking info added");
    setTrackingNumber("");
    setTrackingUrl("");
  };

  const handleCancelOrder = () => {
    if (!selectedOrder) return;
    setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
    setShowDetail(false);
    setSelectedOrder(null);
    toast.success("Order cancelled");
  };

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

  return (
    <PageShell>
      <PageHeader eyebrow="Management" title="Orders" />
      <section className="container-luxury pb-24">
        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 size-4 text-pearl/40" />
            <input
              type="text"
              placeholder="Search by order number, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card/40 border border-pearl/10 rounded pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-champagne transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Order["status"] | "all")}
            className="bg-card/40 border border-pearl/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-champagne transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-card/40 rounded overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-pearl/10 hover:bg-transparent">
                <TableHead className="text-pearl/60">Order #</TableHead>
                <TableHead className="text-pearl/60">Customer</TableHead>
                <TableHead className="text-pearl/60">Total</TableHead>
                <TableHead className="text-pearl/60">Status</TableHead>
                <TableHead className="text-pearl/60">Date</TableHead>
                <TableHead className="text-pearl/60">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-pearl/40">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-b border-pearl/10">
                    <TableCell className="font-mono text-sm text-champagne">{order.orderNumber}</TableCell>
                    <TableCell className="text-sm">{order.customerName}</TableCell>
                    <TableCell className="text-sm font-serif text-champagne">{formatPrice(order.total)}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${statusColor(order.status)}`}>
                        {statusLabel(order.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-pearl/60">
                      {order.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetail(true);
                          setTrackingNumber(order.trackingNumber || "");
                          setTrackingUrl(order.trackingUrl || "");
                        }}
                        className="text-champagne eyebrow text-xs hover:text-pearl transition-colors"
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Order Detail Modal */}
        {showDetail && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-obsidian border border-pearl/20 rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center p-8 border-b border-pearl/10">
                <h2 className="font-serif text-2xl">{selectedOrder.orderNumber}</h2>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-pearl/60 hover:text-pearl"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Customer Info */}
                <div>
                  <h3 className="eyebrow text-pearl/60 mb-4">Customer</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-pearl">{selectedOrder.customerName}</p>
                    <p className="text-pearl/60">{selectedOrder.customerEmail}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="eyebrow text-pearl/60 mb-4">Shipping Address</h3>
                  <div className="text-sm space-y-1 text-pearl/80">
                    <p>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <h3 className="eyebrow text-pearl/60 mb-4">Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-pearl/10 last:border-0">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="size-16 object-cover bg-card"
                        />
                        <div className="flex-1 text-sm">
                          <p className="text-pearl">{item.productName}</p>
                          <p className="text-pearl/60">Qty: {item.qty}</p>
                          <p className="text-champagne mt-2">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="eyebrow text-pearl/60 mb-4">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {["pending", "confirmed", "processing", "packed", "shipped", "delivered"].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s as Order["status"])}
                        className={`px-4 py-2 rounded text-xs font-semibold transition-colors ${
                          selectedOrder.status === s
                            ? "bg-champagne text-obsidian"
                            : "bg-pearl/10 text-pearl/60 hover:bg-pearl/20"
                        }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tracking */}
                <div>
                  <h3 className="eyebrow text-pearl/60 mb-4">Tracking</h3>
                  <div className="space-y-4">
                    {selectedOrder.trackingNumber ? (
                      <div className="bg-card/40 p-4 rounded">
                        <p className="text-sm text-pearl/60 mb-2">Tracking Number</p>
                        <p className="font-mono text-champagne">{selectedOrder.trackingNumber}</p>
                        {selectedOrder.trackingUrl && (
                          <a
                            href={selectedOrder.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-champagne hover:text-pearl mt-2 inline-block"
                          >
                            View Tracking →
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Tracking Number"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="w-full bg-card/40 border border-pearl/10 rounded px-4 py-2 text-sm focus:outline-none focus:border-champagne transition-colors"
                        />
                        <input
                          type="url"
                          placeholder="Tracking URL (optional)"
                          value={trackingUrl}
                          onChange={(e) => setTrackingUrl(e.target.value)}
                          className="w-full bg-card/40 border border-pearl/10 rounded px-4 py-2 text-sm focus:outline-none focus:border-champagne transition-colors"
                        />
                        <button
                          onClick={handleAddTracking}
                          disabled={!trackingNumber}
                          className="w-full bg-champagne text-obsidian py-2 eyebrow rounded hover:bg-pearl transition-colors disabled:opacity-50"
                        >
                          Add Tracking
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Total */}
                <div className="border-t border-pearl/10 pt-6">
                  <div className="flex justify-between items-center">
                    <p className="font-serif text-lg">Order Total</p>
                    <p className="font-serif text-xl text-champagne">{formatPrice(selectedOrder.total)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowDetail(false)}
                    className="flex-1 px-6 py-3 border border-pearl/15 eyebrow rounded hover:bg-pearl/5 transition-colors"
                  >
                    Close
                  </button>
                  {selectedOrder.status !== "delivered" && selectedOrder.status !== "pending" && (
                    <button
                      onClick={handleCancelOrder}
                      className="flex-1 px-6 py-3 bg-red-500/20 text-red-400 eyebrow rounded hover:bg-red-500/30 transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}
