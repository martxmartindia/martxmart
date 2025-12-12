"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingCart, Filter, Grid, List, ChevronDown, Search, X, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  brand?: string;
  averageRating?: number;
  reviewCount?: number;
  stock: number;
  category: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface CategoryData {
  category: Category;
  products: Product[];
  filters: {
    brands: string[];
    categories: Category[];
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function CategoryPage() {
  const params = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const fetchCategoryData = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      if (selectedBrands.length > 0) {
        selectedBrands.forEach((brand) => searchParams.append("brand", brand));
      }
      if (priceRange[0] > 0) searchParams.append("minPrice", priceRange[0].toString());
      if (priceRange[1] < 100000) searchParams.append("maxPrice", priceRange[1].toString());
      if (searchQuery) searchParams.append("search", searchQuery);
      searchParams.append("sortBy", sortBy);
      searchParams.append("sortOrder", sortOrder);
      searchParams.append("page", currentPage.toString());
      searchParams.append("limit", "12");

      const response = await fetch(`/api/shopping/categories/${slug}?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();
      setCategoryData(data);
    } catch (error) {
      console.error("Error fetching category data:", error);
      setError("Failed to load category data. Please try again.");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [selectedBrands, priceRange, sortBy, sortOrder, currentPage, searchQuery]);

  useEffect(() => {
    if (params.slug) {
      const timeoutId = setTimeout(() => {
        fetchCategoryData(params.slug as string);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
    loadWishlist();
  }, [params.slug, fetchCategoryData]);

  const loadWishlist = () => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  };

  const toggleWishlist = async (productId: string) => {
    const isInWishlist = wishlist.includes(productId);
    const newWishlist = isInWishlist
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));

    if (session) {
      try {
        if (isInWishlist) {
          await fetch(`/api/shopping/wishlist?shoppingId=${productId}`, {
            method: "DELETE",
          });
          toast.success("Removed from wishlist");
        } else {
          await fetch("/api/shopping/wishlist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ shoppingId: productId }),
          });
          toast.success("Added to wishlist");
        }
      } catch (error) {
        console.error("Error updating wishlist:", error);
        setWishlist(wishlist);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        toast.error("Failed to update wishlist");
      }
    } else {
      toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
    }
  };

  const addToCart = async (productId: string) => {
    if (!session) {
      toast.error("Please login to add items to cart");
      router.push("/auth/login");
      return;
    }

    setAddingToCart(productId);
    try {
      const response = await fetch("/api/shopping/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shoppingId: productId, quantity: 1 }),
      });

      if (response.ok) {
        toast.success("Added to cart successfully!");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 100000]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">Search Products</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={100000}
            min={0}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Brands */}
      {categoryData?.filters.brands && categoryData.filters.brands.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Brands</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categoryData.filters.brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={brand}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedBrands([...selectedBrands, brand]);
                    } else {
                      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
                    }
                    setCurrentPage(1);
                  }}
                />
                <label htmlFor={brand} className="text-sm text-gray-700 cursor-pointer">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        <X className="h-4 w-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  );

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      <div className="relative">
        <div className="relative h-64 bg-gray-50">
          <Image
            src={product.images?.[0] || "/placeholder.png"}
            alt={`${product.name} - Product image`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.originalPrice && product.originalPrice > product.price && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">Out of Stock</Badge>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="absolute top-12 right-3 bg-white hover:bg-gray-100 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full w-10 h-10 p-0"
          onClick={() => toggleWishlist(product.id)}
          aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </Button>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <Link href={`/shopping/products/${product.id}`}>
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 cursor-pointer text-sm leading-tight">
              {product.name}
            </h3>
          </Link>
          {product.brand && <p className="text-xs text-gray-500 mt-1">{product.brand}</p>}
        </div>

        {product.averageRating && product.reviewCount && product.reviewCount > 0 && (
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(product.averageRating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.reviewCount})</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200" 
          onClick={() => addToCart(product.id)}
          disabled={product.stock === 0 || addingToCart === product.id}
        >
          {addingToCart === product.id ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ShoppingCart className="h-4 w-4 mr-2" />
          )}
          {addingToCart === product.id ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="h-64 bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Category not found</h2>
          <p className="text-gray-600 mb-6">{error || "The category you're looking for doesn't exist."}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.back()} variant="outline" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Link href="/shopping/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-600 mb-6 bg-white rounded-lg px-4 py-3 shadow-sm">
          <Link href="/shopping" className="hover:text-orange-600 transition-colors">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/shopping/products" className="hover:text-orange-600 transition-colors">Products</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-orange-600 font-medium">{categoryData.category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryData.category.name}</h1>
              {categoryData.category.description && (
                <p className="text-gray-600">{categoryData.category.description}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {categoryData.pagination.total} products found
              </p>
            </div>
            
            {/* View Toggle & Sort */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-md"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-md"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [newSortBy, newSortOrder] = value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <FilterSection />
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="lg:hidden">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full mb-6">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSection />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {categoryData.products.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1"
                }`}>
                  {categoryData.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {categoryData.pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, categoryData.pagination.totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => setCurrentPage(page)}
                            className="w-10 h-10 p-0"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(categoryData.pagination.totalPages, currentPage + 1))}
                      disabled={currentPage === categoryData.pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}