"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Search, BookOpen, Edit, Eye, Plus, Download, CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
interface Author {
  id: string
  name: string
  email: string
  bio: string | null
  specialty: string | null
  status: string
  blogCount: number
  createdAt: string
}

export default function AdminAuthorsPage() {
  const router = useRouter()

  const [authors, setAuthors] = useState<Author[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchAuthors()
  }, [ router, currentPage, statusFilter, specialtyFilter, searchQuery])

  const fetchAuthors = async () => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        status: statusFilter !== "all" ? statusFilter : "",
        specialty: specialtyFilter !== "all" ? specialtyFilter : "",
        search: searchQuery,
      })

      const response = await fetch(`/api/admin/authors?${queryParams}`)
      const data = await response.json()

      if (response.ok) {
        setAuthors(data.authors)
        setTotalPages(data.pagination.totalPages)
      } else {
        toast.error(data.error || "Failed to fetch authors")
      }
    } catch (error) {
      console.error("Error fetching authors:", error)
      toast.error("Failed to fetch authors")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchAuthors()
  }

  const handleApproveAuthor = async (authorId: string) => {
    try {
      const response = await fetch(`/api/admin/authors/${authorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "APPROVED",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Author approved successfully")
        fetchAuthors()
      } else {
        toast.error(data.error || "Failed to approve author")
      }
    } catch (error) {
      console.error("Error approving author:", error)
      toast.error("Failed to approve author")
    }
  }

  const handleRejectAuthor = async (authorId: string) => {
    try {
      const response = await fetch(`/api/admin/authors/${authorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "REJECTED",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Author rejected successfully")
        fetchAuthors()
      } else {
        toast.error(data.error || "Failed to reject author")
      }
    } catch (error) {
      console.error("Error rejecting author:", error)
      toast.error("Failed to reject author")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      case "SUSPENDED":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Suspended
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const exportAuthors = () => {
    toast.success("Exporting authors...") 
    // In a real implementation, this would generate and download a CSV file
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Author Management</h1>
          <p className="text-muted-foreground">Manage your content creators</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportAuthors}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push("/admin/authors/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Author
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authors</CardTitle>
          <CardDescription>View and manage all content creators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <Input
                  placeholder="Search authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="secondary">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>

              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={specialtyFilter}
                  onValueChange={(value) => {
                    setSpecialtyFilter(value)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                    <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                    <SelectItem value="FINANCE">Finance</SelectItem>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
                <span className="text-lg">Loading authors...</span>
              </div>
            ) : authors.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Authors Found</h3>
                <p className="text-muted-foreground mb-4">No authors match your current filters.</p>
                <Button onClick={() => router.push("/admin/authors/new")}>Add Author</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>Blogs</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {authors.map((author) => (
                      <TableRow key={author.id}>
                        <TableCell className="font-medium">{author.name}</TableCell>
                        <TableCell>{author.email}</TableCell>
                        <TableCell>{author.specialty || "—"}</TableCell>
                        <TableCell>{author.blogCount}</TableCell>
                        <TableCell>{getStatusBadge(author.status)}</TableCell>
                        <TableCell>{new Date(author.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/admin/authors/${author.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/admin/authors/${author.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {author.status === "PENDING" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleApproveAuthor(author.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRejectAuthor(author.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

