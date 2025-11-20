"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Loader2, ChevronRight , Share2, Clock, Tag, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import ProductCard from "@/components/product-card"

type Guide = {
  id: string
  title: string
  content: string
  category: {
    id: string
    name: string
  }
  image: string
  readTime: number
  publishDate: string
  author: {
    name: string
    avatar: string
    bio: string
  }
  tags: string[]
  relatedProducts: Array<{
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
  }>
}

export default function GuidePage() {
  const params = useParams()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await fetch(`/api/guides/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch guide")
        }
        const data = await response.json()
        setGuide(data)
      } catch (error) {
        console.error("Error fetching guide:", error)
        setError("Failed to load guide")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchGuide()
    }
  }, [params.id])

  const handleShare = async () => {
    try {
      await navigator.share({
        title: guide?.title,
        text: guide?.content.substring(0, 100) + "...",
        url: window.location.href,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">{error || "Guide not found"}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Guide Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/guides"
                className="text-orange-600 hover:text-orange-700"
              >
                Guides
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Link
                href={`/guides/categories/${guide.category.id}`}
                className="text-orange-600 hover:text-orange-700"
              >
                {guide.category.name}
              </Link>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {guide.title}
            </h1>

            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{guide.readTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(guide.publishDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Main Image */}
          <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
            <Image
              src={guide.image || "/placeholder.jpg"}
              alt={guide.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-8">
            <Image
              src={guide.author.avatar || "/placeholder-avatar.jpg"}
              alt={guide.author.name}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{guide.author.name}</h3>
              <p className="text-gray-600">{guide.author.bio}</p>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Guide Content */}
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-12">
            {guide.tags.map((tag) => (
              <Link
                key={tag}
                href={`/guides/tags/${tag}`}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Tag className="h-4 w-4" />
                {tag}
              </Link>
            ))}
          </div>

          {/* Related Products */}
          {guide.relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Related Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guide.relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}