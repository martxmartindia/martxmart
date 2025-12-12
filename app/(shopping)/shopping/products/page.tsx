"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Grid, List, SlidersHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import ProductFilters from "@/components/shopping/ProductFilters"
import EnhancedProductCard from "@/components/shopping/EnhancedProductCard"
import MobileProductCard from "@/components/shopping/MobileProductCard"
import ProductPagination from "@/components/shopping/ProductPagination"
import QuickSearch from "@/components/shopping/QuickSearch"
import { useSession } from "next-auth/react"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  images: string[]
  brand?: string
  averageRating?: number
  reviewCount?: number
  stock?: number
  category: {
    id: string
    name: string
    slug: string
  }
}

interface Filters {
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

function ProductsPageContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<Filters>({ brands: [], categories: [], priceRange: { min: 0, max: 10000 } })
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [wishlist, setWishlist] = useState<string[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const { data: session } = useSession()

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [minRating, setMinRating] = useState(0)
  const [inStock, setInStock] = useState(false)
  const [onSale, setOnSale] = useState(false)
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  useEffect(() => {
    fetchProducts()
    loadWishlist()
  }, [searchParams, selectedBrands, selectedCategories, priceRange, minRating, inStock, onSale, sortBy, sortOrder, currentPage])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      // Add search params
      const search = searchParams.get("search")
      const categorySlug = searchParams.get("category")

      if (search) params.append("search", search)
      if (categorySlug) {
        const category = filters.categories.find(c => c.slug === categorySlug)
        if (category) {
          params.append("category", category.id)
        }
      }

      // Add filter params
      selectedBrands.forEach((brand) => params.append("brand", brand))
      selectedCategories.forEach((cat) => params.append("category", cat))
      
      if (priceRange[0] > filters.priceRange.min) params.append("minPrice", priceRange[0].toString())
      if (priceRange[1] < filters.priceRange.max) params.append("maxPrice", priceRange[1].toString())
      if (minRating > 0) params.append("minRating", minRating.toString())
      if (inStock) params.append("inStock", "true")
      if (onSale) params.append("onSale", "true")

      params.append("sortBy", sortBy)
      params.append("sortOrder", sortOrder)
      params.append("page", currentPage.toString())
      params.append("limit", "16")

      const response = await fetch(`/api/shopping/products?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
        setFilters(data.filters)
        setTotalPages(data.pagination.totalPages)
        setTotalProducts(data.pagination.total)
        
        // Update price range if not set
        if (priceRange[0] === 0 && priceRange[1] === 10000) {
          setPriceRange([data.filters.priceRange.min, data.filters.priceRange.max])
        }

        // Handle URL category parameter
        if (categorySlug) {
          const category = data.filters.categories.find((c: any) => c.slug === categorySlug)
          if (category) {
            setSelectedCategories([category.id])
          }
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const loadWishlist = () => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
  }

  const toggleWishlist = async (productId: string) => {
    if (!session) {
      const newWishlist = wishlist.includes(productId)
        ? wishlist.filter((id) => id !== productId)
        : [...wishlist, productId]
      setWishlist(newWishlist)
      localStorage.setItem("wishlist", JSON.stringify(newWishlist))
      return
    }

    try {
      if (wishlist.includes(productId)) {
        await fetch(`/api/shopping/wishlist?shoppingId=${productId}`, {
          method: "DELETE",
        })
        setWishlist((prev) => prev.filter((id) => id !== productId))
        toast.success("Removed from wishlist")
      } else {
        await fetch("/api/shopping/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shoppingId: productId }),
        })
        setWishlist((prev) => [...prev, productId])
        toast.success("Added to wishlist")
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast.error("Failed to update wishlist")
    }
  }

  const addToCart = async (productId: string) => {
    if (!session) {
      window.location.href = "/auth/login"
      return
    }

    try {
      const response = await fetch("/api/shopping/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shoppingId: productId, quantity: 1 }),
      })

      if (response.ok) {
        toast.success("Added to cart successfully!")
      } else {
        toast.error("Failed to add to cart")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add to cart")
    }
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setSelectedCategories([])
    setPriceRange([filters.priceRange.min, filters.priceRange.max])
    setMinRating(0)
    setInStock(false)
    setOnSale(false)
    setCurrentPage(1)
  }

  const activeFiltersCount = selectedBrands.length + selectedCategories.length + 
    (priceRange[0] > filters.priceRange.min ? 1 : 0) + 
    (priceRange[1] < filters.priceRange.max ? 1 : 0) + 
    (minRating > 0 ? 1 : 0) + 
    (inStock ? 1 : 0) + 
    (onSale ? 1 : 0)




  const ProductSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {searchParams.get("search") ? `Search Results for "${searchParams.get("search")}"` : "All Products"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {totalProducts} products found
                </p>
              </div>
              
              {/* Quick Search */}
              <div className="max-w-md">
                <QuickSearch 
                  initialSearch={searchParams.get("search") || ""}
                  onSearch={(query) => {
                    const params = new URLSearchParams(window.location.search)
                    if (query) {
                      params.set("search", query)
                    } else {
                      params.delete("search")
                    }
                    window.location.href = `/shopping/products?${params.toString()}`
                  }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="p-2"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="p-2"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort */}
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [newSortBy, newSortOrder] = value.split('-')
                setSortBy(newSortBy)
                setSortOrder(newSortOrder)
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="averageRating-desc">Highest Rated</SelectItem>
                  <SelectItem value="reviewCount-desc">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 bg-orange-500">{activeFiltersCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ProductFilters
                      filters={filters}
                      selectedBrands={selectedBrands}
                      selectedCategories={selectedCategories}
                      priceRange={priceRange}
                      minRating={minRating}
                      inStock={inStock}
                      onSale={onSale}
                      onBrandChange={(brands) => {
                        setSelectedBrands(brands)
                        setCurrentPage(1)
                        setMobileFiltersOpen(false)
                      }}
                      onCategoryChange={(categories) => {
                        setSelectedCategories(categories)
                        setCurrentPage(1)
                        setMobileFiltersOpen(false)
                      }}
                      onPriceRangeChange={(range) => {
                        setPriceRange(range)
                        setCurrentPage(1)
                      }}
                      onRatingChange={(rating) => {
                        setMinRating(rating)
                        setCurrentPage(1)
                        setMobileFiltersOpen(false)
                      }}
                      onStockChange={(stock) => {
                        setInStock(stock)
                        setCurrentPage(1)
                        setMobileFiltersOpen(false)
                      }}
                      onSaleChange={(sale) => {
                        setOnSale(sale)
                        setCurrentPage(1)
                        setMobileFiltersOpen(false)
                      }}
                      onClearFilters={() => {
                        clearFilters()
                        setMobileFiltersOpen(false)
                      }}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <Card className="p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <ProductFilters
                filters={filters}
                selectedBrands={selectedBrands}
                selectedCategories={selectedCategories}
                priceRange={priceRange}
                minRating={minRating}
                inStock={inStock}
                onSale={onSale}
                onBrandChange={(brands) => {
                  setSelectedBrands(brands)
                  setCurrentPage(1)
                }}
                onCategoryChange={(categories) => {
                  setSelectedCategories(categories)
                  setCurrentPage(1)
                }}
                onPriceRangeChange={(range) => {
                  setPriceRange(range)
                  setCurrentPage(1)
                }}
                onRatingChange={(rating) => {
                  setMinRating(rating)
                  setCurrentPage(1)
                }}
                onStockChange={(stock) => {
                  setInStock(stock)
                  setCurrentPage(1)
                }}
                onSaleChange={(sale) => {
                  setOnSale(sale)
                  setCurrentPage(1)
                }}
                onClearFilters={clearFilters}
              />
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                  {products.map((product) => {
                    const isMobile = window.innerWidth < 640
                    return isMobile && viewMode === "grid" ? (
                      <MobileProductCard 
                        key={product.id} 
                        product={product} 
                        wishlist={wishlist}
                        onToggleWishlist={toggleWishlist}
                        onAddToCart={addToCart}
                      />
                    ) : (
                      <EnhancedProductCard 
                        key={product.id} 
                        product={product} 
                        viewMode={viewMode}
                        wishlist={wishlist}
                        onToggleWishlist={toggleWishlist}
                        onAddToCart={addToCart}
                      />
                    )
                  })}
                </div>

                {/* Pagination */}
                <ProductPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  )
}
