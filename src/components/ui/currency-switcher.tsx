import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/lib/currencyContext";
import { useLanguage } from "@/lib/languageContext";

const currencies = [
  { code: "IQD", nameKey: "iraqiDinar" },
  { code: "USD", nameKey: "usDollar" },
  { code: "SAR", nameKey: "saudiRiyal" },
];

const currencyNames = {
  iraqiDinar: {
    ar: "دينار عراقي (IQD)",
    en: "Iraqi Dinar (IQD)",
    ku: "دیناری عێراقی (IQD)",
  },
  usDollar: {
    ar: "دولار أمريكي (USD)",
    en: "US Dollar (USD)",
    ku: "دۆلاری ئەمریکی (USD)",
  },
  saudiRiyal: {
    ar: "ريال سعودي (SAR)",
    en: "Saudi Riyal (SAR)",
    ku: "ڕیاڵی سعودی (SAR)",
  },
};

const CurrencySwitcher = () => {
  const { currency, setCurrency } = useCurrency();
  const { language } = useLanguage();

  const currentCurr =
    currencies.find((curr) => curr.code === currency) || currencies[1]; // Default to USD (index 1)

  const getCurrencyName = (nameKey: string) => {
    return currencyNames[nameKey][language];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          {currentCurr.code}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr.code as any)}
            className={curr.code === currency ? "bg-accent" : ""}
          >
            {getCurrencyName(curr.nameKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySwitcher;
