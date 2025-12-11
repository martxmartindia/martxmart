"use client";

import React, { Suspense } from "react";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Heart,
  ShoppingCart,
  Filter,
  Grid,
  List,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  brand?: string;
  averageRating?: number;
  reviewCount?: number;
  category: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    shopping: number;
  };
}

interface SearchData {
  query: string;
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

 function SearchPageContent() {
  const searchParams = useSearchParams();
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      fetchSearchResults(query);
    }
    loadWishlist();
  }, [
    searchParams,
    selectedBrands,
    selectedCategories,
    priceRange,
    sortBy,
    sortOrder,
    currentPage,
  ]);

  const fetchSearchResults = async (query: string) => {
    setLoading(true);
    try {
      const searchParamsObj = new URLSearchParams();
      searchParamsObj.append("q", query);

      if (selectedBrands.length > 0) {
        selectedBrands.forEach((brand) =>
          searchParamsObj.append("brand", brand)
        );
      }
      if (selectedCategories.length > 0) {
        selectedCategories.forEach((categoryId) =>
          searchParamsObj.append("categoryId", categoryId)
        );
      }
      if (priceRange[0] > 0)
        searchParamsObj.append("minPrice", priceRange[0].toString());
      if (priceRange[1] < 10000)
        searchParamsObj.append("maxPrice", priceRange[1].toString());

      searchParamsObj.append("sortBy", sortBy);
      searchParamsObj.append("sortOrder", sortOrder);
      searchParamsObj.append("page", currentPage.toString());
      searchParamsObj.append("limit", "12");

      const response = await fetch(
        `/api/shopping/search?${searchParamsObj.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchData(data);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = () => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!session) {
      const newWishlist = wishlist.includes(productId)
        ? wishlist.filter((id) => id !== productId)
        : [...wishlist, productId];
      setWishlist(newWishlist);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      return;
    }

    try {
      if (wishlist.includes(productId)) {
        await fetch(`/api/shopping/wishlist?shoppingId=${productId}`, {
          method: "DELETE",
        });
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await fetch("/api/shopping/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shoppingId: productId }),
        });
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const addToCart = async (productId: string) => {
    if (!session) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      const response = await fetch("/api/shopping/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shoppingId: productId, quantity: 1 }),
      });

      if (response.ok) {
        alert("Added to cart successfully!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <div className="relative h-64">
          <Image
            src={product.images[0] || "/placeholder.svg?height=256&width=256"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.originalPrice && product.originalPrice > product.price && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
              {Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              )}
              % OFF
            </Badge>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="absolute top-12 right-2 bg-white hover:bg-gray-100 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart
            className={`h-4 w-4 ${
              wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div>
            <Badge variant="outline" className="text-xs mb-1">
              {product.category.name}
            </Badge>
            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 cursor-pointer">
                {product.name}
              </h3>
            </Link>
            {product.brand && (
              <p className="text-sm text-gray-600">{product.brand}</p>
            )}
          </div>

          {product.averageRating && (
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.averageRating || 0)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => addToCart(product.id)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search for products, brands and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 text-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
          />
          <Button
            type="submit"
            className="absolute right-1 top-1 bg-orange-500 hover:bg-orange-600 h-10 px-6"
          >
            Search
          </Button>
        </form>
      </div>

      {searchData && (
        <>
          {/* Results Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Search Results for "{searchData.query}"
                </h1>
                <p className="text-gray-600 mt-1">
                  {searchData.pagination.total} products found
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sort Options */}
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={(value) => {
                    const [field, order] = value.split("-");
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Filter className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Filters</h3>
                  </div>

                  {/* Categories */}
                  {searchData.filters.categories.length > 0 && (
                    <Collapsible defaultOpen className="mb-6">
                      <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                        <h4 className="font-medium">Categories</h4>
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {searchData.filters.categories.map((category) => (
                            <div
                              key={category.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={category.id}
                                checked={selectedCategories.includes(
                                  category.id
                                )}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCategories([
                                      ...selectedCategories,
                                      category.id,
                                    ]);
                                  } else {
                                    setSelectedCategories(
                                      selectedCategories.filter(
                                        (c) => c !== category.id
                                      )
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={category.id}
                                className="text-sm cursor-pointer flex-1"
                              >
                                {category.name} ({category._count.shopping})
                              </label>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Price Range */}
                  <Collapsible defaultOpen className="mb-6">
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                      <h4 className="font-medium">Price Range</h4>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3">
                      <Slider
                        value={priceRange}
                        onValueChange={(value) =>
                          setPriceRange([value[0], value[1]])
                        }
                        max={10000}
                        step={100}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Brands */}
                  {searchData.filters.brands.length > 0 && (
                    <Collapsible defaultOpen>
                      <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                        <h4 className="font-medium">Brands</h4>
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {searchData.filters.brands.map((brand) => (
                            <div
                              key={brand}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={brand}
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedBrands([
                                      ...selectedBrands,
                                      brand,
                                    ]);
                                  } else {
                                    setSelectedBrands(
                                      selectedBrands.filter((b) => b !== brand)
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={brand}
                                className="text-sm cursor-pointer"
                              >
                                {brand}
                              </label>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    className="w-full mt-6 bg-transparent"
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedCategories([]);
                      setPriceRange([0, 10000]);
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {searchData.products.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {searchData.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {searchData.pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-8">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>

                      {Array.from(
                        {
                          length: Math.min(5, searchData.pagination.totalPages),
                        },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          );
                        }
                      )}

                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentPage(
                            Math.min(
                              searchData.pagination.totalPages,
                              currentPage + 1
                            )
                          )
                        }
                        disabled={
                          currentPage === searchData.pagination.totalPages
                        }
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Searchpage(){
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}