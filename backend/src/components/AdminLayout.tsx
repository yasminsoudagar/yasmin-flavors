import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Package, Ticket, Users, LogOut, Menu, X } from 'lucide-react';

const sidebarLinks = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/food', label: 'Manage Food', icon: UtensilsCrossed },
  { path: '/admin/orders', label: 'Manage Orders', icon: Package },
  { path: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { path: '/admin/users', label: 'Users', icon: Users },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-border">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <span className="text-lg font-bold gradient-text">Admin Panel</span>
          </Link>
        </div>
        <nav className="p-4 flex flex-col gap-1">
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive ? 'gradient-primary text-primary-foreground' : 'text-foreground hover:bg-accent'
                }`}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 mt-auto border-t border-border">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors font-medium">
            <LogOut size={20} /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 glass px-6 py-4 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu size={24} />
          </button>
          <span className="font-bold gradient-text">Admin Panel</span>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
