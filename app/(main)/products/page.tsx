"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Filter, 
  Grid3X3, 
  List, 
  Search,
  ChevronDown,
  X,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  featured?: boolean;
  images?: string[] | null;
  brand?: string | null;
  discount?: number | null;
  averageRating?: number;
  reviewCount?: number;
  category?: { 
    name: string; 
    id: string; 
    type: string;
    slug: string;
    parent?: { name: string; id: string; type: string; slug: string } | null;
  } | null;
  vendor?: { user: { name: string; email: string } } | null;
  description: string;
}

interface HierarchicalCategory {
  id: string;
  name: string;
  slug: string;
  type: string;
  parentId?: string;
  children: HierarchicalCategory[];
}

interface ProductsResponse {
  products: Product[];
  total: number;
  totalPages: number;
  filters: {
    brands: string[];
    categories: HierarchicalCategory[]; // Hierarchical categories
    mainCategories: { id: string; name: string; type: string; slug: string }[];
  };
}

const ProductCard = ({ product, view }: { product: Product; view: string }) => {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, hasItem: isInWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id, 1);
    toast.success(`${product.name} added to cart`);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "/placeholder.png",
      });
      toast.success(`${product.name} added to wishlist`);
    }
    setIsWishlisted(!isWishlisted);
  };

  const discountPercentage = product.discount || 
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  const getCategoryDisplay = () => {
    if (!product.category) return null;
    
    if (product.category.parent) {
      return `${product.category.parent.name} → ${product.category.name}`;
    }
    return product.category.name;
  };

  if (view === "list") {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-orange-200"
        whileHover={{ y: -2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href={`/products/${product.id}`}>
          <div className="flex flex-col sm:flex-row p-6">
            <div className="sm:w-1/4 relative">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-50">
                <Image
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                {discountPercentage > 0 && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                    -{discountPercentage}%
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="sm:w-3/4 sm:pl-6 mt-4 sm:mt-0 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    
                    {product.category && (
                      <Badge variant="outline" className="text-xs mb-2">
                        {getCategoryDisplay()}
                      </Badge>
                    )}
                    
                    {product.averageRating && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= (product.averageRating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product.reviewCount || 0} reviews)
                        </span>
                      </div>
                    )}
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {product.description}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-4"
                    onClick={toggleWishlist}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
                      }`}
                    />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-lg text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={product.stock > 0 ? "default" : "destructive"}
                      className={product.stock > 0 ? "bg-green-100 text-green-800" : ""}
                    >
                      {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                    </Badge>
                    
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 overflow-hidden"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          <div className="aspect-square relative bg-gray-50 rounded-t-xl overflow-hidden">
            <Image
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-contain p-2 sm:p-3 lg:p-4 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
            />
            
            {discountPercentage > 0 && (
              <Badge className="absolute top-3 left-3 bg-red-500 text-white shadow-lg">
                -{discountPercentage}%
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-2"
              onClick={toggleWishlist}
            >
              <Heart
                className={`h-4 w-4 ${
                  isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </Button>
          </div>
        </div>
        
        <div className="p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3">
          {product.category && (
            <Badge variant="outline" className="text-[10px] sm:text-xs px-1 py-0.5">
              {getCategoryDisplay()}
            </Badge>
          )}
          
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-xs sm:text-sm leading-tight group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          
          {product.averageRating && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
                      star <= (product.averageRating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] sm:text-xs text-gray-600">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-sm sm:text-lg font-bold text-orange-600">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between gap-1">
            <Badge
              variant={product.stock > 0 ? "default" : "destructive"}
              className={`text-[10px] sm:text-xs px-1 py-0.5 ${product.stock > 0 ? "bg-green-100 text-green-800" : ""}`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </Badge>
            
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-orange-500 hover:bg-orange-600 text-[10px] sm:text-xs px-2 py-1 h-6 sm:h-8"
            >
              <ShoppingCart className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
              <span className="hidden sm:inline">Add</span>
              <span className="sm:hidden">+</span>
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: { 
  categories: HierarchicalCategory[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategory = (category: HierarchicalCategory, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategory === category.id;

    return (
      <div key={category.id} className={level > 0 ? 'ml-4' : ''}>
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer py-1">
            <input
              type="radio"
              name="category"
              value={category.id}
              checked={isSelected}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="text-orange-600"
            />
            <span className="text-sm text-gray-700">{category.name}</span>
          </label>
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleCategory(category.id)}
            >
              <ChevronRight 
                className={`h-3 w-3 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`} 
              />
            </Button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-2 border-l border-gray-200 pl-2">
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="category"
          value=""
          checked={selectedCategory === ""}
          onChange={(e) => onCategoryChange("")}
          className="text-orange-600"
        />
        <span className="text-sm text-gray-700 font-medium">All Categories</span>
      </label>
      
      {categories.map(category => renderCategory(category))}
    </div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    priceRange: "",
    rating: "",
    inStock: false,
    includeOutOfStock: false,
    todaysDeals: false,
    discounts: [] as number[],
  });
  
  const [hierarchicalCategories, setHierarchicalCategories] = useState<HierarchicalCategory[]>([]);
  const [mainCategories, setMainCategories] = useState<any[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "24",
        sort: sortBy,
        ...(searchQuery && { search: searchQuery }),
        ...(filters.category && { category: filters.category }),
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.inStock && { inStock: "true" }),
        ...(filters.includeOutOfStock && { includeOutOfStock: "true" }),
        ...(filters.todaysDeals && { todaysDeals: "true" }),
        ...(filters.discounts.length > 0 && { discounts: filters.discounts.join(',') }),
      });

      console.log('Fetching products with search query:', searchQuery);
      const response = await fetch(`/api/products?${params}`);
      const data: ProductsResponse = await response.json();
      
      console.log('Products received:', data.products.length, 'Total:', data.total);
      setProducts(data.products);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      
      // Set hierarchical categories from API response
      if (data.filters.categories) {
        setHierarchicalCategories(data.filters.categories);
      }
      if (data.filters.mainCategories) {
        setMainCategories(data.filters.mainCategories);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSearchQuery = urlParams.get('search') || '';
      if (urlSearchQuery !== searchQuery) {
        setSearchQuery(urlSearchQuery);
      }
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortBy, searchQuery, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      priceRange: "",
      rating: "",
      inStock: false,
      includeOutOfStock: false,
      todaysDeals: false,
      discounts: [],
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-white shadow-sm border-b w-full">
        <div className="w-full px-2 sm:px-4 lg:px-6 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                {searchQuery ? `Search results for "${searchQuery}"` : "All Products"}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {total} products found
              </p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 w-full lg:w-auto lg:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 px-3 lg:px-4">
                <span className="hidden sm:inline">Search</span>
                <Search className="h-4 w-4 sm:hidden" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="w-full px-2 sm:px-4 lg:px-6 py-4 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 h-full">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2 h-10"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </Button>
          </div>

          {/* Filters Sidebar */}
          <div className={`w-full lg:w-1/4 xl:w-1/5 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border p-3 lg:p-4 xl:p-6 lg:sticky lg:top-4 max-h-[70vh] lg:max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Refine by
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-orange-600 hover:text-orange-700"
                >
                  Clear All
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Category Filter - Using Hierarchical Categories */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                  <CategoryFilter
                    categories={hierarchicalCategories}
                    selectedCategory={filters.category}
                    onCategoryChange={(categoryId) => setFilters(prev => ({ ...prev, category: categoryId }))}
                  />
                </div>

                {/* Customer Reviews */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Customer Reviews</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={filters.rating === rating.toString()}
                          onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                          className="text-orange-600"
                        />
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-700">& Up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Price</h3>
                  <div className="space-y-2 mb-4">
                    {[
                      { label: "Under ₹1,000", min: 0, max: 1000 },
                      { label: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
                      { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
                      { label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
                      { label: "Over ₹20,000", min: 20000, max: null }
                    ].map((range) => (
                      <label key={range.label} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="priceRange"
                          value={`${range.min}-${range.max || ''}`}
                          checked={filters.priceRange === `${range.min}-${range.max || ''}`}
                          onChange={(e) => {
                            setFilters(prev => ({ 
                              ...prev, 
                              priceRange: e.target.value,
                              minPrice: range.min.toString(),
                              maxPrice: range.max?.toString() || ''
                            }));
                          }}
                          className="text-orange-600"
                        />
                        <span className="text-sm text-gray-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex gap-2 mb-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value, priceRange: '' }))}
                        className="text-sm"
                      />
                      <span className="self-center text-gray-500">-</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value, priceRange: '' }))}
                        className="text-sm"
                      />
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      onClick={() => fetchProducts()}
                    >
                      Go
                    </Button>
                  </div>
                </div>

                {/* Deals & Discounts */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Deals & Discounts</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.todaysDeals}
                        onChange={(e) => setFilters(prev => ({ ...prev, todaysDeals: e.target.checked }))}
                        className="text-orange-600"
                      />
                      <span className="text-sm text-gray-700">Today's Deals</span>
                    </label>
                    {[
                      { label: "Discounts 10% Off or More", value: 10 },
                      { label: "Discounts 25% Off or More", value: 25 },
                      { label: "Discounts 50% Off or More", value: 50 }
                    ].map((discount) => (
                      <label key={discount.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.discounts.includes(discount.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({ 
                                ...prev, 
                                discounts: [...prev.discounts, discount.value]
                              }));
                            } else {
                              setFilters(prev => ({ 
                                ...prev, 
                                discounts: prev.discounts.filter(d => d !== discount.value)
                              }));
                            }
                          }}
                          className="text-orange-600"
                        />
                        <span className="text-sm text-gray-700">{discount.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.includeOutOfStock}
                      onChange={(e) => setFilters(prev => ({ ...prev, includeOutOfStock: e.target.checked }))}
                      className="text-orange-600"
                    />
                    <span className="text-sm text-gray-700">Include Out of Stock</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 lg:w-3/4 xl:w-4/5">
            {/* Controls */}
            <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border p-3 lg:p-4 mb-3 lg:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 lg:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">
                    Showing {products.length} of {total} products
                  </span>
                </div>
                
                <div className="flex items-center gap-2 lg:gap-3">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-28 sm:w-36 lg:w-40 text-xs sm:text-sm h-8 lg:h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* View Toggle */}
                  <div className="flex border rounded-md lg:rounded-lg">
                    <Button
                      variant={view === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setView("grid")}
                      className="rounded-r-none px-2 lg:px-3 h-8 lg:h-10"
                    >
                      <Grid3X3 className="h-3 w-3 lg:h-4 lg:w-4" />
                    </Button>
                    <Button
                      variant={view === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setView("list")}
                      className="rounded-l-none px-2 lg:px-3 h-8 lg:h-10"
                    >
                      <List className="h-3 w-3 lg:h-4 lg:w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className={view === "grid" 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 xl:gap-5"
                : "space-y-3 sm:space-y-4 lg:space-y-6"
              }>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3">
                      <Skeleton className="h-3 sm:h-4 w-full" />
                      <Skeleton className="h-3 sm:h-4 w-3/4" />
                      <Skeleton className="h-4 sm:h-6 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 lg:py-16 bg-white rounded-lg lg:rounded-xl shadow-sm border w-full">
                <div className="text-4xl lg:text-6xl mb-3 lg:mb-4">🔍</div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6">Try adjusting your search or filters</p>
                <Button onClick={clearFilters} className="bg-orange-500 hover:bg-orange-600 text-sm lg:text-base">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <motion.div 
                  className={view === "grid" 
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 xl:gap-5 w-full"
                    : "space-y-3 sm:space-y-4 lg:space-y-6 w-full"
                  }
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <ProductCard product={product} view={view} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 lg:mt-12 w-full">
                    <div className="flex items-center gap-1 lg:gap-2 overflow-x-auto pb-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="text-xs lg:text-sm px-2 lg:px-4 h-8 lg:h-10 whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                      </Button>
                      
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "outline"}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`text-xs lg:text-sm min-w-[32px] lg:min-w-[40px] h-8 lg:h-10 ${
                              pageNum === currentPage ? "bg-orange-600 hover:bg-orange-700" : ""
                            }`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="text-xs lg:text-sm px-2 lg:px-4 h-8 lg:h-10 whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Next</span>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;