"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu, X, Search, ShoppingCart, Heart, User, MapPin, 
  Loader2, ChevronDown, LogOut, Settings, Filter, Mic
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import EnhancedSearchBar from "@/components/search/EnhancedSearchBar";

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

export default function EnhancedNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside to close search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target || !(event.target as Element).closest('.search-container')) {
        setShowSearchBar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
    toast.success("Logged out successfully");
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-xs py-1 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span>📞 +91-9876543210</span>
            <span>✉️ support@martxmart.com</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Free Shipping on orders above ₹10,000</span>
            <Link href="/seller-resources" className="hover:text-orange-400">Become a Seller</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={cn(
        "sticky top-0 z-50 bg-white shadow-md transition-all duration-300",
        isScrolled && "shadow-lg"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="martXmart"
                width={40}
                height={40}
                className="rounded-full"
              />
              {/* <span className="font-bold text-xl text-gray-900 hidden sm:block">
                martXmart
              </span> */}
            </Link>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-6 search-container">
              <EnhancedSearchBar className="w-full" />
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* User Account */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-gray-500">Hello, {user.name}</div>
                        <div className="text-sm font-medium">Account</div>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/login">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <div className="text-left">
                      <div className="text-xs text-gray-500">Hello, Sign in</div>
                      <div className="text-sm font-medium">Account</div>
                    </div>
                  </Button>
                </Link>
              )}

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" className="relative p-3">
                  <Heart className="h-5 w-5" />
                  {wishlistItems.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-orange-600">
                      {wishlistItems.length}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" className="relative p-3">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-orange-600">
                      {cartItems.length}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearchBar(!showSearchBar)}
                className="p-2"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="sm" className="p-2">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-orange-600">
                      {cartItems.length}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {showSearchBar && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden pb-4 search-container"
              >
                <EnhancedSearchBar 
                  className="w-full" 
                  placeholder="Search products..."
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Categories Bar (Desktop) */}
        <div className="hidden lg:block border-t bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-6 py-3">
              {menuItems.map((item, index) => 
                item.dropdown ? (
                  <DropdownMenu key={index}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors h-auto p-2"
                      >
                        {item.label}
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64">
                      <ScrollArea className="max-h-80">
                        {item.dropdown.map((subItem, subIndex) => (
                          <DropdownMenuItem key={subIndex} asChild>
                            <Link
                              href={subItem.href}
                              className="text-sm px-4 py-2 hover:bg-orange-50"
                            >
                              {subItem.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </ScrollArea>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : item.href ? (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : null
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-xl md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* User Section */}
              <div className="p-4 border-b">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                ) : (
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>

              {/* Menu Items */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
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
                      {item.dropdown ? (
                        <>
                          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-gray-700 hover:text-orange-600 font-medium">
                            <span>{item.label}</span>
                            <ChevronDown className={cn(
                              "h-4 w-4 transition-transform",
                              openCollapsible === item.label && "rotate-180"
                            )} />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-4 space-y-1">
                            {item.dropdown.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                className="block py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded px-3"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </CollapsibleContent>
                        </>
                      ) : item.href ? (
                        <Link
                          href={item.href}
                          className="block py-3 text-gray-700 hover:text-orange-600 font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ) : null}
                    </Collapsible>
                  ))}
                  
                  <div className="border-t pt-4 mt-4 space-y-2">
                    <Link
                      href="/wishlist"
                      className="flex items-center justify-between py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Wishlist</span>
                      {wishlistItems.length > 0 && (
                        <Badge className="bg-orange-600">{wishlistItems.length}</Badge>
                      )}
                    </Link>
                    
                    {user && (
                      <>
                        <Link
                          href="/account"
                          className="block py-2 text-gray-700"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link
                          href="/orders"
                          className="block py-2 text-gray-700"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        <button
                          className="block w-full text-left py-2 text-red-600"
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
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}