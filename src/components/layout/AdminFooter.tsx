import React from "react";

const AdminFooter = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} ShopHub Admin Portal - All rights
            reserved
          </p>
          <p className="text-xs text-gray-500 mt-1">Version 1.0.0</p>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
