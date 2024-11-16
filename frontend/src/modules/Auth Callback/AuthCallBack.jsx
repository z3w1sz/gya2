import { useEffect } from "react";
import axios from "axios";
import "./styles/AuthCallBack.css";
import { VscLoading } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

export const AuthCallBack = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // Enviar el código en el formato esperado
    axios
      .post(
        "http://localhost:8000/users/auth/callback",
        { code: code },
        { withCredentials: true }
      )
      .then((response) => {
        // Manejar la respuesta aquí si es necesario
        navigate("/store");
      })
      .catch((error) => {
        navigate("/");
      });
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  }, []);

  return (
    <div className="auth-loading__container">
      <VscLoading className="auth-loading__icon" fontSize="3rem" />
    </div>
  );
};
