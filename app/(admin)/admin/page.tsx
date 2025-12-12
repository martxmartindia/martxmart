"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, ShoppingBag, DollarSign, Package, AlertTriangle, FileText, Tag, RefreshCw } from "lucide-react"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface DashboardData {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  pendingOrders: number
  lowStockProducts: number
  totalCategories: number
  totalBlogs: number
  userGrowthRate: number
  revenueGrowthRate: number
  systemHealth: number
  serverUptime: string
  errorRate: string
  pendingIssues: number
  recentOrders: never[]
  topProducts: never[]
  salesByMonth: Array<{ month: string; revenue: number; orders: number }>
  categoryDistribution: Array<{ name: string; value: number }>
  userTypeDistribution: Array<{ name: string; value: number }>
  userGrowthByType: Array<{
    date: string
    customers: number
    vendors: number
    authors: number
    franchises: number
    suppliers: number
  }>
  revenueByUserType: Array<{ name: string; revenue: number }>
  systemLogs: Array<{
    id: string
    level: string
    source: string
    timestamp: Date
    message: string
    details: string
    ip: string
    userAgent: string
  }>
  recentUsers: Array<{
    id: string
    name: string
    email: string
    role: string
    createdAt: string
  }>
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [timeRange, setTimeRange] = useState("7days")
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    totalCategories: 0,
    totalBlogs: 0,
    userGrowthRate: 0,
    revenueGrowthRate: 0,
    systemHealth: 0,
    serverUptime: "",
    errorRate: "",
    pendingIssues: 0,
    recentOrders: [],
    topProducts: [],
    salesByMonth: [],
    categoryDistribution: [],
    userTypeDistribution: [],
    userGrowthByType: [],
    revenueByUserType: [],
    systemLogs: [],
    recentUsers: [],
  })

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/dashboard?range=${timeRange}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch dashboard data")
      }

      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError(error instanceof Error ? error : new Error("An unknown error occurred"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Check authentication and admin role - but don't redirect if we're still loading
    if (status === 'loading') {
      return // Still loading session
    }
    
    console.log("🔍 [AdminPage] Session check:", {
      status,
      hasSession: !!session,
      hasUser: !!session?.user,
      userRole: session?.user?.role,
      isAdmin: session?.user?.role === 'ADMIN'
    });
    
    if (!session?.user) {
      console.log("🚫 [AdminPage] No session user, redirecting to login");
      router.push('/auth/admin/login?callbackUrl=/admin')
      return
    }
    
    if (session.user.role !== 'ADMIN') {
      console.log("🚫 [AdminPage] User is not admin:", session.user.role, "redirecting to home");
      router.push('/')
      return
    }
    
    console.log("✅ [AdminPage] User is admin, fetching dashboard data");
    // User is authenticated admin, fetch dashboard data
    fetchDashboardData()
  }, [session, status, router, timeRange])

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <Button onClick={fetchDashboardData} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  if (isLoading || status === 'loading') {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(null).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d", "#ffc658", "#8dd1e1"]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchDashboardData} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold">{dashboardData.totalUsers.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {dashboardData.userGrowthRate >= 0 ? (
                    <span className="text-green-600">+{dashboardData.userGrowthRate}%</span>
                  ) : (
                    <span className="text-red-600">{dashboardData.userGrowthRate}%</span>
                  )}
                  {" from previous period"}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <h3 className="text-2xl font-bold">{dashboardData.totalOrders.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {dashboardData.pendingOrders} pending orders
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold">₹{dashboardData.totalRevenue.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {dashboardData.revenueGrowthRate >= 0 ? (
                    <span className="text-green-600">+{dashboardData.revenueGrowthRate}%</span>
                  ) : (
                    <span className="text-red-600">{dashboardData.revenueGrowthRate}%</span>
                  )}
                  {" from previous period"}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <h3 className="text-2xl font-bold">{dashboardData.totalProducts.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {dashboardData.lowStockProducts} low stock items
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                <h3 className="text-2xl font-bold">{dashboardData.pendingOrders.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Products</p>
                <h3 className="text-2xl font-bold">{dashboardData.lowStockProducts.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <h3 className="text-2xl font-bold">{dashboardData.totalCategories.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Tag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blog Posts</p>
                <h3 className="text-2xl font-bold">{dashboardData.totalBlogs.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">System Health</p>
              <h3 className="text-2xl font-bold text-green-600">{dashboardData.systemHealth}%</h3>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Server Uptime</p>
              <h3 className="text-2xl font-bold text-blue-600">{dashboardData.serverUptime}</h3>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
              <h3 className="text-2xl font-bold text-yellow-600">{dashboardData.errorRate}</h3>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Issues</p>
              <h3 className="text-2xl font-bold text-orange-600">{dashboardData.pendingIssues}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="system">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardData.salesByMonth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="orders" name="Orders" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by User Type</CardTitle>
                <CardDescription>Distribution of revenue across user types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.revenueByUserType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="revenue"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData.revenueByUserType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Type Distribution</CardTitle>
                <CardDescription>Distribution of users by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.userTypeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData.userTypeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth by Type</CardTitle>
                <CardDescription>Monthly growth of different user types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dashboardData.userGrowthByType}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="customers" stroke="#8884d8" />
                      <Line type="monotone" dataKey="vendors" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="authors" stroke="#ffc658" />
                      <Line type="monotone" dataKey="franchises" stroke="#ff7300" />
                      <Line type="monotone" dataKey="suppliers" stroke="#8dd1e1" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left font-medium">Name</th>
                      <th className="py-3 px-4 text-left font-medium">Email</th>
                      <th className="py-3 px-4 text-left font-medium">Role</th>
                      <th className="py-3 px-4 text-left font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "VENDOR"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>Recent system activities and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.systemLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 rounded-lg border ${
                      log.level === "error"
                        ? "bg-red-50 border-red-200"
                        : log.level === "warning"
                          ? "bg-yellow-50 border-yellow-200"
                          : log.level === "success"
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            log.level === "error"
                              ? "bg-red-100 text-red-800"
                              : log.level === "warning"
                                ? "bg-yellow-100 text-yellow-800"
                                : log.level === "success"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {log.level}
                        </span>
                        <span className="font-medium">{log.source}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2">{log.message}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{log.details}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <span>IP: {log.ip}</span>
                      <span className="mx-2">•</span>
                      <span>User Agent: {log.userAgent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

