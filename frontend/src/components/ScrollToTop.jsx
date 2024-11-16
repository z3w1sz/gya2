import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ lenis }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    lenis && lenis.scrollTo(0);
  }, [pathname, lenis]);
  return null;
};

export default ScrollToTop;
