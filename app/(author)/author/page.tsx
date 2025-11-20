"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { BlogPagination } from "@/components/blog-pagination"
import { toast } from "sonner"
import { format } from "date-fns"

export default function AuthorDashboardPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchBlogs()
  }, [currentPage, statusFilter, searchQuery, router])

  const fetchBlogs = async () => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10" as string,
        status: statusFilter === "ALL" ? "" : statusFilter,
        search: searchQuery,
      })

      const response = await fetch(`/api/author/blogs?${queryParams}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch blogs")
      }

      setBlogs(data.blogs)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error("Error fetching blogs:", error)
      toast.error("Failed to load blogs")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return
    }

    try {
      const response = await fetch(`/api/author/blogs/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete blog")
      }

      toast.success("Blog deleted successfully")
      fetchBlogs()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete blog")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchBlogs()
  }
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Author Dashboard</h1>
        <Button onClick={() => router.push("/author/blogs/new")} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          New Blog Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Blog Posts</CardTitle>
          <CardDescription>Manage your blog content, create new posts, and edit existing ones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <Input
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="secondary">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-2" />
                <span className="text-lg text-gray-700">Loading blogs...</span>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No blogs found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left">Title</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{blog.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {blog.excerpt || blog.content.substring(0, 100)}...
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              blog.status === "PUBLISHED"
                                ? "bg-green-100 text-green-800"
                                : blog.status === "DRAFT"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {blog.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{format(new Date(blog.createdAt), "MMM d, yyyy")}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/blogs/${blog.slug}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => router.push(`/author/blogs/${blog.id}`)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(blog.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

