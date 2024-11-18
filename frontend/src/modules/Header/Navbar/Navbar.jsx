import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles/Navbar.css";
import { useJwtAuth } from "../../../context/AuthJwtContext";
import { FiHelpCircle } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { AccountIcon } from "./components/AccountIcon";
import { CartIcon } from "./components/CartIcon";
import { useIsScrollActive } from "../../../context/IsScrollActive";
import axios from "axios";
import { useBaseUrl } from "../../../context/BaseUrlContext";

export const Navbar = ({ secure }) => {
  const { isValid } = useJwtAuth();
  const [menuActive, setMenuActive] = useState(false);

  const { setIsScrollActive } = useIsScrollActive();

  useEffect(() => {
    setIsScrollActive(!menuActive);
  }, [menuActive]);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const { productsUrl } = useBaseUrl();

  const getProductsNumber = () => {
    axios
      .get(productsUrl + "/cart/number/of/products", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
      });
  };

  useEffect(() => {
    getProductsNumber();
  }, []);

  return (
    <>
      <div className="navbar-wrapper">
        <nav className="navbar">
          <ul>
            <div className="navbar__logo-container">
              <li className="navbar__item item--logo">
                <Link className="navbar__link" to="/">
                  <img className="navbar__medium-logo" src="/logo.png" alt="" />
                </Link>
              </li>
            </div>

            {/* Ícono del menú para pantallas pequeñas */}
            <div className="navbar__menu-icon" onClick={toggleMenu}>
              &#9776; {/* Ícono de hamburguesa */}
            </div>

            {/* Menú de navegación en pantallas pequeñas */}
            <div className={`navbar__menu ${menuActive ? "active" : ""}`}>
              {secure && (
                <Link
                  className="navbar__item"
                  to="/secure"
                  onClick={toggleMenu}
                >
                  Añadir productos
                </Link>
              )}
              <Link className="navbar__item" to="/store" onClick={toggleMenu}>
                Tienda
              </Link>
              <Link
                className="navbar__item"
                to="/categories"
                onClick={toggleMenu}
              >
                Categorías
              </Link>
              <Link className="navbar__item" to="/contact" onClick={toggleMenu}>
                Contacto
              </Link>
              <Link className="navbar__item" to="/account" onClick={toggleMenu}>
                <AccountIcon />
              </Link>
              <Link className="navbar__item" to="/search" onClick={toggleMenu}>
                <FiSearch title="Search" fontSize="1.6rem" />
              </Link>
              <Link className="navbar__item" to="/help" onClick={toggleMenu}>
                <FiHelpCircle title="Help" fontSize="1.6rem" />
              </Link>
              <Link className="navbar__item" to="/cart" onClick={toggleMenu}>
                <CartIcon numberOfProducts="+9" />
              </Link>
            </div>

            {/* Menú en pantallas grandes */}
            <div className="navbar__routes-container">
              {secure && (
                <Link className="navbar__item" to="/secure">
                  <span className="navbar__link">Añadir productos</span>
                </Link>
              )}
              <Link className="navbar__item" to="/store">
                <span className="navbar__link">Tienda</span>
              </Link>
              <Link className="navbar__item" to="/categories">
                <span className="navbar__link">Categorías</span>
              </Link>
              <Link className="navbar__item" to="/contact">
                <span className="navbar__link">Contacto</span>
              </Link>
              <Link className="navbar__item" to="/account">
                <span className="navbar__link item--icon">
                  <AccountIcon />
                </span>
              </Link>
              <li className="navbar__item">
                <Link className="navbar__link item--icon" to="/search">
                  <FiSearch title="Search" fontSize="1.6rem" />
                </Link>
              </li>
              <li className="navbar__item">
                <Link className="navbar__link item--icon" to="/help">
                  <FiHelpCircle title="Help" fontSize="1.6rem" />
                </Link>
              </li>
              <li className="navbar__item">
                {isValid ? (
                  <Link
                    className="navbar__link item--icon link--cart"
                    to="/cart"
                  >
                    <CartIcon numberOfProducts="+9" />
                  </Link>
                ) : (
                  <Link
                    to="/account"
                    className="navbar__link item--icon link--cart"
                  >
                    <CartIcon numberOfProducts="" />
                  </Link>
                )}
              </li>
            </div>
          </ul>
        </nav>
      </div>
    </>
  );
};
