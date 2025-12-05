"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, DollarSign, ShoppingCart, TrendingUp, Loader2, Calendar } from "lucide-react"
import { toast } from "sonner"

interface SalesSummary {
  totalSales: number
  totalOrders: number
  averageOrderValue: number
}

interface DailySale {
  date: string
  totalSales: number
  orderCount: number
  averageOrderValue: number
}

interface RecentOrder {
  id: string
  customerName: string
  customerEmail: string
  totalAmount: number
  status: string
  createdAt: string
  itemCount: number
}

export default function SalesReportPage() {
  const [summary, setSummary] = useState<SalesSummary | null>(null)
  const [dailySales, setDailySales] = useState<DailySale[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [salesByStatus, setSalesByStatus] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSalesReport()
  }, [])

  const fetchSalesReport = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/franchise-portal/reports/sales")

      if (!response.ok) {
        throw new Error("Failed to fetch sales report")
      }

      const data = await response.json()
      setSummary(data.summary)
      setDailySales(data.dailySales || [])
      setRecentOrders(data.recentOrders || [])
      setSalesByStatus(data.salesByStatus || {})
    } catch (error) {
      console.error("Error fetching sales report:", error)
      toast.error("Failed to load sales report")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      COMPLETED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      CANCELLED: "bg-red-100 text-red-800",
      PROCESSING: "bg-blue-100 text-blue-800",
    }
    return <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading sales report...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Report</h1>
          <p className="text-muted-foreground">Sales performance and order analytics</p>
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
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.totalSales || 0)}</div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.averageOrderValue || 0)}</div>
            <p className="text-xs text-muted-foreground">Per order average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailySales.length}</div>
            <p className="text-xs text-muted-foreground">Days with sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Sales by Status</CardTitle>
          <CardDescription>Revenue breakdown by order status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(salesByStatus).map(([status, amount]) => (
              <div key={status} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{status}</p>
                  <p className="text-sm text-muted-foreground">Status</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Sales</CardTitle>
          <CardDescription>Sales performance by date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Order Count</TableHead>
                  <TableHead>Avg Order Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailySales.map((day) => (
                  <TableRow key={day.date}>
                    <TableCell className="font-medium">{formatDate(day.date)}</TableCell>
                    <TableCell>{formatCurrency(day.totalSales)}</TableCell>
                    <TableCell>{day.orderCount}</TableCell>
                    <TableCell>{formatCurrency(day.averageOrderValue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest order activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.id.slice(-8)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>{order.itemCount}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
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