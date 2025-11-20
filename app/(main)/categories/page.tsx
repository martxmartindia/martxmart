"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Grid3X3, List, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories?type=MACHINE");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredCategories = filteredCategories.filter(
    (category) => category.featured
  );
  const regularCategories = filteredCategories.filter(
    (category) => !category.featured
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 lg:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Explore Categories
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our comprehensive range of industrial machinery and equipment.
              Find the perfect category for your business needs.
            </p>
          </motion.div>
        </div>

        {/* Search & Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 md:p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-12 px-4"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-12 px-4"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {searchQuery && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Showing results for: <strong>{searchQuery}</strong>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-orange-600 hover:text-orange-700"
              >
                Clear
              </Button>
            </div>
          )}
        </motion.div>

        {/* Featured Categories */}
        {featuredCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <Star className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Featured Categories
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading
                ? Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <Card key={index} className="overflow-hidden">
                        <Skeleton className="h-[220px] w-full" />
                        <CardContent className="p-6">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full mb-4" />
                          <Skeleton className="h-4 w-1/4" />
                        </CardContent>
                      </Card>
                    ))
                : featuredCategories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Link href={`/products?category=${category.id}`}>
                        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer border-0 shadow-lg hover:-translate-y-1">
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 border-0 shadow-lg">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                              {category.name}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {category.description?.length > 120
                                ? `${category.description.slice(0, 120)}...`
                                : category.description}
                            </p>
                            <div className="flex items-center mt-4 text-orange-600 font-medium text-sm">
                              Explore Category
                              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
            </div>
          </motion.div>
        )}

        {/* All Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {searchQuery ? 'Search Results' : 'All Categories'}
            </h2>
            <div className="text-sm text-gray-500">
              {filteredCategories.length} categories found
            </div>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading
                ? Array(12)
                    .fill(0)
                    .map((_, index) => (
                      <Card key={index} className="overflow-hidden">
                        <Skeleton className="h-[180px] w-full" />
                        <CardContent className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full mb-4" />
                          <Skeleton className="h-4 w-1/4" />
                        </CardContent>
                      </Card>
                    ))
                : regularCategories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link href={`/categories/${category.id}`}>
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full border-0 shadow-md hover:-translate-y-1">
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <CardContent className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                              {category.description}
                            </p>
                            <div className="flex items-center mt-4 text-orange-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              View Products
                              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
            </div>
          ) : (
            <div className="space-y-4">
              {isLoading
                ? Array(8)
                    .fill(0)
                    .map((_, index) => (
                      <Card key={index} className="p-6">
                        <div className="flex gap-4">
                          <Skeleton className="h-20 w-20 rounded-lg" />
                          <div className="flex-1">
                            <Skeleton className="h-6 w-1/3 mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                        </div>
                      </Card>
                    ))
                : regularCategories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link href={`/categories/${category.id}`}>
                        <Card className="p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer border-0 shadow-md">
                          <div className="flex gap-6 items-center">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                              <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                                {category.name}
                              </h3>
                              <p className="text-gray-600 leading-relaxed">
                                {category.description}
                              </p>
                            </div>
                            <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-orange-600 transition-colors flex-shrink-0" />
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
            </div>
          )}
          
          {!isLoading && filteredCategories.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse all categories.
              </p>
              <Button
                onClick={() => setSearchQuery("")}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Show All Categories
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
