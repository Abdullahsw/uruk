import React from "react";
import AdminCredentials from "./AdminCredentials";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const AdminCredentialsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Admin Access</h1>
            <p className="text-gray-600 mt-2">
              Use these credentials to access the admin dashboard
            </p>
          </div>

          <AdminCredentials />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminCredentialsPage;
