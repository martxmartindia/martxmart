"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useCart } from "@/store/cart"
import { useWishlist } from "@/store/wishlist"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    description: string
    images: string[]
    category: {
      name: string
    }
    averageRating?: number
    reviewCount?: number
    condition?: string
    location?: string
    brand?: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, hasItem: isInWishlist } = useWishlist()
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id))
  }, [product.id, isInWishlist])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
             addItem(product.id, 1);

    toast.success("Added to cart")
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast.success("Removed from wishlist")
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      })
      toast.success("Added to wishlist")
    }
    setIsWishlisted(!isWishlisted)
  }

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all hover:shadow-md">
        <div className="relative h-48">
          <Image
            src={product.images[0] || "/placeholder.svg?height=200&width=300"}
            alt={product.name}
            fill
            className="object-cover"
          />
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
          {product.condition && (
            <Badge
              className={`absolute top-2 left-2 ${
                product.condition === "New"
                  ? "bg-green-600"
                  : product.condition === "Refurbished"
                    ? "bg-blue-600"
                    : "bg-orange-600"
              }`}
            >
              {product.condition}
            </Badge>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-orange-600 transition-colors">
              {product.name}
            </h3>
            {product.averageRating && (
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">
                  {product.averageRating.toFixed(1)} ({product.reviewCount})
                </span>
              </div>
            )}
          </div>

          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-orange-600">₹{product.price.toLocaleString()}</p>
            </div>

            {product.location && (
              <div className="flex items-center text-sm text-gray-500">
                <span>{product.location}</span>
              </div>
            )}

            {product.brand && (
              <div className="text-sm text-gray-600">
                Brand: <span className="font-medium">{product.brand}</span>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="w-full py-2 bg-orange-600 text-white rounded-md font-medium hover:bg-orange-700 transition-colors"
            >
              <ShoppingCart className="h-4 w-4 inline-block mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

