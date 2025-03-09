import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  onCheckout: () => void;
  isDisabled?: boolean;
}

const CartSummary = ({
  subtotal,
  discount,
  deliveryFee,
  total,
  onCheckout,
  isDisabled = false,
}: CartSummaryProps) => {
  return (
    <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <p className="text-sm text-gray-600">Subtotal</p>
          <p className="text-sm font-medium text-gray-900">
            ${subtotal.toFixed(2)}
          </p>
        </div>

        {discount > 0 && (
          <div className="flex justify-between">
            <p className="text-sm text-gray-600">Discount</p>
            <p className="text-sm font-medium text-green-600">
              -${discount.toFixed(2)}
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <p className="text-sm text-gray-600">Delivery Fee</p>
          <p className="text-sm font-medium text-gray-900">
            ${deliveryFee.toFixed(2)}
          </p>
        </div>

        <Separator className="my-2" />

        <div className="flex justify-between">
          <p className="text-base font-medium text-gray-900">Total</p>
          <p className="text-base font-medium text-gray-900">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>

      <Button
        className="w-full mt-6"
        size="lg"
        onClick={onCheckout}
        disabled={isDisabled}
      >
        Proceed to Checkout
      </Button>

      <p className="mt-4 text-xs text-center text-gray-500">
        Taxes and shipping calculated at checkout
      </p>
    </div>
  );
};

export default CartSummary;
