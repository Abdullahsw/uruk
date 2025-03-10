import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import { Button } from "@/components/ui/button";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-gray-600 mt-2">
              Join ShopHub to start shopping or become a distributor
            </p>
          </div>

          <RegisterForm onLoginClick={() => navigate("/login")} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
