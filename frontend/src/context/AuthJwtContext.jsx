import { createContext, useContext } from "react";
import { useAuthJwt } from "../hooks/useAuthJwt";

// Crear contexto de autenticación
const AuthJwtContext = createContext(null);

export const AuthJwtProvider = ({ children }) => {
  const { isValid, isLoading } = useAuthJwt();

  return (
    <AuthJwtContext.Provider value={{ isValid, isLoading }}>
      {children}
    </AuthJwtContext.Provider>
  );
};

export const useJwtAuth = () => {
  return useContext(AuthJwtContext);
};
