"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  Heart,
  Loader2,
  ChevronDown,
  LogOut,
  Settings,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/store/auth";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

interface MenuDropdownItem {
  label: string;
  href: string;
}

interface MenuItem {
  label: string;
  href?: string;
  highlight?: boolean;
  dropdown?: MenuDropdownItem[];
}

const menuItems: MenuItem[] = [
  {
    label: "Plant & Machinery",
    dropdown: [
      {
        label: "Manufacturing Industry",
        href: "/plant-categories/manufacturing",
      },
      {
        label: "Service-Based Industry",
        href: "/plant-categories/service-sector",
      },
      {
        label: "Food Processing Industry",
        href: "/plant-categories/food-processing",
      },
      { label: "Trading Industry", href: "/plant-categories/trading-industry" },
      {
        label: "Printing & Labelling Machinery",
        href: "/plant-categories/printing-labelling-machinery",
      },
      {
        label: "Used / Refurbished Machinery",
        href: "/plant-categories/used-refurbished-machinery",
      },
      {
        label: "Tools & Spare Parts",
        href: "/plant-categories/tools-spare-parts",
      },
      { label: "Branding & Packaging Solutions", href: "/branding-packaging" },
      { label: "Raw Materials & Supplies", href: "/raw-materials" },
      { label: "Training & Setup Support", href: "/training-setup-support" },
      {
        label: "Installation & After Sales Support",
        href: "/installation-support",
      },
    ],
  },
  {
    label: "Business Setup360°",
    dropdown: [
    { label: "Business Registration", href: "/service/business-registration" },
    { label: "Legal & IPR Services", href: "/service/legal-ipr" },
    { label: "Tax & Compliance", href: "/service/tax-compliance" },
    { label: "Licensing & Certification", href: "/service/licensing-certification" },
    { label: "Accounting & Financial Services", href: "/service/accounting-financial" },
    { label: "Closure & Conversion", href: "/service/closure-conversion" },
    { label: "Consulting & Support", href: "/service/consulting-support" },
  ],
  },
  {
    label: "Project Reports",
    href: "/project-reports",
  },
  {
    label: "Scheme & Finance",
    href: "/gov-scheme",
  },

  {
    label: "Credit Score360°",
    href: "/credit-score",
  },
  {
    label: "Pay360°",
    href: "/martxpay",
  },
  {
    label: "Shop360°",
    href: "/shopping/products",
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const router = useRouter();
  const { items } = useWishlist();
  const { user, logout } = useAuth();
  const { items: cartItems } = useCart();

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&limit=5`);
          if (response.ok) {
            const data = await response.json();
            setSearchSuggestions(data.suggestions || []);
          } else {
            // Fallback suggestions
            const suggestions = [
              `${searchQuery} machines`,
              `${searchQuery} parts`,
              `${searchQuery} accessories`,
              `Used ${searchQuery} equipment`,
              `${searchQuery} manufacturers`,
            ];
            setSearchSuggestions(suggestions);
          }
        } catch (error) {
          console.error("Error fetching search suggestions:", error);
          setSearchSuggestions([]);
        }
      }, 300);
    } else {
      setSearchSuggestions([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        await router.push(
          `/products?search=${encodeURIComponent(searchQuery)}`
        );
        setSearchSuggestions([]);
        toast.success(`Searching for "${searchQuery}"`);
      } catch (error) {
        console.error("Error during search:", error);
        toast.error("Search failed. Please try again.");
      } finally {
        setIsSearching(false);
        if (isMenuOpen) setIsMenuOpen(false);
      }
    } else {
      toast.error("Please enter a search term.");
    }
  };

  const handleLogout = () => {
    logout();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
    toast.success("Logged out successfully");
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={cn(
          "sticky top-0 left-0 py-2 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-[#112239] text-white shadow-md"
            : "bg-[#292420] text-white"
        )}
      >
        <div className="container mx-auto px-4 sm:px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center space-x-2 mr-10 hover:opacity-90 transition-opacity"
              >
                <Image
                  src="/logo1.png"
                  alt="martXmart Logo"
                  width={100}
                  height={100}
                  className="h-10 w-10 rounded-full"
                />
              </Link>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-orange-400 transition-colors p-1 rounded-md hover:bg-white/10">
              <MapPin className="h-3.5 w-3.5 text-white" />
              <div className="leading-tight">
                <div className="text-xs text-gray-300">Deliver to</div>
                <div className="font-medium text-sm text-white">{location}</div>
              </div>
            </div>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center flex-1 max-w-2xl mx-4 relative"
            >
              <div className="relative w-full" ref={searchRef}>
                <Input
                  type="search"
                  placeholder="Search for machinery, spare parts, tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-10 rounded-lg border-2 border-transparent focus:border-orange-500 bg-white hover:ring-2 hover:ring-orange-300 transition-all"
                  disabled={isSearching}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {isSearching ? (
                    <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <Button
                  type="submit"
                  className="absolute right-0 top-0 h-full rounded-l-none bg-[#89211c] hover:bg-[#6d282a] transition-colors"
                  disabled={isSearching}
                >
                  Search
                </Button>
                {searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
                    <ScrollArea className="max-h-64">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-sm"
                          onClick={() => {
                            setSearchQuery(suggestion);
                            setSearchSuggestions([]);
                            router.push(`/products?search=${encodeURIComponent(suggestion)}`);
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </ScrollArea>
                  </div>
                )}
              </div>
            </form>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              {/* User Account */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/10 flex items-center space-x-1 h-auto py-1 rounded-md"
                    >
                      <div className="flex flex-col items-start leading-none">
                        <span className="text-xs text-gray-300">
                          Hi, {user.name}
                        </span>
                        <span className="font-medium">Account & Orders</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/account"
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>My Account</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 flex items-center space-x-1 h-auto py-1 rounded-md"
                  >
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-xs text-gray-300">
                        Login | Sign Up
                      </span>
                      <span className="font-medium">Account & Orders</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </Link>
              )}

              <Link href="/wishlist" className="relative">
                <Button
                  variant="ghost"
                  className="flex flex-col items-center gap-1 h-auto py-1 text-white hover:bg-white/10 rounded-md"
                >
                  <Heart className="h-5 w-5" />
                  <span className="text-xs">Wishlist</span>
                  {items.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[20px] h-5 bg-orange-600">
                      {items.length}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Link href="/cart" className="relative">
                <Button
                  variant="ghost"
                  className="flex flex-col items-center gap-1 h-auto py-1 text-white hover:bg-white/10 rounded-md"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-xs">Cart</span>
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[20px] h-5 bg-orange-600">
                      {cartItems.length}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button and Icons */}
            <div className="flex items-center md:hidden space-x-4">
              <Link href="/wishlist" className="relative text-white">
                <Heart className="h-5 w-5" />
                {items.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 py-0 min-w-[18px] h-4 text-xs bg-orange-600">
                    {items.length}
                  </Badge>
                )}
              </Link>
              <Link href="/cart" className="relative text-white">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 py-0 min-w-[18px] h-4 text-xs bg-orange-600">
                    {cartItems.length}
                  </Badge>
                )}
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 text-white rounded-md hover:bg-white/10"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="hidden lg:flex justify-center gap-4 py-3">
          {menuItems.map((item, index) =>
            item.dropdown ? (
              <DropdownMenu key={index}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-white hover:bg-orange-500/10 hover:text-orange-400 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200",
                      item.highlight &&
                        "bg-orange-500 hover:bg-orange-600 text-white"
                    )}
                    aria-expanded="false"
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 mt-1"
                  align="start"
                  side="bottom"
                >
                  <ScrollArea className="max-h-80">
                    <DropdownMenuGroup>
                      {item.dropdown.map((subItem, subIndex) => (
                        <DropdownMenuItem key={subIndex} asChild>
                          <Link
                            href={subItem.href}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/50 transition-colors duration-150"
                          >
                            {subItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : item.href ? (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={cn(
                  "text-white hover:bg-orange-500/10 hover:text-orange-400 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200",
                  item.highlight &&
                    "bg-orange-500 hover:bg-orange-600 text-white"
                )}
                asChild
              >
                <Link href={item.href} className="flex items-center">
                  {item.label}
                </Link>
              </Button>
            ) : null
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-md fixed top-16 left-0 right-0 z-40 max-h-[calc(100vh-4rem)] overflow-auto"
          >
            <div className="p-4 space-y-3">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <div className="relative w-full">
                  <Input
                    type="search"
                    placeholder="Search machinery, parts, tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-3 pr-10 h-9 rounded-full border-orange-300 focus:border-orange-500 dark:bg-gray-700 text-sm"
                    disabled={isSearching}
                  />
                  {isSearching ? (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600 animate-pulse">
                      Loading...
                    </span>
                  ) : (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  )}
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 p-0 text-gray-400 hover:text-orange-600"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      X
                    </Button>
                  )}
                </div>
                {searchSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700"
                  >
                    <ScrollArea className="max-h-64">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full px-4 py-2 text-left hover:bg-orange-50 dark:hover:bg-orange-900/50 transition-colors text-sm text-gray-700 dark:text-gray-200"
                          onClick={() => {
                            setSearchQuery(suggestion);
                            setSearchSuggestions([]);
                            router.push(`/products?search=${encodeURIComponent(suggestion)}`);
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </ScrollArea>
                  </motion.div>
                )}
              </form>

              {/* User Info */}
              {user ? (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="block w-full px-4 py-2 bg-orange-600 text-white rounded-full text-center font-medium text-sm hover:bg-orange-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}

              {/* Menu Items */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                {menuItems.map((item, index) => (
                  <Collapsible
                    key={index}
                    open={openCollapsible === item.label}
                    onOpenChange={() =>
                      setOpenCollapsible(
                        openCollapsible === item.label ? null : item.label
                      )
                    }
                  >
                    <CollapsibleTrigger
                      className={cn(
                        "flex items-center justify-between w-full py-2 text-gray-700 dark:text-gray-200 font-medium text-sm",
                        item.highlight && "text-orange-600"
                      )}
                    >
                      <span>{item.label}</span>
                      {item.dropdown && (
                        <span
                          className={cn(
                            "text-xs transition-transform",
                            openCollapsible === item.label && "rotate-90"
                          )}
                        >
                          {openCollapsible === item.label ? "▲" : "▼"}
                        </span>
                      )}
                    </CollapsibleTrigger>
                    {item.dropdown ? (
                      <CollapsibleContent className="pl-8 space-y-1">
                        {item.dropdown.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className="block text-sm text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/50 rounded-md px-3 py-1.5"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    ) : item.href ? (
                      <Link
                        href={item.href}
                        className="block text-sm text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/50 rounded-md px-3 py-1.5"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : null}
                  </Collapsible>
                ))}
              </div>

              {/* Quick Links */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between px-3 py-2 hover:bg-orange-50 dark:hover:bg-orange-900/50 rounded-md text-gray-700 dark:text-gray-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Wishlist</span>
                  {items.length > 0 && (
                    <Badge className="bg-orange-600 text-xs">
                      {items.length}
                    </Badge>
                  )}
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center justify-between px-3 py-2 hover:bg-orange-50 dark:hover:bg-orange-900/50 rounded-md text-gray-700 dark:text-gray-200 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Cart</span>
                  {cartItems.length > 0 && (
                    <Badge className="bg-orange-600 text-xs">
                      {cartItems.length}
                    </Badge>
                  )}
                </Link>
                {user && (
                  <>
                    <Link
                      href="/account"
                      className="block px-3 py-2 hover:bg-orange-50 dark:hover:bg-orange-900/50 rounded-md text-gray-700 dark:text-gray-200 text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-3 py-2 hover:bg-orange-50 dark:hover:bg-orange-900/50 rounded-md text-gray-700 dark:text-gray-200 text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-orange-50 dark:hover:bg-orange-900/50 rounded-md text-red-600 dark:text-red-400 text-sm"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
