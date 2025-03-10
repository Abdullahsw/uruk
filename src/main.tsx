import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { seedAdminUser } from "./lib/seed-admin";
import { LanguageProvider } from "./lib/languageContext";
import { CurrencyProvider } from "./lib/currencyContext";
import {
  checkSupabaseConnection,
  checkSupabaseEnvVars,
} from "./lib/supabaseHelpers";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Check Supabase environment variables
const envVarsConfigured = checkSupabaseEnvVars();
if (!envVarsConfigured) {
  console.warn(
    "Supabase environment variables are not properly configured. Some features may not work correctly.",
  );
}

// Check Supabase connection and create admin user if it doesn't exist
checkSupabaseConnection().then((isConnected) => {
  if (isConnected) {
    seedAdminUser().catch((error) => {
      console.error("Error seeding admin user:", error);
    });
  }
});

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
