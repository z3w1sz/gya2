import "./styles/Account.css";
import { Register } from "./components/Register";
import { Profile } from "./components/Profile";
import { useJwtAuth } from "../../../context/AuthJwtContext";
import { useEffect } from "react";
import { useIsRegister } from "../../../context/IsRegisterContext";

export const Account = () => {
  const { isValid } = useJwtAuth();
  const { setIsRegisterActive } = useIsRegister();
  useEffect(() => {
    if (isValid === true) {
      setIsRegisterActive(false);
    }
  }, [isValid]);
  return (
    <div className="account__main-container">
      {isValid === false && <Register />}
      {isValid === true && <Profile />}
    </div>
  );
};
