// src/contexts/LanguageContext.jsx
import React, { createContext, useState, useContext } from "react";
import i18n from "i18next";

// Créer le contexte
const LanguageContext = createContext();

// Créer un fournisseur de contexte
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("fr"); // Langue par défaut

  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Créer un hook pour utiliser le contexte de la langue
export const useLanguage = () => useContext(LanguageContext);
