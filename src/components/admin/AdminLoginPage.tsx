import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { Lock, Mail } from "lucide-react";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is already logged in as admin
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData?.user_metadata?.account_type === "admin") {
          navigate("/dashboard/admin");
        }
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
  }, [navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Check if using demo credentials
      if (email === "admin@shophub.com" && password === "Admin123!") {
        // Directly handle admin login for demo mode
        toast({
          title: "Admin login successful (Demo Mode)",
          description: "You have been logged in as an administrator.",
        });

        // Create admin user in localStorage
        const userData = {
          id: "admin-user-id",
          email: email,
          user_metadata: {
            name: "Admin User",
            account_type: "admin",
          },
          created_at: new Date().toISOString(),
        };

        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect to admin dashboard with a slight delay to ensure state updates
        setTimeout(() => {
          setIsLoading(false);
          navigate("/dashboard/admin");
        }, 500);
        return;
      }

      // Regular sign in process
      const result = await signIn(email, password);

      if (result.success) {
        toast({
          title: "Admin login successful",
          description: "You have been logged in as an administrator.",
        });

        // Redirect to admin dashboard
        setTimeout(() => {
          navigate(result.redirectPath || "/dashboard/admin");
        }, 500);
      } else {
        setError(result.error || "Invalid admin credentials");
        toast({
          title: "Login failed",
          description: result.error || "Invalid admin credentials",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
      toast({
        title: "Login error",
        description: "An unexpected error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="bg-primary h-16 flex items-center px-6">
        <h1 className="text-white text-xl font-bold">ShopHub Admin</h1>
      </div>

      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Admin Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login to Admin Panel"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-500">
                Demo credentials:{" "}
                <span className="font-medium">admin@shophub.com</span> /{" "}
                <span className="font-medium">Admin123!</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} ShopHub Admin Portal
      </footer>
    </div>
  );
};

export default AdminLoginPage;
