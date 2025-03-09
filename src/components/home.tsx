import React, { useState } from "react";
import Header from "./layout/Header";
import HeroSection from "./home/HeroSection";
import FeaturedProducts from "./products/FeaturedProducts";
import CategorySection from "./categories/CategorySection";
import Footer from "./layout/Footer";
import { useAuth } from "@/lib/auth.tsx";

interface HomePageProps {
  featuredProducts?: Array<{
    id: string;
    image: string;
    title: string;
    price: number;
    rating: number;
    discount?: number;
    isNew?: boolean;
  }>;
  categories?: Array<{
    id: string;
    name: string;
    image: string;
    productCount?: number;
  }>;
}

const HomePage = ({
  featuredProducts = [
    {
      id: "prod-001",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
      title: "Premium Wireless Headphones",
      price: 129.99,
      rating: 4.5,
      discount: 15,
      isNew: true,
    },
    {
      id: "prod-002",
      image:
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80",
      title: "Smart Watch Series 5",
      price: 249.99,
      rating: 4.7,
    },
    {
      id: "prod-003",
      image:
        "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80",
      title: "Portable Bluetooth Speaker",
      price: 79.99,
      rating: 4.3,
      discount: 10,
    },
    {
      id: "prod-004",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
      title: "Noise Cancelling Earbuds",
      price: 89.99,
      rating: 4.2,
      isNew: true,
    },
    {
      id: "prod-005",
      image:
        "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&q=80",
      title: "Smartphone Stabilizer Gimbal",
      price: 119.99,
      rating: 4.1,
    },
  ],
  categories = [
    {
      id: "cat-1",
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&q=80",
      productCount: 120,
    },
    {
      id: "cat-2",
      name: "Fashion",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=80",
      productCount: 85,
    },
    {
      id: "cat-3",
      name: "Home & Kitchen",
      image:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300&q=80",
      productCount: 67,
    },
    {
      id: "cat-4",
      name: "Beauty",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80",
      productCount: 43,
    },
    {
      id: "cat-5",
      name: "Sports",
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300&q=80",
      productCount: 56,
    },
    {
      id: "cat-6",
      name: "Books",
      image:
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&q=80",
      productCount: 92,
    },
    {
      id: "cat-7",
      name: "Toys & Games",
      image:
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&q=80",
      productCount: 38,
    },
  ],
}: HomePageProps) => {
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
        {/* Hero Section */}
        <HeroSection
          title="Discover Premium Products for Every Need"
          subtitle="Shop our exclusive collection of high-quality products with fast shipping and exceptional customer service."
          ctaText="Shop Now"
          secondaryCtaText="Learn More"
          backgroundImage="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80"
          badge="New Collection"
          onCtaClick={handleCtaClick}
        />

        {/* Featured Products Section */}
        <FeaturedProducts
          title="Featured Products"
          subtitle="Discover our most popular items handpicked for you"
          products={featuredProducts}
          onAddToCart={handleAddToCart}
        />

        {/* Categories Section */}
        <CategorySection
          title="Shop by Category"
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />

        {/* Additional Featured Products Section with different title */}
        <FeaturedProducts
          title="New Arrivals"
          subtitle="Check out our latest products just added to the store"
          products={featuredProducts.filter((product) => product.isNew)}
          onAddToCart={handleAddToCart}
        />

        {/* Special Offers Section */}
        <FeaturedProducts
          title="Special Offers"
          subtitle="Limited time deals and discounts you don't want to miss"
          products={featuredProducts.filter((product) => product.discount)}
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
