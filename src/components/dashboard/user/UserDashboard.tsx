import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useAuth } from "@/lib/auth.tsx";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  console.log("User in UserDashboard:", user);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
            <p className="text-gray-500 mb-6">
              You need to be logged in to access your dashboard.
            </p>
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentPlan = user?.user_metadata?.subscription_plan || "free";

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Basic access to the platform",
      features: [
        { name: "Browse products", included: true },
        { name: "Place orders", included: true },
        { name: "Track shipments", included: true },
        { name: "Customer support", included: false },
        { name: "Exclusive deals", included: false },
      ],
      current: currentPlan === "free",
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "monthly",
      description: "Enhanced shopping experience",
      features: [
        { name: "Browse products", included: true },
        { name: "Place orders", included: true },
        { name: "Track shipments", included: true },
        { name: "Customer support", included: true },
        { name: "Exclusive deals", included: true },
        { name: "Free shipping", included: true },
      ],
      current: currentPlan === "premium",
    },
    {
      name: "Business",
      price: "$29.99",
      period: "monthly",
      description: "For business customers",
      features: [
        { name: "All Premium features", included: true },
        { name: "Bulk ordering", included: true },
        { name: "Priority shipping", included: true },
        { name: "Dedicated account manager", included: true },
        { name: "Custom pricing", included: true },
      ],
      current: currentPlan === "business",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and subscription
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
            <TabsTrigger
              value="profile"
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" onClick={() => setActiveTab("orders")}>
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              onClick={() => setActiveTab("subscription")}
            >
              Subscription
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    View and update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Name
                      </h3>
                      <p className="text-base">
                        {user.user_metadata?.name || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Email
                      </h3>
                      <p className="text-base">{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Account Type
                      </h3>
                      <p className="text-base capitalize">
                        {user.user_metadata?.account_type || "Customer"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Member Since
                      </h3>
                      <p className="text-base">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Edit Profile</Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="orders">
            {activeTab === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View your past orders and track current shipments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      You haven't placed any orders yet.
                    </p>
                    <Button className="mt-4" onClick={() => navigate("/")}>
                      Start Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="subscription">
            {activeTab === "subscription" && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Your Subscription</h2>
                  <p className="text-gray-600">
                    You are currently on the{" "}
                    <span className="font-medium capitalize">
                      {currentPlan}
                    </span>{" "}
                    plan
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <Card
                      key={plan.name}
                      className={plan.current ? "border-primary" : ""}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>{plan.name}</CardTitle>
                          {plan.current && (
                            <Badge className="bg-primary">Current Plan</Badge>
                          )}
                        </div>
                        <div className="flex items-baseline mt-2">
                          <span className="text-3xl font-bold">
                            {plan.price}
                          </span>
                          {plan.period && (
                            <span className="ml-1 text-sm text-gray-500">
                              /{plan.period}
                            </span>
                          )}
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              {feature.included ? (
                                <Check className="h-4 w-4 text-green-500 mr-2" />
                              ) : (
                                <X className="h-4 w-4 text-gray-300 mr-2" />
                              )}
                              <span
                                className={
                                  feature.included ? "" : "text-gray-500"
                                }
                              >
                                {feature.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        {plan.current ? (
                          <Button className="w-full" disabled>
                            Current Plan
                          </Button>
                        ) : (
                          <Button
                            className="w-full"
                            variant={
                              plan.name === "Free" ? "outline" : "default"
                            }
                          >
                            {plan.name === "Free" ? "Downgrade" : "Upgrade"}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
