import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../../redux/features/cart/cartSlice'
import { useNavigate } from 'react-router-dom'
import { getBackendApiUrl } from "../../utils/baseURL";  



const OrderSummary = ({ onClose }) => {
  const { tax, taxRate, totalPrice, grandTotal, products } = useSelector((s) => s.cart);


// Ensure selectedItems is always an array
  // Ensure products is always an array
  const cartItems = Array.isArray(products) ? products : [];

  const totalQuantity = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );


  const dispatch = useDispatch()
  const navigate = useNavigate()


  const handleSendToCart = async () => {
  try {
    console.log("cartItems =", cartItems);
    onClose?.();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const itemIds = cartItems.map((item) => String(item.id));

    navigate("/cart-navigation");

    // COMMENTED FOR DEMO - Robot API call temporarily disabled for screenshots
    // UNCOMMENT the Robot API call below to enable it
    const BACKEND_URL = getBackendApiUrl();

    const response = await fetch(`${BACKEND_URL}/robot/go-to-cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: itemIds }),
    });

    if (!response.ok) throw new Error("Failed to send cart");
    const data = await response.json();
    console.log("Cart sent successfully:", data);

    
  } catch (error) {
    console.error("Failed to send cart to robot:", error);
    alert("Error sending cart to robot. Please try again.");
  }
};


  return (
    <div className='bg-primary-light mt-5 rounded text-base shadow-lg p-6'>
      <h2 className='text-xl text-text-dark font-semibold mb-4'>Order Summary</h2>

      <p className='text-text-dark'>
        Selected Items: <span className='font-medium'>{totalQuantity}</span>
      </p>
      <p>
        Total Price: <span className='font-medium'>${Number(totalPrice || 0).toFixed(2)}</span>
      </p>
      <p>
        Tax ({Number((taxRate || 0) * 100).toFixed(2)}%): <span className='font-medium'>${Number(tax || 0).toFixed(2)}</span>
      </p>
      <h3 className='font-bold text-lg mt-2'>
        Grand Total: <span className='text-green-600'>${Number(grandTotal || 0).toFixed(2)}</span>
      </h3>

      <div className='flex justify-between mt-6'>
        <button
          className='bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition duration-300'
          onClick={() => dispatch(clearCart())}
        >
          <i className="ri-delete-bin-2-line"></i>
          Clear Cart
        </button>

        <button
          className='bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition duration-300'
          disabled={totalQuantity === 0}
          onClick={handleSendToCart}
        >
          Send to cart
        </button>
      </div>
    </div>
  )
}

export default OrderSummary
