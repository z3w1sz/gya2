import { useEffect, useState } from "react";
import "./styles/Search.css";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import { useBaseUrl } from "../../../context/BaseUrlContext";
import Slider from "react-slick";
import {
  SampleNextArrow,
  SamplePrevArrow,
} from "../../../components/SliderItems";

export const Search = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [hoveredProducts, setHoveredProducts] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1); // Estado para la página actual
  const [loading, setLoading] = useState(false); // Estado para indicar si se está cargando más contenido

  const { productsUrl } = useBaseUrl();

  useEffect(() => {
    // Cargar productos al inicio o cuando la página cambie
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${productsUrl}/simple`, {
          params: { page },
        });
        setData((prevData) => [...prevData, ...response.data]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [page, productsUrl]);

  const handleMouseEnter = (index) => {
    setHoveredProducts((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const handleMouseLeave = (index) => {
    setHoveredProducts((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setPage((prevPage) => prevPage + 1); // Incrementa la página para cargar más productos
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const settings = {
    dots: true,
    lazyLoad: true,
    infinite: false,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    beforeChange: (current, next) => setCurrentSlide(next),
  };

  const filteredProducts = data.filter(
    (productSimple) =>
      productSimple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productSimple.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productSimple.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productSimple.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="search">
      <div className="search-title">
        <h2>Buscar resultados</h2>
      </div>
      <div className="search-bar">
        <div
          className={
            "search-bar__wrapper " + `${isFocused && "search-bar--focus"}`
          }
        >
          <div className="search-bar__search-icon flex-center">
            <FiSearch fontSize="1.2rem" />
          </div>
          <input
            placeholder="Buscar nombre, categoría, código y más..."
            type="text"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="search-products__container">
        {filteredProducts.map((productSimple, index) => {
          const isProductHovered = hoveredProducts[index];
          return (
            <Link
              className="search-product"
              to={`/products/${productSimple.code}`}
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              {productSimple.images.length > 1 ? (
                <Slider
                  {...settings}
                  className={
                    "custom-slider " +
                    `${isProductHovered ? "" : "slider__not-hover "} ` +
                    `${
                      currentSlide + 1 === productSimple.images.length
                        ? "slider__last-slide"
                        : ""
                    } ` +
                    `${currentSlide === 0 ? "slider__first-slide" : ""}`
                  }
                >
                  {productSimple.images.map((image, imgIndex) => (
                    <div key={imgIndex}>
                      <img src={image} alt={`Slide ${imgIndex + 1}`} />
                    </div>
                  ))}
                </Slider>
              ) : (
                <img src={productSimple.images[0]} alt={productSimple.name} />
              )}

              <div className="search-product__title">
                <h3>{productSimple.name}</h3>
              </div>
              <div className="search-product__price">
                <span>$ {productSimple.price}</span>
              </div>
              <div className="search-product__category">
                <h4>{productSimple.material}</h4>
              </div>
            </Link>
          );
        })}
        {loading && <p>Cargando más productos...</p>}
      </div>
    </div>
  );
};
