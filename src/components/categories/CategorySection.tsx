import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Category {
  id: string;
  name: string;
  image: string;
  productCount?: number;
}

interface CategorySectionProps {
  title?: string;
  categories?: Category[];
  onCategoryClick?: (id: string) => void;
}

const CategorySection = ({
  title = "Shop by Category",
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
  onCategoryClick = (id) => console.log(`Category clicked: ${id}`),
}: CategorySectionProps) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto py-10 px-4 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            className="rounded-full"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            className="rounded-full"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollArea
        className="w-full whitespace-nowrap pb-4"
        ref={scrollContainerRef}
      >
        <div className="flex space-x-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex-none w-[180px] cursor-pointer transition-transform hover:scale-105"
              onClick={() => onCategoryClick(category.id)}
            >
              <div className="relative w-full h-[180px] rounded-lg overflow-hidden bg-gray-100 mb-2">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <h3 className="text-white font-medium">{category.name}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {category.productCount} products
              </p>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CategorySection;
