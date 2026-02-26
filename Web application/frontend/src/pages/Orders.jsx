import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { useAuth } from "../firebase";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Load orders from localStorage (mock database)
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
    setLoading(false);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-400" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-400" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'processing':
        return 'text-blue-400';
      case 'shipped':
        return 'text-purple-400';
      case 'delivered':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <Helmet>
          <title>My Orders - ChaseCart</title>
          <meta name="description" content="View your order history and track your purchases." />
        </Helmet>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Package className="h-24 w-24 text-white/50 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4 text-white">No orders yet</h1>
          <p className="text-white/70">
            You haven't placed any orders yet. Start shopping to see your orders here!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <Helmet>
        <title>My Orders - ChaseCart</title>
        <meta name="description" content="View your order history and track your purchases." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-white">My Orders</h1>
          <p className="text-white/70">
            Track your orders and view your purchase history
          </p>
        </motion.div>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass-effect border-white/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">
                        Order #{order.id}
                      </CardTitle>
                      <p className="text-white/70 text-sm">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`capitalize font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-white/70 text-sm">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="text-purple-400 font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-white/20 mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">Total</span>
                      <span className="text-xl font-bold text-purple-400">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;