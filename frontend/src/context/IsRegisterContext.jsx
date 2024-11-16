import { createContext, useContext, useState } from "react";

const IsRegisterContext = createContext(null);

export const IsRegisterProvider = ({ children }) => {
  const [isRegisterActive, setIsRegisterActive] = useState(false);

  return (
    <IsRegisterContext.Provider
      value={{ isRegisterActive, setIsRegisterActive }}
    >
      {children}
    </IsRegisterContext.Provider>
  );
};

export const useIsRegister = () => {
  return useContext(IsRegisterContext);
};
