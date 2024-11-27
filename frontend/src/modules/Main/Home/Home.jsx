import { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import { useBaseUrl } from "../../../context/BaseUrlContext";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const Home = () => {
  const { productsUrl } = useBaseUrl();
  const [newestProducts, setNewestProducts] = useState([]);
  const [hoveredProducts, setHoveredProducts] = useState({}); // Estado para "hover" de cada producto
  const [backgroundImage, setBackgroundImage] = useState(""); // Imagen de fondo optimizada

  // Obtener productos más nuevos
  const getNewestProducts = () => {
    axios.get(productsUrl).then((response) => {
      setNewestProducts(response.data);
    });
  };

  useEffect(() => {
    getNewestProducts();
  }, []);

  // Manejo de hover para los productos
  const handleMouseEnter = (productCode) => {
    setHoveredProducts((prev) => ({ ...prev, [productCode]: true }));
  };

  const handleMouseLeave = (productCode) => {
    setHoveredProducts((prev) => ({ ...prev, [productCode]: false }));
  };

  // Lazy load para la imagen de fondo principal
  useEffect(() => {
    const updateBackgroundImage = () => {
      const isMobile = window.innerWidth < 768;
      const imageUrl = isMobile
        ? "/accessories-bg-mobile.webp"
        : "/accessories-bg.webp";
      setBackgroundImage(imageUrl);
    };

    updateBackgroundImage();
    window.addEventListener("resize", updateBackgroundImage);

    return () => window.removeEventListener("resize", updateBackgroundImage);
  }, []);

  // Lazy load para imágenes de productos
  useEffect(() => {
    const lazyLoadImages = document.querySelectorAll(
      ".newest-product__img.lazy"
    );

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const bgImageUrl = element.getAttribute("data-bg");
            if (bgImageUrl) {
              element.style.backgroundImage = `url(${bgImageUrl})`;
              element.classList.remove("lazy");
              observer.unobserve(element);
            }
          }
        });
      },
      { rootMargin: "0px", threshold: 0.1 }
    );

    lazyLoadImages.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, [newestProducts]);

  return (
    <>
      <div className="home-container">
        {/* Imagen de fondo principal */}
        <div
          className="home-image__wrapper"
          style={{
            backgroundImage: `linear-gradient(#0005, #0005), url(${backgroundImage})`,
          }}
        >
          <div className="home-main__container flex-center">
            <div className="home-main__title">
              <h1>Brilla con estilo</h1>
            </div>
            <div className="home-main__subtitle">
              <h2>Joyas y accesorios exclusivos en G&A</h2>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="home-main__products">
          <h2>Nuevos productos</h2>
          <div className="home-main__newest-products">
            {newestProducts.map((product) => (
              <Link
                key={product.code}
                className="newest-product__img lazy"
                onMouseEnter={() => handleMouseEnter(product.code)}
                onMouseLeave={() => handleMouseLeave(product.code)}
                to={`/products/${product.code}`}
                data-bg={product.images[0]} // Imagen diferida
              >
                {hoveredProducts[product.code] && (
                  <>
                    <h4>{product.name}</h4>
                    <h5>{product.material}</h5>
                  </>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Botón para ver más */}
        <Link to="/store" className="home-main__see-more-button">
          Ver más
          <FaArrowUpRightFromSquare fontSize="1.3rem" />
        </Link>
      </div>
    </>
  );
};
