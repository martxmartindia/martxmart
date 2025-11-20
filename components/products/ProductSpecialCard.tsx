"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {  HeartIcon, StarIcon, Sparkles, Star, ShoppingCart, Eye, TrendingUp, Zap, Timer, Gift, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '@/store/cart';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/store/wishlist';
import { motion } from 'framer-motion';

interface ApiProduct {
  id: string;
  name: string;
  price: number;
    category: {
    name: string;
  };
  originalPrice?: number | null;
  discount?: number | null;
  images: string[];
  averageRating?: number;
  reviewCount?: number;
  slug?: string | null;
  discountEndDate?: string | null;
  isFestival?: boolean;
}

interface SpecialProductsResponse {
  newArrivals: ApiProduct[];
  bestSellers: ApiProduct[];
  flashSales: ApiProduct[];
  specialDeals: ApiProduct[];
}

const ProductCard = ({ product }: { product: ApiProduct }) => {
  const { addItem } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    hasItem: isInWishlist,
  } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  // Countdown timer for flash sales
  useEffect(() => {
    if (product.discountEndDate) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(product.discountEndDate!).getTime();
        const distance = endTime - now;

        if (distance > 0) {
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft('Expired');
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [product.discountEndDate]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      await addItem(product.id, 1);
      toast.success(`${product.name} added to cart`, {
        description: 'Item successfully added to your cart',
        action: {
          label: 'View Cart',
          onClick: () => window.location.href = '/cart'
        }
      });
    } catch (error) {
      toast.error('Failed to add item to cart');
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
        toast.success('Removed from wishlist', {
          description: `${product.name} has been removed from your wishlist`
        });
      } else {
        await addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || '/placeholder.png',
        });
        toast.success('Added to wishlist', {
          description: `${product.name} has been saved to your wishlist`
        });
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const discountPercentage = product.discount
    ? Math.round(product.discount)
    : product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  const isFlashSale = product.discountEndDate && new Date(product.discountEndDate) > new Date();
  const isNewArrival = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) < new Date(); // Last 7 days

  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-300 backdrop-blur-sm"
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      role="article"
      aria-label={`Product: ${product.name}`}
    >
      <div className="relative">
        <Link href={`/products/${product.id || product.id}`} className="block">
          <div className="relative h-40 sm:h-48 md:h-52 lg:h-56 overflow-hidden rounded-t-xl bg-gray-100">
            <Image
              src={!imageError && product.images[0] ? product.images[0] : '/placeholder.png'}
              alt={product.name}
              fill
              sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              quality={80}
              priority={false}
              onError={() => setImageError(true)}
            />
            
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Top badges with better positioning */}
            <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-20">
              {product.isFestival && (
                <Badge className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0 text-xs font-bold shadow-lg px-2 py-1 animate-pulse">
                  <Gift className="h-3 w-3 mr-1" />
                  <span className="hidden xs:inline">Festival Special</span>
                  <span className="xs:hidden">🎉</span>
                </Badge>
              )}
              {isNewArrival && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-medium shadow-md px-2 py-0.5">
                  <Sparkles className="h-3 w-3 mr-1" />
                  New
                </Badge>
              )}
              {savings > 0 && (
                <Badge className="bg-blue-500 text-white text-xs font-medium shadow-md px-2 py-0.5">
                  Save ₹{savings.toLocaleString()}
                </Badge>
              )}
            </div>

            {/* Enhanced discount badge */}
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold shadow-lg px-2 py-1 z-20">
                -{discountPercentage}% OFF
              </Badge>
            )}

            {/* Flash sale timer */}
            {isFlashSale && timeLeft && timeLeft !== 'Expired' && (
              <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
                <Timer className="h-3 w-3" />
                {timeLeft}
              </div>
            )}

            {/* Action buttons overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30 backdrop-blur-sm z-10">
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(`/products/${product.slug || product.id}`, '_blank');
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
                  onClick={toggleWishlist}
                >
                  <HeartIcon className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                </Button>
                
              </div>
            </div>

            {/* Mobile wishlist button */}
            {/* <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-12 bg-white/90 hover:bg-white shadow-md sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full p-2 backdrop-blur-sm z-20 sm:hidden"
              onClick={toggleWishlist}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <HeartIcon className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
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
          
          <Link href={`/products/${product.slug || product.id}`} className="block">
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
                <StarIcon
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(product.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
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
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {discountPercentage > 0 && product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {savings > 0 && (
            <p className="text-xs text-green-600 font-medium">
              You save ₹{savings.toLocaleString()}
            </p>
          )}
        </div>

        {/* Enhanced countdown timer */}
        {isFlashSale && timeLeft && timeLeft !== 'Expired' && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-red-600">
                <Zap className="h-3 w-3" />
                <span className="text-xs font-medium">Flash Sale</span>
              </div>
              <div className="flex items-center gap-1 text-red-700">
                <Timer className="h-3 w-3" />
                <span className="text-xs font-bold">{timeLeft}</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced action button */}
        <Button
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 shadow-md hover:shadow-lg transition-all duration-300 group/btn"
          onClick={handleAddToCart}
          disabled={isLoading}
          aria-label={`Add ${product.name} to cart`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
              <span>Add to Cart</span>
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </div>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

const ProductSection = ({
  title,
  products,
}: {
  title: string;
  products: ApiProduct[];
}) => {
  if (!products.length) return null;

  const getSectionIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'new arrivals': return <Sparkles className="h-5 w-5" />;
      case 'best sellers': return <TrendingUp className="h-5 w-5" />;
      case 'flash sales': return <Zap className="h-5 w-5" />;
      case 'special deals': return <Gift className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const getSectionColor = (title: string) => {
    switch (title.toLowerCase()) {
      case 'new arrivals': return 'from-green-500 to-emerald-600';
      case 'best sellers': return 'from-blue-500 to-blue-600';
      case 'flash sales': return 'from-red-500 to-red-600';
      case 'special deals': return 'from-purple-500 to-purple-600';
      default: return 'from-orange-500 to-orange-600';
    }
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-r ${getSectionColor(title)} text-white shadow-lg`}>
                {getSectionIcon(title)}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {title}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
              {title === 'New Arrivals' && 'Fresh products just added to our collection'}
              {title === 'Best Sellers' && 'Most popular products loved by our customers'}
              {title === 'Flash Sales' && 'Limited time offers with incredible discounts'}
              {title === 'Special Deals' && 'Exclusive deals and amazing offers just for you'}
            </p>
          </div>
          
          <Link
            href={`/products?category=${title.toLowerCase().replace(' ', '-')}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            View All
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {products.slice(0, 12).map((product, index) => (
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
        
        {products.length > 12 && (
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Link
              href={`/products?category=${title.toLowerCase().replace(' ', '-')}`}
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium bg-orange-50 hover:bg-orange-100 px-6 py-3 rounded-lg transition-colors duration-300"
            >
              View {products.length - 12} More Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

// Enhanced Loading Skeleton Component
const ProductSkeleton = () => (
  <div className="animate-pulse rounded-xl bg-white shadow-md border border-gray-100 overflow-hidden">
    <div className="relative">
      <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-40 sm:h-48 md:h-52 lg:h-56 rounded-t-xl"></div>
      {/* Skeleton badges */}
      <div className="absolute top-2 left-2 space-y-1">
        <div className="h-5 w-16 bg-gray-300 rounded-full"></div>
        <div className="h-4 w-12 bg-gray-300 rounded-full"></div>
      </div>
      <div className="absolute top-2 right-2">
        <div className="h-6 w-14 bg-gray-300 rounded-lg"></div>
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
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
    </div>
  </div>
);

const LoadingSection = ({ title }: { title: string }) => {
  const getSectionIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'new arrivals': return <Sparkles className="h-5 w-5" />;
      case 'best sellers': return <TrendingUp className="h-5 w-5" />;
      case 'flash sales': return <Zap className="h-5 w-5" />;
      case 'special deals': return <Gift className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const getSectionColor = (title: string) => {
    switch (title.toLowerCase()) {
      case 'new arrivals': return 'from-green-500 to-emerald-600';
      case 'best sellers': return 'from-blue-500 to-blue-600';
      case 'flash sales': return 'from-red-500 to-red-600';
      case 'special deals': return 'from-purple-500 to-purple-600';
      default: return 'from-orange-500 to-orange-600';
    }
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-r ${getSectionColor(title)} text-white shadow-lg animate-pulse`}>
                {getSectionIcon(title)}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {title}
              </h2>
            </div>
            <div className="h-5 bg-gray-200 rounded w-80 animate-pulse"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default function SpecialDealsNew() {
  const [data, setData] = useState<SpecialProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpecialProducts() {
      try {
        const res = await fetch('/api/products/special-deal', {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        const result: SpecialProductsResponse = await res.json();
        setData(result);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchSpecialProducts();
  }, []);

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <LoadingSection title="New Arrivals" />
        <LoadingSection title="Best Sellers" />
        <LoadingSection title="Flash Sales" />
        <LoadingSection title="Special Deals" />
      </main>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 bg-red-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-orange-400 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <motion.div 
          className="text-center space-y-6 max-w-lg relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-8xl mb-4">😔</div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900">Oops! Something went wrong</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {error || 'No products available at the moment. Please check back later.'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-3"
            >
              Go Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {data.newArrivals.length > 0 && (
          <ProductSection title="New Arrivals" products={data.newArrivals} />
        )}
        {data.bestSellers.length > 0 && (
          <ProductSection title="Best Sellers" products={data.bestSellers} />
        )}
        {data.flashSales.length > 0 && (
          <ProductSection title="Flash Sales" products={data.flashSales} />
        )}
        {data.specialDeals.length > 0 && (
          <ProductSection title="Special Deals" products={data.specialDeals} />
        )}
        
        {/* Empty state if no products in any category */}
        {!data.newArrivals.length && !data.bestSellers.length && !data.flashSales.length && !data.specialDeals.length && (
          <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <motion.div 
              className="text-center space-y-6 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold text-gray-900">No Products Available</h2>
              <p className="text-gray-600 text-lg">
                We're working hard to bring you amazing products. Check back soon!
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Explore Other Sections
              </Button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </main>
  );
}