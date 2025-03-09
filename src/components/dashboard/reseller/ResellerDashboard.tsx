import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth.tsx";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ResellerProducts from "./ResellerProducts";
import ResellerOrders from "./ResellerOrders";
import ResellerCustomers from "./ResellerCustomers";
import ResellerSettings from "./ResellerSettings";
import ResellerAnalytics from "./ResellerAnalytics";
import SocialIntegration from "./SocialIntegration";

const ResellerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is a reseller
  const isReseller = user?.user_metadata?.account_type === "reseller";
  const resellerPlan = user?.user_metadata?.reseller_plan || "basic";

  if (!user || !isReseller) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              Reseller Access Required
            </h2>
            <p className="text-gray-500 mb-6">
              You need a reseller account to access this dashboard.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-primary text-white px-4 py-2 rounded-md"
            >
              Return to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Reseller Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your reseller store, products, and customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,456.78</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Active Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                +8 new products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-amber-500 flex items-center mt-1">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid grid-cols-6 w-full max-w-4xl mb-8">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ResellerProducts />
          </TabsContent>

          <TabsContent value="orders">
            <ResellerOrders />
          </TabsContent>

          <TabsContent value="customers">
            <ResellerCustomers />
          </TabsContent>

          <TabsContent value="analytics">
            <ResellerAnalytics />
          </TabsContent>

          <TabsContent value="integration">
            <SocialIntegration currentPlan={resellerPlan} />
          </TabsContent>
          
          <TabsContent value="settings">
            <ResellerSettings currentPlan={resellerPlan}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ResellerDashboard;
