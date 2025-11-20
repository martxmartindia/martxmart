"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"

interface Category {
  id: string
  name: string
  description: string | null
  image: string | null
  slug: string
  _count: {
    projects: number
  }
}

export default function ProjectCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/project-category")
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError("Failed to load Project  categories. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 mx-auto center text-center ">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">Select Project Report Categories</h1>
        <p className="text-lg text-gray-600 max-auto center text-center">
        Explore a wide range of industry-specific, authentic, and detailed project reports tailored to your entrepreneurial goals.<br/> Our reports are specially designed to meet the requirements of government schemes, bank loans, and financial institutions.
        </p>
        <div className="mt-6 max-w-screen-md right-20">
          <div className="relative ">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="border border-gray-200 ">
              <div className="h-40">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-10 w-full mt-6" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card
              key={category.id}
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="h-40 overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg?height=200&width=300"}
                  alt={category.name}
                  height={200} width={300}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader className="relative">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </CardTitle>
                 
                </div>
                <CardDescription className="text-gray-600 mt-1">{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-3">
                  {/* We don't have subcategories in our database model, so we'll show project count instead */}
                  <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                    <ChevronRight className="h-4 w-4 mr-2 text-orange-500" />
                    <span>{category._count.projects} Projects Available</span>
                  </div>
                </div>
                <Link href={`/project-reports/${category.slug}`}>
                  <Button className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 transition-colors duration-200">
                    Explore Projects
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {!loading && !error && filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No categories found matching your search.</p>
          <Button
            variant="link"
            onClick={() => setSearchTerm("")}
            className="mt-4 text-orange-600 hover:text-orange-700"
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  )
}
