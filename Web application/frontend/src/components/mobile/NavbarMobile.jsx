import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import CartModal from '../../pages/shop/CartModal';
import avatarImg from '../../assets/avatar.png';
import { logout } from '../../redux/features/auth/authSlice';
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const NavbarMobile = () => {
  const products = useSelector((state) => state.cart.products);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDropDownToggle = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate("/");
      setIsMenuOpen(false);
      setIsDropDownOpen(false);
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  return (
    <>
      <header className='fixed inset-x-0 top-0 z-50 bg-white shadow'>
        <nav className="mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className='nav__logo flex-shrink-0'>
            <Link to="/" className="text-xl font-bold text-gray-900">
              ChaseCart<span className="text-primary">.</span>
            </Link>
          </div>

          {/* Icons - Right side */}
          <div className='flex items-center gap-3'>
            {/* Search Icon */}
            <Link to="/shop" className="text-2xl hover:text-primary p-2">
              <i className="ri-search-line"></i>
            </Link>

            {/* Cart Icon */}
            <button onClick={handleCartToggle} className='relative text-2xl hover:text-primary p-2'>
              <i className="ri-shopping-cart-2-line"></i>
              {products.length > 0 && (
                <sup className='absolute top-0 right-0 text-xs px-1.5 py-0.5 text-white rounded-full bg-primary min-w-[20px] text-center'>
                  {products.length}
                </sup>
              )}
            </button>

            {/* User Avatar or Login */}
            {user ? (
              <button onClick={handleDropDownToggle} className="relative p-2">
                <img 
                  src={user?.profileImage || avatarImg} 
                  alt="User" 
                  className='w-6 h-6 rounded-full object-cover cursor-pointer'
                />
              </button>
            ) : (
              <Link to="/login" className="text-2xl hover:text-primary p-2">
                <i className="ri-user-line"></i>
              </Link>
            )}

            {/* Burger Menu Icon */}
            <button 
              onClick={handleMenuToggle} 
              className='text-3xl hover:text-primary p-2'
              aria-label="Toggle menu"
            >
              <i className={isMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="bg-white border-t shadow-lg">
            <ul className='flex flex-col py-2'>
              <li className='px-6 py-3 hover:bg-gray-100'>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              </li>
              <li className='px-6 py-3 hover:bg-gray-100'>
                <Link to="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link>
              </li>
              <li className='px-6 py-3 hover:bg-gray-100'>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              </li>
              <li className='px-6 py-3 hover:bg-gray-100'>
                <Link to="/why_chasecart" onClick={() => setIsMenuOpen(false)}>Why ChaseCart?</Link>
              </li>
            </ul>
          </div>
        )}

        {/* User Dropdown Menu */}
        {isDropDownOpen && user && (
          <div className="absolute right-4 top-16 bg-white border shadow-lg rounded-lg py-2 min-w-[120px] z-50">
            <ul>
              <li className='px-4 py-2 hover:bg-gray-100'>
                <button onClick={handleLogout} className="w-full text-left">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Cart Modal */}
      <CartModal 
        products={products} 
        isOpen={isCartOpen} 
        onClose={handleCartToggle} 
      />
    </>
  );
};

export default NavbarMobile;
