import { createContext, useContext, useState } from "react";

const IsScrollActiveContext = createContext(null);

export const IsScrollActiveProvider = ({ children }) => {
  const [isScrollActive, setIsScrollActive] = useState(false);

  return (
    <IsScrollActiveContext.Provider
      value={{ isScrollActive, setIsScrollActive }}
    >
      {children}
    </IsScrollActiveContext.Provider>
  );
};

export const useIsScrollActive = () => {
  return useContext(IsScrollActiveContext);
};
