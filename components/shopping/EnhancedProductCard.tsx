"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Heart, ShoppingCart, Eye, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

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

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
  wishlist: string[]
  onToggleWishlist: (productId: string) => void
  onAddToCart: (productId: string) => void
}

export default function EnhancedProductCard({
  product,
  viewMode,
  wishlist,
  onToggleWishlist,
  onAddToCart,
}: ProductCardProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const isInWishlist = wishlist.includes(product.id)
  const isOutOfStock = product.stock === 0

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} for ₹${product.price}`,
          url: `/shopping/products/${product.id}`,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/shopping/products/${product.id}`)
        toast.success("Product link copied to clipboard!")
      } catch (error) {
        toast.error("Failed to copy link")
      }
    }
  }

  const handleImageHover = (index: number) => {
    if (product.images.length > 1) {
      setCurrentImageIndex(index)
    }
  }

  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
        <div className="flex flex-col sm:flex-row">
          {/* Image Section */}
          <Link href={`/shopping/products/${product.id}`} className="relative w-full sm:w-48 h-48 sm:h-32 flex-shrink-0">
            <Image
              src={product.images[currentImageIndex] || "/placeholder.svg?height=128&width=192"}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-300 ${imageLoading ? 'blur-sm' : 'blur-0'} ${!isOutOfStock ? 'group-hover:scale-105' : ''}`}
              onLoad={() => setImageLoading(false)}
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discountPercentage > 0 && (
                <Badge className="bg-red-500 text-white text-xs font-medium">
                  {discountPercentage}% OFF
                </Badge>
              )}
              {isOutOfStock && (
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Image Indicators */}
            {product.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {product.images.slice(0, 3).map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onMouseEnter={() => handleImageHover(index)}
                  />
                ))}
              </div>
            )}
          </Link>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <Button
              variant="secondary"
              size="sm"
              className="p-2 bg-white/90 hover:bg-white shadow-sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleWishlist(product.id)
              }}
            >
              <Heart className={`h-3 w-3 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="p-2 bg-white/90 hover:bg-white shadow-sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleShare()
              }}
            >
              <Share2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Content Section */}
          <CardContent className="flex-1 p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between h-full">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category.name}
                  </Badge>
                  {product.brand && (
                    <Badge variant="secondary" className="text-xs">
                      {product.brand}
                    </Badge>
                  )}
                </div>

                <Link href={`/shopping/products/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 cursor-pointer">
                    {product.name}
                  </h3>
                </Link>
                
                {product.averageRating && product.averageRating > 0 && (
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < Math.floor(product.averageRating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      {product.averageRating.toFixed(1)} ({product.reviewCount || 0})
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:items-end justify-between mt-4 sm:mt-0">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link href={`/shopping/products/${product.id}`}>
                    <Button variant="outline" size="sm" className="p-2">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    className="bg-orange-500 hover:bg-orange-600 text-white" 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onAddToCart(product.id)
                    }}
                    disabled={isOutOfStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  // Grid View
  return (
    <Link href={`/shopping/products/${product.id}`}>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white cursor-pointer">
        {/* Image Section */}
        <div className="relative">
          <div className="relative h-64 overflow-hidden">
            <Image
              src={product.images[currentImageIndex] || "/placeholder.svg?height=256&width=256"}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-300 ${imageLoading ? 'blur-sm' : 'blur-0'} ${!isOutOfStock ? 'group-hover:scale-105' : ''}`}
              onLoad={() => setImageLoading(false)}
            />
            
            {/* Overlay for out of stock */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white font-medium">
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <Button
              variant="secondary"
              size="sm"
              className="p-2 bg-white/90 hover:bg-white shadow-md"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleWishlist(product.id)
              }}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="p-2 bg-white/90 hover:bg-white shadow-md"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleShare()
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Image Indicators */}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
              {product.images.slice(0, 4).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onMouseEnter={() => handleImageHover(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {product.category.name}
              </Badge>
              {product.brand && (
                <Badge variant="secondary" className="text-xs">
                  {product.brand}
                </Badge>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
              {product.name}
            </h3>

            {product.averageRating && product.averageRating > 0 && (
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.averageRating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.averageRating.toFixed(1)} ({product.reviewCount || 0})
                </span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium" 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToCart(product.id)
              }}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}