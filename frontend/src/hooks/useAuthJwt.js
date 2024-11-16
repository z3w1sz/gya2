import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export const useAuthJwt = () => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { accessToken, login, logout } = useAuth();
  const verifyAccessTokenUrl =
    "http://localhost:8000/users/verify/access_token";
  const verifyRefreshTokenUrl = "http://localhost:8000/users/refresh";

  const verifyAccessToken = async () => {
    try {
      const response = await axios.post(verifyAccessTokenUrl, {
        access_token: accessToken,
        token_type: "Bearer",
      });
      if (response.data?.state === "sucessful") {
        setIsValid(true);
        setIsLoading(false);
      } else {
        setIsValid(false);
        setIsLoading(false);
      }
    } catch (error) {}
  };

  const createAccessTokenWithRefreshToken = async () => {
    try {
      const response = await axios.post(
        verifyRefreshTokenUrl,
        {},
        { withCredentials: true }
      );
      const { access_token } = response.data;
      login(access_token);
      setIsLoading(false);
    } catch (e) {
      setIsValid(false);
      logout();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken !== "") {
      verifyAccessToken();
    }

    if (accessToken === "") {
      createAccessTokenWithRefreshToken();
    }
  }, [accessToken, isValid]);

  return { isValid, isLoading };
};
