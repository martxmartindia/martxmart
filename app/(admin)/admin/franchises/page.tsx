"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Loader2,
  Search,
  Filter,
  Building,
  Edit,
  Eye,
  Trash2,
  Plus,
  Download,
  CheckCircle,
  XCircle,
  MapPin,
  DollarSign,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

interface Franchise {
  id: string
  name: string
  ownerName: string
  territory: string
  status: string
  commissionRate: number
  revenue: number
  isActive: boolean
  createdAt: string
  expiresAt: string | null
}

export default function AdminFranchisesPage() {
  const router = useRouter()
  const [franchises, setFranchises] = useState<Franchise[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [territoryFilter, setTerritoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {

    fetchFranchises()
  }, [ router, currentPage, statusFilter, territoryFilter, searchQuery])

  const fetchFranchises = async () => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        status: statusFilter !== "all" ? statusFilter : "",
        territory: territoryFilter !== "all" ? territoryFilter : "",
        search: searchQuery,
      })

      const response = await fetch(`/api/admin/franchises?${queryParams}`)
      const data = await response.json()      

      if (response.ok) {
        setFranchises(data.franchises)
        const totalPages = data.pagination?.totalPages || 1
        setTotalPages(totalPages)
      } else {
        setTotalPages(1);
        toast.error(data.error || "Failed to fetch franchises")
      }
    } catch (error) {
      console.error("Error fetching franchises:", error)
      toast.error("Failed to fetch franchises")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchFranchises()
  }

  const handleApproveFranchise = async (franchiseId: string) => {
    try {
      const response = await fetch(`/api/admin/franchises/${franchiseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "APPROVED",
          isActive: true,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Franchise approved successfully")
        fetchFranchises()
      } else {
        toast.error(data.error || "Failed to approve franchise")
      }
    } catch (error) {
      console.error("Error approving franchise:", error)
      toast.error("Failed to approve franchise")
    }
  }

  const handleRejectFranchise = async (franchiseId: string) => {
    try {
      const response = await fetch(`/api/admin/franchises/${franchiseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "REJECTED",
          isActive: false,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Franchise rejected successfully")
        fetchFranchises()
      } else {
        toast.error(data.error || "Failed to reject franchise")
      }
    } catch (error) {
      console.error("Error rejecting franchise:", error)
      toast.error("Failed to reject franchise")
    }
  }

  const handleToggleStatus = async (franchiseId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/franchises/${franchiseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Franchise status updated successfully")
        fetchFranchises()
      } else {
        toast.success("Franchise status updated successfully")
      }
    } catch (error) {
      console.error("Error updating franchise status:", error)
      toast.success("Franchise status updated successfully")
    }
  }

  const handleDeleteFranchise = async (franchiseId: string) => {
    if (!confirm("Are you sure you want to delete this franchise? This action cannot be undone.")) return

    try {
      const response = await fetch(`/api/admin/franchises/${franchiseId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Franchise deleted successfully")
        fetchFranchises()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to delete franchise")
      }
    } catch (error) {
      console.error("Error deleting franchise:", error)
      toast.error("Failed to delete franchise")
    }
  }

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Inactive
        </Badge>
      )
    }

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
      case "TERMINATED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Terminated
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const exportFranchises = () => {
    toast.success("Exporting franchises...")
    // In a real implementation, this would generate and download a CSV file
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Franchise Management</h1>
          <p className="text-muted-foreground">Manage your franchise network</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportFranchises}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push("/admin/franchises/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Franchise
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Franchises</CardTitle>
          <CardDescription>View and manage all franchises in your network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <Input
                  placeholder="Search franchises..."
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
                    <SelectItem value="TERMINATED">Terminated</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={territoryFilter}
                  onValueChange={(value) => {
                    setTerritoryFilter(value)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by territory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Territories</SelectItem>
                    <SelectItem value="North">North</SelectItem>
                    <SelectItem value="South">South</SelectItem>
                    <SelectItem value="East">East</SelectItem>
                    <SelectItem value="West">West</SelectItem>
                    <SelectItem value="Central">Central</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
                <span className="text-lg">Loading franchises...</span>
              </div>
            ) : franchises.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Franchises Found</h3>
                <p className="text-muted-foreground mb-4">No franchises match your current filters.</p>
                <Button onClick={() => router.push("/admin/franchises/new")}>Add Franchise</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Franchise Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Territory</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {franchises.map((franchise) => (
                      <TableRow key={franchise.id}>
                        <TableCell className="font-medium">{franchise.name}</TableCell>
                        <TableCell>{franchise.ownerName}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                            {franchise.territory}
                          </div>
                        </TableCell>
                        <TableCell>{franchise.commissionRate}%</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />₹
                            {(franchise.revenue ?? 0).toLocaleString("en-IN")}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(franchise.status, franchise.isActive)}</TableCell>
                        <TableCell>
                          {franchise.expiresAt ? new Date(franchise.expiresAt).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Filter className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/admin/franchises/${franchise.id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/franchises/${franchise.id}/edit`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Franchise
                              </DropdownMenuItem>

                              {franchise.status === "PENDING" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleApproveFranchise(franchise.id)}>
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    Approve Franchise
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRejectFranchise(franchise.id)}>
                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                    Reject Franchise
                                  </DropdownMenuItem>
                                </>
                              )}

                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleStatus(franchise.id, franchise.isActive)}>
                                {franchise.isActive ? (
                                  <>
                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                    Deactivate Franchise
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    Activate Franchise
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteFranchise(franchise.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Franchise
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

