import React, { createContext, useContext, useState, useEffect } from "react";

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
  }) => void;
  convertPrice: (
    price: number,
    fromCurrency: Currency,
    toCurrency: Currency,
  ) => number;
};

const defaultExchangeRates = {
  usdToIqd: 1460, // 1 USD = 1460 IQD
  sarToIqd: 389.33, // 1 SAR = 389.33 IQD
  usdToSar: 3.75, // 1 USD = 3.75 SAR
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "IQD",
  setCurrency: () => {},
  formatPrice: () => "",
  exchangeRates: defaultExchangeRates,
  setExchangeRates: () => {},
  convertPrice: () => 0,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<Currency>("IQD");
  const [exchangeRates, setExchangeRates] = useState(defaultExchangeRates);

  // Load exchange rates from localStorage on mount
  useEffect(() => {
    const savedRates = localStorage.getItem("exchangeRates");
    if (savedRates) {
      try {
        setExchangeRates(JSON.parse(savedRates));
      } catch (e) {
        console.error("Failed to parse saved exchange rates", e);
      }
    }
  }, []);

  // Save exchange rates to localStorage when they change
  useEffect(() => {
    localStorage.setItem("exchangeRates", JSON.stringify(exchangeRates));
  }, [exchangeRates]);

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
    // Convert price to current currency
    const convertedPrice = convertPrice(price, "USD", currency);

    // Format based on currency
    switch (currency) {
      case "IQD":
        return `${convertedPrice.toLocaleString()} IQD`;
      case "USD":
        return `$${convertedPrice.toFixed(2)}`;
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
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
