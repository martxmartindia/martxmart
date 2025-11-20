"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Package, ShoppingCart, DollarSign, Clock, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "sonner";

interface DashboardData {
  stats: {
    totalProducts: number
    approvedProducts: number
    pendingProducts: number
    totalOrders: number
    pendingOrders: number
    packingOrders: number
    totalEarnings: number
    monthlyEarnings: number
    earningsChange: number
  }
  recentOrders: {
    id: string
    orderNumber: string
    customerName: string
    amount: number
    status: string
    packagingStatus: string
    createdAt: string
  }[]
  topProducts: {
    id: string
    name: string
    sales: number
    earnings: number
  }[]
  earningsChart: {
    month: string
    earnings: number
  }[]
  orderStatusChart: {
    status: string
    count: number
    color: string
  }[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function VendorDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/vendor-portal/dashboard")
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to fetch dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">No dashboard data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business performance on the platform</p>
      </div>

      {/* Welcome Card */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Package className="h-8 w-8 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Welcome to Your Vendor Portal</h3>
              <p className="text-blue-700 mb-3">
                You're supplying products to our platform. Customers buy from us, and you handle fulfillment.
              </p>
              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link href="/vendor-portal/products/new">Add New Product</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/vendor-portal/orders">View Orders</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.totalProducts}</div>
            <div className="text-xs text-muted-foreground">
              {dashboardData.stats.approvedProducts} approved, {dashboardData.stats.pendingProducts} pending
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fulfillment Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.totalOrders}</div>
            <div className="text-xs text-muted-foreground">
              {dashboardData.stats.pendingOrders} pending, {dashboardData.stats.packingOrders} packing
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.stats.monthlyEarnings)}</div>
            <div className="flex items-center text-xs">
              {dashboardData.stats.earningsChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={dashboardData.stats.earningsChange >= 0 ? "text-green-500" : "text-red-500"}>
                {formatPercentage(dashboardData.stats.earningsChange)}
              </span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(dashboardData.stats.totalEarnings)}</div>
            <div className="text-xs text-muted-foreground">Your share from platform sales</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Earnings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings Trend</CardTitle>
            <CardDescription>Your monthly earnings from platform sales</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.earningsChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), "Earnings"]} />
                <Line type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Current status of your fulfillment orders</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.orderStatusChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {dashboardData.orderStatusChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Fulfillment Orders</CardTitle>
            <CardDescription>Latest orders requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent orders</p>
              ) : (
                dashboardData.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.amount)}</p>
                      <div className="flex gap-1">
                        {getStatusBadge(order.status)}
                        {getPackagingStatusBadge(order.packagingStatus)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {dashboardData.recentOrders.length > 0 && (
              <div className="pt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/vendor-portal/orders">View All Orders</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Your best selling products on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No sales data available</p>
              ) : (
                dashboardData.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                    </div>
                    <p className="font-medium">{formatCurrency(product.earnings)}</p>
                  </div>
                ))
              )}
            </div>
            {dashboardData.topProducts.length > 0 && (
              <div className="pt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/vendor-portal/products">Manage Products</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for vendor management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button asChild className="h-20 flex-col">
              <Link href="/vendor-portal/products/new">
                <Package className="h-6 w-6 mb-2" />
                Add Product
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/vendor-portal/orders?status=PENDING">
                <Clock className="h-6 w-6 mb-2" />
                Pending Orders
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/vendor-portal/orders?packaging=IN_PROGRESS">
                <Truck className="h-6 w-6 mb-2" />
                Packing Queue
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/vendor-portal/analytics">
                <BarChart className="h-6 w-6 mb-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
