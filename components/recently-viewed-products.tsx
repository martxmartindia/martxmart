"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingBag } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Product {
  id: string
  name: string
  price: number
  discountPrice: number | null
  images: string[]
  averageRating: number
}

export default function RecentlyViewedProducts({
  currentProductId,
}: {
  currentProductId?: string
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get recently viewed products from localStorage
    const getRecentlyViewedProducts = () => {
      const recentlyViewed = localStorage.getItem("recentlyViewed")
      return recentlyViewed ? JSON.parse(recentlyViewed) : []
    }

    // Add current product to recently viewed
    const addToRecentlyViewed = (productId: string) => {
      if (!productId) return

      const recentlyViewed = getRecentlyViewedProducts()

      // Remove the current product if it exists in the list
      const filteredList = recentlyViewed.filter((id: string) => id !== productId)

      // Add the current product to the beginning of the list
      const updatedList = [productId, ...filteredList].slice(0, 10) // Keep only the 10 most recent

      localStorage.setItem("recentlyViewed", JSON.stringify(updatedList))
      return updatedList
    }

    // Fetch products data
    const fetchProducts = async (productIds: string[]) => {
      if (productIds.length === 0) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        // Filter out the current product ID
        const idsToFetch = currentProductId ? productIds.filter((id) => id !== currentProductId) : productIds

        if (idsToFetch.length === 0) {
          setProducts([])
          setIsLoading(false)
          return
        }

        const queryString = idsToFetch.map((id) => `ids=${id}`).join("&")
        const response = await fetch(`/api/products/recently-viewed?${queryString}`)
        const data = await response.json()

        if (response.ok) {
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error("Error fetching recently viewed products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // If we have a current product ID, add it to recently viewed
    if (currentProductId) {
      const updatedList = addToRecentlyViewed(currentProductId)
      fetchProducts(updatedList || [])
    } else {
      // Otherwise just fetch the existing list
      const recentlyViewed = getRecentlyViewedProducts()
      fetchProducts(recentlyViewed)
    }
  }, [currentProductId])

  if (isLoading) {
    return <RecentlyViewedSkeleton />
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.slice(0, 5).map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <Link href={`/products/${product.id}`}>
              <div className="relative aspect-square bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
            </Link>
            <CardContent className="p-3">
              <Link
                href={`/products/${product.id}`}
                className="font-medium text-sm line-clamp-2 h-10 hover:text-orange-600"
              >
                {product.name}
              </Link>
              <div className="flex items-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.round(product.averageRating) ? "fill-orange-400 text-orange-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-2">
                {product.discountPrice ? (
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-sm">${product.discountPrice.toFixed(2)}</span>
                    <span className="text-xs text-gray-500 line-through">${product.price.toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="font-medium text-sm">${product.price.toFixed(2)}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function RecentlyViewedSkeleton() {
  return (
    <div className="mt-12">
      <Skeleton className="h-7 w-40 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square" />
            <CardContent className="p-3">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-20 mb-1" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

