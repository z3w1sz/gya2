import { createContext, useContext, useState } from "react";

const IsPageStoreChangingContext = createContext(null);

export const IsPageStoreChangingProvider = ({ children }) => {
  const [isPageStoreChanging, setIsPageStoreChanging] = useState(false);

  return (
    <IsPageStoreChangingContext.Provider
      value={{ isPageStoreChanging, setIsPageStoreChanging }}
    >
      {children}
    </IsPageStoreChangingContext.Provider>
  );
};

export const useIsPageStoreChanging = () => {
  return useContext(IsPageStoreChangingContext);
};
