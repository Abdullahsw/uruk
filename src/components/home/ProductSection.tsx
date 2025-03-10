import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/languageContext";

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  rating: number;
  discount?: number;
  isNew?: boolean;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
  layout?: "vertical" | "horizontal";
}

const ProductSection = ({
  title,
  products,
  viewAllLink = "/products",
  layout = "vertical",
}: ProductSectionProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleViewAll = () => {
    // Direct navigation without event handling or setTimeout
    // This fixes the white screen issue by using a simpler navigation approach
    try {
      // Make sure the path is correct for category pages
      let categoryPath = viewAllLink;
      if (
        !categoryPath.includes("/category/") &&
        categoryPath.includes("/products/")
      ) {
        categoryPath = categoryPath.replace(
          "/products/",
          "/products/category/",
        );
      }

      // Simple direct navigation
      if (categoryPath) {
        navigate(categoryPath);
        console.log(
          `Viewing all products in ${title} section: ${categoryPath}`,
        );
      } else {
        navigate("/products");
        console.log(`Fallback to all products`);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      navigate("/");
    }
  };

  return (
    <div className="w-full py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button
          variant="ghost"
          className="text-primary flex items-center"
          onClick={handleViewAll}
        >
          {t("viewAll")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Mobile-optimized grid with 2 products per row on small screens */}
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
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
