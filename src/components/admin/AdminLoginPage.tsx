import React, { useState } from "react";
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
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Check if using demo credentials
      if (email === "admin@shophub.com" && password === "Admin123!") {
        try {
          // Try to sign in with Supabase first
          const supabaseResult = await signIn(email, password);

          if (supabaseResult.success) {
            toast({
              title: "Admin login successful",
              description: "You have been logged in as an administrator.",
            });

            // Redirect to admin dashboard
            navigate("/dashboard/admin");
            return;
          }

          // If Supabase login fails, fall back to demo mode
          console.log("Supabase login failed, using demo mode");

          // Directly handle admin login for demo
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

          // Redirect to admin dashboard
          navigate("/dashboard/admin");
          return;
        } catch (error) {
          console.error("Error during admin login:", error);

          // Fall back to demo mode on any error
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

          // Redirect to admin dashboard
          navigate("/dashboard/admin");
          return;
        }
      }

      // Regular sign in process
      const result = await signIn(email, password);

      if (result.success) {
        toast({
          title: "Admin login successful",
          description: "You have been logged in as an administrator.",
        });

        // Redirect to admin dashboard
        navigate(result.redirectPath || "/dashboard/admin");
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
