"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus, AlertTriangle, Package, TrendingUp, Minus } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface InventoryItem {
  id: string
  product: {
    id: string
    name: string
    sku: string
    category: string
    price: number
  }
  quantity: number
  minStock: number
  location: string
  createdAt: string
  updatedAt: string
}

interface StockAdjustment {
  productId: string
  adjustmentType: "IN" | "OUT"
  quantity: number
  reason: string
  notes?: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [openAdjustment, setOpenAdjustment] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [adjustmentData, setAdjustmentData] = useState<StockAdjustment>({
    productId: "",
    adjustmentType: "IN",
    quantity: 0,
    reason: "",
    notes: "",
  })

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/franchise-portal/inventory")
      if (!response.ok) throw new Error("Failed to fetch inventory")

      const data = await response.json()
      setInventory(data.inventory)
    } catch (error) {
      console.error("Error fetching inventory:", error)
      toast.error("Failed to load inventory")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/franchise-portal/inventory/adjustments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adjustmentData),
      })

      if (!response.ok) throw new Error("Failed to adjust stock")

      // Refresh inventory
      await fetchInventory()

      // Reset form and close dialog
      setAdjustmentData({
        productId: "",
        adjustmentType: "IN",
        quantity: 0,
        reason: "",
        notes: "",
      })
      setSelectedItem(null)
      setOpenAdjustment(false)

      toast.success("Stock adjustment recorded successfully")
    } catch (error) {
      console.error("Error adjusting stock:", error)
      toast.error("Failed to adjust stock")
    }
  }

  const openAdjustmentDialog = (item: InventoryItem) => {
    setSelectedItem(item)
    setAdjustmentData({
      ...adjustmentData,
      productId: item.product.id,
    })
    setOpenAdjustment(true)
  }

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.minStock) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Low Stock
        </Badge>
      )
    } else if (item.quantity === 0) {
      return (
        <Badge className="bg-red-600">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Out of Stock
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-green-500">
          <Package className="mr-1 h-3 w-3" />
          In Stock
        </Badge>
      )
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || item.product.category === categoryFilter

    let matchesStock = true
    if (stockFilter === "low") {
      matchesStock = item.quantity <= item.minStock
    } else if (stockFilter === "out") {
      matchesStock = item.quantity === 0
    } else if (stockFilter === "in") {
      matchesStock = item.quantity > item.minStock
    }

    return matchesSearch && matchesCategory && matchesStock
  })

  const lowStockItems = inventory.filter((item) => item.quantity <= item.minStock)
  const outOfStockItems = inventory.filter((item) => item.quantity === 0)
  const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.product.price, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Monitor and manage your product inventory</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Products in inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items need restocking</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items unavailable</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>View and manage your product stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                <SelectItem value="Books">Books</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="in">In Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product.name}</TableCell>
                      <TableCell className="font-mono text-sm">{item.product.sku}</TableCell>
                      <TableCell className="capitalize">{item.product.category}</TableCell>
                      <TableCell className="font-bold">{item.quantity}</TableCell>
                      <TableCell>{item.minStock}</TableCell>
                      <TableCell>{formatCurrency(item.product.price)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(item.quantity * item.product.price)}
                      </TableCell>
                      <TableCell>{getStockStatus(item)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => openAdjustmentDialog(item)}>
                          <Plus className="h-4 w-4 mr-1" />
                          Adjust
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

      {/* Stock Adjustment Dialog */}
      <Dialog open={openAdjustment} onOpenChange={setOpenAdjustment}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Stock Adjustment</DialogTitle>
            <DialogDescription>Adjust stock levels for {selectedItem?.product.name}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStockAdjustment}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="adjustmentType" className="text-right">
                  Type
                </Label>
                <Select
                  value={adjustmentData.adjustmentType}
                  onValueChange={(value) =>
                    setAdjustmentData({ ...adjustmentData, adjustmentType: value as "IN" | "OUT" })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">
                      <div className="flex items-center">
                        <Plus className="mr-2 h-4 w-4 text-green-500" />
                        Stock In
                      </div>
                    </SelectItem>
                    <SelectItem value="OUT">
                      <div className="flex items-center">
                        <Minus className="mr-2 h-4 w-4 text-red-500" />
                        Stock Out
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  className="col-span-3"
                  value={adjustmentData.quantity}
                  onChange={(e) =>
                    setAdjustmentData({ ...adjustmentData, quantity: Number.parseInt(e.target.value) || 0 })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Reason
                </Label>
                <Input
                  id="reason"
                  className="col-span-3"
                  value={adjustmentData.reason}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, reason: e.target.value })}
                  placeholder="e.g., Received shipment, Damaged goods"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Input
                  id="notes"
                  className="col-span-3"
                  value={adjustmentData.notes}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, notes: e.target.value })}
                  placeholder="Additional notes (optional)"
                />
              </div>
              {selectedItem && (
                <div className="col-span-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Current Stock:</span>
                      <span className="font-medium">{selectedItem.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adjustment:</span>
                      <span
                        className={`font-medium ${adjustmentData.adjustmentType === "IN" ? "text-green-600" : "text-red-600"}`}
                      >
                        {adjustmentData.adjustmentType === "IN" ? "+" : "-"}
                        {adjustmentData.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span>New Stock:</span>
                      <span className="font-bold">
                        {adjustmentData.adjustmentType === "IN"
                          ? selectedItem.quantity + adjustmentData.quantity
                          : selectedItem.quantity - adjustmentData.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                Record Adjustment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
