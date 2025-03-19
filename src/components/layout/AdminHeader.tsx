import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="w-full h-16 bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard/admin");
            }}
            className="flex items-center"
          >
            <span className="text-xl font-bold">ShopHub Admin</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-primary-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary absolute top-16 left-0 right-0 border-t border-primary-foreground shadow-md z-50">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Button
              variant="ghost"
              className="text-white justify-start hover:bg-primary-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
