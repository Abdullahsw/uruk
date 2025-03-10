import React, { useState } from "react";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import HeroSection from "./home/HeroSection";
import AdvertisementCarousel from "./home/AdvertisementCarousel";
import ProductSection from "./home/ProductSection";
import { useAuth } from "@/lib/auth.tsx";

// Mock bestseller products
const bestsellerProducts = [
  {
    id: "prod-001",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    title: "Premium Wireless Headphones",
    price: 129.99,
    rating: 4.5,
    discount: 15,
    isNew: false,
  },
  {
    id: "prod-002",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80",
    title: "Smart Watch Series 5",
    price: 249.99,
    rating: 4.7,
    discount: 0,
    isNew: true,
  },
  {
    id: "prod-003",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    title: "Portable Bluetooth Speaker",
    price: 79.99,
    rating: 4.3,
    discount: 10,
    isNew: false,
  },
  {
    id: "prod-004",
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80",
    title: "Noise Cancelling Earbuds",
    price: 89.99,
    rating: 4.2,
    discount: 0,
    isNew: false,
  },
  {
    id: "prod-005",
    image:
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&q=80",
    title: "Smartphone Stabilizer Gimbal",
    price: 119.99,
    rating: 4.1,
    discount: 5,
    isNew: false,
  },
];

// Mock special offers products
const offerProducts = [
  {
    id: "prod-006",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80",
    title: "Smart Watch Series 5",
    price: 249.99,
    rating: 4.7,
    discount: 20,
    isNew: false,
  },
  {
    id: "prod-007",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    title: "Premium Wireless Headphones",
    price: 129.99,
    rating: 4.5,
    discount: 25,
    isNew: false,
  },
  {
    id: "prod-008",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    title: "Portable Bluetooth Speaker",
    price: 79.99,
    rating: 4.3,
    discount: 30,
    isNew: false,
  },
  {
    id: "prod-009",
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80",
    title: "Noise Cancelling Earbuds",
    price: 89.99,
    rating: 4.2,
    discount: 15,
    isNew: false,
  },
];

// Mock new arrivals products
const newArrivalsProducts = [
  {
    id: "prod-010",
    image:
      "https://images.unsplash.com/photo-1600003263720-95b45a4035d5?w=400&q=80",
    title: 'Ultra HD Smart TV 55"',
    price: 699.99,
    rating: 4.8,
    discount: 0,
    isNew: true,
  },
  {
    id: "prod-011",
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80",
    title: "Wireless Gaming Mouse",
    price: 59.99,
    rating: 4.6,
    discount: 0,
    isNew: true,
  },
  {
    id: "prod-012",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80",
    title: 'Ultrabook Pro 13"',
    price: 1299.99,
    rating: 4.9,
    discount: 0,
    isNew: true,
  },
  {
    id: "prod-013",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
    title: "Smartphone X Pro",
    price: 899.99,
    rating: 4.7,
    discount: 0,
    isNew: true,
  },
];

const HomePage = () => {
  const { user } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(3);

  // Handlers for various user interactions
  const handleSearch = (query: string) => {
    console.log(`Searching for: ${query}`);
  };

  const handleCartClick = () => {
    console.log("Cart clicked");
  };

  const handleAddToCart = (productId: string) => {
    console.log(`Added product ${productId} to cart`);
    setCartItemCount((prev) => prev + 1);
  };

  const handleCategoryClick = (categoryId: string) => {
    console.log(`Navigating to category: ${categoryId}`);
  };

  const handleCtaClick = () => {
    console.log("Primary CTA clicked");
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header
        cartItemCount={cartItemCount}
        onSearch={handleSearch}
        onCartClick={handleCartClick}
        onProfileClick={handleProfileClick}
      />

      <main className="flex-grow">
        {/* No Hero Section - Removed as requested */}

        <div className="container mx-auto px-4 py-8">
          {/* Advertisement Carousel - Now more prominent at the top */}
          <div className="mb-12 mt-4">
            <h1 className="text-3xl font-bold mb-2">Welcome to ShopHub</h1>
            <p className="text-gray-600 mb-6">
              Discover premium products with fast shipping and exceptional
              service
            </p>
            <AdvertisementCarousel />
          </div>

          {/* Special Offers Section - Now first for prominence */}
          <ProductSection
            title="Special Offers"
            products={offerProducts}
            viewAllLink="/products/category/offers"
            layout="vertical"
          />

          {/* Bestsellers Section */}
          <ProductSection
            title="Bestsellers"
            products={bestsellerProducts}
            viewAllLink="/products/category/bestsellers"
            layout="vertical"
          />

          {/* New Arrivals Section */}
          <ProductSection
            title="New Arrivals"
            products={newArrivalsProducts}
            viewAllLink="/products/category/new-arrivals"
            layout="vertical"
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
