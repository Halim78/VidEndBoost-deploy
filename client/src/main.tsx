import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import React from "react";
import "../i18n.js";
import {
  LanguageProvider,
  // useLanguage,
} from "../src/contexts/LanguageContext.jsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
