import { useEffect } from "react";
import { useLocation } from "react-router-dom";

<<<<<<< HEAD
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]); // 🔥 se déclenche à chaque changement de route

  return null;
};

export default ScrollToTop;
=======
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
export default ScrollToTop; 
>>>>>>> a05f0ba (Ajout des dernières modifications (Dashboard, Navbar, Auth, etc.))
