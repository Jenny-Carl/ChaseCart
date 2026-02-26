import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const totalRevenue = savedOrders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = savedOrders.filter(order => order.status === 'pending').length;

    setStats({
      totalProducts: savedProducts.length,
      totalOrders: savedOrders.length,
      totalRevenue,
      pendingOrders,
    });
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-400' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-400' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-purple-400' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: Users, color: 'text-yellow-400' },
  ];

  return (
    <div>
      <Helmet>
        <title>Admin Dashboard - ShopMVP</title>
        <meta name="description" content="Overview of the store's performance." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2 text-white">Dashboard</h1>
        <p className="text-white/70">
          An overview of your store's performance.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
          >
            <Card className="glass-effect border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/70">{card.title}</CardTitle>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{card.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;