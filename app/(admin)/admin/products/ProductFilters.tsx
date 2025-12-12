"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface HierarchicalCategory {
  id: string;
  name: string;
  slug: string;
  type: string;
  parentId?: string;
  children: HierarchicalCategory[];
}

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void;
  categories: HierarchicalCategory[];
  filters: any;
}

export default function ProductFilters({ onFiltersChange, categories, filters }: ProductFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const active = Object.entries(filters)
      .filter(([key, value]) => value !== '' && value !== 'all')
      .map(([key, _]) => key);
    setActiveFilters(active);
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: string) => {
    onFiltersChange({ ...filters, [key]: key === 'brand' ? '' : 'all' });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: 'all',
      featured: 'all',
      stock: 'all',
      priceRange: 'all',
      brand: '',
    });
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getFilterLabel = (key: string, value: string) => {
    switch (key) {
      case 'category':
        const category = findCategoryById(categories, value);
        return `Category: ${category?.name || value}`;
      case 'featured':
        return `Featured: ${value === 'true' ? 'Yes' : 'No'}`;
      case 'stock':
        return `Stock: ${value === 'in_stock' ? 'In Stock' : value === 'low_stock' ? 'Low Stock' : 'Out of Stock'}`;
      case 'priceRange':
        return `Price: ${value}`;
      case 'brand':
        return `Brand: ${value}`;
      default:
        return `${key}: ${value}`;
    }
  };

  const findCategoryById = (categories: HierarchicalCategory[], id: string): HierarchicalCategory | undefined => {
    for (const category of categories) {
      if (category.id === id) {
        return category;
      }
      if (category.children) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const renderCategory = (category: HierarchicalCategory, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = filters.category === category.id;

    return (
      <div key={category.id} className={level > 0 ? 'ml-4' : ''}>
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer py-1">
            <input
              type="radio"
              name="category"
              value={category.id}
              checked={isSelected}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="text-orange-600"
            />
            <span className="text-sm text-gray-700">{category.name}</span>
          </label>
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleCategory(category.id)}
            >
              <ChevronRight 
                className={`h-3 w-3 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`} 
              />
            </Button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-2 border-l border-gray-200 pl-2">
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {activeFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </Button>
                )}
              </div>
              
              <Separator />

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <div className="max-h-48 overflow-y-auto border rounded-md p-2">
                    <label className="flex items-center space-x-2 mb-2">
                      <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={filters.category === 'all'}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="text-orange-600"
                      />
                      <span className="text-sm text-gray-700 font-medium">All Categories</span>
                    </label>
                    {categories.filter(cat => cat.id && cat.id.trim() !== '').map((category) => 
                      renderCategory(category)
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Featured</label>
                  <Select value={filters.featured} onValueChange={(value) => handleFilterChange('featured', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All products</SelectItem>
                      <SelectItem value="true">Featured only</SelectItem>
                      <SelectItem value="false">Non-featured only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Stock Status</label>
                  <Select value={filters.stock} onValueChange={(value) => handleFilterChange('stock', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All stock levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All stock levels</SelectItem>
                      <SelectItem value="in_stock">In Stock ({'>'}10)</SelectItem>
                      <SelectItem value="low_stock">Low Stock (1-10)</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock (0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All prices</SelectItem>
                      <SelectItem value="0-1000">₹0 - ₹1,000</SelectItem>
                      <SelectItem value="1000-5000">₹1,000 - ₹5,000</SelectItem>
                      <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                      <SelectItem value="10000-50000">₹10,000 - ₹50,000</SelectItem>
                      <SelectItem value="50000+">₹50,000{'+'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Brand</label>
                  <Input
                    placeholder="Enter brand name"
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Active Filters */}
        {activeFilters.map((key) => (
          <Badge key={key} variant="secondary" className="gap-1">
            {getFilterLabel(key, filters[key as keyof typeof filters])}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-muted-foreground hover:text-foreground"
              onClick={() => clearFilter(key)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}