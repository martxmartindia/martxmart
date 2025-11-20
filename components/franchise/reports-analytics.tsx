"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
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
import { ArrowDownToLine, Calendar, Download, Filter } from "lucide-react"

// Sample data for charts
const salesData = [
  { month: "Jan", sales: 65000, orders: 120, target: 60000 },
  { month: "Feb", sales: 59000, orders: 110, target: 60000 },
  { month: "Mar", sales: 80000, orders: 140, target: 70000 },
  { month: "Apr", sales: 81000, orders: 145, target: 70000 },
  { month: "May", sales: 56000, orders: 100, target: 60000 },
  { month: "Jun", sales: 55000, orders: 90, target: 60000 },
  { month: "Jul", sales: 40000, orders: 80, target: 50000 },
  { month: "Aug", sales: 45000, orders: 85, target: 50000 },
  { month: "Sep", sales: 60000, orders: 110, target: 60000 },
  { month: "Oct", sales: 70000, orders: 130, target: 65000 },
  { month: "Nov", sales: 90000, orders: 150, target: 70000 },
  { month: "Dec", sales: 100000, orders: 170, target: 80000 },
]

const categoryData = [
  { name: "Electronics", value: 35 },
  { name: "Clothing", value: 25 },
  { name: "Home Appliances", value: 20 },
  { name: "Furniture", value: 15 },
  { name: "Others", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const topProducts = [
  { id: 1, name: "Smart TV 43-inch", category: "Electronics", sales: 45, revenue: 675000 },
  { id: 2, name: "Washing Machine 7kg", category: "Home Appliances", sales: 38, revenue: 570000 },
  { id: 3, name: "Refrigerator Double Door", category: "Home Appliances", sales: 32, revenue: 640000 },
  { id: 4, name: "Sofa Set 3+1+1", category: "Furniture", sales: 28, revenue: 560000 },
  { id: 5, name: "Men's Formal Shirt", category: "Clothing", sales: 25, revenue: 125000 },
]

const topCustomers = [
  { id: 1, name: "Rajesh Kumar", orders: 12, totalSpent: 120000, lastOrder: "2023-11-05" },
  { id: 2, name: "Priya Sharma", orders: 10, totalSpent: 95000, lastOrder: "2023-11-08" },
  { id: 3, name: "Amit Patel", orders: 8, totalSpent: 85000, lastOrder: "2023-10-25" },
  { id: 4, name: "Neha Singh", orders: 7, totalSpent: 70000, lastOrder: "2023-11-02" },
  { id: 5, name: "Vikram Verma", orders: 6, totalSpent: 65000, lastOrder: "2023-10-30" },
]

export function ReportsAnalytics() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("year")
  const [activeTab, setActiveTab] = useState("sales")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reports & Analytics</CardTitle>
          <CardDescription>View and analyze your franchise performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sales" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <TabsContent value="sales" className="m-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {formatCurrency(salesData.reduce((sum, item) => sum + item.sales, 0))}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {timeRange === "year"
                            ? "Jan - Dec 2023"
                            : timeRange === "quarter"
                              ? "Oct - Dec 2023"
                              : "Nov 2023"}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {salesData.reduce((sum, item) => sum + item.orders, 0)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {timeRange === "year"
                            ? "Jan - Dec 2023"
                            : timeRange === "quarter"
                              ? "Oct - Dec 2023"
                              : "Nov 2023"}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {formatCurrency(
                            salesData.reduce((sum, item) => sum + item.sales, 0) /
                              salesData.reduce((sum, item) => sum + item.orders, 0),
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {timeRange === "year"
                            ? "Jan - Dec 2023"
                            : timeRange === "quarter"
                              ? "Oct - Dec 2023"
                              : "Nov 2023"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Sales Performance</CardTitle>
                      <CardDescription>Monthly sales vs target</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={salesData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Legend />
                            <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} name="Sales" />
                            <Line type="monotone" dataKey="target" stroke="#82ca9d" name="Target" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Orders by Month</CardTitle>
                        <CardDescription>Monthly order count</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={salesData}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                        <CardDescription>Distribution of sales across categories</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {categoryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => `${value}%`} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="products" className="m-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Selling Products</CardTitle>
                      <CardDescription>Products with highest sales volume</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Units Sold</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>{product.sales}</TableCell>
                              <TableCell>{formatCurrency(product.revenue)}</TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline">
                                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                                  Report
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Product Category Distribution</CardTitle>
                        <CardDescription>Sales distribution by product category</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {categoryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => `${value}%`} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Product Performance</CardTitle>
                        <CardDescription>Top 5 products by revenue</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={topProducts}
                              layout="vertical"
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis dataKey="name" type="category" width={100} />
                              <Tooltip formatter={(value) => formatCurrency(value as number)} />
                              <Legend />
                              <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="customers" className="m-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Customers</CardTitle>
                      <CardDescription>Customers with highest purchase value</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer Name</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead>Total Spent</TableHead>
                            <TableHead>Last Order</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topCustomers.map((customer) => (
                            <TableRow key={customer.id}>
                              <TableCell className="font-medium">{customer.name}</TableCell>
                              <TableCell>{customer.orders}</TableCell>
                              <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                              <TableCell>{new Date(customer.lastOrder).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline">
                                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                                  Report
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Orders</CardTitle>
                        <CardDescription>Distribution of orders per customer</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={topCustomers}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Spending</CardTitle>
                        <CardDescription>Total amount spent by top customers</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={topCustomers}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value) => formatCurrency(value as number)} />
                              <Legend />
                              <Bar dataKey="totalSpent" fill="#82ca9d" name="Total Spent" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="inventory" className="m-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">125</div>
                        <div className="text-xs text-muted-foreground mt-1">Across all categories</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">12</div>
                        <div className="text-xs text-muted-foreground mt-1">Below minimum stock level</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Out of Stock Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-500">5</div>
                        <div className="text-xs text-muted-foreground mt-1">Requires immediate attention</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Inventory Value by Category</CardTitle>
                      <CardDescription>Total value of inventory by product category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { category: "Electronics", value: 1250000 },
                              { category: "Home Appliances", value: 980000 },
                              { category: "Furniture", value: 750000 },
                              { category: "Clothing", value: 450000 },
                              { category: "Others", value: 320000 },
                            ]}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" name="Inventory Value" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Stock Movement</CardTitle>
                      <CardDescription>Inventory additions and reductions over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={[
                              { month: "Jan", additions: 50, reductions: 30 },
                              { month: "Feb", additions: 45, reductions: 35 },
                              { month: "Mar", additions: 60, reductions: 40 },
                              { month: "Apr", additions: 55, reductions: 45 },
                              { month: "May", additions: 40, reductions: 35 },
                              { month: "Jun", additions: 45, reductions: 40 },
                              { month: "Jul", additions: 35, reductions: 30 },
                              { month: "Aug", additions: 30, reductions: 25 },
                              { month: "Sep", additions: 45, reductions: 40 },
                              { month: "Oct", additions: 50, reductions: 45 },
                              { month: "Nov", additions: 60, reductions: 50 },
                              { month: "Dec", additions: 70, reductions: 60 },
                            ]}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="additions"
                              stroke="#82ca9d"
                              activeDot={{ r: 8 }}
                              name="Stock Added"
                            />
                            <Line
                              type="monotone"
                              dataKey="reductions"
                              stroke="#ff7300"
                              activeDot={{ r: 8 }}
                              name="Stock Reduced"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
