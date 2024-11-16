import { createContext, useContext, useState } from "react";

const PopupContext = createContext(null);

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState(false);

  return (
    <PopupContext.Provider value={{ popup, setPopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  return useContext(PopupContext);
};
