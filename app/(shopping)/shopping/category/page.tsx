"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

// Define interfaces for type safety
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count: {
    shopping: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/shopping/categories?type=SHOP");
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">{error}</h2>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">No categories found</h2>
          <p className="text-gray-600 mt-2">Check back later for new categories.</p>
          <Link href="/shopping/products">
            <Button className="mt-4">Browse All Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
        <Link href="/shopping" className="hover:text-orange-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-orange-600 font-medium">Categories</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shop by Category</h1>
        <p className="text-gray-600 mt-2">
          Browse our {categories.length} categories to find the perfect products for you.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <CardHeader className="p-0">
              <div className="relative h-48">
                <Image
                  src={`/category-placeholder-${category.id}.svg?height=192&width=256`}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                <Link href={`/shopping/category/${category.slug}`}>{category.name}</Link>
              </CardTitle>
              {category.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{category.description}</p>
              )}
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-600">
                  {category._count.shopping} {category._count.shopping === 1 ? "product" : "products"}
                </span>
                <Link href={`/shopping/category/${category.slug}`}>
                  <Button variant="outline" size="sm">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Shop Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}