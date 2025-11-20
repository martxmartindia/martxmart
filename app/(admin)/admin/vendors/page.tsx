"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Search, Store, Edit, Eye, Plus, Download, CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

interface Vendor {
  id: string
  name: string
  ownerName: string
  email: string
  phone: string
  businessType: string
  status: string
  productCount: number
  createdAt: string
}

export default function AdminVendorsPage() {
  const router = useRouter()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {

    fetchVendors()
  }, [router, currentPage, statusFilter, businessTypeFilter, searchQuery])

  const fetchVendors = async () => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        status: statusFilter !== "all" ? statusFilter : "",
        businessType: businessTypeFilter !== "all" ? businessTypeFilter : "",
        search: searchQuery,
      })

      const response = await fetch(`/api/admin/vendors?${queryParams}`)
      const data = await response.json()

      if (response.ok) {
        setVendors(data.vendors)
        setTotalPages(data.pagination.totalPages)
      } else {
        toast.error(data.error || "Failed to fetch vendors")
      }
    } catch (error) {
      console.error("Error fetching vendors:", error)
      toast.error("Failed to fetch vendors")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchVendors()
  }

  const handleApproveVendor = async (vendorId: string) => {
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}`, {
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
        toast.success("Vendor approved successfully")
        fetchVendors()
      } else {
        toast.success(data.error || "Failed to approve vendor")
      }
    } catch (error) {
      console.error("Error approving vendor:", error)
      toast.error("Failed to approve vendor") 
    }
  }

  const handleRejectVendor = async (vendorId: string) => {
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}`, {
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
        toast.success("Vendor rejected successfully")
        fetchVendors()
      } else {
        toast.success(data.error || "Failed to reject vendor")
      }
    } catch (error) {
      console.error("Error rejecting vendor:", error)
      toast.error("Failed to reject vendor")
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

  const exportVendors = async () => {
    try {
      toast.loading("Exporting vendors...")
      const response = await fetch("/api/admin/vendors/export")
      
      if (!response.ok) throw new Error("Failed to export vendors")
      
      // Create a blob from the CSV data
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = url
      link.download = `vendors-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success("Vendors exported successfully")
    } catch (error) {
      console.error("Error exporting vendors:", error)
      toast.error("Failed to export vendors")
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Vendor Management</h1>
          <p className="text-muted-foreground">Manage your marketplace vendors</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportVendors}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push("/admin/vendors/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendors</CardTitle>
          <CardDescription>View and manage all vendors in your marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <Input
                  placeholder="Search vendors..."
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
                  value={businessTypeFilter}
                  onValueChange={(value) => {
                    setBusinessTypeFilter(value)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="COMPANY">Company</SelectItem>
                    <SelectItem value="PARTNERSHIP">Partnership</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
                <span className="text-lg">Loading vendors...</span>
              </div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-8">
                <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Vendors Found</h3>
                <p className="text-muted-foreground mb-4">No vendors match your current filters.</p>
                <Button onClick={() => router.push("/admin/vendors/new")}>Add Vendor</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Business Type</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">{vendor.name}</TableCell>
                        <TableCell>{vendor.ownerName}</TableCell>
                        <TableCell>
                          <div>{vendor.email}</div>
                          <div className="text-sm text-muted-foreground">{vendor.phone}</div>
                        </TableCell>
                        <TableCell>{vendor.businessType}</TableCell>
                        <TableCell>{vendor.productCount}</TableCell>
                        <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/admin/vendors/${vendor.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/admin/vendors/${vendor.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {vendor.status === "PENDING" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleApproveVendor(vendor.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRejectVendor(vendor.id)}
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

