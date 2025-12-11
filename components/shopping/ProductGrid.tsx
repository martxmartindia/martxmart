'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ShoppingCart } from 'lucide-react';
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
  brand?: string;
  category: {
    name: string;
  };
}

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { data: session } = useSession();

  const addToCart = async (productId: string) => {
    if (!session) {
      window.location.href = '/auth/login';
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
        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const toggleWishlist = (productId: string) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/shopping/products/${product.id}`} className="block">
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
      ))}
    </div>
  );
}