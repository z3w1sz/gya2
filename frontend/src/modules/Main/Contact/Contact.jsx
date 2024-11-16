import "./styles/Contact.css";
import { FaCheck, FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { TiPhone } from "react-icons/ti";
import { IoMdMail } from "react-icons/io";
import { useForm } from "../../../hooks/useForm";
import { useState } from "react";

export const Contact = () => {
  const [showAlert, setShowAlert] = useState(false);
  const initialState = {
    name: "",
    email: "",
    message: "",
  };
  const { formState, setFormState, onInputChange } = useForm(initialState);
  const { name, email, message } = formState;
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    setShowAlert(true);
    setFormState(initialState);
  };
  return (
    <div className="contact">
      <div className="contact__title">
        <h2>Contactanos</h2>
      </div>
      <div className="contact__container">
        <div className="contact__send-message">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre completo"
              name="name"
              value={name}
              onChange={onInputChange}
            />
            <input
              type="text"
              placeholder="E-mail"
              name="email"
              value={email}
              onChange={onInputChange}
            />
            <textarea
              type="text"
              placeholder="Mensaje"
              name="message"
              value={message}
              onChange={onInputChange}
            />
            <button type="submit">Contactanos</button>
          </form>
        </div>
        <div className="contact__divider"></div>
        <div className="contact__info-container">
          <div className="contact__info">
            <div className="contact-info__contact">
              <h3>Contacto</h3>
            </div>
            <div className="contact-info__wrapper">
              <div className="contact-info__place">
                <MdPlace color="#d4af37" fontSize="1.3rem" />
                <span>Paraná, Entre Ríos</span>
              </div>
              <div className="contact-info__whatsapp">
                <TiPhone color="#d4af37" fontSize="1.3rem" />
                <span>343 438-5864</span>
              </div>
              <div className="contact-info__mail">
                <IoMdMail color="#d4af37" fontSize="1.3rem" />
                <span>gyaaccesorios.shop@gmail.com</span>
              </div>
            </div>
            <div className="contact__social-media-container">
              <FaFacebook
                className="social-icon facebook-icon"
                fontSize="1.4rem"
              />

              <FaInstagram
                className="social-icon instagram-icon"
                fontSize="1.4rem"
              />
              <FaWhatsapp
                className="social-icon whatsapp-icon"
                fontSize="1.4rem"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          "secure-alert__product-added " +
          `${showAlert ? "product-added--appear" : "product-added--disappear"}`
        }
      >
        <div className="flex-center gap-4">
          Enviado exitosamente
          <FaCheck color="#0f0" />
        </div>
      </div>
    </div>
  );
};
