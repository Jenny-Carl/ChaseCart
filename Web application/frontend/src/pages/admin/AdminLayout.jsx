import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, PlusCircle } from 'lucide-react';

const AdminLayout = () => {
  const navLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
    { to: '/admin/products', icon: Package, text: 'Manage Products' },
    { to: '/admin/products/add', icon: PlusCircle, text: 'Add Product' },
    { to: '/admin/orders', icon: ShoppingCart, text: 'All Orders' },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900/80 glass-effect border-r border-white/10 p-4 hidden md:block">
        <nav className="flex flex-col space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin/dashboard'}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <link.icon className="h-5 w-5 mr-3" />
              <span>{link.text}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;