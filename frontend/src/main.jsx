import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./fonts.css";
import { AuthProvider } from "./context/AuthContext";
import { AuthJwtProvider } from "./context/AuthJwtContext.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { PopupProvider } from "./context/PopupContext.jsx";
import { BaseUrlProvider } from "./context/BaseUrlContext.jsx";
import { IsRegisterProvider } from "./context/IsRegisterContext.jsx";
import { IsScrollActiveProvider } from "./context/IsScrollActive.jsx";
import { IsPageStoreChangingProvider } from "./context/IsPageStoreChangingContext.jsx";

createRoot(document.getElementById("root")).render(
  /* <StrictMode> */
  <BaseUrlProvider>
    <AuthProvider>
      <AuthJwtProvider>
        <PopupProvider>
          <IsRegisterProvider>
            <IsScrollActiveProvider>
              <IsPageStoreChangingProvider>
                <Router>
                  <App />
                </Router>
              </IsPageStoreChangingProvider>
            </IsScrollActiveProvider>
          </IsRegisterProvider>
        </PopupProvider>
      </AuthJwtProvider>
    </AuthProvider>
  </BaseUrlProvider>
  /* </StrictMode> */
);
