import axios from "axios";
import { useBaseUrl } from "../context/BaseUrlContext";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useIsSecure = () => {
  const { usersUrl } = useBaseUrl();
  const [isSecure, setIsSecure] = useState(false);
  const verifyIfIsSecure = () => {
    axios
      .post(usersUrl + "/secure", {}, { withCredentials: true })
      .then((response) =>
        response.data?.state == "success"
          ? setIsSecure(true)
          : setIsSecure(false)
      );
  };
  const location = useLocation();
  useEffect(() => {
    verifyIfIsSecure();
  }, [location.pathname]);
  return {
    secure: isSecure,
  };
};
