import { useEffect, useState } from "react";
import "./styles/Profile.css";
import axios from "axios";
import { useBaseUrl } from "../../../../context/BaseUrlContext";
import { CiEdit } from "react-icons/ci";
import { useForm } from "../../../../hooks/useForm";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

export const Profile = () => {
  const [isSimpleUser, setIsSimpleUser] = useState(false);
  const { usersUrl } = useBaseUrl();

  const initialState = {
    name: "",
    email: "",
    password: "",
  };

  const { formState, onInputChange, setFormState } = useForm(initialState);
  const { name = "", email = "", password = "" } = formState;

  const [isInputClicked, setIsInputClicked] = useState(false);
  const handleGoogleUserInputClick = () => setIsInputClicked(true);

  const [googleUser, setGoogleUser] = useState({});

  useEffect(() => {
    axios
      .get(`${usersUrl}/profile`, { withCredentials: true })
      .then((response) => {
        setIsSimpleUser(!response.data.name);
        setGoogleUser(response.data);
        setFormState({
          name: response.data.name || "",
          email: response.data.email || "",
        });
      });
  }, [usersUrl, setFormState]);

  const navigate = useNavigate();

  const handleLogoutClick = () => {
    axios.post(usersUrl + "/logout", {}, { withCredentials: true });
    setTimeout(() => {
      window.location.reload();
      navigate("/");
    }, 1000);
  };

  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(usersUrl + "/update", formState, { withCredentials: true })
      .then((response) => {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        setShowAlert(true);
      });
  };

  return (
    <div className="profile">
      <div className="profile__wrapper">
        <div className="profile__img-container">
          <div
            className="profile__img"
            style={{ backgroundImage: `url("${googleUser.picture}")` }}
          ></div>
        </div>
        <form className="profile__info" onSubmit={handleSubmit}>
          <div className="profile__info-data">
            <input
              type="text"
              value={email}
              id="googleUser-input-email"
              onChange={onInputChange}
              name="email"
              disabled={true}
              style={{ pointerEvents: isInputClicked ? "auto" : "none" }}
            />
          </div>
          {isSimpleUser ? (
            <div className="profile__info-data">
              <input
                type="text"
                value={password}
                id="googleUser-input-name"
                name="password"
                placeholder="Nueva contraseña"
                onChange={onInputChange}
                style={{ pointerEvents: isInputClicked ? "auto" : "none" }}
              />
              <label htmlFor="googleUser-input-name">
                <CiEdit
                  fontSize="1.4rem"
                  cursor="pointer"
                  onClick={handleGoogleUserInputClick}
                />
              </label>
            </div>
          ) : (
            <div className="profile__info-data">
              <input
                type="text"
                value={name}
                id="googleUser-input-name"
                name="name"
                onChange={onInputChange}
                style={{ pointerEvents: isInputClicked ? "auto" : "none" }}
              />
              <label htmlFor="googleUser-input-name">
                <CiEdit
                  fontSize="1.4rem"
                  cursor="pointer"
                  onClick={handleGoogleUserInputClick}
                />
              </label>
            </div>
          )}
          <button type="submit" disabled={!isInputClicked}>
            Cambiar
          </button>
          <button
            type="button"
            className="profile__logout-button"
            onClick={handleLogoutClick}
          >
            Cerrar sesión
            <MdLogout fontSize={"1.3rem"} />
          </button>
        </form>
      </div>
      <div
        className={
          "secure-alert__product-added " +
          `${showAlert ? "product-added--appear" : "product-added--disappear"}`
        }
      >
        <div className="flex-center gap-4">
          Actualizado correctamente
          <FaCheck color="#0f0" />
        </div>
      </div>
    </div>
  );
};
