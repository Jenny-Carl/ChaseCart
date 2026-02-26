// CartModal.jsx
import React, { useEffect, useCallback, useMemo } from 'react';
import OrderSummary from './OrderSummary';
import { useDispatch } from 'react-redux';
import { incrementQuantity, decrementQuantity, removeFromCart } from '../../redux/features/cart/cartSlice';

const formatCurrency = (n) => Number(n || 0).toFixed(2);

const CartModal = ({ products = [], isOpen, onClose }) => {
  const dispatch = useDispatch();

  // id fallback: id -> _id -> productId -> index
  const makeId = useCallback((item, idx) => item?.id ?? item?._id ?? item?.productId ?? idx, []);

  // lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  // close on Esc
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const hasItems = products.length > 0;
  const items = useMemo(() => products, [products]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      className={`fixed z-[1000] inset-0 bg-black/80 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ transition: 'opacity 300ms' }}
      onClick={onClose}
    >
      <div
        className={`fixed right-0 top-0 md:w-1/3 w-full h-full bg-white shadow-lg overflow-y-auto transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ transition: 'transform 300ms cubic-bezier(0.25,0.46,0.45,0.94)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 id="cart-title" className="text-xl font-semibold">Shopping Cart</h2>
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900"
              onClick={onClose}
              aria-label="Close cart"
            >
              <i className="ri-close-line bg-black p-1 text-white" />
            </button>
          </div>

          {/* Cart items */}
          <div className="cart-items">
            {!hasItems ? (
              <div className="text-gray-600">Your cart is empty</div>
            ) : (
              items.map((item, index) => {
                const id = makeId(item, index);
                return (
                  <div
                    key={id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between shadow-md md:p-5 p-3 mb-4 rounded-lg"
                  >
                    <div className="flex items-center">
                      <span className="mr-4 px-2 min-w-8 text-center bg-primary text-white rounded-full">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {item?.image ? (
                        <img
                          src={item.image}
                          alt={item?.name || 'Product'}
                          className="w-8 h-8 object-cover mr-4 rounded"
                        />
                      ) : (
                        <div className="w-8 h-8 mr-4 rounded bg-gray-200" aria-hidden />
                      )}

                      <div>
                        <p className="text-sm font-medium leading-tight">{item?.name ?? 'Unnamed item'}</p>
                        <p className="text-gray-600 text-sm">${formatCurrency(item?.price)}</p>
                      </div>
                    </div>

                    <div className="flex flex-row md:justify-start justify-end items-center mt-3 md:mt-0">
                      <button
                        type="button"
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white ml-0 md:ml-8"
                        onClick={() => dispatch(decrementQuantity({ id }))}
                        aria-label={`Decrease quantity of ${item?.name ?? 'item'}`}
                      >
                        –
                      </button>
                      <span className="px-3 text-center min-w-6">{item?.quantity ?? 0}</span>
                      <button
                        type="button"
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white"
                        onClick={() => dispatch(incrementQuantity({ id }))}
                        aria-label={`Increase quantity of ${item?.name ?? 'item'}`}
                      >
                        +
                      </button>

                      <button
                        type="button"
                        className="ml-5 text-red-500 hover:text-red-700"
                        onClick={() => dispatch(removeFromCart({ id }))}
                        aria-label={`Remove ${item?.name ?? 'item'} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Calculation */}
          {hasItems && <OrderSummary onClose={onClose}/>}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
