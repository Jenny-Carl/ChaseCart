import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';  
import { addToCart } from '../../redux/features/cart/cartSlice.js';

const formatMoney = (n) => Number(n || 0).toFixed(2);

const ProductCardsMobile = ({ products = [] }) => {
  const dispatch = useDispatch();
  const [addedToCartId, setAddedToCartId] = useState(null);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    
    // Afficher le message "Added to cart"
    setAddedToCartId(product.id);
    
    // Masquer le message après 2 secondes
    setTimeout(() => {
      setAddedToCartId(null);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-2 gap-3 px-3 py-4">
      {products.map((product, idx) => (
        <div 
          key={product.id ?? idx} 
          className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
        >
          {/* Zone image */}
          <Link to={`/shop/${product.id}`} className="block">
            <div className="aspect-square w-full bg-gray-100 relative">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              
              {/* Message "Added to cart" overlay */}
              {addedToCartId === product.id && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white text-green-600 px-3 py-2 rounded-lg text-xs font-medium shadow-lg flex items-center gap-1">
                    <i className="ri-check-line"></i>
                    Added!
                  </div>
                </div>
              )}
            </div>
          </Link>

          {/* Bouton panier en overlay */}
          <div className="absolute top-2 right-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
              aria-label={`Add ${product.name} to cart`}
              className="rounded-full bg-primary text-white p-2 hover:brightness-110 shadow-md"
            >
              <i className="ri-shopping-cart-2-line text-sm" />
            </button>
          </div>

          {/* Contenu */}
          <div className="p-2 flex flex-col items-center text-center">
            <h3 className="text-xs font-medium line-clamp-2 mb-1">{product.name}</h3>
            <p className="text-sm font-bold text-gray-900">
              ${formatMoney(product.price)}
            </p>
            {product?.oldPrice && (
              <s className="text-xs text-gray-500">${formatMoney(product.oldPrice)}</s>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCardsMobile;
