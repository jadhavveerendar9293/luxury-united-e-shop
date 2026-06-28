import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, X, Truck, Package } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Order Management — Luxury United" }] }),
  component: AdminOrdersPage,
});

type OrderStatus = Tables<"orders">["status"];
type Order = Tables<"orders"> & {
  order_items?: {
    id: string;
    product_name: string;
    product_image: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
};

function AdminOrdersPage() {
  const { user, isAdmin, isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [courierName, setCourierName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchOrders();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            product_name,
            product_image,
            quantity,
            unit_price,
            total_price
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders((data || []) as Order[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-pearl/50">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl text-pearl mb-4">Admin Access Required</h1>
        <p className="text-pearl/50">Please sign in as an admin to access this page.</p>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.shipping_first_name} ${order.shipping_last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    setIsUpdating(true);

    try {
      const updateData: Record<string, any> = { status: newStatus };

      if (newStatus === "confirmed") {
        updateData.confirmed_at = new Date().toISOString();
      } else if (newStatus === "shipped") {
        updateData.shipped_at = new Date().toISOString();
      } else if (newStatus === "delivered") {
        updateData.delivered_at = new Date().toISOString();
      }

      const { error } = await (supabase as any)
        .from("orders")
        .update(updateData)
        .eq("id", selectedOrder.id);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus, ...updateData } : o
        )
      );
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: newStatus, ...updateData } : null
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddTracking = async () => {
    if (!selectedOrder || !trackingNumber) return;
    setIsUpdating(true);

    try {
      const { error } = await (supabase as any)
        .from("orders")
        .update({
          tracking_number: trackingNumber,
          tracking_url: trackingUrl || null,
          courier_name: courierName || null,
        })
        .eq("id", selectedOrder.id);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, tracking_number: trackingNumber, tracking_url: trackingUrl, courier_name: courierName }
            : o
        )
      );
      setSelectedOrder((prev) =>
        prev
          ? { ...prev, tracking_number: trackingNumber, tracking_url: trackingUrl, courier_name: courierName }
          : null
      );
      toast.success("Tracking info added");
      setTrackingNumber("");
      setTrackingUrl("");
      setCourierName("");
    } catch (error) {
      console.error("Error adding tracking:", error);
      toast.error("Failed to add tracking info");
    } finally {
      setIsUpdating(false);
    }
  };

  const statusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      pending: "bg-pearl/10 text-pearl/70",
      confirmed: "bg-blue-500/10 text-blue-400",
      processing: "bg-amber-500/10 text-amber-400",
      packed: "bg-purple-500/10 text-purple-400",
      shipped: "bg-green-500/10 text-green-400",
      delivered: "bg-emerald-500/10 text-emerald-400",
      cancelled: "bg-red-500/10 text-red-400",
      rejected: "bg-red-500/10 text-red-400",
    };
    return colors[status];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-pearl mb-2">Order Management</h2>
        <p className="text-pearl/50">{orders.length} orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 size-4 text-pearl/40" />
          <input
            type="text"
            placeholder="Search by order number, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-pearl/5 border border-pearl/10 rounded pl-10 pr-4 py-3 text-sm text-pearl placeholder:text-pearl/40 focus:outline-none focus:border-champagne transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
          className="bg-pearl/5 border border-pearl/10 rounded px-4 py-3 text-sm text-pearl focus:outline-none focus:border-champagne transition-colors"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-12 text-pearl/50">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-pearl/5 border border-pearl/10 rounded">
          <Package className="size-12 mx-auto text-pearl/30 mb-4" />
          <p className="text-pearl/50">No orders found</p>
        </div>
      ) : (
        <div className="bg-pearl/5 border border-pearl/10 rounded overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-pearl/10 hover:bg-transparent">
                <TableHead className="text-pearl/60">Order #</TableHead>
                <TableHead className="text-pearl/60">Customer</TableHead>
                <TableHead className="text-pearl/60">Total</TableHead>
                <TableHead className="text-pearl/60">Payment</TableHead>
                <TableHead className="text-pearl/60">Status</TableHead>
                <TableHead className="text-pearl/60">Date</TableHead>
                <TableHead className="text-pearl/60">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-b border-pearl/5">
                  <TableCell className="font-mono text-sm text-champagne">{order.order_number}</TableCell>
                  <TableCell className="text-sm text-pearl">
                    <div>
                      <p>{order.shipping_first_name} {order.shipping_last_name}</p>
                      <p className="text-xs text-pearl/50">{order.shipping_email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-serif text-champagne">{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      order.payment_status === "paid" ? "bg-green-500/20 text-green-300" :
                      order.payment_status === "failed" ? "bg-red-500/20 text-red-300" :
                      order.payment_status === "refunded" ? "bg-yellow-500/20 text-yellow-300" :
                      "bg-pearl/10 text-pearl/60"
                    }`}>
                      {order.payment_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-pearl/60">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetail(true);
                        setTrackingNumber(order.tracking_number || "");
                        setTrackingUrl(order.tracking_url || "");
                        setCourierName((order as any).courier_name || "");
                      }}
                      className="text-champagne text-sm hover:text-pearl transition-colors"
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order Detail Modal */}
      {showDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-obsidian border border-pearl/20 rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-pearl/10">
              <div>
                <h2 className="font-serif text-xl text-pearl">{selectedOrder.order_number}</h2>
                <p className="text-sm text-pearl/50 mt-1">
                  Created {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="text-pearl/60 hover:text-pearl transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-xs font-medium text-pearl/60 uppercase tracking-wider mb-3">Customer</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-pearl">{selectedOrder.shipping_first_name} {selectedOrder.shipping_last_name}</p>
                  <p className="text-pearl/60">{selectedOrder.shipping_email}</p>
                  {selectedOrder.shipping_phone && (
                    <p className="text-pearl/60">{selectedOrder.shipping_phone}</p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-xs font-medium text-pearl/60 uppercase tracking-wider mb-3">Shipping Address</h3>
                <div className="text-sm space-y-1 text-pearl/80">
                  <p>{selectedOrder.shipping_address}</p>
                  <p>{selectedOrder.shipping_city}, {selectedOrder.shipping_postal_code}</p>
                  {selectedOrder.shipping_state && <p>{selectedOrder.shipping_state}</p>}
                  <p>{selectedOrder.shipping_country}</p>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <h3 className="text-xs font-medium text-pearl/60 uppercase tracking-wider mb-3">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-3 border-b border-pearl/10 last:border-0">
                      <div className="size-16 bg-pearl/10 rounded overflow-hidden flex-shrink-0">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="size-6 text-pearl/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="text-pearl">{item.product_name}</p>
                        <p className="text-pearl/60">Qty: {item.quantity}</p>
                        <p className="text-champagne mt-1">{formatCurrency(item.unit_price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-xs font-medium text-pearl/60 uppercase tracking-wider mb-3">Order Status</h3>
                <div className="flex flex-wrap gap-2">
                  {["pending", "confirmed", "processing", "packed", "shipped", "delivered"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s as OrderStatus)}
                      disabled={isUpdating}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
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
                <h3 className="text-xs font-medium text-pearl/60 uppercase tracking-wider mb-3">Tracking</h3>
                <div className="space-y-3">
                  {selectedOrder.tracking_number ? (
                    <div className="bg-pearl/5 border border-pearl/10 p-4 rounded space-y-2">
                      {selectedOrder.tracking_url && (
                        <a
                          href={selectedOrder.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-champagne hover:text-pearl text-sm"
                        >
                          <Truck size={14} />
                          Track Package →
                        </a>
                      )}
                      <p className="text-xs text-pearl/60">
                        Courier: {(selectedOrder as any).courier_name || "N/A"}
                      </p>
                      <p className="text-xs text-pearl/60">
                        Tracking #: <span className="font-mono text-pearl">{selectedOrder.tracking_number}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Courier Name (e.g., FedEx, UPS)"
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        className="w-full bg-pearl/5 border border-pearl/10 rounded px-4 py-2 text-sm text-pearl placeholder:text-pearl/40 focus:outline-none focus:border-champagne transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Tracking Number"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="w-full bg-pearl/5 border border-pearl/10 rounded px-4 py-2 text-sm text-pearl placeholder:text-pearl/40 focus:outline-none focus:border-champagne transition-colors"
                      />
                      <input
                        type="url"
                        placeholder="Tracking URL (optional)"
                        value={trackingUrl}
                        onChange={(e) => setTrackingUrl(e.target.value)}
                        className="w-full bg-pearl/5 border border-pearl/10 rounded px-4 py-2 text-sm text-pearl placeholder:text-pearl/40 focus:outline-none focus:border-champagne transition-colors"
                      />
                      <button
                        onClick={handleAddTracking}
                        disabled={!trackingNumber || isUpdating}
                        className="w-full bg-champagne text-obsidian py-2 text-sm font-medium rounded hover:bg-pearl transition-colors disabled:opacity-50"
                      >
                        Add Tracking
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-pearl/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-pearl/60">Subtotal</span>
                  <span className="text-pearl">{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-pearl/60">Shipping</span>
                  <span className="text-pearl">{formatCurrency(selectedOrder.shipping_cost)}</span>
                </div>
                <div className="flex justify-between font-serif text-lg">
                  <span className="text-pearl">Total</span>
                  <span className="text-champagne">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDetail(false)}
                  className="flex-1 px-6 py-3 border border-pearl/15 text-pearl text-sm font-medium rounded hover:bg-pearl/5 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
