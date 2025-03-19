import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import { useToast } from "@/components/ui/use-toast";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: "Admin login successful",
      description: "You have been logged in as an administrator.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm
              onSuccess={handleSuccess}
              onRegisterClick={() => navigate("/register")}
              onForgotPasswordClick={() => navigate("/forgot-password")}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;
