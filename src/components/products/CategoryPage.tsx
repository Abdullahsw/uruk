import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/languageContext";

// Mock products data - in a real app, this would come from an API
const allProducts = {
  bestsellers: [
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
    // More bestseller products...
  ],
  offers: [
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
    // More offer products...
  ],
  "new-arrivals": [
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
    // More new arrival products...
  ],
};

const categoryTitles = {
  bestsellers: "Bestselling Products",
  offers: "Special Offers",
  "new-arrivals": "New Arrivals",
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // Simplified product loading to prevent white screen issues
    try {
      // Set products immediately without loading state
      if (categoryId && Object.keys(allProducts).includes(categoryId)) {
        const categoryProducts =
          allProducts[categoryId as keyof typeof allProducts];
        setProducts(categoryProducts || []);
      } else {
        // If category not found or no categoryId, show all products
        const allProductsArray = Object.values(allProducts).flat();
        setProducts(allProductsArray);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      // Ensure we always have some products to display
      const allProductsArray = Object.values(allProducts).flat();
      setProducts(allProductsArray);
    }

    // Always set loading to false immediately
    setLoading(false);
  }, [categoryId]);

  const handleAddToCart = (productId: string) => {
    console.log(`Added product ${productId} to cart`);
    setCartItemCount((prev) => prev + 1);
  };

  const getCategoryTitle = () => {
    if (!categoryId) return "All Products";
    return (
      categoryTitles[categoryId as keyof typeof categoryTitles] || "Products"
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        cartItemCount={cartItemCount}
        onSearch={(query) => console.log(`Searching for: ${query}`)}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <button onClick={() => navigate("/")} className="hover:text-primary">
            Home
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{getCategoryTitle()}</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">{getCategoryTitle()}</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-4">No products found</h2>
                <p className="text-gray-500 mb-6">
                  We couldn't find any products in this category.
                </p>
                <Button onClick={() => navigate("/")}>Back to Home</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {products.map((product) => (
                  <div key={product.id} className="w-full mb-6">
                    <ProductCard
                      id={product.id}
                      image={product.image}
                      title={product.title}
                      price={product.price}
                      rating={product.rating}
                      discount={product.discount}
                      isNew={product.isNew}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
