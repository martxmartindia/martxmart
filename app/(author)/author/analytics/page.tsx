"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Eye, ThumbsUp, BarChart2 } from "lucide-react"

interface BlogStats {
  id: string
  title: string
  views: number
  slug: string
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [topBlogs, setTopBlogs] = useState<BlogStats[]>([])
  const [recentBlogs, setRecentBlogs] = useState<BlogStats[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [totalBlogs, setTotalBlogs] = useState(0)
  const [publishedBlogs, setPublishedBlogs] = useState(0)

  useEffect(() => {
    fetchAnalytics()
  }, [router])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/author/analytics")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch analytics")
      }

      setTopBlogs(data.topBlogs || [])
      setRecentBlogs(data.recentBlogs || [])
      setTotalViews(data.totalViews || 0)
      setTotalBlogs(data.totalBlogs || 0)
      setPublishedBlogs(data.publishedBlogs || 0)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-2" />
        <span className="text-lg text-gray-700">Loading analytics...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <h3 className="text-2xl font-bold mt-1">{totalViews}</h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Blogs</p>
                <h3 className="text-2xl font-bold mt-1">{totalBlogs}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Published Blogs</p>
                <h3 className="text-2xl font-bold mt-1">{publishedBlogs}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <ThumbsUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="top">
        <TabsList className="mb-4">
          <TabsTrigger value="top">Top Performing Blogs</TabsTrigger>
          <TabsTrigger value="recent">Recent Blogs</TabsTrigger>
        </TabsList>
        <TabsContent value="top">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Blogs</CardTitle>
              <CardDescription>Your blogs with the most views</CardDescription>
            </CardHeader>
            <CardContent>
              {topBlogs.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No data available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Title</th>
                        <th className="text-right py-3 px-4">Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topBlogs.map((blog) => (
                        <tr
                          key={blog.id}
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => router.push(`/blog/${blog.slug}`)}
                        >
                          <td className="py-3 px-4">{blog.title}</td>
                          <td className="py-3 px-4 text-right">{blog.views}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Blogs</CardTitle>
              <CardDescription>Your most recently published blogs</CardDescription>
            </CardHeader>
            <CardContent>
              {recentBlogs.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No data available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Title</th>
                        <th className="text-right py-3 px-4">Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBlogs.map((blog) => (
                        <tr
                          key={blog.id}
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => router.push(`/blog/${blog.slug}`)}
                        >
                          <td className="py-3 px-4">{blog.title}</td>
                          <td className="py-3 px-4 text-right">{blog.views}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

