import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { TbSquareRoundedArrowRightFilled } from "react-icons/tb";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import "./styles/Store.css";
import { useBaseUrl } from "../../../context/BaseUrlContext";
import { useIsPageStoreChanging } from "../../../context/IsPageStoreChangingContext";
import { MdClose, MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";

export const Store = () => {
  const { productsUrl } = useBaseUrl();
  const { subcategory } = useParams();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [order, setOrder] = useState(null); // "asc" o "desc"
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1); // Página actual
  const limitPerPage = 21;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getProductsForSubcategory = async (page) => {
    try {
      const response = await axios.get(
        `${productsUrl}/store/${subcategory}/?page=${page}`
      );
      setProducts(response.data.products);
      setTotalProducts(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching products by subcategory:", error);
    }
  };

  const getProducts = async (page) => {
    try {
      const response = await axios.get(`${productsUrl}/store?page=${page}`);
      setProducts(response.data.products);
      setTotalProducts(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${productsUrl}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (subcategory) {
      getProductsForSubcategory(page);
    } else {
      getProducts(page);
    }
    getCategories();
  }, [page, subcategory]);

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    if (priceMin !== "") {
      filtered = filtered.filter(
        (product) => parseFloat(product.price) >= parseFloat(priceMin)
      );
    }

    if (priceMax !== "") {
      filtered = filtered.filter(
        (product) => parseFloat(product.price) <= parseFloat(priceMax)
      );
    }

    return filtered;
  };

  useEffect(() => {
    setFilteredProducts(filterProducts());
  }, [products, selectedCategories, priceMin, priceMax]);

  useEffect(() => {
    const sortedProducts = [...filteredProducts];
    if (order === "asc") {
      sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (order === "desc") {
      sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    setFilteredProducts(sortedProducts);
  }, [order]);

  const totalPages = Math.ceil(totalProducts / limitPerPage) || 1;

  const { setIsPageStoreChanging } = useIsPageStoreChanging();

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
      setTimeout(() => setIsPageStoreChanging(true), 200);
    }
  };

  const [isMobileFilterActive, setIsMobileFilterActive] = useState(false);

  const handleFilterClick = () => {
    setIsMobileFilterActive(!isMobileFilterActive);
  };

  useEffect(() => {
    const lazyLoadImages = document.querySelectorAll(
      ".store-product__img.lazy"
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
  }, [filteredProducts]);

  return (
    <div className={"store " + (isMobile ? "store-mobile" : "")}>
      <div className="store__filters-container">
        <div className="store__filter-wrapper">
          <h2>Filtros</h2>
          <div className="store-filter__filter-selected">
            <div className="store-filter__selected-filter">
              {order === "asc"
                ? "Menor precio"
                : order === "desc"
                ? "Mayor precio"
                : "Sin ordenar"}
            </div>
          </div>
          <div className="store-filter__filter-selected">
            <div className="store-filter__categorie-selected">
              {selectedCategories.map((category, index) => (
                <div key={index} className="store-filter__selected-filter">
                  {category}
                  <IoMdClose
                    fontSize="1.2rem"
                    onClick={() => toggleCategory(category)}
                    color="#d4af37"
                    cursor="pointer"
                  />
                </div>
              ))}
            </div>
          </div>
          {isMobile && isMobileFilterActive === false && (
            <MdOutlineKeyboardDoubleArrowDown
              fontSize="1.4rem"
              onClick={handleFilterClick}
              cursor={"pointer"}
            />
          )}
          {isMobile && isMobileFilterActive && (
            <MdClose
              fontSize="1.4rem"
              onClick={handleFilterClick}
              cursor={"pointer"}
            />
          )}
        </div>
        <div
          className={
            "store-filter__wrapper2 " +
            `${isMobileFilterActive ? "wrapper2--visible" : "wrapper2--hidden"}`
          }
        >
          <div className="store-filter-container">
            <h4>Categorías</h4>
            <ul>
              {categories.map((category, index) => (
                <li key={index}>
                  <a
                    onClick={() => toggleCategory(category.name)}
                    className={
                      selectedCategories.includes(category.name)
                        ? "selected"
                        : ""
                    }
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="store-filter-container">
            <h4>Precio</h4>
            <ul>
              <li>
                <a onClick={() => setOrder(null)}>Más relevantes</a>
              </li>
              <li>
                <a onClick={() => setOrder("asc")}>Menor precio</a>
              </li>
              <li>
                <a onClick={() => setOrder("desc")}>Mayor precio</a>
              </li>
              <div className="store-filter__select-price">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  min={0}
                  max={100000}
                />
                <div className="store-filter-price__divider"></div>
                <input
                  type="number"
                  placeholder="Máximo"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  min={0}
                  max={100000}
                />
                <TbSquareRoundedArrowRightFilled
                  fontSize="1.6rem"
                  color="#d4af37"
                  className="select-price-icon"
                  onClick={filterProducts}
                />
              </div>
            </ul>
          </div>
          {/* Aquí puedes agregar la lógica para mostrar filtros dinámicos */}
        </div>
      </div>

      <div className="store-products__main-container">
        <div className="store-products__container">
          {filteredProducts.map((product, index) => (
            <Link
              className="store-product"
              to={`/products/${product.code}`}
              key={index}
            >
              <div
                className="store-product__img lazy"
                data-bg={product.images[0]}
              ></div>
              <div className="store-product__title">
                <h3>{product.name}</h3>
              </div>
              <div className="store-product__price">
                <span>$ {product.price}</span>
              </div>
              <div className="store-product__category">
                <h4>{product.category}</h4>
              </div>
            </Link>
          ))}
        </div>

        <div className="store-products__page-number-bar">
          <ul>
            <li>
              <span onClick={() => goToPage(page - 1)} disabled={page === 1}>
                Anterior
              </span>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index}>
                <span onClick={() => goToPage(index + 1)}>{index + 1}</span>
              </li>
            ))}
            <li>
              <span
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
              >
                Siguiente
                <MdOutlineKeyboardArrowRight fontSize="1.4rem" />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
