"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, AlertTriangle, CheckCircle, Package, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface InventoryItem {
  product: string
  sku: string
  currentStock: number
  minStock: number
  maxStock: number
  status: string
  lastUpdated: string
}

interface InventorySummary {
  totalProducts: number
  inStockProducts: number
  lowStockProducts: number
  outOfStockProducts: number
  totalValue: number
}

export default function InventoryReportPage() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([])
  const [summary, setSummary] = useState<InventorySummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchInventoryReport()
  }, [])

  const fetchInventoryReport = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/franchise-portal/reports/inventory")

      if (!response.ok) {
        throw new Error("Failed to fetch inventory report")
      }

      const data = await response.json()
      setInventoryData(data.inventory || [])
      setSummary(data.summary)
    } catch (error) {
      console.error("Error fetching inventory report:", error)
      toast.error("Failed to load inventory report")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string, currentStock: number, minStock: number) => {
    if (currentStock === 0) {
      return (
        <Badge className="bg-red-100 text-red-800">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Out of Stock
        </Badge>
      )
    }

    if (currentStock <= minStock) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Low Stock
        </Badge>
      )
    }

    return (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="mr-1 h-3 w-3" />
        In Stock
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading inventory report...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Report</h1>
          <p className="text-muted-foreground">Comprehensive inventory status and analytics</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary?.inStockProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Above minimum levels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary?.lowStockProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Below minimum levels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary?.outOfStockProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Zero inventory</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Details</CardTitle>
          <CardDescription>Detailed view of all products and their stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min/Max Levels</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.product}</TableCell>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell>
                      <span className={item.currentStock <= item.minStock ? "text-red-600 font-medium" : ""}>
                        {item.currentStock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {item.minStock} / {item.maxStock}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status, item.currentStock, item.minStock)}</TableCell>
                    <TableCell>{item.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}