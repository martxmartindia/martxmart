"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Heart, User, Menu, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useAuth } from "@/store/auth";
import { useShopping } from "@/store/shopping";
import { toast } from "sonner";

export function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const { cartCount, wishlistCount } = useShopping();
  const [location, setLocation] = useState("");



  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            const city =
              data?.address?.city ||
              data?.address?.town ||
              data?.address?.village ||
              "Unknown";
            const country = data?.address?.country || "";
            setLocation(`${city}, ${country}`);
          } catch (error) {
            console.error("Geolocation Error:", error);
            setLocation("Location not found");
          }
        },
        () => {
          setLocation("Permission denied");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shopping/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
    toast.success("Logged out successfully");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/shopping" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <span className="font-bold text-xl">martXmart</span>
          </Link>

          {/* Location - Hidden on mobile, visible on tablet and desktop */}
          <div className="hidden md:flex items-center gap-1.5 cursor-pointer hover:text-orange-400 transition-colors p-1 rounded-md hover:bg-black/10">
            <MapPin className="h-3.5 w-3.5 text-black" />
            <div className="leading-tight">
              <div className="text-xs text-gray-500">Deliver to</div>
              <div className="font-medium text-sm text-black">{location}</div>
            </div>
          </div>

          {/* Search bar - Desktop and tablet */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Wishlist */}
            <Link href="/shopping/wishlist" className="relative">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/shopping/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation links - Desktop and tablet */}
        <nav className="hidden md:flex h-12 items-center justify-center space-x-4 lg:space-x-8 text-sm w-full">
          <Link href="/shopping/products" className="hover:text-orange-600 transition-colors">
            All Products
          </Link>
          <Link
            href="/shopping/products?category=electronics"
            className="hover:text-orange-600 transition-colors"
          >
            Electronics
          </Link>
          <Link
            href="/shopping/products?category=fashion"
            className="hover:text-orange-600 transition-colors"
          >
            Fashion
          </Link>
          <Link
            href="/shopping/products?category=home"
            className="hover:text-orange-600 transition-colors"
          >
            Home & Garden
          </Link>
          <Link
            href="/shopping/products?category=sports"
            className="hover:text-orange-600 transition-colors"
          >
            Sports
          </Link>
          <Link
            href="/shopping/products?festival=true"
            className="hover:text-orange-600 transition-colors text-orange-600"
          >
            Festival Special
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </form>

            {/* Mobile navigation */}
            <nav className="flex flex-col space-y-2">
              <Link
                href="/shopping/products"
                className="py-2 hover:text-orange-600 transition-colors"
              >
                All Products
              </Link>
              <Link
                href="/shopping/products?category=electronics"
                className="py-2 hover:text-orange-600 transition-colors"
              >
                Electronics
              </Link>
              <Link
                href="/shopping/products?category=fashion"
                className="py-2 hover:text-orange-600 transition-colors"
              >
                Fashion
              </Link>
              <Link
                href="/shopping/products?category=home"
                className="py-2 hover:text-orange-600 transition-colors"
              >
                Home & Garden
              </Link>
              <Link
                href="/shopping/products?category=sports"
                className="py-2 hover:text-orange-600 transition-colors"
              >
                Sports
              </Link>
              <Link
                href="/shopping/products?festival=true"
                className="py-2 text-orange-600"
              >
                Festival Special
              </Link>
            </nav>

            {/* Mobile auth buttons */}
            {!user && (
              <div className="flex space-x-2 pt-4 border-t">
                <Button variant="ghost" className="flex-1" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}