import React from "react";
import { useNavigate } from "react-router-dom";
import PasswordResetForm from "./PasswordResetForm";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const PasswordResetPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create New Password</h1>
            <p className="text-gray-600 mt-2">
              Enter a new password for your account
            </p>
          </div>

          <PasswordResetForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PasswordResetPage;
