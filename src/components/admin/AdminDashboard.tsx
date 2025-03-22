import React, { Suspense, lazy, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { getAdminDashboardStats } from "@/lib/admin/adminService";
import AdminHeader from "@/components/layout/AdminHeader";
import AdminFooter from "@/components/layout/AdminFooter";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  Shield,
  Activity,
  Database,
  Layout,
} from "lucide-react";

// Lazy load admin components
const AdminUsers = lazy(() => import("./AdminUsers"));
const AdminOrders = lazy(() => import("./AdminOrders"));
const AdminProducts = lazy(() => import("./AdminProducts"));
const AdminSettings = lazy(() => import("./AdminSettings"));
const AdminResellers = lazy(() => import("./AdminResellers"));
const AdminApiRequests = lazy(() => import("./AdminApiRequests"));
const AdminActivityLogs = lazy(() => import("./AdminActivityLogs"));
const AdminDashboardCustomizer = lazy(
  () => import("./AdminDashboardCustomizer"),
);
const AdminSecuritySettings = lazy(() => import("./AdminSecuritySettings"));

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    users: { total: 0, newThisMonth: 0 },
    resellers: { total: 0, newThisMonth: 0 },
    products: { total: 0, newThisMonth: 0 },
    revenue: { total: 0, thisMonth: 0, percentChange: "0.0" },
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is an admin
  const isAdmin = user?.user_metadata?.account_type === "admin";

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (isAdmin) {
        setIsLoading(true);
        try {
          const {
            success,
            stats: dashboardStats,
            error,
          } = await getAdminDashboardStats();

          if (success && dashboardStats) {
            setStats(dashboardStats);
          } else if (error) {
            console.error("Error fetching dashboard stats:", error);
            toast({
              title: "Failed to load dashboard statistics",
              description: error,
              variant: "destructive",
            });
          }
        } catch (err) {
          console.error("Error in dashboard stats fetch:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardStats();
  }, [isAdmin, toast]);

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
            Manage your platform, users, and business operations
          </p>
        </div>

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-12 flex items-center">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="text-sm text-gray-500">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {stats.users.total.toLocaleString()}
                    </div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />+
                      {stats.users.newThisMonth} this month
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Active Resellers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-12 flex items-center">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="text-sm text-gray-500">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {stats.resellers.total.toLocaleString()}
                    </div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />+
                      {stats.resellers.newThisMonth} this month
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-2 text-orange-500" />
                  Total Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-12 flex items-center">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="text-sm text-gray-500">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {stats.products.total.toLocaleString()}
                    </div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />+
                      {stats.products.newThisMonth} this month
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-green-500" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-12 flex items-center">
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="text-sm text-gray-500">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      $
                      {stats.revenue.total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <p
                      className={`text-xs flex items-center mt-1 ${parseFloat(stats.revenue.percentChange) >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {parseFloat(stats.revenue.percentChange) >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {parseFloat(stats.revenue.percentChange) >= 0 ? "+" : ""}
                      {stats.revenue.percentChange}% this month
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-9 w-full max-w-7xl mb-8">
            <TabsTrigger value="dashboard" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="resellers" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Resellers
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center">
              <Database className="h-4 w-4 mr-2" />
              API
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Suspense fallback={<LoadingSpinner text="Loading dashboard..." />}>
              <AdminDashboardCustomizer />
            </Suspense>
          </TabsContent>

          <TabsContent value="users">
            <Suspense fallback={<LoadingSpinner text="Loading users..." />}>
              {activeTab === "users" && <AdminUsers />}
            </Suspense>
          </TabsContent>

          <TabsContent value="resellers">
            <Suspense fallback={<LoadingSpinner text="Loading resellers..." />}>
              {activeTab === "resellers" && <AdminResellers />}
            </Suspense>
          </TabsContent>

          <TabsContent value="products">
            <Suspense fallback={<LoadingSpinner text="Loading products..." />}>
              {activeTab === "products" && <AdminProducts />}
            </Suspense>
          </TabsContent>

          <TabsContent value="orders">
            <Suspense fallback={<LoadingSpinner text="Loading orders..." />}>
              {activeTab === "orders" && <AdminOrders />}
            </Suspense>
          </TabsContent>

          <TabsContent value="api">
            <Suspense
              fallback={<LoadingSpinner text="Loading API requests..." />}
            >
              {activeTab === "api" && <AdminApiRequests />}
            </Suspense>
          </TabsContent>

          <TabsContent value="activity">
            <Suspense
              fallback={<LoadingSpinner text="Loading activity logs..." />}
            >
              {activeTab === "activity" && <AdminActivityLogs />}
            </Suspense>
          </TabsContent>

          <TabsContent value="security">
            <Suspense
              fallback={<LoadingSpinner text="Loading security settings..." />}
            >
              {activeTab === "security" && <AdminSecuritySettings />}
            </Suspense>
          </TabsContent>

          <TabsContent value="settings">
            <Suspense fallback={<LoadingSpinner text="Loading settings..." />}>
              {activeTab === "settings" && <AdminSettings />}
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>

      <AdminFooter />
    </div>
  );
};

export default AdminDashboard;
