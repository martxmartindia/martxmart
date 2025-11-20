"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Grid, List, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  products: any[];
  total: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  query: string;
  sortBy: string;
  viewMode: 'grid' | 'list';
  onSortChange: (sort: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onPageChange: (page: number) => void;
}

export default function SearchResults({
  products,
  total,
  currentPage,
  totalPages,
  loading,
  query,
  sortBy,
  viewMode,
  onSortChange,
  onViewModeChange,
  onPageChange
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Searching products...</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-gray-600">
          {query ? `No results for "${query}"` : 'Try adjusting your filters'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">
            {total.toLocaleString()} products found
            {query && <span className="text-gray-600"> for "{query}"</span>}
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Sort */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
      )}>
        {products.map((product) => (
          <div key={product.id} className={cn(
            viewMode === 'list' && "border rounded-lg p-4"
          )}>
            <ProductCard 
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.images?.[0] || product.image || '/placeholder.jpg'}
              description={product.description}
              category={product.category?.name || 'Uncategorized'}
            />
            {product.highlight && (
              <div className="mt-2">
                {product.highlight.name && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Name: </span>
                    <span dangerouslySetInnerHTML={{ __html: product.highlight.name[0] }} />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            const isActive = page === currentPage;
            
            return (
              <Button
                key={page}
                variant={isActive ? "default" : "outline"}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          })}
          
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span>...</span>
              <Button
                variant="outline"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}