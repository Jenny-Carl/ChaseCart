import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productsApi } from '../../services/api';
import ProductCards from './ProductCards';


const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Utiliser l'API Firestore pour récupérer le produit par ID
        const foundProduct = await productsApi.getById(id);
        setProduct(foundProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="section__container text-center py-8">
        <p>Chargement du produit...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section__container text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section__container text-center py-8">
        <p>Produit non trouvé!</p>
      </div>
    );
  }

  return (
    <>
      <section className="section__container bg-primary-light">
        <h2 className="section__header capitalize">{product.name}</h2>
      </section>

      <div className="product-info">
        {/* Pass the product as an array */}
        <ProductCards products={[product]} />
        <h3>{product.description}</h3>
      </div>
    </>
  );
};

export default SingleProduct;
