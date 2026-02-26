import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    if (savedProducts.length === 0) {
      const mockProducts = [
        { id: 1, name: 'Wireless Headphones', price: 99.99, category: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
        { id: 2, name: 'Smart Watch', price: 199.99, category: 'electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }
      ];
      setProducts(mockProducts);
      localStorage.setItem('products', JSON.stringify(mockProducts));
    } else {
      setProducts(savedProducts);
    }
  }, []);

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    toast({
      title: "Product deleted",
      description: "Product has been deleted successfully."
    });
  };

  return (
    <div>
      <Helmet>
        <title>Manage Products - Admin</title>
        <meta name="description" content="Add, edit, and delete products." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Products</h1>
          <p className="text-white/70">Add, edit, or delete products from your store.</p>
        </div>
        <Button onClick={() => navigate('/admin/products/add')} className="btn-gradient">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card className="glass-effect border-white/20 h-full flex flex-col">
              <CardContent className="p-4 flex flex-col flex-grow">
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2 truncate flex-grow">{product.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-purple-400 font-bold">${product.price}</span>
                  <span className="text-white/50 text-sm capitalize">{product.category}</span>
                </div>
                <div className="flex space-x-2 mt-auto">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/admin/products/edit/${product.id}`)} className="flex-1 border-white/20 text-white hover:bg-white/10">
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product.id)} className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;