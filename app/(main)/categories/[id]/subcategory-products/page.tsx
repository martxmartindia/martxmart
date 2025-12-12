'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
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
  description: string;
}

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

const SubcategoryProductsPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const subcategoryId = searchParams.get('subcategory');
  
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category data with subcategories
        const categoryResponse = await fetch(`/api/categories/${id}?type=MACHINE`);
        if (!categoryResponse.ok) {
          throw new Error(`Failed to fetch category: ${categoryResponse.statusText}`);
        }
        const categoryData = await categoryResponse.json();
        setCategory({ 
          id: id as string, 
          name: categoryData.categoryName, 
          subcategories: categoryData.subcategories 
        });

        // Find the selected subcategory
        const subcategory = categoryData.subcategories?.find((sub: Subcategory) => sub.id === subcategoryId);
        if (subcategory) {
          setSelectedSubcategory(subcategory);
        }

        // Fetch products for the subcategory
        if (subcategoryId) {
          const productsResponse = await fetch(`/api/categories/${id}/products?subcategory=${subcategoryId}`);
          if (!productsResponse.ok) {
            throw new Error(`Failed to fetch products: ${productsResponse.statusText}`);
          }
          const productsData = await productsResponse.json();
          setProducts(productsData.products || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id && subcategoryId) {
      fetchData();
    } else {
      setError('Invalid category or subcategory ID');
      setIsLoading(false);
    }
  }, [id, subcategoryId]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array(12).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-6 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !category || !selectedSubcategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || 'Category or subcategory not found'}</p>
          <div className="space-y-2">
            <Button onClick={() => window.location.reload()} className="bg-orange-600 hover:bg-orange-700">
              Try Again
            </Button>
            <div>
              <Button asChild variant="outline">
                <Link href={`/categories/${id}`}>Back to Category</Link>
              </Button>
            </div>
          </div>
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
            <Link href={`/categories/${id}`} className="hover:text-orange-600 transition-colors">{category.name}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{selectedSubcategory.name}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                {selectedSubcategory.name}
              </h1>
              {selectedSubcategory.description && (
                <p className="text-gray-600 text-lg max-w-3xl">{selectedSubcategory.description}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                asChild
                className="w-fit"
              >
                <Link href={`/categories/${id}`} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to {category.name}
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-fit"
              >
                <Link href="/categories" className="flex items-center gap-2">
                  All Categories
                </Link>
              </Button>
            </div>
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
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl"
              />
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                <span>{filteredProducts.length} products</span>
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

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <Package className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No products found' : 'No products available'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `No products match "${searchQuery}". Try a different search term.`
                : 'This subcategory doesn\'t have any products yet.'
              }
            </p>
            {searchQuery ? (
              <Button
                onClick={() => setSearchQuery('')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Show All Products
              </Button>
            ) : (
              <div className="space-x-2">
                <Button
                  asChild
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Link href={`/categories/${id}`}>Browse Other Subcategories</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                >
                  <Link href="/products">Browse All Products</Link>
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/products/${product.id}`}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Image
                        src={product.images?.[0] || '/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      />
                      {product.featured && (
                        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 border-0 shadow-lg">
                          Featured
                        </Badge>
                      )}
                      {product.discount && product.discount > 0 && (
                        <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                          -{product.discount}%
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-col text-sm mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-orange-600">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={product.stock > 0 ? "default" : "destructive"}
                          className={`text-xs ${product.stock > 0 ? "bg-green-100 text-green-800" : ""}`}
                        >
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                        
                        <div className="flex items-center text-orange-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubcategoryProductsPage;