import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "reseller" | "customer";
  fallbackPath?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRole,
  fallbackPath = "/login",
}) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Wait until auth is loaded
    if (isLoading) return;

    // If no user is logged in, redirect to login
    if (!user) {
      const isAdminRoute =
        window.location.pathname.includes("/dashboard/admin");
      if (isAdminRoute) {
        toast({
          title: "Admin authentication required",
          description: "Please log in with admin credentials",
          variant: "destructive",
        });
        navigate("/admin/login", { replace: true });
      } else {
        toast({
          title: "Authentication required",
          description: "Please log in to access this page",
          variant: "destructive",
        });
        navigate(fallbackPath, { replace: true });
      }
      return;
    }

    // If a specific role is required, check if user has that role
    if (requiredRole) {
      const userRole = user.user_metadata?.account_type;

      if (requiredRole === "admin" && userRole !== "admin") {
        toast({
          title: "Access denied",
          description: "You need admin privileges to access this page",
          variant: "destructive",
        });
        navigate("/", { replace: true });
        return;
      }

      if (
        requiredRole === "reseller" &&
        userRole !== "reseller" &&
        userRole !== "admin"
      ) {
        toast({
          title: "Access denied",
          description: "You need reseller privileges to access this page",
          variant: "destructive",
        });
        navigate("/", { replace: true });
        return;
      }
    }
  }, [user, isLoading, requiredRole, navigate, toast, fallbackPath]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // If we're not loading and haven't redirected, render children
  return <>{children}</>;
};

export default AuthGuard;
