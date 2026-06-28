import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, User, Mail, Phone, ShoppingBag, DollarSign, Calendar } from "lucide-react";
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
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({ meta: [{ title: "Customer Management — Luxury United" }] }),
  component: AdminCustomersPage,
});

type Customer = Tables<"profiles"> & {
  order_count?: number;
  total_spent?: number;
  last_order_date?: string;
};

function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "customer")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch order data for each customer
      const customersWithOrders = await Promise.all(
        (data || []).map(async (customer) => {
          const { data: orders, error: orderError } = await supabase
            .from("orders")
            .select("total, created_at")
            .eq("user_id", customer.user_id);

          if (!orderError && orders) {
            const total_spent = orders.reduce(
              (sum, order) => sum + (order.total || 0),
              0
            );
            const last_order = orders.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )[0];

            return {
              ...customer,
              order_count: orders.length,
              total_spent,
              last_order_date: last_order?.created_at,
            };
          }
          return { ...customer, order_count: 0, total_spent: 0 };
        })
      );

      setCustomers(customersWithOrders);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetail(true);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-pearl/50">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-pearl mb-2">Customer Management</h2>
        <p className="text-pearl/50">View and manage registered customers</p>
      </div>

      <div className="bg-card/40 border border-pearl/10 rounded p-6">
        <div className="flex gap-4">
          <Search className="absolute left-9 top-32 md:top-auto md:left-auto text-pearl/40 size-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-obsidian/50 border border-pearl/20 rounded px-4 py-2 pl-10 text-pearl placeholder-pearl/40 focus:outline-none focus:border-champagne/40"
          />
        </div>
      </div>

      <div className="text-sm text-pearl/50 mb-4">
        {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? "s" : ""}
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="bg-card/40 border border-pearl/10 rounded p-12 text-center">
          <p className="text-pearl/50">No customers found</p>
        </div>
      ) : (
        <div className="bg-card/40 border border-pearl/10 rounded overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-pearl/10 hover:bg-transparent">
                <TableHead className="text-pearl/70">Name</TableHead>
                <TableHead className="text-pearl/70">Email</TableHead>
                <TableHead className="text-pearl/70">Phone</TableHead>
                <TableHead className="text-pearl/70 text-right">Orders</TableHead>
                <TableHead className="text-pearl/70 text-right">Total Spent</TableHead>
                <TableHead className="text-pearl/70">Joined</TableHead>
                <TableHead className="text-pearl/70 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.user_id}
                  className="border-pearl/10 hover:bg-pearl/5 cursor-pointer"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <TableCell className="text-pearl/80 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-champagne/20 flex items-center justify-center">
                        <User size={16} className="text-champagne" />
                      </div>
                      {customer.full_name || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="text-pearl/80 text-sm">{customer.email}</TableCell>
                  <TableCell className="text-pearl/80 text-sm">
                    {customer.phone || "N/A"}
                  </TableCell>
                  <TableCell className="text-pearl/80 text-sm text-right">
                    {customer.order_count || 0}
                  </TableCell>
                  <TableCell className="text-pearl/80 text-sm text-right font-medium">
                    ${((customer.total_spent || 0) / 100).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-pearl/80 text-sm">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <button className="text-champagne hover:text-pearl transition-colors text-sm px-3 py-1 rounded border border-champagne/30 hover:border-champagne/60">
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {showDetail && selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => {
            setShowDetail(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
}

function CustomerDetailModal({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", customer.user_id)
          .order("created_at", { ascending: false });

        if (!error) {
          setOrders(data || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [customer.user_id]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-obsidian border border-pearl/20 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="sticky top-0 bg-obsidian border-b border-pearl/20 p-6 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-serif text-pearl mb-2">
              {customer.full_name || "Customer"}
            </h3>
            <p className="text-pearl/50 text-sm">{customer.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-pearl/50 hover:text-pearl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card/40 p-4 rounded border border-pearl/10">
              <p className="text-pearl/50 text-xs mb-1">Total Orders</p>
              <p className="text-2xl font-serif text-champagne">
                {customer.order_count || 0}
              </p>
            </div>
            <div className="bg-card/40 p-4 rounded border border-pearl/10">
              <p className="text-pearl/50 text-xs mb-1">Total Spent</p>
              <p className="text-2xl font-serif text-champagne">
                ${((customer.total_spent || 0) / 100).toFixed(2)}
              </p>
            </div>
            <div className="bg-card/40 p-4 rounded border border-pearl/10">
              <p className="text-pearl/50 text-xs mb-1">Customer Since</p>
              <p className="text-sm text-pearl">
                {new Date(customer.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-pearl">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 text-pearl/80">
                <Mail size={16} className="text-pearl/40" />
                {customer.email}
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3 text-pearl/80">
                  <Phone size={16} className="text-pearl/40" />
                  {customer.phone}
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <p className="text-pearl/50 text-sm">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-pearl/50 text-sm">No orders yet</div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-serif text-pearl">Order History</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-card/40 p-3 rounded border border-pearl/10 text-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-pearl font-medium">{order.order_number}</p>
                        <p className="text-pearl/50 text-xs mt-1">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-champagne font-medium">
                          ${(order.total / 100).toFixed(2)}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            order.status === "delivered"
                              ? "text-green-400"
                              : order.status === "cancelled"
                                ? "text-red-400"
                                : "text-yellow-400"
                          }`}
                        >
                          {order.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
