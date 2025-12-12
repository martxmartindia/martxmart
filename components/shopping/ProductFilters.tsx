"use client"

import { useState } from "react"
import { Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

interface FilterProps {
  filters: {
    brands: string[]
    categories: Array<{
      id: string
      name: string
      slug: string
      _count: { shopping: number }
    }>
    priceRange: {
      min: number
      max: number
    }
  }
  selectedBrands: string[]
  selectedCategories: string[]
  priceRange: [number, number]
  minRating: number
  inStock: boolean
  onSale: boolean
  onBrandChange: (brands: string[]) => void
  onCategoryChange: (categories: string[]) => void
  onPriceRangeChange: (range: [number, number]) => void
  onRatingChange: (rating: number) => void
  onStockChange: (inStock: boolean) => void
  onSaleChange: (onSale: boolean) => void
  onClearFilters: () => void
}

export default function ProductFilters({
  filters,
  selectedBrands,
  selectedCategories,
  priceRange,
  minRating,
  inStock,
  onSale,
  onBrandChange,
  onCategoryChange,
  onPriceRangeChange,
  onRatingChange,
  onStockChange,
  onSaleChange,
  onClearFilters,
}: FilterProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
    rating: true,
    other: true,
  })

  const activeFiltersCount = selectedBrands.length + selectedCategories.length + 
    (priceRange[0] > filters.priceRange.min ? 1 : 0) + 
    (priceRange[1] < filters.priceRange.max ? 1 : 0) + 
    (minRating > 0 ? 1 : 0) + 
    (inStock ? 1 : 0) + 
    (onSale ? 1 : 0)

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="space-y-6">
      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Filters ({activeFiltersCount})</span>
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear All
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((categoryId) => {
              const category = filters.categories.find(c => c.id === categoryId)
              return category ? (
                <Badge key={categoryId} variant="secondary" className="text-xs">
                  {category.name}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => onCategoryChange(selectedCategories.filter(c => c !== categoryId))}
                  />
                </Badge>
              ) : null
            })}
            
            {selectedBrands.map((brand) => (
              <Badge key={brand} variant="secondary" className="text-xs">
                {brand}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => onBrandChange(selectedBrands.filter(b => b !== brand))}
                />
              </Badge>
            ))}
            
            {(priceRange[0] > filters.priceRange.min || priceRange[1] < filters.priceRange.max) && (
              <Badge variant="secondary" className="text-xs">
                ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => onPriceRangeChange([filters.priceRange.min, filters.priceRange.max])}
                />
              </Badge>
            )}
            
            {minRating > 0 && (
              <Badge variant="secondary" className="text-xs">
                {minRating}+ Stars
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => onRatingChange(0)}
                />
              </Badge>
            )}
            
            {inStock && (
              <Badge variant="secondary" className="text-xs">
                In Stock
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => onStockChange(false)}
                />
              </Badge>
            )}
            
            {onSale && (
              <Badge variant="secondary" className="text-xs">
                On Sale
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => onSaleChange(false)}
                />
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <Collapsible open={openSections.categories} onOpenChange={() => toggleSection('categories')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="font-semibold">Categories</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.categories ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filters.categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onCategoryChange([...selectedCategories, category.id])
                    } else {
                      onCategoryChange(selectedCategories.filter((c) => c !== category.id))
                    }
                  }}
                />
                <label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer flex-1 flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className="text-xs text-gray-500">({category._count.shopping})</span>
                </label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Brands */}
      <Collapsible open={openSections.brands} onOpenChange={() => toggleSection('brands')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="font-semibold">Brands</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.brands ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filters.brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onBrandChange([...selectedBrands, brand])
                    } else {
                      onBrandChange(selectedBrands.filter((b) => b !== brand))
                    }
                  }}
                />
                <label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Price Range */}
      <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="font-semibold">Price Range</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.price ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={(value) => onPriceRangeChange(value as [number, number])}
              max={filters.priceRange.max}
              min={filters.priceRange.min}
              step={100}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>₹{priceRange[0].toLocaleString()}</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Rating */}
      <Collapsible open={openSections.rating} onOpenChange={() => toggleSection('rating')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="font-semibold">Minimum Rating</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.rating ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={minRating === rating}
                  onCheckedChange={(checked) => onRatingChange(checked ? rating : 0)}
                />
                <label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center">
                  <div className="flex items-center mr-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  & above
                </label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Other Filters */}
      <Collapsible open={openSections.other} onOpenChange={() => toggleSection('other')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="font-semibold">Other Filters</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.other ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={inStock}
                onCheckedChange={(checked) => onStockChange(!!checked)}
              />
              <label htmlFor="in-stock" className="text-sm cursor-pointer">
                In Stock Only
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="on-sale"
                checked={onSale}
                onCheckedChange={(checked) => onSaleChange(!!checked)}
              />
              <label htmlFor="on-sale" className="text-sm cursor-pointer">
                On Sale
              </label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
