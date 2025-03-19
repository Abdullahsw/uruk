import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function CartItem({ item, onUpdateQuantity, onRemove }) {
  const handleIncreaseQuantity = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      onRemove(item.id);
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  const discountedPrice = item.discount
    ? item.price * (1 - item.discount / 100)
    : item.price;

  return (
    <div className="flex items-start space-x-4 py-4 border-b last:border-0">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
          <div className="text-right">
            {item.discount ? (
              <div>
                <span className="text-sm font-medium text-gray-900">
                  ${(discountedPrice * item.quantity).toFixed(2)}
                </span>
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-sm font-medium text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {item.color && (
          <p className="mt-1 text-sm text-gray-500">Color: {item.color}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={handleDecreaseQuantity}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={handleIncreaseQuantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-red-500"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
