import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import React from "react";
import "../i18n.js";
import {
  LanguageProvider,
  // useLanguage,
} from "../src/contexts/LanguageContext.jsx";
import NotFound from "./NotFound.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  window.location.pathname !== "/" ? (
    <NotFound />
  ) : (
    <React.StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </React.StrictMode>
  )
);
