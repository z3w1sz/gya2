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

  const getNewestProducts = () => {
    axios.get(productsUrl).then((response) => {
      setNewestProducts(response.data);
    });
  };

  useEffect(() => {
    getNewestProducts();
  }, []);

  const handleMouseEnter = (productCode) => {
    setHoveredProducts((prev) => ({ ...prev, [productCode]: true }));
  };

  const handleMouseLeave = (productCode) => {
    setHoveredProducts((prev) => ({ ...prev, [productCode]: false }));
  };

  return (
    <>
      <div className="home-container">
        <div className="home-image__wrapper">
          <div className="home-main__container flex-center">
            <div className="home-main__title">
              <h1>Brilla con estilo</h1>
            </div>
            <div className="home-main__subtitle">
              <h2>Joyas y accesorios exclusivos en G&A</h2>
            </div>
          </div>
        </div>
        <div className="home-main__products">
          <h2>Nuevos productos</h2>
          <div className="home-main__newest-products">
            {newestProducts.map((product) => (
              <Link
                key={product.code}
                className="newest-product__img"
                onMouseEnter={() => handleMouseEnter(product.code)}
                onMouseLeave={() => handleMouseLeave(product.code)}
                to={`/products/${product.code}`}
                style={{ backgroundImage: `url("${product.images[0]}")` }}
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
        <Link to="/store" className="home-main__see-more-button">
          Ver más
          <FaArrowUpRightFromSquare fontSize="1.3rem" />
        </Link>
      </div>
    </>
  );
};
