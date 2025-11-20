"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SearchFiltersProps {
  filters: {
    brands: string[];
    categories: string[];
    priceRanges: Array<{ key: string; doc_count: number }>;
  };
  activeFilters: {
    brand?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    priceRange?: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function SearchFilters({ filters, activeFilters, onFilterChange }: SearchFiltersProps) {
  const handleBrandChange = (brand: string, checked: boolean) => {
    onFilterChange({
      ...activeFilters,
      brand: checked ? brand : undefined
    });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    onFilterChange({
      ...activeFilters,
      category: checked ? category : undefined
    });
  };

  const handlePriceRangeChange = (range: string) => {
    const ranges: Record<string, { min?: number; max?: number }> = {
      'Under 10000': { max: 10000 },
      '10000-50000': { min: 10000, max: 50000 },
      '50000-100000': { min: 50000, max: 100000 },
      'Above 100000': { min: 100000 }
    };

    const selectedRange = ranges[range];
    onFilterChange({
      ...activeFilters,
      minPrice: selectedRange?.min,
      maxPrice: selectedRange?.max,
      priceRange: range
    });
  };

  const clearFilter = (filterKey: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterKey as keyof typeof newFilters];
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className="space-y-6">
      {activeFilterCount > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Active Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {activeFilters.brand && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Brand: {activeFilters.brand}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('brand')} />
                </Badge>
              )}
              {activeFilters.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {activeFilters.category}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('category')} />
                </Badge>
              )}
              {activeFilters.priceRange && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Price: {activeFilters.priceRange}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('priceRange')} />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filters.priceRanges.map((range) => (
              <div key={range.key} className="flex items-center space-x-2">
                <Checkbox
                  id={range.key}
                  checked={activeFilters.priceRange === range.key}
                  onCheckedChange={(checked) => 
                    handlePriceRangeChange(checked ? range.key : '')
                  }
                />
                <Label htmlFor={range.key} className="text-sm flex-1">
                  {range.key} ({range.doc_count})
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filters.brands.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {filters.brands.slice(0, 10).map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand}
                    checked={activeFilters.brand === brand}
                    onCheckedChange={(checked) => handleBrandChange(brand, !!checked)}
                  />
                  <Label htmlFor={brand} className="text-sm">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filters.categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {filters.categories.slice(0, 10).map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={activeFilters.category === category}
                    onCheckedChange={(checked) => handleCategoryChange(category, !!checked)}
                  />
                  <Label htmlFor={category} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}