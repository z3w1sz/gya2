import { Link, useNavigate, useParams } from "react-router-dom";
import "./styles/ProductDetail.css";
import StarRating from "./component/StarRating";
import { useEffect, useState } from "react";
import { useBaseUrl } from "../../../context/BaseUrlContext";
import axios from "axios";
import { MdClose } from "react-icons/md";
import { usePopup } from "../../../context/PopupContext";
import SimpleSlider from "./component/SimpleSlider";

export const ProductDetail = ({ secure }) => {
  const { productsUrl } = useBaseUrl();
  const { productCode } = useParams();
  const [product, setProduct] = useState({});
  const [imageSmallSelected, setImageSmallSelected] = useState("");
  const [imageSmallCurrentIndex, setImageSmallCurrentIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();
  const { setPopup } = usePopup();

  const getDetailProducts = () => {
    axios.get(`${productsUrl}/detail/${productCode}`).then((response) => {
      setProduct(response.data);
      if (response.data.images && response.data.images.length > 0) {
        setImageSmallSelected(response.data.images[0]);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    getDetailProducts();
  }, [productsUrl, productCode]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageSmallClick = (imageSmallSelect, index) => {
    setImageSmallSelected(imageSmallSelect);
    setImageSmallCurrentIndex(index);
  };

  const handleCartClick = () => {
    axios.put(
      productsUrl + "/cart",
      { ...product, quantity: 1 },
      { withCredentials: true }
    );
  };

  const handleProductDelete = (code) => {
    axios.delete(`${productsUrl}/${code}`).then(() => {
      navigate("/store");
    });
  };

  const handleOpenModal = () => {
    setPopup(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setPopup(false);
    setIsModalOpen(false);
  };

  return (
    <div className="product-detail">
      <div className="product-images-container">
        {loading ? (
          <div>Cargando imágenes...</div>
        ) : isMobile === true && product.images.length > 1 ? (
          <SimpleSlider images={product.images} />
        ) : isMobile === true ? (
          <div
            className="product-image"
            style={{
              backgroundImage: `url(${imageSmallSelected})`,
              cursor: "auto",
            }}
          ></div>
        ) : (
          <>
            <div className="product-images">
              {product.images &&
                product.images.map((image, index) => (
                  <div
                    className={`product-image-small ${
                      imageSmallCurrentIndex === index
                        ? "product-image-small__selected"
                        : ""
                    }`}
                    key={index}
                    onClick={() => handleImageSmallClick(image, index)}
                    onMouseEnter={() => handleImageSmallClick(image, index)}
                  >
                    <div className="product-image-small__container">
                      <img src={image} alt={`Image ${index}`} />
                    </div>
                  </div>
                ))}
            </div>
            <div
              className="product-image"
              style={{
                backgroundImage: `url(${imageSmallSelected})`,
              }}
              onClick={handleOpenModal}
            ></div>
          </>
        )}
      </div>
      <div className="product-detail-container">
        <div className="product-detail__title">
          <h2>{product.name}</h2>
        </div>
        <div className="product-detail__stars">
          <StarRating rating={4.5} />
        </div>
        <div className="product-detail__price">
          <span>$ {product.price}</span>
        </div>
        <div className="product-detail__category">
          <p>{product.category}</p>
        </div>
        <div className="product-detail__text">
          <span>Material:</span>
          <span>{product.material}</span>
        </div>
        <div className="product-detail__text text--code">
          <span>Código:</span>
          <span>{product.code}</span>
        </div>
        <Link
          className="product-shopping-cart__button"
          to="/cart"
          onClick={handleCartClick}
        >
          Agregar al carrito
        </Link>
        {secure && (
          <button
            className="product-shopping-cart__button cart-button--delete"
            onClick={() => handleProductDelete(product.code)}
          >
            Eliminar
          </button>
        )}
      </div>
      {isModalOpen && (
        <div className="secure-popup">
          <div
            className="secure-popup__img"
            style={{ backgroundImage: `url(${imageSmallSelected})` }}
          ></div>
          <div
            className="secure-popup__close-button"
            onClick={handleCloseModal}
          >
            <MdClose fontSize="3rem" />
          </div>
        </div>
      )}
    </div>
  );
};
