import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  products?: Array<{
    id: string;
    image: string;
    title: string;
    price: number;
    rating: number;
    discount?: number;
    isNew?: boolean;
  }>;
  onAddToCart?: (id: string) => void;
}

const FeaturedProducts = ({
  title = "Featured Products",
  subtitle = "Discover our most popular items handpicked for you",
  products = [
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
  onAddToCart = (id) => console.log(`Added product ${id} to cart`),
}: FeaturedProductsProps) => {
  // State for horizontal scrolling
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const newPosition = Math.max(scrollPosition - 600, 0);
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setScrollPosition(newPosition);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const maxScroll =
        scrollContainerRef.current.scrollWidth -
        scrollContainerRef.current.clientWidth;
      const newPosition = Math.min(scrollPosition + 600, maxScroll);
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setScrollPosition(newPosition);
    }
  };

  // Handle scroll events to update position state
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section className="w-full max-w-[1400px] mx-auto py-12 px-4 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={scrollPosition <= 0}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={
              scrollContainerRef.current &&
              scrollPosition >=
                scrollContainerRef.current.scrollWidth -
                  scrollContainerRef.current.clientWidth
            }
            className="rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="snap-start">
            <ProductCard
              id={product.id}
              image={product.image}
              title={product.title}
              price={product.price}
              rating={product.rating}
              discount={product.discount}
              isNew={product.isNew}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
