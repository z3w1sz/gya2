import "./styles/Register.css";
import { useIsRegister } from "../../../../context/IsRegisterContext";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { handleGoogleLogin } from "../../../../helpers/googleLogin";
import { useForm } from "../../../../hooks/useForm";
import axios from "axios";
import { useBaseUrl } from "../../../../context/BaseUrlContext";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

export const Register = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState("");

  const { usersUrl } = useBaseUrl();

  const initialState = {
    email: "",
    password: "",
  };

  const [isInputsCompleted, setIsInputsCompleted] = useState(false);
  const { formState, onInputChange, setFormState } = useForm(initialState);

  const { email, password } = formState;

  const { setIsRegisterActive } = useIsRegister();

  useEffect(() => {
    setIsRegisterActive(true);
  }, [setIsRegisterActive]);

  // Corregir useEffect para verificar los inputs
  useEffect(() => {
    if (email.length > 3 && password.length > 4) {
      setIsInputsCompleted(true);
    } else {
      setIsInputsCompleted(false);
    }
  }, [email, password]);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const sendFormState = (data) => {
    axios
      .post(`${usersUrl}/register`, data, { withCredentials: true })
      .then((response) => {
        setTimeout(() => {
          window.location.reload();
        }, 300);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 4000);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendFormState(formState);
    setFormState(initialState);
  };

  const [isPasswordChanging, setisPasswordChanging] = useState(false);

  useEffect(() => {
    setisPasswordChanging(!isPasswordChanging);
  }, [isPasswordVisible]);

  return (
    <div className="register">
      <div className="register__image"></div>
      <div className="register__container">
        <div className="register__wrapper">
          <h2>Crea tu cuenta</h2>
          <form className="register__form" onSubmit={handleSubmit}>
            <button
              className="register__google-button"
              type="button"
              onClick={handleGoogleLogin}
            >
              <FcGoogle fontSize="1.2rem" />
              <span>Continuar con Google</span>
            </button>
            <div className="register__divider">
              <div className="register__or-divider"></div>
              <p>OR</p>
              <div className="register__or-divider"></div>
            </div>
            <div className="register__input-container">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={onInputChange}
              />
            </div>
            <div className="register__input-container">
              <label htmlFor="password">Contraseña</label>
              <div className="register__password-wrapper">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={onInputChange}
                />
                <button type="button" onClick={togglePasswordVisibility}>
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={!isInputsCompleted}>
              Continuar
            </button>
          </form>
          <Link to="/login" className="register__button-login">
            Ya tienes una cuenta?
            <span>Ingresar</span>
          </Link>
        </div>
      </div>
      {error.detail !== "" ? (
        <div
          className={
            "secure-alert__product-added " +
            `${
              showAlert ? "product-added--appear" : "product-added--disappear"
            }`
          }
        >
          <div className="flex-center gap-4">
            {error.detail}
            <IoMdClose color="#f00" />
          </div>
        </div>
      ) : (
        <div
          className={
            "secure-alert__product-added " +
            `${
              showAlert ? "product-added--appear" : "product-added--disappear"
            }`
          }
        >
          <div className="flex-center gap-4">
            Enviado exitosamente
            <FaCheck color="#0f0" />
          </div>
        </div>
      )}
    </div>
  );
};
