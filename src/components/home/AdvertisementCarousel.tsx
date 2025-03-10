import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Advertisement {
  id: string;
  imageUrl: string;
  redirectUrl: string;
  title: string;
  duration: number; // in seconds
}

interface AdvertisementCarouselProps {
  advertisements?: Advertisement[];
  autoPlay?: boolean;
  interval?: number; // in seconds
}

// Mock advertisements data with direct product links
const mockAdvertisements: Advertisement[] = [
  {
    id: "ad1",
    imageUrl:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80",
    redirectUrl: "/products/prod-007", // Direct link to headphones product
    title: "Premium Headphones - 25% Off",
    duration: 5,
  },
  {
    id: "ad2",
    imageUrl:
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1400&q=80",
    redirectUrl: "/products/prod-010", // Direct link to Smart TV product
    title: "New Ultra HD Smart TVs - Shop Now",
    duration: 5,
  },
  {
    id: "ad3",
    imageUrl:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1400&q=80",
    redirectUrl: "/products/prod-008", // Direct link to speaker product
    title: "Bluetooth Speakers - 30% Off",
    duration: 5,
  },
];

const AdvertisementCarousel = ({
  advertisements = mockAdvertisements,
  autoPlay = true,
  interval = 5, // 5 seconds default
}: AdvertisementCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [autoPlay, interval, advertisements.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + advertisements.length) % advertisements.length,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleRedirect = (url: string) => {
    // Ensure we're navigating to the exact product
    if (!url) {
      navigate("/");
      return;
    }

    try {
      // Check if this is a product URL
      if (url.includes("/products/") && !url.includes("category")) {
        const productId = url.split("/").pop();
        console.log(`Redirecting to specific product: ${productId}`);
      }

      // Direct navigation to the exact URL
      navigate(url);
      console.log(`Redirecting to: ${url}`);
    } catch (error) {
      console.error("Navigation error:", error);
      navigate("/");
    }
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-md">
      {/* Carousel Images */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {advertisements.map((ad) => (
          <div
            key={ad.id}
            className="min-w-full h-full relative cursor-pointer"
            onClick={() => handleRedirect(ad.redirectUrl)}
          >
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{ad.title}</h3>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          goToPrevious();
        }}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          goToNext();
        }}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {advertisements.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AdvertisementCarousel;
