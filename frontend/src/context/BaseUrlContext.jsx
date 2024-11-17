import { createContext, useContext } from "react";

const BaseUrlContext = createContext(null);

export const BaseUrlProvider = ({ children }) => {
  const baseUrl = "https://gya2-agq9-z3w1szs-projects.vercel.app";
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
