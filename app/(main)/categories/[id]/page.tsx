'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft, Grid3X3, Package, Search, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface Subcategory {
  id: string;
  name: string;
  image: string;
  productCount: number;
  featured: boolean;
  description: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  subcategories: Subcategory[];
}

const CategoryDetailPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch(`/api/categories/${id}?type=MACHINE`);
        if (!response.ok) {
          throw new Error(`Failed to fetch category: ${response.statusText}`);
        }
        const data = await response.json();
        setCategory({ id: id as string, name: data.categoryName, subcategories: data.subcategories });
        const subs = Array.isArray(data.subcategories) ? data.subcategories : [];
        setSubcategories(subs);
        setFilteredSubcategories(subs);
      } catch (error) {
        console.error('Error fetching category:', error);
        toast.error('Failed to load category data');
        setError('Failed to load category data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCategoryData();
    } else {
      setError('Invalid category ID');
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSubcategories(subcategories);
    } else {
      const filtered = subcategories.filter(sub =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.description && sub.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredSubcategories(filtered);
    }
  }, [searchQuery, subcategories]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-10 w-80 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="mb-8">
            <Skeleton className="h-12 w-full max-w-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array(10).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-orange-600 hover:bg-orange-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb & Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/categories" className="hover:text-orange-600 transition-colors">Categories</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{category?.name}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                {category?.name}
              </h1>
              {category?.description && (
                <p className="text-gray-600 text-lg max-w-3xl">{category.description}</p>
              )}
            </div>
            
            <Button
              variant="outline"
              asChild
              className="w-fit"
            >
              <Link href="/categories" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Categories
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Search & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search subcategories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl"
              />
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                <span>{filteredSubcategories.length} subcategories</span>
              </div>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="text-orange-600 hover:text-orange-700"
                >
                  Clear search
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Subcategories Grid */}
        {filteredSubcategories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <Package className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No subcategories found' : 'No subcategories available'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `No subcategories match "${searchQuery}". Try a different search term.`
                : 'This category doesn\'t have any subcategories yet.'
              }
            </p>
            {searchQuery ? (
              <Button
                onClick={() => setSearchQuery('')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Show All Subcategories
              </Button>
            ) : (
              <Button
                asChild
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Link href={`/products?category=${id}`}>
                  Browse Products in This Category
                </Link>
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredSubcategories.map((subcategory, index) => (
              <motion.div
                key={subcategory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="space-y-3"
              >
                {/* Subcategory Card */}
                <Link href={`/categories/${id}/subcategory-products?subcategory=${subcategory.id}`}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1 cursor-pointer">
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Image
                        src={subcategory.image || '/placeholder.svg'}
                        alt={subcategory.name}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      />
                      {subcategory.featured && (
                        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 border-0 shadow-lg">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-5">
                      <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2 line-clamp-2">
                        {subcategory.name}
                      </h3>
                      
                      {subcategory.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {subcategory.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        {subcategory.productCount !== undefined && (
                          <span className="text-xs text-gray-500">
                            {subcategory.productCount} products
                          </span>
                        )}
                        
                        <div className="flex items-center text-orange-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Explore
                          <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                  >
                    <Link href={`/categories/${id}/subcategory-products?subcategory=${subcategory.id}`}>
                      <Eye className="h-3 w-3 mr-1" />
                      View All
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 text-xs bg-orange-600 hover:bg-orange-700"
                  >
                    <Link href={`/categories/${id}/subcategory-products?subcategory=${subcategory.id}`}>
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Shop Now
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailPage;