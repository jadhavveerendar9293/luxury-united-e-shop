import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Package, DollarSign, Users, TriangleAlert as AlertTriangle } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Tables<'orders'>[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Tables<'products'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total orders and revenue
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .eq('payment_status', 'paid');

        const totalOrders = orders?.length || 0;
        const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;

        // Get total products
        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Get total customers (unique user_ids from orders)
        const { data: customers } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'customer');

        // Get low stock products
        const { data: lowStock } = await supabase
          .from('products')
          .select('*')
          .lt('stock', 10)
          .order('stock', { ascending: true })
          .limit(5);

        // Get recent orders
        const { data: recent } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalOrders,
          totalRevenue,
          totalProducts: productCount || 0,
          totalCustomers: customers?.length || 0,
          lowStockProducts: lowStock?.length || 0,
        });

        setRecentOrders(recent || []);
        setLowStockItems(lowStock || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    subtext,
  }: {
    icon: any;
    label: string;
    value: string | number;
    subtext?: string;
  }) => (
    <div className="bg-pearl/5 border border-pearl/10 rounded-lg p-6 hover:border-champagne/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-pearl/60 text-sm">{label}</p>
          <p className="text-3xl font-serif text-champagne mt-2">{value}</p>
          {subtext && <p className="text-xs text-pearl/40 mt-2">{subtext}</p>}
        </div>
        <Icon className="text-champagne/60" size={24} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-pearl/5 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Analytics Overview */}
      <div>
        <h2 className="text-xl font-serif text-pearl mb-4">Analytics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            icon={ShoppingBag}
            label="Total Orders"
            value={stats.totalOrders}
            subtext="Paid orders"
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            subtext="From paid orders"
          />
          <StatCard
            icon={Package}
            label="Products"
            value={stats.totalProducts}
            subtext="In catalog"
          />
          <StatCard
            icon={Users}
            label="Customers"
            value={stats.totalCustomers}
            subtext="Registered users"
          />
          <StatCard
            icon={AlertTriangle}
            label="Low Stock"
            value={stats.lowStockProducts}
            subtext="Under 10 units"
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-serif text-pearl mb-4">Recent Orders</h2>
        <div className="bg-pearl/5 border border-pearl/10 rounded-lg overflow-hidden">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-pearl/50">
              No orders yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-pearl/10">
                    <th className="text-left p-4 text-pearl/60">Order #</th>
                    <th className="text-left p-4 text-pearl/60">Customer</th>
                    <th className="text-left p-4 text-pearl/60">Total</th>
                    <th className="text-left p-4 text-pearl/60">Status</th>
                    <th className="text-left p-4 text-pearl/60">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-pearl/5 hover:bg-champagne/5 transition-colors"
                    >
                      <td className="p-4 text-pearl font-mono text-xs">
                        {order.order_number}
                      </td>
                      <td className="p-4 text-pearl">
                        {order.shipping_first_name} {order.shipping_last_name}
                      </td>
                      <td className="p-4 text-champagne font-medium">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-pearl/60 text-xs">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {stats.lowStockProducts > 0 && (
        <div>
          <h2 className="text-xl font-serif text-pearl mb-4">Low Stock Alerts</h2>
          <div className="bg-red-950/20 border border-red-900/30 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-red-900/20 bg-red-950/10">
                    <th className="text-left p-4 text-red-200">Product</th>
                    <th className="text-left p-4 text-red-200">SKU</th>
                    <th className="text-left p-4 text-red-200">Stock</th>
                    <th className="text-left p-4 text-red-200">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-red-900/10 hover:bg-red-950/10 transition-colors"
                    >
                      <td className="p-4 text-pearl">{product.name}</td>
                      <td className="p-4 text-pearl/60 font-mono text-xs">
                        {product.sku}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded text-xs font-medium ${
                          product.stock <= 0
                            ? 'bg-red-500/20 text-red-200'
                            : 'bg-yellow-500/20 text-yellow-200'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="p-4 text-pearl/60">
                        {product.category}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'delivered':
      return 'bg-green-500/20 text-green-200';
    case 'shipped':
      return 'bg-blue-500/20 text-blue-200';
    case 'processing':
    case 'packed':
      return 'bg-cyan-500/20 text-cyan-200';
    case 'confirmed':
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-200';
    case 'cancelled':
    case 'rejected':
      return 'bg-red-500/20 text-red-200';
    default:
      return 'bg-gray-500/20 text-gray-200';
  }
}

function ShoppingBag(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
