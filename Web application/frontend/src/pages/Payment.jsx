import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { CreditCard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const Payment = () => {
  const handleAddPaymentMethod = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      description: "Integrating a payment provider like Stripe is needed.",
    });
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <Helmet>
        <title>Payment Methods - ChaseCart</title>
        <meta name="description" content="Manage your payment methods." />
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-white">Payment Methods</h1>
          <p className="text-white/70">
            Manage your saved payment options for faster checkout.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Your Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CreditCard className="h-20 w-20 text-white/50 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-2">No payment methods saved</h3>
                <p className="text-white/70 mb-6">
                  Add a payment method to get started.
                </p>
                <Button onClick={handleAddPaymentMethod} className="btn-gradient">
                  Add Payment Method
                </Button>
              </div>
              <div className="flex items-center justify-center mt-6 text-sm text-green-400">
                <Shield className="h-4 w-4 mr-2" />
                <span>Your payment information is secure.</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;