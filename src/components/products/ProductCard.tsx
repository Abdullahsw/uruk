import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/lib/currencyContext";

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  rating?: number;
  discount?: number;
  isNew?: boolean;
  onAddToCart?: (id: string) => void;
}

const ProductCard = ({
  id,
  image,
  title,
  price,
  rating = 0,
  discount = 0,
  isNew = false,
  onAddToCart,
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;

  const handleClick = () => {
    navigate(`/products/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer h-full flex flex-col"
      onClick={handleClick}
    >
      {/* Product Image */}
      <div className="relative pt-[100%] bg-gray-100">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <Badge
            variant="destructive"
            className="absolute top-2 right-2 font-medium"
          >
            {discount}% OFF
          </Badge>
        )}

        {/* New Badge */}
        {isNew && (
          <Badge className="absolute top-2 left-2 bg-blue-500 font-medium">
            New
          </Badge>
        )}

        {/* Quick Action Buttons - Visible on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              // Add to wishlist functionality would go here
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-sm line-clamp-2 mb-1">{title}</h3>

          <div className="flex items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={`${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"} ${i === Math.floor(rating) && rating % 1 > 0 ? "text-yellow-400 opacity-50" : ""}`}
                  fill={i < Math.floor(rating) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              {(rating || 0).toFixed(1)}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center">
            {discount > 0 && (
              <span className="text-gray-400 text-xs line-through mr-2">
                {formatPrice(price)}
              </span>
            )}
            <span className="text-primary font-semibold">
              {formatPrice(discountedPrice)}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
