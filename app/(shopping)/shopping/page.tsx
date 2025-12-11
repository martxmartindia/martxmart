'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ShoppingCart, ArrowRight, Gift, Sparkles, Clock, TrendingUp, Zap, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  averageRating?: number;
  reviewCount?: number;
  discount?: number;
  discountType?: string;
  brand?: string;
  category: {
    name: string;
    slug: string;
  };
  isFestival?: boolean;
  festivalType?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    shopping: number;
  };
}

interface HomeData {
  slides: any[];
  featuredCategories: Category[];
  bestSellingProducts: Product[];
  trendingProducts: Product[];
  dealOfTheDay: Product[];
  festivalProducts: Product[];
  newArrivals: Product[];
  featuredProducts: Product[];
}

export default function HomePage() {
  const { data: session } = useSession();
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchHomeData();
    loadWishlist();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (!homeData?.slides || homeData.slides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => prev === homeData.slides.length - 1 ? 0 : prev + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [homeData?.slides]); 

const fetchHomeData = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds

  try {
    const response = await fetch('/api/shopping/home?type=SHOP', {
      signal: controller.signal,
    });

    if (response.ok) {
      const data = await response.json();
      setHomeData(data);
    } else {
      console.error('Server returned:', response.status, response.statusText);
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timed out after 15 seconds');
    } else {
      console.error('Error fetching home data:', error);
    }
  } finally {
    clearTimeout(timeoutId);
    setLoading(false);
  }
};


  const loadWishlist = () => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!session) {
      // Handle guest wishlist
      const newWishlist = wishlist.includes(productId)
        ? wishlist.filter(id => id !== productId)
        : [...wishlist, productId];
      setWishlist(newWishlist);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return;
    }

    try {
      if (wishlist.includes(productId)) {
        await fetch(`/api/shopping/wishlist?shoppingId=${productId}`, {
          method: 'DELETE',
        });
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        await fetch('/api/shopping/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ shoppingId: productId }),
        });
        setWishlist(prev => [...prev, productId]);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const addToCart = async (productId: string) => {
    if (!session) {
      // Redirect to login
      // Handle guest cart using localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const existingItem = guestCart.find((item: any) => item.shoppingId === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        guestCart.push({
          shoppingId: productId,
          quantity: 1,
          addedAt: new Date().toISOString()
        });
      }
      
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      toast.success('Added to cart! Login to save your cart.');
      return;
    }

    try {
      const response = await fetch('/api/shopping/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shoppingId: productId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        // Show success message or update cart count
        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Link href={`/shopping/products/${product.id}`} className="block">
      <Card className="group overflow-hidden border-0 shadow-soft hover:shadow-large transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
        <div className="relative">
          <div className="relative h-64">
            <Image
              src={product.images[0] || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.discount && product.discount > 0 && (
              <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                {product.discount}% OFF
              </Badge>
            )}
            {product.isFestival && (
              <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                Festival Special
              </Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-12 right-2 bg-white hover:bg-gray-100 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
          >
            <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            <div>
              <Badge variant="outline" className="text-xs mb-1">
                {product.category.name}
              </Badge>
              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
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
                      className={`h-4 w-4 ${i < Math.floor(product.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviewCount || 0})</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product.id);
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const ProductSection = ({ 
    title, 
    products, 
    icon: Icon, 
    viewAllLink 
  }: { 
    title: string; 
    products: Product[]; 
    icon: any; 
    viewAllLink: string;
  }) => (
    <section className="py-4">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Icon className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-600">Handpicked products just for you</p>
            </div>
          </div>
          <Link href={viewAllLink}>
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!homeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Hero Slider */}
      {homeData.slides && homeData.slides.length > 0 ? (
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <div className="relative w-full h-full">
            {homeData.slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={slide.imageorVideo}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30" />
              </div>
            ))}
          </div>
          
          {/* Navigation Buttons */}
          {homeData.slides.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                onClick={() => setCurrentSlide(prev => prev === 0 ? homeData.slides.length - 1 : prev - 1)}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                onClick={() => setCurrentSlide(prev => prev === homeData.slides.length - 1 ? 0 : prev + 1)}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
          
          {/* Dots Indicator */}
          {homeData.slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {homeData.slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative container-custom py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-yellow-300" />
                    <span className="text-sm font-medium uppercase tracking-wide">Festival Special</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Your Shopping
                    <span className="block text-yellow-300">Destination</span>
                  </h1>
                </div>
                <p className="text-lg md:text-xl text-gray-100 max-w-lg">
                  Discover amazing deals across all categories. From daily essentials to festival specials, find everything at MartXMart.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/shopping/products">
                    <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold">
                      <Gift className="h-5 w-5 mr-2" />
                      Explore Festival Offers
                    </Button>
                  </Link>
                  <Link href="/shopping/category">
                    <Button size="lg" variant="destructive" className="border-white text-white hover:bg-white hover:text-orange-600">
                      Shop All Categories
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-3xl transform rotate-6 opacity-20"></div>
                  <Image
                    src="https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Festival Shopping"
                    width={500}
                    height={400}
                    className="relative rounded-3xl object-cover shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our diverse range of products across all categories
            </p>
          </div>
          <div className="flex overflow-x-scroll gap-4 pb-4 mx-4 px-4" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {homeData.featuredCategories.map((category, index) => {
              const colors = [
                'from-blue-500 to-purple-600',
                'from-green-500 to-teal-600', 
                'from-orange-500 to-red-600',
                'from-pink-500 to-rose-600',
                'from-indigo-500 to-blue-600',
                'from-yellow-500 to-orange-600'
              ];
              return (
                <Link key={category.id} href={`/shopping/category/${category.slug}`} className="group flex-shrink-0">
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-w-[90px] border border-gray-100">
                    <div className="p-4 text-center">
                      <div className={`w-14 h-14 mx-auto mb-3 bg-gradient-to-br ${colors[index % colors.length]} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Package className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors text-xs leading-tight line-clamp-2 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {category._count.shopping} items
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deal of the Day */}
      {homeData.dealOfTheDay.length > 0 && (
        <ProductSection
          title="Deal of the Day"
          products={homeData.dealOfTheDay}
          icon={Clock}
          viewAllLink="/shopping/deals"
        />
      )}

      {/* Best Selling Products */}
      {homeData.bestSellingProducts.length > 0 && (
        <ProductSection
          title="Best Selling"
          products={homeData.bestSellingProducts}
          icon={TrendingUp}
          viewAllLink="/shopping/best-selling"
        />
      )}

      {/* Trending Products */}
      {homeData.trendingProducts.length > 0 && (
        <section className="section-padding bg-gray-50">
          <ProductSection
            title="Trending Now"
            products={homeData.trendingProducts}
            icon={Zap}
            viewAllLink="shopping/trending"
          />
        </section>
      )}

      {/* Festival Products */}
      {homeData.festivalProducts.length > 0 && (
        <ProductSection
          title="Festival Collection"
          products={homeData.festivalProducts}
          icon={Sparkles}
          viewAllLink="/shopping/festival"
        />
      )}

      {/* New Arrivals */}
      {homeData.newArrivals.length > 0 && (
        <section className="section-padding bg-gray-50">
          <ProductSection
            title="New Arrivals"
            products={homeData.newArrivals}
            icon={Package}
            viewAllLink="/shopping/new-arrivals"
          />
        </section>
      )}
    </div>
  );
}
