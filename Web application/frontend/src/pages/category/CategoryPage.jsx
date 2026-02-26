import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { productsApi } from "../../services/api"
import ProductCards from '../shop/ProductCards';



const CategoryPage = () => {
    const { categoryName } = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchProductsByCategory = async () => {
        try {
          setLoading(true);
          setError(null);
          
          console.log(`Fetching products for category: ${categoryName}`);
          // Utiliser l'API Firestore pour récupérer les produits par catégorie
          const products = await productsApi.getByCategory(categoryName.toLowerCase());
          console.log(`Fetched ${products?.length || 0} products`);
          setFilteredProducts(products);
        } catch (err) {
          console.error('Error fetching products by category:', err);
          console.error('Error details:', err.message);
          setError(`Erreur lors du chargement des produits: ${err.message || 'Vérifiez que le backend est accessible'}`);
        } finally {
          setLoading(false);
        }
      };

      if (categoryName) {
        fetchProductsByCategory();
      }
    }, [categoryName]);
  
    return (
    <>
      <section className="section__container bg-primary-light">
        <h2 className="section__header capitalize">{categoryName}</h2>
        <p className="section__subheader">
        Browse a wide selection of categories, from everyday essentials to exciting new finds. Whatever you're looking for, we've got something for you!
        </p>
      </section>
      
      <div className='section__container'>
        {loading && (
          <div className="text-center py-8">
            <p>Chargement des produits...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <ProductCards products={filteredProducts}/>
        )}
        
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p>Aucun produit trouvé dans cette catégorie.</p>
          </div>
        )}
      </div>
      </>
    );
  };
  
  export default CategoryPage;