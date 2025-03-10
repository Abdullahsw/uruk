import React from "react";
import { useNavigate } from "react-router-dom";
import ForgotPasswordForm from "./ForgotPasswordForm";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Reset Your Password</h1>
            <p className="text-gray-600 mt-2">
              Enter your email to receive a password reset link
            </p>
          </div>

          <ForgotPasswordForm onLoginClick={() => navigate("/login")} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
