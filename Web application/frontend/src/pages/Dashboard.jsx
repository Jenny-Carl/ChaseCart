import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!auth.currentUser) return;

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    const userOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrders(userOrders);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const features = [
    { icon: ShoppingBag, title: 'Large Selection', description: 'Browse a wide range of products tailored for you.' },
    { icon: Truck, title: 'Fast Delivery', description: 'Get your orders delivered quickly and safely.' },
    { icon: Shield, title: 'Secure Payments', description: 'All transactions are secure and encrypted.' },
    { icon: Star, title: 'Top Rated Products', description: 'We only offer products highly rated by our users.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>ChaseCart Dashboard</title>
      </Helmet>

      <header className="bg-white shadow p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to ChaseCart</h1>
        <Button variant="default" onClick={() => auth.signOut().then(() => window.location.reload())}>
          Logout
        </Button>
      </header>

      <main className="p-6">
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Your Dashboard</h2>
          <p className="text-gray-600">Access your orders, track shipments, and manage your account.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
            >
              <feature.icon className="w-10 h-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </motion.div>
          ))}
        </section>

        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Your Orders</h3>
          {loading ? (
            <p>Loading your orders...</p>
          ) : orders.length === 0 ? (
            <p>You have no orders yet.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map(order => (
                <li key={order.id} className="bg-white p-4 rounded shadow">
                  <p><strong>Order ID:</strong> {order.id}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Total:</strong> ${order.total}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="text-center">
          <Link to="/shop">
            <Button variant="default">Start Shopping</Button>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
