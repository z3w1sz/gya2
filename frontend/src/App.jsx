import { BrowserRouter as Route, Routes } from "react-router-dom";
import { Home } from "./modules/Main/Home/Home";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import ScrollToTop from "./components/ScrollToTop";
import { Footer } from "./modules/Footer/Footer";
import { AuthCallBack } from "./modules/Auth Callback/AuthCallBack";
import { Header } from "./modules/Header/Header";
import { Search } from "./modules/Main/Search/Search";
import { ProductDetail } from "./modules/Main/Product Detail/ProductDetail";
import { Cart } from "./modules/Main/Cart/Cart";
import { Categories } from "./modules/Main/Categories/Categories";
import { Store } from "./modules/Main/Store/Store";
import { Help } from "./modules/Main/Help/Help";
import { Contact } from "./modules/Main/Contact/Contact";
import { Secure } from "./modules/Main/Secure/Secure";
import { usePopup } from "./context/PopupContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Account } from "./modules/Main/Account/Account";
import { useIsRegister } from "./context/IsRegisterContext";
import { Subcategorie } from "./modules/Main/Categories/components/Subcategorie";
import { useIsSecure } from "./hooks/useIsSecure";
import { useIsScrollActive } from "./context/IsScrollActive";
import { useIsPageStoreChanging } from "./context/IsPageStoreChangingContext";
import { Login } from "./modules/Main/Account/components/Login";

function App() {
  // Lenis do that the scroll on the all page are smooth
  const [lenis, setLenis] = useState(null);
  useEffect(() => {
    const lenisInstance = new Lenis();
    setLenis(lenisInstance);

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      // Limpieza si se desmonta el componente
      lenisInstance.destroy();
    };
  }, []);

  // Verify if the refresh_token is valid, if is valid generate a access_token it's return a true or false
  const { popup } = usePopup();

  const { isScrollActive } = useIsScrollActive();

  const { isRegisterActive } = useIsRegister();

  useEffect(() => {
    if (lenis) {
      if (popup || isScrollActive === false) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [popup, isScrollActive]);

  const { secure } = useIsSecure();

  const { isPageStoreChanging, setIsPageStoreChanging } =
    useIsPageStoreChanging();

  useEffect(() => {
    if (isPageStoreChanging) {
      lenis.scrollTo(0, { duration: 0.5, easing: (t) => t });
      setIsPageStoreChanging(false);
    }
  }, [isPageStoreChanging, lenis, setIsPageStoreChanging]);

  return (
    <>
      {popup === false && isRegisterActive === false && (
        <Header secure={secure} />
      )}

      {/* 
          This make when change the route lenis make a
          scroll to the top of the page with a animation
      */}
      {lenis && <ScrollToTop lenis={lenis} />}
      {isPageStoreChanging && <ScrollToTop lenis={lenis} />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:category" element={<Subcategorie />} />
          <Route path="/account" element={<Account />} />
          <Route path="/store/:subcategory?" element={<Store />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/products/:productCode"
            element={<ProductDetail secure={secure} />}
          />
          <Route path="/cart" element={<Cart />} />
          {secure && (
            <>
              <Route path="/secure" element={<Secure />} />
            </>
          )}
          <Route path="/auth/callback" element={<AuthCallBack />} />

          <Route path="/*" element={<Home />} />
        </Routes>
      </main>

      {isRegisterActive === false && <Footer />}
    </>
  );
}

export default App;
