"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  Heart,
  Package,
  LogOut,
  Settings,
  Factory,
  Smartphone,
  Stethoscope,
  Briefcase,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { CategoryMegaMenu } from "@/components/category-mega-menu"
import { useAuth } from "@/store/auth"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const {user, logout, isLoading} = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (user) {
      fetchCartCount()
    }
  }, [user])

  const fetchCartCount = async () => {
    try {
      const response = await fetch("/api/cart")
      const data = await response.json()

      if (response.ok) {
        const count = data.items.reduce((total: number, item: any) => total + item.quantity, 0)
        setCartCount(count)
      }
    } catch (error) {
      console.error("Error fetching cart count:", error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const isAdmin = user?.role === "ADMIN"
  const isVendor = user?.role === "VENDOR"
  const isAuthor = user?.role === "AUTHOR"

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-orange-600">ShopEase</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                pathname === "/" ? "text-orange-600" : "text-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                pathname === "/products" || pathname.startsWith("/products/") ? "text-orange-600" : "text-gray-700"
              }`}
            >
              Products
            </Link>
            <Link
              href="/services"
              className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                pathname === "/services" || pathname.startsWith("/services/") ? "text-orange-600" : "text-gray-700"
              }`}
            >
              Services
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                pathname === "/blog" || pathname.startsWith("/blog/") ? "text-orange-600" : "text-gray-700"
              }`}
            >
              Blog
            </Link>
            <Link
              href="/franchise/apply"
              className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                pathname === "/franchise/apply" || pathname.startsWith("/franchise/")
                  ? "text-orange-600"
                  : "text-gray-700"
              }`}
            >
              Franchise
            </Link>

            {/* Categories Mega Menu */}
            <CategoryMegaMenu />
          </nav>

          {/* Search, Cart, and User */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-[200px] lg:w-[300px] h-9 pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            </form>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => router.push("/cart")}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-orange-600"
                  variant="default"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {!isLoading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-gray-100">
                        <User className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
                      <DropdownMenuSeparator />
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard">Admin Dashboard</Link>
                        </DropdownMenuItem>
                      )}
                      {isVendor && (
                        <DropdownMenuItem asChild>
                          <Link href="/vendor/dashboard">Vendor Dashboard</Link>
                        </DropdownMenuItem>
                      )}
                      {isAuthor && (
                        <DropdownMenuItem asChild>
                          <Link href="/author/dashboard">Author Dashboard</Link>
                        </DropdownMenuItem>
                      )}
                      {(isAdmin || isVendor || isAuthor) && <DropdownMenuSeparator />}
                      <DropdownMenuItem asChild>
                        <Link href="/account/dashboard" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>My Account</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account/orders" className="flex items-center">
                          <Package className="mr-2 h-4 w-4" />
                          <span>My Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account/wishlist" className="flex items-center">
                          <Heart className="mr-2 h-4 w-4" />
                          <span>Wishlist</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account/profile" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center text-red-600 focus:text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => router.push("/auth/login")}>
                    Sign In
                  </Button>
                )}
              </>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <Link href="/" className="flex items-center">
                      <span className="text-xl font-bold text-orange-600">ShopEase</span>
                    </Link>
                  </div>

                  <form onSubmit={handleSearch} className="relative mb-6">
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="w-full pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  </form>

                  <nav className="flex flex-col space-y-4">
                    <Link
                      href="/"
                      className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                        pathname === "/" ? "text-orange-600" : "text-gray-700"
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      href="/products"
                      className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                        pathname === "/products" || pathname.startsWith("/products/")
                          ? "text-orange-600"
                          : "text-gray-700"
                      }`}
                    >
                      Products
                    </Link>
                    <Link
                      href="/blog"
                      className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                        pathname === "/blog" || pathname.startsWith("/blog/") ? "text-orange-600" : "text-gray-700"
                      }`}
                    >
                      Blog
                    </Link>
                    <Link
                      href="/franchise/apply"
                      className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                        pathname === "/franchise/apply" || pathname.startsWith("/franchise/")
                          ? "text-orange-600"
                          : "text-gray-700"
                      }`}
                    >
                      Franchise
                    </Link>

                    <div className="py-2">
                      <p className="text-sm font-medium mb-2">Categories</p>
                      <div className="pl-4 flex flex-col space-y-2">
                        <Link
                          href="/products?category=electronics"
                          className="text-sm text-gray-700 hover:text-orange-600"
                        >
                          Electronics
                        </Link>
                        <Link
                          href="/products?category=clothing"
                          className="text-sm text-gray-700 hover:text-orange-600"
                        >
                          Clothing
                        </Link>
                        <Link href="/products?category=home" className="text-sm text-gray-700 hover:text-orange-600">
                          Home & Kitchen
                        </Link>
                        <Link href="/products?category=beauty" className="text-sm text-gray-700 hover:text-orange-600">
                          Beauty
                        </Link>
                        <Link href="/products?category=books" className="text-sm text-gray-700 hover:text-orange-600">
                          Books
                        </Link>
                      </div>
                    </div>
                  </nav>

                  <div className="mt-auto pt-6">
                    {!isLoading && (
                      <>
                        {user ? (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>

                            {isAdmin && (
                              <Link
                                href="/admin/dashboard"
                                className="flex items-center text-sm font-medium text-gray-700 hover:text-orange-600"
                              >
                                Admin Dashboard
                              </Link>
                            )}
                            {isVendor && (
                              <Link
                                href="/vendor/dashboard"
                                className="flex items-center text-sm font-medium text-gray-700 hover:text-orange-600"
                              >
                                Vendor Dashboard
                              </Link>
                            )}
                            {isAuthor && (
                              <Link
                                href="/author/dashboard"
                                className="flex items-center text-sm font-medium text-gray-700 hover:text-orange-600"
                              >
                                Author Dashboard
                              </Link>
                            )}

                            <Link
                              href="/account/dashboard"
                              className="flex items-center text-sm font-medium text-gray-700 hover:text-orange-600"
                            >
                              <User className="mr-2 h-4 w-4" />
                              <span>My Account</span>
                            </Link>
                            <Link
                              href="/account/orders"
                              className="flex items-center text-sm font-medium text-gray-700 hover:text-orange-600"
                            >
                              <Package className="mr-2 h-4 w-4" />
                              <span>My Orders</span>
                            </Link>
                            <Link
                              href="/account/wishlist"
                              className="flex items-center text-sm font-medium text-gray-700 hover:text-orange-600"
                            >
                              <Heart className="mr-2 h-4 w-4" />
                              <span>Wishlist</span>
                            </Link>
                            <Link
                              href="/cart"
                              className="flex items-center text-sm font-medium text-gray-700 hover:text-orange-600"
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              <span>Cart</span>
                              {cartCount > 0 && (
                                <Badge className="ml-2 bg-orange-600" variant="default">
                                  {cartCount}
                                </Badge>
                              )}
                            </Link>

                            <Button
                              variant="ghost"
                              className="w-full justify-start pl-0 text-red-600 hover:text-red-700 hover:bg-transparent"
                              onClick={handleLogout}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              <span>Logout</span>
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Button
                              className="w-full bg-orange-600 hover:bg-orange-700"
                              onClick={() => router.push("/auth/login")}
                            >
                              Sign In
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => router.push("/auth/register")}>
                              Create Account
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
