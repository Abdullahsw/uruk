import React, { useState } from "react";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/auth.tsx";

interface HeaderProps {
  logo?: string;
  cartItemCount?: number;
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
  onProfileClick?: () => void;
  navigationLinks?: Array<{ label: string; href: string }>;
}

const Header = ({
  logo = "/vite.svg",
  cartItemCount = 0,
  onSearch = () => console.log("Search triggered"),
  onCartClick = () => (window.location.href = "/cart"),
  onProfileClick = () => console.log("Profile clicked"),
  navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "Deals", href: "/deals" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const isLoggedIn = !!user;
  const userName = user?.user_metadata?.name || "User";
  const userAvatar = user?.user_metadata?.avatar_url || "";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleCartClick = () => {
    window.location.href = "/cart";
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img src={logo} alt="E-commerce Logo" className="h-10 w-auto" />
            <span className="ml-2 text-xl font-bold text-primary hidden sm:inline">
              ShopHub
            </span>
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
          {navigationLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-600 hover:text-primary text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Search, Cart, and User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-64">
            <Input
              type="search"
              placeholder="Search products..."
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onCartClick}
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback>
                      {userName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem onClick={onProfileClick}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>Orders</DropdownMenuItem>
                <DropdownMenuItem>Wishlist</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthModal
              trigger={
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              }
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-20 left-0 right-0 border-b border-gray-200 shadow-md z-50">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              {navigationLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-600 hover:text-primary py-2 text-sm font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Mobile User Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCartClick}
                className="relative flex items-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              {isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onProfileClick}
                  className="flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span>My Account</span>
                </Button>
              ) : (
                <AuthModal
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span>Sign In</span>
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
