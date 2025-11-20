"use client";

import type React from "react";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import SpecialDealsNew from "@/components/products/ProductSpecialCard";
import {
  Star,
  Heart,
  ChevronRight,
  ChevronLeft,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Clock,
  Eye,
  Share2,
  Filter,
  Grid3X3,
  List,
  ArrowUp,
} from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/store/cart";
import { HeroSlider, CategoryShowcase, IndustrySolutions, ServicesSection, StatsSection } from "@/components/Home";
import { motion } from "framer-motion";

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  images: string[];
  category: {
    name: string;
  };
  averageRating?: number;
  reviewCount?: number;
  discount?: number;
  discountType?: "PERCENTAGE" | "FIXED";
  discountStartDate?: string;
  discountEndDate?: string;
  isFestival?: boolean;
};

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, hasItem: isInWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      await addItem(product.id, 1);
      toast.success(`${product.name} added to cart`, {
        description: "Item successfully added to your cart",
        action: {
          label: "View Cart",
          onClick: () => window.location.href = "/cart"
        }
      });
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        toast.success(`Removed from wishlist`, {
          description: `${product.name} has been removed from your wishlist`
        });
      } else {
        await addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
        });
        toast.success(`Added to wishlist`, {
          description: `${product.name} has been saved to your wishlist`
        });
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const discountPercentage = product.discount && product.discountType === "PERCENTAGE"
    ? product.discount
    : product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-orange-200 backdrop-blur-sm"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      role="article"
      aria-label={`Product: ${product.name}`}
    >
      <div className="relative">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative h-36 sm:h-44 md:h-48 lg:h-52 overflow-hidden rounded-t-xl bg-gray-100">
            <Image
              src={!imageError && product.images[0] ? product.images[0] : "/placeholder-product.jpg"}
              alt={product.name}
              fill
              sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              quality={80}
              priority={false}
              onError={() => setImageError(true)}
            />
            
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Top badges row with better positioning */}
            <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-20">
              {product.isFestival && (
                <Badge className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0 text-xs font-bold shadow-lg px-2 py-1 animate-pulse">
                  <Sparkles className="h-3 w-3 mr-1" />
                  <span className="hidden xs:inline">Festival Special</span>
                  <span className="xs:hidden">🎉</span>
                </Badge>
              )}
              {savings > 0 && (
                <Badge className="bg-green-500 text-white text-xs font-medium shadow-md px-2 py-0.5">
                  Save ₹{savings.toLocaleString()}
                </Badge>
              )}
            </div>

            {/* Enhanced discount badge */}
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold shadow-lg px-2 py-1 z-20">
                -{discountPercentage}% OFF
              </Badge>
            )}

            {/* Action buttons overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-sm z-10">
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(`/products/${product.id}`, '_blank');
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
                  onClick={toggleWishlist}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                </Button>
              </div>
            </div>

            {/* Mobile wishlist button */}
            {/* <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-12 bg-white/90 hover:bg-white shadow-md sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full p-2 backdrop-blur-sm z-20 sm:hidden"
              onClick={toggleWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </Button> */}
          </div>
        </Link>
      </div>
      
      <div className="p-3 sm:p-4 space-y-3">
        {/* Category and Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-50 px-2 py-0.5 font-medium">
              {product.category.name}
            </Badge>
            {product.averageRating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600 font-medium">
                  {product.averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 text-sm sm:text-base leading-tight min-h-[2.5rem] sm:min-h-[3rem]">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Enhanced rating display */}
        {product.averageRating && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(product.averageRating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {product.reviewCount || 0} reviews
            </span>
          </div>
        )}

        {/* Enhanced price display */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              ₹{Number(product.price).toLocaleString()}
            </span>
            {discountPercentage > 0 && product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{Number(product.originalPrice).toLocaleString()}
              </span>
            )}
          </div>
          {savings > 0 && (
            <p className="text-xs text-green-600 font-medium">
              You save ₹{savings.toLocaleString()}
            </p>
          )}
        </div>

        {/* Enhanced action button */}
        <Button
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 shadow-md hover:shadow-lg transition-all duration-300 group/btn"
          onClick={handleAddToCart}
          disabled={isLoading}
          aria-label={`Add ${product.name} to cart`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Adding...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
              <span>Add to Cart</span>
            </div>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <motion.div 
      className="flex flex-col sm:flex-row items-center justify-center mt-12 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page info for mobile */}
      <div className="text-sm text-gray-600 sm:hidden">
        Page {currentPage} of {totalPages}
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed px-2 sm:px-3 py-2 transition-colors duration-200"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Previous</span>
        </Button>
        
        <div className="hidden sm:flex items-center gap-1">
          {getVisiblePages().map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`dots-${index}`} className="px-2 py-2 text-gray-500">
                  ...
                </span>
              );
            }
            
            return (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? "default" : "outline"}
                onClick={() => onPageChange(pageNum as number)}
                className={pageNum === currentPage 
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 min-w-[40px] h-10 shadow-md" 
                  : "border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300 min-w-[40px] h-10 transition-colors duration-200"
                }
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed px-2 sm:px-3 py-2 transition-colors duration-200"
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Page info for desktop */}
      <div className="hidden sm:block text-sm text-gray-600">
        Showing page {currentPage} of {totalPages}
      </div>
    </motion.div>
  );
};

// Enhanced Loading Skeleton for Home Page
const HomeProductSkeleton = () => (
  <div className="animate-pulse rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
    <div className="relative">
      <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-36 sm:h-44 md:h-48 lg:h-52 rounded-t-xl"></div>
      {/* Skeleton badges */}
      <div className="absolute top-2 left-2">
        <div className="h-5 w-16 bg-gray-300 rounded-full"></div>
      </div>
      <div className="absolute top-2 right-2">
        <div className="h-5 w-12 bg-gray-300 rounded-full"></div>
      </div>
    </div>
    <div className="p-3 sm:p-4 space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-8"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 w-3 bg-gray-200 rounded-full"></div>
          ))}
        </div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
    </div>
  </div>
);

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/products/featured?page=${page}&limit=${productsPerPage}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-600 text-sm sm:text-base">Discover our hand-picked selection of quality products</p>
          </div>
          <Link
            href="/products"
            className="text-orange-600 hover:text-orange-700 font-semibold flex items-center text-sm sm:text-base lg:text-lg transition-colors duration-200 group"
          >
            View All 
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
        
        {loading ? (
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 xs:gap-3 sm:gap-4 lg:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <HomeProductSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <motion.div 
            className="text-center py-12 sm:py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-4xl sm:text-5xl">😔</div>
              <p className="text-red-600 text-lg font-medium">{error}</p>
              <Button
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50"
                onClick={() => setPage(1)}
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div 
            className="text-center py-12 sm:py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">
              <div className="text-4xl sm:text-5xl">📦</div>
              <p className="text-gray-600 text-lg font-medium">No featured products available</p>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 xs:gap-3 sm:gap-4 lg:gap-5"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </section>
  );
};


const TrendingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/products/trending?page=${page}&limit=${productsPerPage}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching trending products:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Trending Now</h2>
            <p className="text-gray-600 text-sm sm:text-base">Popular products that everyone is talking about</p>
          </div>
          <Link
            href="/products?sort=trending"
            className="text-orange-600 hover:text-orange-700 font-semibold flex items-center text-sm sm:text-base lg:text-lg transition-colors duration-200 group"
          >
            View All 
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
        
        {loading ? (
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 xs:gap-3 sm:gap-4 lg:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <HomeProductSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <motion.div 
            className="text-center py-12 sm:py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-4xl sm:text-5xl">🔥</div>
              <p className="text-red-600 text-lg font-medium">{error}</p>
              <Button
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50"
                onClick={() => setPage(1)}
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div 
            className="text-center py-12 sm:py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">
              <div className="text-4xl sm:text-5xl">📈</div>
              <p className="text-gray-600 text-lg font-medium">No trending products available</p>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 xs:gap-3 sm:gap-4 lg:gap-5"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </section>
  );
};

// Scroll to top component
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      className={`fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={scrollToTop}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </motion.button>
  );
};

// Enhanced error fallback
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="text-center max-w-md">
      <div className="text-6xl mb-4">😵</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-6">We're sorry for the inconvenience. Please try refreshing the page.</p>
      <div className="space-y-3">
        <Button onClick={resetErrorBoundary} className="bg-orange-500 hover:bg-orange-600 text-white">
          Try Again
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Go Home
        </Button>
      </div>
    </div>
  </div>
);

// Enhanced loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-orange-300 rounded-full animate-ping mx-auto"></div>
      </div>
      <p className="text-gray-600 font-medium">Loading amazing products...</p>
    </div>
  </div>
);

export default function HomePage() {
  return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative">
        <Suspense fallback={<PageLoader />}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSlider />
            <CategoryShowcase />
            <TrendingProducts />
            <FeaturedProducts />
            <SpecialDealsNew />
            <IndustrySolutions />
            <ServicesSection />
            <StatsSection />
          </motion.div>
        </Suspense>
        <ScrollToTop />
      </main>
  );
}