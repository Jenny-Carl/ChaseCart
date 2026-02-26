import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from "../firebase";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const { currentUser, userProfile } = useAuth();
  const [name, setName] = useState(userProfile?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // In a real app, you would update the user profile in Firestore here.
    // For now, we'll just show a toast.
    setTimeout(() => {
      toast({
        title: "🚧 Feature in progress!",
        description: "Updating user profiles is not yet implemented. You can request it in your next prompt! 🚀",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <Helmet>
        <title>My Profile - ShopMVP</title>
        <meta name="description" content="Manage your profile information." />
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-white">My Profile</h1>
          <p className="text-white/70">
            View and update your account details.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentUser?.email || ''}
                    className="bg-white/20 border-white/30 text-white/70"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white">Role</Label>
                  <Input
                    id="role"
                    value={userProfile?.role || 'client'}
                    className="bg-white/20 border-white/30 text-white/70 capitalize"
                    disabled
                  />
                </div>
                <Button type="submit" className="btn-gradient" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;