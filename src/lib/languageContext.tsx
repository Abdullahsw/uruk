import React, { createContext, useContext, useState } from "react";

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  dir: string;
};

const translations = {
  en: {
    addToCart: "Add to Cart",
    viewDetails: "View Details",
    checkout: "Checkout",
    login: "Login",
    register: "Register",
    search: "Search",
    // Add more translations as needed
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  dir: "ltr",
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<string>("en");

  const t = (key: string): string => {
    return (
      translations[language as keyof typeof translations]?.[
        key as keyof typeof translations.en
      ] || key
    );
  };

  // Set direction based on language
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}
