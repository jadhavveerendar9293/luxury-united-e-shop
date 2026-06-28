import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Zap,
  ShoppingBag,
  Star,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.navigate({ to: '/login' });
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!isLoading && user && !isAdmin) {
      router.navigate({ to: '/account' });
    }
  }, [user, isAdmin, isLoading, router]);

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian">
        <div className="text-pearl">Loading...</div>
      </div>
    );
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: FolderOpen, label: 'Categories', href: '/admin/categories' },
    { icon: Zap, label: 'Collections', href: '/admin/collections' },
    { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
    { icon: Star, label: 'Reviews', href: '/admin/reviews' },
    { icon: Users, label: 'Customers', href: '/admin/customers' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-obsidian flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden text-champagne"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-gradient-to-b from-obsidian to-obsidian border-r border-pearl/10 transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b border-pearl/10 px-6 py-8">
            <h1 className="font-serif text-2xl text-champagne">Admin</h1>
            <p className="text-pearl/50 text-xs mt-1">Luxury United</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    router.navigate({ to: item.href as any });
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-colors text-sm ${
                    isActive
                      ? 'bg-champagne/10 text-champagne border border-champagne/20'
                      : 'text-pearl/60 hover:text-pearl hover:bg-pearl/5'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-pearl/10 px-4 py-6 space-y-3">
            <div className="px-4 py-3 rounded bg-pearl/5 border border-pearl/10">
              <p className="text-xs text-pearl/50">Admin</p>
              <p className="text-sm text-champagne font-medium truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={async () => {
                await signOut();
                router.navigate({ to: '/login' });
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded border border-pearl/20 text-pearl/60 hover:text-pearl hover:border-pearl/40 transition-colors text-sm"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:ml-0">
        {/* Top Bar */}
        <div className="border-b border-pearl/10 bg-obsidian/50 backdrop-blur-sm px-6 py-4 md:pl-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif text-pearl hidden md:block">
              Admin Dashboard
            </h1>
            <div className="text-sm text-pearl/60">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
