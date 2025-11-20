"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, ChevronRight, Loader2, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type GuideCategory = {
  id: string
  name: string
  description: string
  image: string
  guideCount: number
}

type Guide = {
  id: string
  title: string
  description: string
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
  }
}

export default function GuidesPage() {
  const [categories, setCategories] = useState<GuideCategory[]>([])
  const [guides, setGuides] = useState<Guide[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, guidesRes] = await Promise.all([
          fetch("/api/guide-categories"),
          fetch("/api/guides"),
        ])

        if (!categoriesRes.ok || !guidesRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const [categoriesData, guidesData] = await Promise.all([
          categoriesRes.json(),
          guidesRes.json(),
        ])

        setCategories(categoriesData.categories)
        setGuides(guidesData.guides)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load guides")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Buyer&apos;s Guides
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover comprehensive guides to help you make informed decisions
            about your purchases.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-lg"
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Guide Categories</h2>
            <Button variant="ghost" className="text-orange-600">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/guides/categories/${category.id}`}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={category.image || "/placeholder.jpg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mt-2">{category.description}</p>
                    <p className="text-sm text-gray-500 mt-4">
                      {category.guideCount} Guides
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Guides Section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Guides</h2>
            <Button variant="ghost" className="text-orange-600">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/guides/${guide.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                    <div className="relative h-48">
                      <Image
                        src={guide.image || "/placeholder.jpg"}
                        alt={guide.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                          {guide.category.name}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {guide.readTime} min read
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                        {guide.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{guide.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image
                            src={guide.author.avatar || "/placeholder-avatar.jpg"}
                            alt={guide.author.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <span className="text-sm text-gray-700">
                            {guide.author.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(guide.publishDate).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}