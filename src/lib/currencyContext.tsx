import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCurrencyRates, updateCurrencyRates } from "./api";

type Currency = "IQD" | "USD" | "SAR";

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  exchangeRates: {
    usdToIqd: number;
    sarToIqd: number;
    usdToSar: number;
  };
  setExchangeRates: (rates: {
    usdToIqd: number;
    sarToIqd: number;
    usdToSar: number;
  }) => Promise<{ success: boolean; error?: string }>;
  convertPrice: (
    price: number,
    fromCurrency: Currency,
    toCurrency: Currency,
  ) => number;
  lastUpdated: Date | null;
};

const defaultExchangeRates = {
  usdToIqd: 1460, // 1 USD = 1460 IQD
  sarToIqd: 389.33, // 1 SAR = 389.33 IQD
  usdToSar: 3.75, // 1 USD = 3.75 SAR
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
  formatPrice: () => "",
  exchangeRates: defaultExchangeRates,
  setExchangeRates: async () => ({ success: false }),
  convertPrice: () => 0,
  lastUpdated: null,
});

export const useCurrency = () => useContext(CurrencyContext);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [exchangeRates, setExchangeRatesState] = useState(defaultExchangeRates);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load exchange rates from database on mount
  useEffect(() => {
    const loadRates = async () => {
      try {
        setIsLoading(true);
        const rates = await fetchCurrencyRates();
        setExchangeRatesState({
          usdToIqd: rates.usdToIqd,
          sarToIqd: rates.sarToIqd,
          usdToSar: rates.usdToSar,
        });
        setLastUpdated(new Date(rates.updatedAt));
      } catch (error) {
        console.error("Failed to fetch exchange rates", error);
        // Fallback to localStorage
        const savedRates = localStorage.getItem("exchangeRates");
        if (savedRates) {
          try {
            setExchangeRatesState(JSON.parse(savedRates));
          } catch (e) {
            console.error("Failed to parse saved exchange rates", e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadRates();
  }, []);

  // Save exchange rates to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("exchangeRates", JSON.stringify(exchangeRates));
    }
  }, [exchangeRates, isLoading]);

  const setExchangeRates = async (rates: {
    usdToIqd: number;
    sarToIqd: number;
    usdToSar: number;
  }) => {
    try {
      // Update in database
      const result = await updateCurrencyRates(rates);

      if (result.success) {
        // Update local state
        setExchangeRatesState(rates);
        setLastUpdated(new Date());
        return { success: true };
      }

      return { success: false, error: result.error };
    } catch (error) {
      console.error("Failed to update exchange rates", error);
      // Still update local state even if database update fails
      setExchangeRatesState(rates);
      setLastUpdated(new Date());
      return { success: false, error: error.message };
    }
  };

  const convertPrice = (
    price: number,
    fromCurrency: Currency,
    toCurrency: Currency,
  ): number => {
    if (fromCurrency === toCurrency) return price;

    // Convert to IQD first (as base currency)
    let priceInIQD: number;
    switch (fromCurrency) {
      case "USD":
        priceInIQD = price * exchangeRates.usdToIqd;
        break;
      case "SAR":
        priceInIQD = price * exchangeRates.sarToIqd;
        break;
      case "IQD":
      default:
        priceInIQD = price;
        break;
    }

    // Convert from IQD to target currency
    switch (toCurrency) {
      case "USD":
        return priceInIQD / exchangeRates.usdToIqd;
      case "SAR":
        return priceInIQD / exchangeRates.sarToIqd;
      case "IQD":
      default:
        return priceInIQD;
    }
  };

  const formatPrice = (price: number): string => {
    // Handle undefined or null price
    if (price === undefined || price === null) {
      return currency === "USD"
        ? "0.00"
        : currency === "SAR"
          ? "0.00 SAR"
          : "0 IQD";
    }

    // Convert price to current currency
    const convertedPrice = convertPrice(price, "USD", currency);

    // Format based on currency
    switch (currency) {
      case "IQD":
        return `${convertedPrice.toLocaleString()} IQD`;
      case "USD":
        return `${convertedPrice.toFixed(2)}`;
      case "SAR":
        return `${convertedPrice.toFixed(2)} SAR`;
      default:
        return `${convertedPrice.toLocaleString()}`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        exchangeRates,
        setExchangeRates,
        convertPrice,
        lastUpdated,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}
