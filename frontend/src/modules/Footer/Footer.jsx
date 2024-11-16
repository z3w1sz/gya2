import "./styles/Footer.css";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>G&A Accesorios</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Acerca de nosotros</Link>
              </li>
              <li>
                <Link to="/">Politicas de privacidad</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Ayuda</h3>
            <ul className="footer-links">
              <li>
                <Link to="/help">Preguntas frequentes</Link>
              </li>
              <li>
                <Link to="/contact">Contacto</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Tienda</h3>
            <ul className="footer-links">
              <li>
                <Link to="/store">Productos</Link>
              </li>
              <li>
                <Link to="/search">Buscar productos</Link>
              </li>
              <li>
                <Link to="/cart">Carrito de compras</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Síguenos</h3>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/gyaaccesorios"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaFacebook fontSize="1.3rem" />
              </a>
              <a
                href="https://www.instagram.com/gyaaccesorios"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaInstagram fontSize="1.3rem" />
              </a>
              <a
                href="https://wa.me/3434385864"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaWhatsapp fontSize="1.3rem" />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} G&A Accesorios. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
