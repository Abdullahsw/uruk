import React, { Suspense, lazy, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth.tsx";
import AdminHeader from "@/components/layout/AdminHeader";
import AdminFooter from "@/components/layout/AdminFooter";
import LoadingSpinner from "@/components/ui/loading-spinner";

// Lazy load admin components
const AdminUsers = lazy(() => import("./AdminUsers"));
const AdminOrders = lazy(() => import("./AdminOrders"));
const AdminProducts = lazy(() => import("./AdminProducts"));
const AdminSettings = lazy(() => import("./AdminSettings"));
const AdminResellers = lazy(() => import("./AdminResellers"));
const AdminApiRequests = lazy(() => import("./AdminApiRequests"));
const CurrencyRates = lazy(() => import("./CurrencyRates"));
const AdvertisementManager = lazy(
  () => import("@/components/admin/AdvertisementManager"),
);
const ProductSectionManager = lazy(
  () => import("@/components/admin/ProductSectionManager"),
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is an admin
  const isAdmin = user?.user_metadata?.account_type === "admin";

  useEffect(() => {
    // Set a short timeout to ensure components render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AdminHeader />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              Admin Access Required
            </h2>
            <p className="text-gray-500 mb-6">
              You need admin privileges to access this dashboard.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-primary text-white px-4 py-2 rounded-md"
            >
              Return to Home
            </button>
          </div>
        </main>
        <AdminFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your platform, users, and resellers
          </p>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,456</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                +125 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Active Resellers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                +8 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,893</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                +56 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$128,456.78</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                +18.5% this month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-9 w-full max-w-7xl mb-8">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="resellers">Resellers</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="api">API Requests</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
            <TabsTrigger value="advertisements">Advertisements</TabsTrigger>
            <TabsTrigger value="sections">Product Sections</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Suspense fallback={<LoadingSpinner text="Loading users..." />}>
              {activeTab === "users" && (
                <AdminUsers searchValue={searchValue} />
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="resellers">
            <Suspense fallback={<LoadingSpinner text="Loading resellers..." />}>
              {activeTab === "resellers" && (
                <AdminResellers searchValue={searchValue} />
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="products">
            <Suspense fallback={<LoadingSpinner text="Loading products..." />}>
              {activeTab === "products" && (
                <AdminProducts searchValue={searchValue} />
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="orders">
            <Suspense fallback={<LoadingSpinner text="Loading orders..." />}>
              {activeTab === "orders" && (
                <AdminOrders searchValue={searchValue} />
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="api">
            <Suspense
              fallback={<LoadingSpinner text="Loading API requests..." />}
            >
              {activeTab === "api" && (
                <AdminApiRequests searchValue={searchValue} />
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="currency">
            <Suspense
              fallback={<LoadingSpinner text="Loading currency rates..." />}
            >
              {activeTab === "currency" && (
                <CurrencyRates searchValue={searchValue} />
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="advertisements">
            <Suspense
              fallback={
                <LoadingSpinner text="Loading advertisement manager..." />
              }
            >
              {activeTab === "advertisements" && (
                <AdvertisementManager searchValue={searchValue} />
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="sections">
            <Suspense
              fallback={
                <LoadingSpinner text="Loading product section manager..." />
              }
            >
              {activeTab === "sections" && (
                <ProductSectionManager searchValue={searchValue} />
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="settings">
            <Suspense fallback={<LoadingSpinner text="Loading settings..." />}>
              {activeTab === "settings" && (
                <AdminSettings searchValue={searchValue} />
              )}
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>

      <AdminFooter />
    </div>
  );
};

export default AdminDashboard;
