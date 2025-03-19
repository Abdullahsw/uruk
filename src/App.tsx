import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { AuthProvider } from "./lib/auth.tsx";
import { Toaster } from "./components/ui/toaster";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthGuard from "./components/auth/AuthGuard";

// Lazy load pages for better performance
const CartPage = lazy(() => import("./components/cart/CartPage"));
const OrdersPage = lazy(() => import("./components/orders/OrdersPage"));
const LoginPage = lazy(() => import("./components/auth/LoginPage"));
const RegisterPage = lazy(() => import("./components/auth/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("./components/auth/ForgotPasswordPage"),
);
const PasswordResetPage = lazy(
  () => import("./components/auth/PasswordResetPage"),
);
const AdminCredentialsPage = lazy(
  () => import("./components/auth/AdminCredentialsPage"),
);
const AdminLoginPage = lazy(() => import("./components/admin/AdminLoginPage"));
const ResellerDashboard = lazy(
  () => import("./components/dashboard/reseller/ResellerDashboard"),
);
const AdminDashboard = lazy(
  () => import("./components/dashboard/admin/AdminDashboard"),
);
const UserDashboard = lazy(
  () => import("./components/dashboard/user/UserDashboard"),
);
const ProductDetailsPage = lazy(
  () => import("./components/products/ProductDetailsPage"),
);
const CategoryPage = lazy(() => import("./components/products/CategoryPage"));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen bg-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          }
        >
          <>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<PasswordResetPage />} />
              <Route
                path="/admin-credentials"
                element={<AdminCredentialsPage />}
              />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/dashboard/reseller"
                element={
                  <AuthGuard requiredRole="reseller">
                    <ResellerDashboard />
                  </AuthGuard>
                }
              />
              <Route
                path="/dashboard/admin/*"
                element={
                  <AuthGuard requiredRole="admin">
                    <AdminDashboard />
                  </AuthGuard>
                }
              />
              <Route
                path="/admin"
                element={<Navigate to="/admin/login" replace />}
              />
              <Route
                path="/dashboard/user"
                element={
                  <AuthGuard>
                    <UserDashboard />
                  </AuthGuard>
                }
              />
              {/* Category routes must come before product routes to avoid conflicts */}
              <Route
                path="/products/category/:categoryId"
                element={<CategoryPage />}
              />
              <Route
                path="/products/:productId"
                element={<ProductDetailsPage />}
              />
              {/* Fallback route for any other product-related paths */}
              <Route path="/products" element={<CategoryPage />} />
              {/* Add this before the catchall route for Tempo */}
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" />
              )}
              {/* Error fallback route to prevent white screens */}
              <Route path="*" element={<Home />} />
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            <Toaster />
          </>
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
