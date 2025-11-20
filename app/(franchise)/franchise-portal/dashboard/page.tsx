"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from "lucide-react"

// Import components
import { VendorManagement } from "@/components/franchise/vendor-management"
import { InventoryManagement } from "@/components/franchise/inventory-management"
import { MessagingSystem } from "@/components/franchise/messaging-system"
import { TicketSystem } from "@/components/franchise/ticket-system"
import { PromotionManagement } from "@/components/franchise/promotion-management"
import { PaymentManagement } from "@/components/franchise/payment-management"
import { StaffManagement } from "@/components/franchise/staff-management"

interface DashboardData {
  totalSales: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  salesGrowth: number
  ordersGrowth: number
  customersGrowth: number
  productsGrowth: number
  recentOrders: any[]
  salesByCategory: any[]
  salesByDay: any[]
  topProducts: any[]
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/franchise-portal/dashboard")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Franchise Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your franchise performance.</p>
        </div>
        <Button onClick={() => window.location.reload()}>Refresh Data</Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <Card>
          <CardContent className="p-0">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-b-transparent px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="vendors"
                className="rounded-none border-b-2 border-b-transparent px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
              >
                Vendors
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="rounded-none border-b-2 border-b-transparent px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
              >
                Inventory
              </TabsTrigger>
              <TabsTrigger
                value="messaging"
                className="rounded-none border-b-2 border-b-transparent px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
              >
                Messaging
              </TabsTrigger>
              <TabsTrigger
                value="tickets"
                className="rounded-none border-b-2 border-b-transparent px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
              >
                Tickets
              </TabsTrigger>
              <TabsTrigger
                value="promotions"
                className="rounded-none border-b-2 border-b-transparent px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
              >
                Promotions
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="rounded-none border-b-2 border-b-transparent px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
              >
                Payments
              </TabsTrigger>
              <TabsTrigger
                value="staff"
                className="rounded-none border-b-2 border-b-transparent px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
              >
                Staff
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        <TabsContent value="overview" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboardData?.totalSales || 0)}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span
                      className={`mr-1 ${dashboardData?.salesGrowth && dashboardData.salesGrowth > 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {dashboardData?.salesGrowth && dashboardData.salesGrowth > 0 ? "+" : ""}
                      {dashboardData?.salesGrowth || 0}%
                    </span>
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="ml-1">from last month</span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.totalOrders || 0}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span
                      className={`mr-1 ${dashboardData?.ordersGrowth && dashboardData.ordersGrowth > 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {dashboardData?.ordersGrowth && dashboardData.ordersGrowth > 0 ? "+" : ""}
                      {dashboardData?.ordersGrowth || 0}%
                    </span>
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="ml-1">from last month</span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.totalCustomers || 0}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span
                      className={`mr-1 ${dashboardData?.customersGrowth && dashboardData.customersGrowth > 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {dashboardData?.customersGrowth && dashboardData.customersGrowth > 0 ? "+" : ""}
                      {dashboardData?.customersGrowth || 0}%
                    </span>
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="ml-1">from last month</span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.totalProducts || 0}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span
                      className={`mr-1 ${dashboardData?.productsGrowth && dashboardData.productsGrowth > 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {dashboardData?.productsGrowth && dashboardData.productsGrowth > 0 ? "+" : ""}
                      {dashboardData?.productsGrowth || 0}%
                    </span>
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="ml-1">from last month</span>
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Daily sales for the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-80 w-full bg-gray-100 animate-pulse rounded-md"></div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData?.salesByDay || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="amount" fill="#8884d8" name="Sales" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across categories</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-80 w-full bg-gray-100 animate-pulse rounded-md"></div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData?.salesByCategory || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData?.salesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from customers</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex justify-between items-center animate-pulse">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData?.recentOrders.map((order) => (
                      <div key={order.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.id}</p>
                        </div>
                        <div className="font-medium">{formatCurrency(order.amount)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best selling products this month</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex justify-between items-center animate-pulse">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData?.topProducts.map((product) => (
                      <div key={product.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <div className="font-medium">{product.sold} sold</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <VendorManagement />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryManagement />
        </TabsContent>

        <TabsContent value="messaging" className="space-y-4">
          <MessagingSystem />
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <TicketSystem />
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <PromotionManagement />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <PaymentManagement />
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <StaffManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
