import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const productToEdit = products.find(p => p.id.toString() === id);
      if (productToEdit) {
        setProduct(productToEdit);
      } else {
        toast({ title: "Product not found", variant: "destructive" });
        navigate('/admin/products');
      }
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.category) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setLoading(true);

    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    if (isEditing) {
      const updatedProducts = products.map(p =>
        p.id.toString() === id ? { ...product, price: parseFloat(product.price) } : p
      );
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      toast({ title: "Product updated successfully!" });
    } else {
      const newProduct = {
        id: Date.now(),
        ...product,
        price: parseFloat(product.price)
      };
      products.push(newProduct);
      localStorage.setItem('products', JSON.stringify(products));
      toast({ title: "Product added successfully!" });
    }

    setLoading(false);
    navigate('/admin/products');
  };

  return (
    <div>
      <Helmet>
        <title>{isEditing ? 'Edit Product' : 'Add Product'} - Admin</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass-effect border-white/20 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Product Name</Label>
                  <Input id="name" name="name" value={product.name} onChange={handleChange} className="bg-white/10 border-white/20 text-white" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white">Price</Label>
                  <Input id="price" name="price" type="number" step="0.01" value={product.price} onChange={handleChange} className="bg-white/10 border-white/20 text-white" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">Category</Label>
                <select id="category" name="category" value={product.category} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white" required>
                  <option value="" className="bg-gray-800">Select category</option>
                  <option value="electronics" className="bg-gray-800">Electronics</option>
                  <option value="sports" className="bg-gray-800">Sports</option>
                  <option value="home" className="bg-gray-800">Home</option>
                  <option value="accessories" className="bg-gray-800">Accessories</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <textarea id="description" name="description" value={product.description} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white" rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-white">Image URL</Label>
                <Input id="image" name="image" value={product.image} onChange={handleChange} className="bg-white/10 border-white/20 text-white" placeholder="https://example.com/image.jpg" />
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="btn-gradient" disabled={loading}>
                  {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product')}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/admin/products')} className="border-white/20 text-white hover:bg-white/10">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddProduct;