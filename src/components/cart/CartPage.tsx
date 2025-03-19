import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth.tsx";
import { useCartStore } from "@/lib/cartStore";
import CartItem from "./CartItem.tsx";
import CartSummary from "./CartSummary";
import DeliveryAddressForm from "./DeliveryAddressForm";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const CartPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("cart");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    items,
    deliveryAddress,
    deliveryFee,
    updateQuantity,
    removeItem,
    setDeliveryAddress,
    getSubtotal,
    getDiscountTotal,
    getTotal,
    clearCart,
  } = useCartStore();

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to continue with checkout",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some products before checkout.",
        variant: "destructive",
      });
      return;
    }

    setActiveTab("delivery");
  };

  const handleAddressSubmit = (data: any) => {
    setDeliveryAddress(data);
    setActiveTab("payment");
    toast({
      title: "Address saved",
      description: "Your delivery address has been saved",
    });
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to place an order",
        variant: "destructive",
      });
      return;
    }

    if (!deliveryAddress) {
      toast({
        title: "Address required",
        description: "Please add a delivery address",
        variant: "destructive",
      });
      setActiveTab("delivery");
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would normally send the order to your backend
      // For now, we'll just simulate a successful order
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Order placed successfully!",
        description: "Your order has been received and is being processed.",
      });

      clearCart();
      navigate("/orders");
    } catch (error) {
      toast({
        title: "Error placing order",
        description:
          "There was a problem processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = getSubtotal();
  const discount = getDiscountTotal();
  const total = getTotal();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            className="p-0 mr-2"
            onClick={handleContinueShopping}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </div>

        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingCart className="mr-2 h-6 w-6" />
          Your Cart
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="cart">Cart</TabsTrigger>
            <TabsTrigger value="delivery" disabled={items.length === 0}>
              Delivery
            </TabsTrigger>
            <TabsTrigger value="payment" disabled={!deliveryAddress}>
              Payment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cart" className="space-y-4">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-medium mb-4">
                      Cart Items ({items.length})
                    </h2>
                    <Separator className="mb-4" />

                    <div className="space-y-2">
                      {items.map((item) => (
                        <CartItem
                          key={item.id}
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onRemove={removeItem}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <CartSummary
                    subtotal={subtotal}
                    discount={discount}
                    deliveryFee={deliveryFee}
                    total={total}
                    onCheckout={handleProceedToCheckout}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Button onClick={handleContinueShopping}>Start Shopping</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="delivery">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-medium mb-4">Delivery Address</h2>
                  <Separator className="mb-4" />

                  <DeliveryAddressForm
                    onSubmit={handleAddressSubmit}
                    defaultValues={deliveryAddress || undefined}
                  />
                </div>
              </div>

              <div>
                <CartSummary
                  subtotal={subtotal}
                  discount={discount}
                  deliveryFee={deliveryFee}
                  total={total}
                  onCheckout={() => {}}
                  isDisabled={true}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                  <Separator className="mb-4" />

                  <div className="p-4 bg-gray-50 rounded-md mb-4">
                    <p className="text-sm text-gray-600">
                      For this demo, we're using a mock payment process. In a
                      real application, you would integrate with a payment
                      processor like Stripe, PayPal, etc.
                    </p>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Complete Order"}
                  </Button>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h2 className="text-lg font-medium mb-4">
                    Delivery Information
                  </h2>
                  <Separator className="mb-4" />

                  {deliveryAddress && (
                    <div className="space-y-2">
                      <p className="font-medium">{deliveryAddress.fullName}</p>
                      <p>{deliveryAddress.streetAddress}</p>
                      <p>
                        {deliveryAddress.city}, {deliveryAddress.state}{" "}
                        {deliveryAddress.postalCode}
                      </p>
                      <p>{deliveryAddress.country}</p>
                      <p className="pt-2">{deliveryAddress.phone}</p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setActiveTab("delivery")}
                  >
                    Edit Address
                  </Button>
                </div>
              </div>

              <div>
                <CartSummary
                  subtotal={subtotal}
                  discount={discount}
                  deliveryFee={deliveryFee}
                  total={total}
                  onCheckout={handlePlaceOrder}
                  isDisabled={isSubmitting}
                />

                <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium mb-2">Order Summary</h3>
                  <Separator className="mb-4" />

                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.title}{" "}
                          <span className="text-gray-500">
                            x{item.quantity}
                          </span>
                        </span>
                        <span>
                          $
                          {(
                            (item.discount
                              ? item.price * (1 - item.discount / 100)
                              : item.price) * item.quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
