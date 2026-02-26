import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    toast({
      title: "Order updated",
      description: `Order status changed to ${newStatus}.`
    });
  };

  return (
    <div>
      <Helmet>
        <title>Manage Orders - Admin</title>
        <meta name="description" content="View and manage all customer orders." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">Manage Orders</h1>
        <p className="text-white/70">View and update the status of all orders.</p>
      </motion.div>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="glass-effect border-white/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Order #{order.id}</h3>
                      <p className="text-white/70 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-1 text-white text-sm">
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-white/70 truncate pr-2 flex-1">{item.name} × {item.quantity}</span>
                        <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/20 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Total</span>
                      <span className="text-purple-400">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-white/50 mx-auto mb-4" />
            <p className="text-white/70">No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;