import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

const LoginForm = ({
  onSuccess = () => {},
  onRegisterClick = () => {},
}: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // For admin credentials demo
      if (data.email === "admin@shophub.com" && data.password === "Admin123!") {
        // Set user in auth context
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "admin-user-id",
            email: data.email,
            user_metadata: {
              name: "Admin User",
              account_type: "admin",
            },
          }),
        );

        toast({
          title: "Admin Login successful",
          description: "You have been logged in as admin.",
        });
        navigate("/dashboard/admin");
        onSuccess();
        // Force page reload to update auth state
        window.location.href = "/dashboard/admin";
        return;
      }

      // Always succeed for demo purposes
      // Create mock user based on email pattern
      let accountType = "customer";
      let redirectPath = "/dashboard/user";

      if (data.email.includes("admin")) {
        accountType = "admin";
        redirectPath = "/dashboard/admin";
      } else if (
        data.email.includes("reseller") ||
        data.email.includes("distributor")
      ) {
        accountType = "reseller";
        redirectPath = "/dashboard/reseller";
      }

      // Store user in localStorage for auth persistence
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: `user-${Date.now()}`,
          email: data.email,
          user_metadata: {
            name: data.email.split("@")[0],
            account_type: accountType,
          },
        }),
      );

      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      });

      // Force page reload to update auth state
      window.location.href = redirectPath;

      onSuccess();
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your.email@example.com"
                      type="email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={onRegisterClick}
                >
                  Register
                </Button>
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
