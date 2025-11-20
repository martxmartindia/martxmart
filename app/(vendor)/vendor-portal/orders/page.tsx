"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Package, Search, Download, Eye, Truck, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import {toast} from "sonner"

interface VendorOrder {
  id: string
  orderNumber: string
  platformOrderId: string // Reference to the main customer order
  customerName: string // For packaging reference only
  items: {
    productName: string
    quantity: number
    vendorPrice: number // What vendor gets paid
    platformPrice: number // What customer pays
  }[]
  totalVendorAmount: number // What vendor receives
  totalPlatformAmount: number // What customer pays
  status: "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED"
  packagingStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED"
  shippingAddress: string
  specialInstructions?: string
  createdAt: string
  updatedAt: string
  vendorInvoiceNumber?: string
}

export default function VendorOrders() {
  const [orders, setOrders] = useState<VendorOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/vendor-portal/orders")
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }
      const data = await response.json()
      setOrders(data.orders)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to fetch orders")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePackagingStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/vendor-portal/orders/${orderId}/packaging`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packagingStatus: status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update packaging status")
      }

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, packagingStatus: status as VendorOrder["packagingStatus"] } : order,
        ),
      )

      toast.success("Packaging status updated successfully.")
    } catch (error) {
      console.error("Error updating packaging status:", error)
      toast.error("Failed to update packaging status. Please try again.")
    }
  }

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      const response = await fetch(`/api/vendor-portal/orders/${orderId}/invoice`)
      if (!response.ok) {
        throw new Error("Failed to generate invoice")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `vendor-invoice-${orderId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)

      toast.success("Invoice downloaded successfully.")
    } catch (error) {
      console.error("Error downloading invoice:", error)
      toast.error("Failed to generate invoice. Please try again.")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-orange-500">Pending</Badge>
      case "CONFIRMED":
        return <Badge className="bg-blue-500">Confirmed</Badge>
      case "PACKED":
        return <Badge className="bg-purple-500">Packed</Badge>
      case "SHIPPED":
        return <Badge className="bg-indigo-500">Shipped</Badge>
      case "DELIVERED":
        return <Badge className="bg-green-500">Delivered</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPackagingStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline">Not Started</Badge>
      case "IN_PROGRESS":
        return <Badge className="bg-orange-500">In Progress</Badge>
      case "COMPLETED":
        return <Badge className="bg-green-500">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.platformOrderId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const pendingOrders = orders.filter((order) => order.status === "PENDING").length
  const totalEarnings = orders
    .filter((order) => order.status === "DELIVERED")
    .reduce((acc, order) => acc + order.totalVendorAmount, 0)
  const packingOrders = orders.filter((order) => order.packagingStatus === "IN_PROGRESS").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Fulfillment Orders</h1>
        <p className="text-muted-foreground">Manage packaging and shipping for platform orders</p>
      </div>

      {/* Info Alert */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Order Fulfillment Process:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Customer places order on platform (you don't interact with customer directly)</li>
                <li>You receive fulfillment request with packaging details</li>
                <li>Pack items according to shipping address provided</li>
                <li>Generate your vendor invoice for platform payment</li>
                <li>Platform handles customer billing and support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Packing Queue</CardTitle>
            <Truck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{packingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Vendor share</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fulfillment Orders</CardTitle>
          <CardDescription>Orders requiring packaging and shipping</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4 gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Orders</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PACKED">Packed</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Details</TableHead>
                    <TableHead>Customer Info</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Your Earnings</TableHead>
                    <TableHead>Packaging</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.orderNumber}</div>
                            <div className="text-sm text-muted-foreground">Platform: {order.platformOrderId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-sm text-muted-foreground">For packaging only</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {order.items.length} item{order.items.length > 1 ? "s" : ""}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">₹{order.totalVendorAmount.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            Customer pays: ₹{order.totalPlatformAmount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>{getPackagingStatusBadge(order.packagingStatus)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/vendor-portal/orders/${order.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(order.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            {order.packagingStatus === "PENDING" && (
                              <Button size="sm" onClick={() => handleUpdatePackagingStatus(order.id, "IN_PROGRESS")}>
                                Start Packing
                              </Button>
                            )}
                            {order.packagingStatus === "IN_PROGRESS" && (
                              <Button size="sm" onClick={() => handleUpdatePackagingStatus(order.id, "COMPLETED")}>
                                Mark Packed
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
