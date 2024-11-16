import { useEffect, useState } from "react";
import "./styles/Cart.css";
import { LiaTimesSolid } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBaseUrl } from "../../../context/BaseUrlContext";
import { useJwtAuth } from "../../../context/AuthJwtContext";
import CheckoutButton from "./components/CheckoutButton";

export const Cart = () => {
  const { productsUrl, usersUrl } = useBaseUrl();
  const [products, setProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [profileData, setProfileData] = useState({});

  const getCartProducts = () => {
    axios
      .get(productsUrl + "/cart", { withCredentials: true })
      .then((response) => {
        const productsWithQuantity = response.data.products.map((product) => ({
          ...product,
          quantity: product.quantity || 1,
        }));
        setProducts(productsWithQuantity);
      });
  };

  const handleProductCartDelete = (product_code) => {
    axios
      .delete(productsUrl + "/cart" + `/${product_code}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
      });
    setTimeout(() => {
      getCartProducts();
    }, [500]);
  };

  const calculateTotals = () => {
    // Calcular subtotal, descuento y total
    const totalSubtotal = products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    // Suponiendo que cada producto tiene un campo discount
    const totalDiscount = products.reduce(
      (acc, product) => acc + (product.discount || 0),
      0
    );

    const totalPrice = totalSubtotal - totalDiscount;

    // Actualiza los estados de subtotal, discount y total
    setSubtotal(totalSubtotal);
    setDiscount(totalDiscount);
    setTotal(totalPrice);
  };

  const updateProductQuantity = (productCode, newQuantity) => {
    if (newQuantity <= 0) {
      // Aquí podrías manejar la lógica si no quieres permitir cantidades negativas
      return;
    }

    axios
      .put(
        `${productsUrl}/cart/${productCode}`,
        { quantity: newQuantity },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        getCartProducts(); // Actualiza la lista de productos en el carrito
      })
      .catch((error) => {
        console.error("Error al actualizar la cantidad:", error);
      });
  };

  useEffect(() => {
    getCartProducts();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [products]);

  const { isValid, isLoading } = useJwtAuth();

  const navigate = useNavigate();

  useEffect(() => {
    isLoading === false && isValid === false && navigate("/account");
  }, [isValid]);

  const getProfileData = () => {
    axios
      .get(usersUrl + "/profile", { withCredentials: true })
      .then((response) => {
        setProfileData(response.data);
      });
  };

  useEffect(() => {
    getProfileData();
  }, []);

  const handleCartShop = () => {
    return {
      payer: {
        first_name: profileData.name || profileData.email,
        last_name: profileData.name || profileData.email,
        email: profileData.email,
      },
      items: products.map((product) => ({
        id: product.code,
        title: product.name,
        description: "",
        category_id: product.material,
        quantity: product.quantity,
        unit_price: parseFloat(product.price),
      })),
      external_reference: `order-12345`,
      notification_url: "https://youtube.com/webhook",
    };
  };

  return (
    <div className="cart">
      <div className="cart__title">
        <h2>Carrito de compras</h2>
      </div>
      <div className="cart__main-container">
        <div className="cart-product__wrapper">
          {products.map((product, index) => {
            return (
              <div className="cart__product" key={index}>
                <Link to={`/products/${product.code}`}>
                  <div
                    className="cart-product__image"
                    style={{ backgroundImage: `url("${product.images[0]}")` }}
                  ></div>
                </Link>
                <div className="cart-product__info">
                  <div>
                    <div className="cart-product__top-wrapper">
                      <Link
                        to={`/products/${product.code}`}
                        className="cart-product__title-link"
                      >
                        <div className="cart-product__title">
                          <h3>{product.name}</h3>
                        </div>
                      </Link>
                      <div
                        className="cart-product__delete-container"
                        onClick={() => handleProductCartDelete(product.code)}
                      >
                        <button>
                          <LiaTimesSolid fontSize="1.4rem" />
                        </button>
                      </div>
                    </div>
                    <div className="cart-product__material">
                      <span>Material</span>
                      <span>{product.material}</span>
                    </div>
                  </div>
                  <div className="cart-product__bottom-wrapper">
                    <div className="cart-product__change-container">
                      <div className="cart-product__change-button">
                        <button
                          onClick={() =>
                            updateProductQuantity(
                              product.code,
                              product.quantity - 1
                            )
                          }
                          className={
                            "change-decrement-button " +
                            `${
                              product.quantity <= 1
                                ? "change-decrement-button--disabled"
                                : "change-decrement-button--enabled"
                            }`
                          }
                        >
                          -
                        </button>
                      </div>
                      <div className="cart-product__change-number">
                        {product.quantity}
                      </div>
                      <div className="cart-product__change-button">
                        <button
                          onClick={() =>
                            updateProductQuantity(
                              product.code,
                              product.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cart-product__price">
                      <span>$ {product.price * product.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="cart__summary">
          <div className="summary__title">
            <h3>Resumen de compra</h3>
          </div>
          <div className="summary-horizontal-line"></div>
          <div className="summary__shopping-detail">
            <div className="summary__detail-text">
              <span>Subtotal: </span>
              <span>$ {subtotal}</span>
            </div>
            <div className="summary__detail-text detail-text--discount">
              <span>Descuento: </span>
              <span>{discount === 0 ? "0.00" : `$ ${discount}`}</span>
            </div>
            <div className="summary__detail-text detail-text--total">
              <span>Total: </span>
              <span>$ {total}</span>
            </div>
          </div>
          <div className="summary-horizontal-line"></div>
          <a className="summary-end-shopping" target="_blank">
            <CheckoutButton orderData={handleCartShop()} />
          </a>
        </div>
      </div>
    </div>
  );
};
