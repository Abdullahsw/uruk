import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/languageContext";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  backgroundImage?: string;
  badge?: string;
  onCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
}

const HeroSection = ({
  title = "Discover Premium Products for Every Need",
  subtitle = "Shop our exclusive collection of high-quality products with fast shipping and exceptional customer service.",
  ctaText = "shopNow",
  secondaryCtaText = "learnMore",
  backgroundImage = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80",
  badge = "newCollection",
  onCtaClick = () => console.log("Primary CTA clicked"),
  onSecondaryCtaClick = () => console.log("Secondary CTA clicked"),
}: HeroSectionProps) => {
  const { t } = useLanguage();
  return (
    <div className="relative w-full h-[500px] bg-gray-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl">
          {/* Badge */}
          {badge && (
            <Badge className="mb-4 bg-primary/90 hover:bg-primary text-white px-3 py-1">
              {t(badge)}
            </Badge>
          )}

          {/* Hero Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>

          {/* Hero Subtitle */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={onCtaClick}
              className="bg-primary hover:bg-primary/90 text-white font-medium"
            >
              {t(ctaText)}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onSecondaryCtaClick}
              className="bg-transparent border-white text-white hover:bg-white/20"
            >
              {t(secondaryCtaText)}
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-primary/30 to-transparent blur-2xl opacity-50" />
    </div>
  );
};

export default HeroSection;
