import { createContext, useContext, useState } from "react";

// Crear contexto de autenticación
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");

  const login = (token) => {
    setAccessToken(token); // Almacenar el token en la memoria (state)
  };

  const logout = () => {
    setAccessToken(""); // Eliminar el token de la memoria
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
