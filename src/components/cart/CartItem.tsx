import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType } from "@/lib/cartStore";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const { id, title, price, image, quantity, discount } = item;
  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <div className="flex items-start py-4 border-b border-gray-200">
      {/* Product Image */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Product Details */}
      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <div className="mt-1 flex items-center">
              {discount ? (
                <>
                  <span className="text-sm font-medium text-gray-900">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ${price.toFixed(2)}
                  </span>
                  <span className="ml-2 text-xs text-green-600">
                    {discount}% off
                  </span>
                </>
              ) : (
                <span className="text-sm font-medium text-gray-900">
                  ${price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-red-500"
            onClick={() => onRemove(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Quantity Controls */}
        <div className="mt-2 flex items-center">
          <div className="flex items-center border border-gray-200 rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => onUpdateQuantity(id, quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => onUpdateQuantity(id, quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm font-medium text-gray-900">
              ${(discountedPrice * quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
