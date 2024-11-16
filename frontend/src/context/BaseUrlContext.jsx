import { createContext, useContext } from "react";

const BaseUrlContext = createContext(null);

export const BaseUrlProvider = ({ children }) => {
  const baseUrl = "http://localhost:8000";
  const productsUrl = baseUrl + "/products";
  const usersUrl = baseUrl + "/users";

  return (
    <BaseUrlContext.Provider value={{ productsUrl, usersUrl }}>
      {children}
    </BaseUrlContext.Provider>
  );
};

export const useBaseUrl = () => {
  return useContext(BaseUrlContext);
};
