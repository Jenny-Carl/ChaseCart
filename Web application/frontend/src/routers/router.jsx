import {createBrowserRouter, Routes, Route} from "react-router-dom"
import App from "../App";
import Home from "../pages/home/Home";
import HomeMobile from "../pages/home/HomeMobile";
import CategoryPage from "../pages/category/CategoryPage";
import Search from "../pages/search/Search";
import SearchMobile from "../pages/search/SearchMobile";
import SingleProduct from "../pages/shop/SingleProduct";
import Contact from "../pages/contact/Contact";
import Login from "../components/Login"; 
import Register from "../components/Register"; 
import Checkout from '../pages/shop/Checkout';
import OrderSuccess from '../pages/shop/OrderSuccess';
import CartNavigationPage from "../pages/cartNavigationProcessing/CartNavigationPage";
import WhyChaseCart from "../pages/why_chasecart/WhyChaseCart"; 
import useDeviceDetection from "../hooks/useDeviceDetection";
//import Dashboard from "../pages/Dashboard";
//import Profile from "../pages/Profile";
//import Payments from "../pages/Payments";
//import Orders from "../pages/Orders";

// Composant wrapper pour router selon le device
const DeviceRouter = ({ mobileComponent: MobileComponent, desktopComponent: DesktopComponent }) => {
  const { isMobile } = useDeviceDetection();
  return isMobile ? <MobileComponent /> : <DesktopComponent />;
};

const router =createBrowserRouter([

    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/",
                element: <DeviceRouter mobileComponent={HomeMobile} desktopComponent={Home} />
            },
            {
                 path: "/categories/:categoryName",
                 element: <CategoryPage/>
            },
            {
                path: "/shop",
                element: <DeviceRouter mobileComponent={SearchMobile} desktopComponent={Search} />
            },
            {
                path: "/shop/:id",
                element: <SingleProduct/>
            },
            {
                path: "/contact",
                element: <Contact/>
            },
            {
                path: "/login",
                element: <Login/>, 
            },
            {
                path: "/register",
                element: <Register/>, 
            },
            {
                path: "/checkout",
                element: <Checkout />
            },
            {
                path: "/order-success",
                element: <OrderSuccess />
            },
            {
                path: "/why_chasecart",
                element: <WhyChaseCart />
            },
            {
                path: "/cart-navigation",
                element: <CartNavigationPage />
            },
            
        ]
    }
]);
export default router;