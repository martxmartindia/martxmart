"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useShopping } from "@/store/shopping"
import { toast } from "sonner"

interface WishlistItem {
  id: string
  shopping: {
    id: string
    name: string
    slug: string
    price: number
    originalPrice?: number
    images: string[]
    stock: number
    brand?: string
    averageRating?: number
    reviewCount?: number
    category: {
      name: string
    }
  }
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { updateCartCount, updateWishlistCount } = useShopping()

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/shopping/wishlist", {
        credentials: "include"
      })

      if (response.ok) {
        const data = await response.json()
        setWishlistItems(data || [])
      } else if (response.status === 401) {
        setWishlistItems([])
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      setWishlistItems([])
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/shopping/wishlist?shoppingId=${productId}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (response.ok) {
        setWishlistItems((prev) => prev.filter((item) => item.shopping.id !== productId))
        updateWishlistCount()
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    }
  }

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch("/api/shopping/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          shoppingId: productId,
          quantity: 1,
        }),
      })

      if (response.ok) {
        toast.success("Added to cart successfully!")
        updateCartCount()
      } else if (response.status === 401) {
        window.location.href = "/auth/login"
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Heart className="h-24 w-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Save items you love to your wishlist and shop them later.</p>
          <Link href="/shopping/products">
            <Button className="bg-orange-500 hover:bg-orange-600">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-600 mt-2">{wishlistItems.length} items in your wishlist</p>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <Card
            key={item.id}
            className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="relative">
              <div className="relative h-64">
                <Image
                  src={item.shopping.images[0] || "/placeholder.svg?height=256&width=256"}
                  alt={item.shopping.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.shopping.originalPrice && item.shopping.originalPrice > item.shopping.price && (
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                    {Math.round(
                      ((item.shopping.originalPrice - item.shopping.price) / item.shopping.originalPrice) * 100,
                    )}
                    % OFF
                  </Badge>
                )}
                {item.shopping.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-white">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 left-2 bg-white hover:bg-gray-100 shadow-md"
                onClick={() => removeFromWishlist(item.shopping.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            <CardContent className="p-4">
              <div className="space-y-2">
                <div>
                  <Badge variant="outline" className="text-xs mb-1">
                    {item.shopping.category.name}
                  </Badge>
                  <Link href={`/products/${item.shopping.id}`}>
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 cursor-pointer">
                      {item.shopping.name}
                    </h3>
                  </Link>
                  {item.shopping.brand && <p className="text-sm text-gray-600">{item.shopping.brand}</p>}
                </div>

                {item.shopping.averageRating && (
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(item.shopping.averageRating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({item.shopping.reviewCount || 0})</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">₹{item.shopping.price}</span>
                  {item.shopping.originalPrice && item.shopping.originalPrice > item.shopping.price && (
                    <span className="text-sm text-gray-500 line-through">₹{item.shopping.originalPrice}</span>
                  )}
                </div>

                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => addToCart(item.shopping.id)}
                  disabled={item.shopping.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {item.shopping.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
