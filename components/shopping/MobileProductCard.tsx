"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  brand?: string
  averageRating?: number
  reviewCount?: number
  stock?: number
  category: {
    name: string
  }
}

interface MobileProductCardProps {
  product: Product
  wishlist: string[]
  onToggleWishlist: (productId: string) => void
  onAddToCart: (productId: string) => void
}

export default function MobileProductCard({
  product,
  wishlist,
  onToggleWishlist,
  onAddToCart,
}: MobileProductCardProps) {
  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const isInWishlist = wishlist.includes(product.id)
  const isOutOfStock = product.stock === 0

  return (
    <Link href={`/shopping/products/${product.id}`}>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white cursor-pointer">
        <div className="relative">
          <div className="relative h-40 sm:h-48">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                {discountPercentage}% OFF
              </Badge>
            )}
            
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-sm p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleWishlist(product.id)
            }}
          >
            <Heart className={`h-3 w-3 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>

        <CardContent className="p-3">
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs">
              {product.category.name}
            </Badge>
            
            <h3 className="font-medium text-sm text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
              {product.name}
            </h3>

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
                <span className="text-xs text-gray-600">({product.reviewCount || 0})</span>
              </div>
            )}

            <div className="flex items-center space-x-1">
              <span className="text-base font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs py-2" 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToCart(product.id)
              }}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}