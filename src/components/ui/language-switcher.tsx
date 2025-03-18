import React from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

// English-only language switcher
const LanguageSwitcher = () => {
  const { setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1"
      onClick={() => setLanguage("en")}
    >
      <Globe className="h-4 w-4" />
      <span>English</span>
    </Button>
  );
};

export default LanguageSwitcher;
