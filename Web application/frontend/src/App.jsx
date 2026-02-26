import { Outlet } from 'react-router-dom'
import './App.css'
import './App.mobile.css'
import Navbar from './components/Navbar'
import NavbarMobile from './components/mobile/NavbarMobile'
import Footer from './components/Footer'
import ScrollToTop from "./components/ScrollToTop"
import { Toaster } from './components/ui/toaster'
import useDeviceDetection from './hooks/useDeviceDetection'


function App() {
  const { isMobile } = useDeviceDetection();

  return (
    <>
      <ScrollToTop />
      {isMobile ? <NavbarMobile /> : <Navbar />}
      <main className="pt-16"> {/* 16 = la hauteur du Navbar (h-16) */}
        <Outlet />
      </main>
      <Footer />
      <Toaster /> {/* ✅ Notifications accessibles partout */}
    </>
  );
}
export default App
