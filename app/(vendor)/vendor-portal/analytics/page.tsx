"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
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
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    change: number
    data: { month: string; revenue: number }[]
  }
  orders: {
    current: number
    previous: number
    change: number
    data: { month: string; orders: number }[]
  }
  customers: {
    current: number
    previous: number
    change: number
  }
  products: {
    current: number
    previous: number
    change: number
  }
  topProducts: { name: string; sales: number; revenue: number }[]
  categoryBreakdown: { category: string; value: number; color: string }[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function VendorAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>({
    revenue: { current: 0, previous: 0, change: 0, data: [] },
    orders: { current: 0, previous: 0, change: 0, data: [] },
    customers: { current: 0, previous: 0, change: 0 },
    products: { current: 0, previous: 0, change: 0 },
    topProducts: [],
    categoryBreakdown: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30")

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/vendor-portal/analytics?range=${timeRange}`)
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data")
      }
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
      toast.error("Failed to fetch analytics data")
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your business performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData?.revenue?.current ?? 0)}</div>
            <div className="flex items-center text-xs">
              {(analyticsData?.revenue?.change ?? 0) >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={(analyticsData?.revenue?.change ?? 0) >= 0 ? "text-green-500" : "text-red-500"}>
                {formatPercentage(analyticsData?.revenue?.change ?? 0)}
              </span>
              <span className="text-muted-foreground ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.orders?.current ?? 0}</div>
            <div className="flex items-center text-xs">
              {(analyticsData?.orders?.change ?? 0) >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={(analyticsData?.orders?.change ?? 0) >= 0 ? "text-green-500" : "text-red-500"}>
                {formatPercentage(analyticsData?.orders?.change ?? 0)}
              </span>
              <span className="text-muted-foreground ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.customers?.current ?? 0}</div>
            <div className="flex items-center text-xs">
              {(analyticsData?.customers?.change ?? 0) >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={(analyticsData?.customers?.change ?? 0) >= 0 ? "text-green-500" : "text-red-500"}>
                {formatPercentage(analyticsData?.customers?.change ?? 0)}
              </span>
              <span className="text-muted-foreground ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.products?.current ?? 0}</div>
            <div className="flex items-center text-xs">
              {(analyticsData?.products?.change ?? 0) >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={(analyticsData?.products?.change ?? 0) >= 0 ? "text-green-500" : "text-red-500"}>
                {formatPercentage(analyticsData?.products?.change ?? 0)}
              </span>
              <span className="text-muted-foreground ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData?.revenue?.data ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders Trend</CardTitle>
            <CardDescription>Monthly orders over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData?.orders?.data ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue breakdown by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData?.categoryBreakdown ?? []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, value }) => {
                    const total = (analyticsData?.categoryBreakdown ?? []).reduce((sum, item) => sum + item.value, 0);
                    const percent = total > 0 ? (value / total) * 100 : 0;
                    return `${category} ${percent.toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(analyticsData?.categoryBreakdown ?? []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(value as number), "Revenue"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Your best performing products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(analyticsData?.topProducts ?? []).map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                    </div>
                  </div>
                  <p className="font-medium">{formatCurrency(product.revenue)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
