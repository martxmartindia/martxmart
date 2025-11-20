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

export default function RecommendedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRecommendedProducts()
  }, [])

  const fetchRecommendedProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/products/recommended")
      const data = await response.json()

      if (response.ok) {
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error("Error fetching recommended products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <RecommendedProductsSkeleton />
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
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
            <CardContent className="p-4">
              <Link href={`/products/${product.id}`} className="font-medium line-clamp-2 h-12 hover:text-orange-600">
                {product.name}
              </Link>
              <div className="flex items-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.averageRating) ? "fill-orange-400 text-orange-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-2">
                {product.discountPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">${product.discountPrice.toFixed(2)}</span>
                    <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="font-medium">${product.price.toFixed(2)}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function RecommendedProductsSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-64 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square" />
            <CardContent className="p-4">
              <Skeleton className="h-5 w-full mb-1" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

