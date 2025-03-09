import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useCartStore } from "@/lib/cartStore";

interface ProductCardProps {
  id?: string;
  image?: string;
  title?: string;
  price?: number;
  rating?: number;
  discount?: number;
  isNew?: boolean;
  onAddToCart?: (id: string) => void;
}

const ProductCard = ({
  id = "prod-001",
  image = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  title = "Premium Wireless Headphones",
  price = 129.99,
  rating = 4.5,
  discount = 0,
  isNew = false,
  onAddToCart = () => console.log("Added to cart"),
}: ProductCardProps) => {
  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addToCart({ id, title, price, image, discount });
    onAddToCart(id);
  };

  return (
    <Card className="w-[280px] h-[350px] overflow-hidden flex flex-col bg-white transition-all duration-300 hover:shadow-lg">
      <div className="relative h-[180px] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {isNew && (
          <Badge className="absolute top-2 left-2 bg-blue-500">New</Badge>
        )}
        {discount > 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            {discount}% OFF
          </Badge>
        )}
      </div>

      <CardHeader className="p-4 pb-0">
        <h3 className="font-medium text-sm line-clamp-2 h-10">{title}</h3>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow">
        <div className="flex items-center mb-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"} ${i === Math.floor(rating) && rating % 1 > 0 ? "text-yellow-400 opacity-50" : ""}`}
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
              />
            ))}
          <span className="text-xs text-gray-500 ml-1">{rating}</span>
        </div>

        <div className="flex items-center">
          {discount > 0 && (
            <span className="text-gray-400 text-sm line-through mr-2">
              ${price.toFixed(2)}
            </span>
          )}
          <span className="text-primary font-semibold">
            ${discountedPrice.toFixed(2)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full" size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
