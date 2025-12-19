"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRightLeft, Plus, Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Transfer {
  id: string
  productId: string
  productName: string
  fromLocation: string
  toLocation: string
  quantity: number
  status: "pending" | "in_transit" | "completed" | "cancelled"
  transferDate: string
  notes?: string
  createdBy: string
}

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTransfers()
  }, [])

  const fetchTransfers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/franchise-portal/inventory/transfers")

      if (!response.ok) {
        throw new Error("Failed to fetch transfers")
      }

      const data = await response.json()
      setTransfers(data.transfers || [])
    } catch (error) {
      console.error("Error fetching transfers:", error)
      toast.error("Failed to load transfers")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Completed", className: "bg-green-100 text-green-800" },
      in_transit: { label: "In Transit", className: "bg-blue-100 text-blue-800" },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.className}>{config.label}</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading transfers...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Transfers</h1>
          <p className="text-muted-foreground">Manage product transfers between locations</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" />
          New Transfer
        </Button>
      </div>

      {/* Transfers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>View and manage inventory transfers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transfer ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>From → To</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No transfers found
                    </TableCell>
                  </TableRow>
                ) : (
                  transfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-mono text-sm">{transfer.id}</TableCell>
                      <TableCell className="font-medium">{transfer.productName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{transfer.fromLocation}</span>
                          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{transfer.toLocation}</span>
                        </div>
                      </TableCell>
                      <TableCell>{transfer.quantity}</TableCell>
                      <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                      <TableCell>{new Date(transfer.transferDate).toLocaleDateString()}</TableCell>
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