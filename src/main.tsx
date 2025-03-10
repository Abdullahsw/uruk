import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { seedAdminUser } from "./lib/seed-admin";
import { LanguageProvider } from "./lib/languageContext";
import { CurrencyProvider } from "./lib/currencyContext";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Create admin user if it doesn't exist
seedAdminUser();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <LanguageProvider>
        <CurrencyProvider>
          <App />
        </CurrencyProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
