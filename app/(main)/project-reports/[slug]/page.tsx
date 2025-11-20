"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Clock, DollarSign, IndianRupee, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useParams } from "next/navigation"

interface ProjectCategory {
  id: string
  name: string
  description: string | null
  slug: string
  projects: Project[]
}

interface Project {
  id: string
  name: string
  slug: string
  description: string | null
  scheme: string | null
  estimatedCost: string | null
  timeline: string | null
  projectReportCost: number
  machinery: { name: string; cost: string }[]
}

export default function ProjectCategoryDetailsPage() {
  const params = useParams()
  const [category, setCategory] = useState<ProjectCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "cost" | "timeline">("name")
  const [filterScheme, setFilterScheme] = useState<string>("All")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/project-category/${params.slug}`)
        if (!response.ok) {
          throw new Error("Failed to fetch project category")
        }
        const data = await response.json()
        setCategory(data)
      } catch (error) {
        console.error("Error fetching project category:", error)
        setError("Failed to load category. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchCategory()
    } else {
      setError("Invalid category slug")
      setLoading(false)
    }
  }, [params.slug])

  const schemes = category?.projects
    ? Array.from(new Set(category.projects.map((project) => project.scheme).filter((scheme): scheme is string => !!scheme)))
    : []

  const parseCost = (cost: string | null): number => {
    if (!cost) return 0
    // Extract numeric value (e.g., "₹10 Lakh" -> 1000000)
    const match = cost.match(/[\d,.]+/)
    if (!match) return 0
    const numeric = parseFloat(match[0].replace(/,/g, ""))
    return cost.toLowerCase().includes("lakh") ? numeric * 100000 : numeric
  }

  const parseTimeline = (timeline: string | null): number => {
    if (!timeline) return 0
    // Extract numeric value (e.g., "6-12 months" -> 6, "1 year" -> 12)
    const match = timeline.match(/\d+/)
    if (!match) return 0
    const numeric = parseInt(match[0])
    return timeline.toLowerCase().includes("year") ? numeric * 12 : numeric
  }

  const filteredProjects = category?.projects
    ? category.projects
        .filter(
          (project) =>
            (filterScheme === "All" || project.scheme === filterScheme) &&
            (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))),
        )
        .sort((a, b) => {
          if (sortBy === "name") {
            return a.name.localeCompare(b.name)
          }
          if (sortBy === "cost") {
            return parseCost(a.estimatedCost) - parseCost(b.estimatedCost)
          }
          if (sortBy === "timeline") {
            return parseTimeline(a.timeline) - parseTimeline(b.timeline)
          }
          return 0
        })
    : []

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Skeleton className="h-10 w-40" />
        </div>
        <Card className="border border-gray-200 shadow-lg mb-8">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Skeleton key={item} className="h-12 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/project-categor">y
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="ml-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>Category Not Found</CardTitle>
            <CardDescription>The requested category does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/plant-and-machinery">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/project-categories">
        <Button
          variant="ghost"
          className="mb-6 text-orange-600 hover:text-orange-700 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Categories
        </Button>
      </Link>

      <Card className="border border-gray-200 shadow-lg mb-8">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
          <CardTitle className="text-3xl font-bold text-gray-900">{category.name}</CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2 max-w-2xl">
            {category.description || "Explore projects in this category."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Projects</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  aria-label="Search projects"
                />
              </div>
              <Select value={sortBy} onValueChange={(value: "name" | "cost" | "timeline") => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="cost">Sort by Cost</SelectItem>
                  <SelectItem value="timeline">Sort by Timeline</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterScheme} onValueChange={setFilterScheme}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Schemes</SelectItem>
                  {schemes.map((scheme) => (
                    <SelectItem key={scheme} value={scheme}>
                      {scheme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="relative">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {project.name}
                    </CardTitle>
                  
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-gray-600 mb-4">{project.description || "No description available."}</p>
                  <div className="space-y-4">
                    {project.estimatedCost && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                          <IndianRupee className="h-4 w-4 mr-2 text-orange-500" />
                          Estimated Cost
                        </h4>
                        <p className="text-sm text-gray-600">{project.estimatedCost}</p>
                      </div>
                    )}
                    {project.timeline && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-orange-500" />
                          Timeline
                        </h4>
                        <p className="text-sm text-gray-600">{project.timeline}</p>
                      </div>
                    )}
                  </div>
                  <Link href={`/projects/${project.slug}`}>
                    <Button className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2">
                      View Project Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No projects found matching your criteria.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("")
                  setFilterScheme("All")
                  setSortBy("name")
                }}
                className="mt-4 text-orange-600 hover:text-orange-700"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}