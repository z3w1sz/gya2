import "./styles/Login.css";
import { useIsRegister } from "../../../../context/IsRegisterContext";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import { handleGoogleLogin } from "../../../../helpers/googleLogin";
import { IoMdClose } from "react-icons/io";
import { useForm } from "../../../../hooks/useForm";
import axios from "axios";
import { useBaseUrl } from "../../../../context/BaseUrlContext";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
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

  const navigate = useNavigate();

  const sendFormState = (data) => {
    axios
      .post(`${usersUrl}/login`, data, { withCredentials: true })
      .then((response) => {
        setTimeout(() => {
          navigate("/account");
          window.location.reload();
        }, 1000);
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
    <div className="account__main-container">
      <div className="login">
        <div className="login__image"></div>
        <div className="login__container">
          <div className="login__wrapper">
            <h2>Ingresá a tu cuenta</h2>
            <form className="login__form" onSubmit={handleSubmit}>
              <button
                className="login__google-button"
                type="button"
                onClick={handleGoogleLogin}
              >
                <FcGoogle fontSize="1.2rem" />
                <span>Continuar con Google</span>
              </button>
              <div className="login__divider">
                <div className="login__or-divider"></div>
                <p>OR</p>
                <div className="login__or-divider"></div>
              </div>
              <div className="login__input-container">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={onInputChange}
                />
              </div>
              <div className="login__input-container">
                <label htmlFor="password">Contraseña</label>
                <div className="login__password-wrapper">
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
            <Link to="/account" className="login__button-login">
              No tienes una cuenta?
              <span>Registrarse</span>
            </Link>
          </div>
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
