"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Plus, Megaphone, Eye, MoreHorizontal, Calendar, FileText } from "lucide-react"

interface PromotionRequest {
  id: string
  title: string
  description: string
  type: "ADVERTISEMENT" | "BANNER" | "FLYER" | "SOCIAL_MEDIA" | "EVENT" | "OTHER"
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"
  materials: string[]
  notes: string | null
  createdAt: string
  updatedAt: string
}

interface PromotionSummary {
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  completedRequests: number
}

export function PromotionRequestsManagement() {
  const [promotions, setPromotions] = useState<PromotionRequest[]>([])
  const [summary, setSummary] = useState<PromotionSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [openNewRequest, setOpenNewRequest] = useState(false)
  const [requestFormData, setRequestFormData] = useState({
    title: "",
    description: "",
    type: "",
    materials: "",
    notes: "",
  })

  // Fetch promotions on component mount
  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/franchise-portal/promotions")
      if (!response.ok) {
        throw new Error("Failed to fetch promotion requests")
      }
      const data = await response.json()
      setPromotions(data.promotions)
      setSummary(data.summary)
    } catch (error) {
      console.error("Error fetching promotions:", error)
      toast.error("Failed to load promotion requests. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const materialsArray = requestFormData.materials
        .split(",")
        .map(material => material.trim())
        .filter(material => material.length > 0)

      const response = await fetch("/api/franchise-portal/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...requestFormData,
          materials: materialsArray,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit promotion request")
      }

      const data = await response.json()

      // Add the new request to the list
      setPromotions([data.promotion, ...promotions])

      // Reset form and close dialog
      resetForm()
      setOpenNewRequest(false)

      toast.success("Promotion request submitted successfully.")
    } catch (error) {
      console.error("Error submitting promotion request:", error)
      toast.error(error instanceof Error ? error.message : "Failed to submit promotion request. Please try again.")
    }
  }

  const resetForm = () => {
    setRequestFormData({
      title: "",
      description: "",
      type: "",
      materials: "",
      notes: "",
    })
  }

  const getPromotionTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      "ADVERTISEMENT": "Advertisement",
      "BANNER": "Banner",
      "FLYER": "Flyer",
      "SOCIAL_MEDIA": "Social Media",
      "EVENT": "Event",
      "OTHER": "Other",
    }
    return typeLabels[type] || type
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800",
      },
      APPROVED: {
        label: "Approved",
        className: "bg-blue-100 text-blue-800",
      },
      REJECTED: {
        label: "Rejected",
        className: "bg-red-100 text-red-800",
      },
      COMPLETED: {
        label: "Completed",
        className: "bg-green-100 text-green-800",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Badge className={config.className}>{config.label}</Badge>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalRequests || 0}</div>
            <p className="text-xs text-muted-foreground">All promotion requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.pendingRequests || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.approvedRequests || 0}</div>
            <p className="text-xs text-muted-foreground">Ready for execution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.completedRequests || 0}</div>
            <p className="text-xs text-muted-foreground">Successfully executed</p>
          </CardContent>
        </Card>
      </div>

      {/* Promotion Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Promotion Requests</CardTitle>
          <CardDescription>Manage your marketing and promotional activity requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <Dialog open={openNewRequest} onOpenChange={setOpenNewRequest}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Submit Promotion Request</DialogTitle>
                  <DialogDescription>
                    Request marketing or promotional activities for your franchise.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitRequest}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          required
                          value={requestFormData.title}
                          onChange={(e) => setRequestFormData({ ...requestFormData, title: e.target.value })}
                          placeholder="e.g., Diwali Banner Campaign"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={requestFormData.type}
                          onValueChange={(value) => setRequestFormData({ ...requestFormData, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADVERTISEMENT">Advertisement</SelectItem>
                            <SelectItem value="BANNER">Banner</SelectItem>
                            <SelectItem value="FLYER">Flyer</SelectItem>
                            <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                            <SelectItem value="EVENT">Event</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={3}
                        required
                        value={requestFormData.description}
                        onChange={(e) => setRequestFormData({ ...requestFormData, description: e.target.value })}
                        placeholder="Describe the promotional activity you want to conduct..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="materials">Required Materials</Label>
                      <Textarea
                        id="materials"
                        rows={2}
                        value={requestFormData.materials}
                        onChange={(e) => setRequestFormData({ ...requestFormData, materials: e.target.value })}
                        placeholder="List materials needed (e.g., banners, flyers, digital assets) - separate with commas"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        rows={2}
                        value={requestFormData.notes}
                        onChange={(e) => setRequestFormData({ ...requestFormData, notes: e.target.value })}
                        placeholder="Any additional information or special requirements..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Submit Request</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Materials</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No promotion requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  promotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{promotion.title}</div>
                          <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                            {promotion.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getPromotionTypeLabel(promotion.type)}</TableCell>
                      <TableCell>{getStatusBadge(promotion.status)}</TableCell>
                      <TableCell>{formatDate(promotion.createdAt)}</TableCell>
                      <TableCell>
                        <div className="max-w-[150px] truncate" title={promotion.materials.join(", ")}>
                          {promotion.materials.length > 0 ? promotion.materials.join(", ") : "None specified"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {promotion.status === "PENDING" && (
                              <DropdownMenuItem>
                                Edit Request
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}