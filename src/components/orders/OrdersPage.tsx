import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth.tsx";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

// Mock order data - in a real app, this would come from your backend
const mockOrders = [
  {
    id: "ORD-1234",
    date: "2023-06-15T10:30:00Z",
    status: "delivered",
    total: 129.99,
    items: [
      {
        id: "prod-001",
        title: "Premium Wireless Headphones",
        price: 129.99,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
        quantity: 1,
      },
    ],
    deliveryAddress: {
      fullName: "John Doe",
      streetAddress: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "US",
      phone: "+1 (555) 123-4567",
    },
  },
  {
    id: "ORD-5678",
    date: "2023-06-10T14:45:00Z",
    status: "processing",
    total: 329.98,
    items: [
      {
        id: "prod-002",
        title: "Smart Watch Series 5",
        price: 249.99,
        image:
          "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80",
        quantity: 1,
      },
      {
        id: "prod-003",
        title: "Portable Bluetooth Speaker",
        price: 79.99,
        image:
          "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80",
        quantity: 1,
      },
    ],
    deliveryAddress: {
      fullName: "John Doe",
      streetAddress: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "US",
      phone: "+1 (555) 123-4567",
    },
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "processing":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "shipped":
      return <Package className="h-5 w-5 text-orange-500" />;
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "cancelled":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "processing":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Processing
        </Badge>
      );
    case "shipped":
      return (
        <Badge
          variant="outline"
          className="bg-orange-50 text-orange-700 border-orange-200"
        >
          Shipped
        </Badge>
      );
    case "delivered":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Delivered
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Sign in to view your orders
            </h2>
            <p className="text-gray-500 mb-6">
              You need to be signed in to view your order history.
            </p>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleOrderClick = (orderId: string) => {
    setSelectedOrder(selectedOrder === orderId ? null : orderId);
  };

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
          <ShoppingBag className="mr-2 h-6 w-6" />
          Your Orders
        </h1>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleOrderClick(order.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      {getStatusIcon(order.status)}
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">{order.id}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()} at{" "}
                          {new Date(order.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                      <div className="mr-6">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedOrder === order.id && (
                  <div className="border-t border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Order Items</h4>
                        <Separator className="mb-4" />

                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex">
                              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <h5 className="text-sm font-medium">
                                    {item.title}
                                  </h5>
                                  <p className="mt-1 text-sm text-gray-500">
                                    Qty: {item.quantity} × $
                                    {item.price.toFixed(2)}
                                  </p>
                                </div>
                                <div className="flex flex-1 items-end justify-between">
                                  <p className="text-sm font-medium">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">
                          Delivery Information
                        </h4>
                        <Separator className="mb-4" />

                        <div className="space-y-1">
                          <p className="font-medium">
                            {order.deliveryAddress.fullName}
                          </p>
                          <p>{order.deliveryAddress.streetAddress}</p>
                          <p>
                            {order.deliveryAddress.city},{" "}
                            {order.deliveryAddress.state}{" "}
                            {order.deliveryAddress.postalCode}
                          </p>
                          <p>{order.deliveryAddress.country}</p>
                          <p className="pt-2">{order.deliveryAddress.phone}</p>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-medium mb-2">Order Summary</h4>
                          <Separator className="mb-4" />

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <p className="text-sm text-gray-600">Subtotal</p>
                              <p className="text-sm font-medium">
                                ${order.total.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm text-gray-600">Shipping</p>
                              <p className="text-sm font-medium">$0.00</p>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between">
                              <p className="font-medium">Total</p>
                              <p className="font-medium">
                                ${order.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't placed any orders yet.
            </p>
            <Button onClick={handleContinueShopping}>Start Shopping</Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;
