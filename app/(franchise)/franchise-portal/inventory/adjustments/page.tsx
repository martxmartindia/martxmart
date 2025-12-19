"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Eye, TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Adjustment {
  id: string
  productId: string
  productName: string
  type: "increase" | "decrease"
  quantity: number
  reason: string
  previousStock: number
  newStock: number
  adjustmentDate: string
  performedBy: string
}

export default function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAdjustments()
  }, [])

  const fetchAdjustments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/franchise-portal/inventory/adjustments")

      if (!response.ok) {
        throw new Error("Failed to fetch adjustments")
      }

      const data = await response.json()
      setAdjustments(data.adjustments || [])
    } catch (error) {
      console.error("Error fetching adjustments:", error)
      toast.error("Failed to load adjustments")
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeBadge = (type: string) => {
    if (type === "increase") {
      return (
        <Badge className="bg-green-100 text-green-800">
          <TrendingUp className="mr-1 h-3 w-3" />
          Increase
        </Badge>
      )
    }
    return (
      <Badge className="bg-red-100 text-red-800">
        <TrendingDown className="mr-1 h-3 w-3" />
        Decrease
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading adjustments...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Adjustments</h1>
          <p className="text-muted-foreground">Manage stock level corrections and adjustments</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" />
          New Adjustment
        </Button>
      </div>

      {/* Adjustments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Adjustment History</CardTitle>
          <CardDescription>View and manage inventory adjustments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Adjustment ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Previous → New</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No adjustments found. Create your first adjustment to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  adjustments.map((adjustment) => (
                    <TableRow key={adjustment.id}>
                      <TableCell className="font-mono text-sm">{adjustment.id}</TableCell>
                      <TableCell className="font-medium">{adjustment.productName}</TableCell>
                      <TableCell>{getTypeBadge(adjustment.type)}</TableCell>
                      <TableCell>{adjustment.quantity}</TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {adjustment.previousStock} → {adjustment.newStock}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate" title={adjustment.reason}>
                        {adjustment.reason}
                      </TableCell>
                      <TableCell>{adjustment.performedBy}</TableCell>
                      <TableCell>{new Date(adjustment.adjustmentDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
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