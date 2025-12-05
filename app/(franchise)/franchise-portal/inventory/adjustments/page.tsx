"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Eye, TrendingUp, TrendingDown } from "lucide-react"

export default function AdjustmentsPage() {
  // Mock data for demonstration
  const adjustments = [
    {
      id: "ADJ-001",
      product: "CNC Lathe Machine",
      type: "increase",
      quantity: 5,
      reason: "Stock count correction",
      previousStock: 10,
      newStock: 15,
      date: "2024-01-15",
      performedBy: "John Doe",
    },
    {
      id: "ADJ-002",
      product: "Tractor Engine",
      type: "decrease",
      quantity: 2,
      reason: "Damaged goods",
      previousStock: 8,
      newStock: 6,
      date: "2024-01-14",
      performedBy: "Jane Smith",
    },
    {
      id: "ADJ-003",
      product: "Concrete Mixer",
      type: "increase",
      quantity: 1,
      reason: "Supplier return",
      previousStock: 12,
      newStock: 13,
      date: "2024-01-13",
      performedBy: "Mike Johnson",
    },
  ]

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
                      No adjustments found
                    </TableCell>
                  </TableRow>
                ) : (
                  adjustments.map((adjustment) => (
                    <TableRow key={adjustment.id}>
                      <TableCell className="font-mono text-sm">{adjustment.id}</TableCell>
                      <TableCell className="font-medium">{adjustment.product}</TableCell>
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
                      <TableCell>{adjustment.date}</TableCell>
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