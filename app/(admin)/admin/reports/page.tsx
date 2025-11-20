"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Loader2, Download, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BarChart,
  Bar,
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
import { toast } from "sonner"

export default function AdminReportsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [reportType, setReportType] = useState("sales")
  const [dateRange, setDateRange] = useState("last30days")
  const [startDate, setStartDate] = useState(format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"))

  const generateReport = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Report generated successfully")
    }, 1500)
  }

  const downloadReport = (format: string) => {
    toast.success(`Report downloaded in ${format} format`)
  }

  // Sample data for reports
  const salesData = [
    { name: "Jan", sales: 4000, revenue: 240000 },
    { name: "Feb", sales: 3000, revenue: 198000 },
    { name: "Mar", sales: 5000, revenue: 280000 },
    { name: "Apr", sales: 2780, revenue: 190000 },
    { name: "May", sales: 1890, revenue: 130000 },
    { name: "Jun", sales: 2390, revenue: 150000 },
    { name: "Jul", sales: 3490, revenue: 210000 },
  ]

  const userRegistrationData = [
    { name: "Jan", customers: 120, vendors: 5, authors: 2, franchises: 1 },
    { name: "Feb", customers: 150, vendors: 8, authors: 3, franchises: 0 },
    { name: "Mar", customers: 180, vendors: 10, authors: 5, franchises: 2 },
    { name: "Apr", customers: 210, vendors: 7, authors: 4, franchises: 1 },
    { name: "May", customers: 250, vendors: 12, authors: 6, franchises: 3 },
    { name: "Jun", customers: 280, vendors: 15, authors: 8, franchises: 2 },
    { name: "Jul", customers: 310, vendors: 18, authors: 10, franchises: 4 },
  ]

  const productPerformanceData = [
    { name: "Electronics", sales: 400, revenue: 240000 },
    { name: "Clothing", sales: 300, revenue: 150000 },
    { name: "Home", sales: 200, revenue: 100000 },
    { name: "Books", sales: 150, revenue: 45000 },
    { name: "Sports", sales: 100, revenue: 60000 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and download detailed reports</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Generator</CardTitle>
          <CardDescription>Configure and generate custom reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="users">User Registration</SelectItem>
                  <SelectItem value="products">Product Performance</SelectItem>
                  <SelectItem value="inventory">Inventory Status</SelectItem>
                  <SelectItem value="franchises">Franchise Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-range">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger id="date-range">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === "custom" && (
              <>
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>

                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => downloadReport("pdf")}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" onClick={() => downloadReport("excel")}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" onClick={() => downloadReport("csv")}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>

            <Button onClick={generateReport} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sales">
        <TabsList className="mb-6">
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="products">Product Analytics</TabsTrigger>
          <TabsTrigger value="franchises">Franchise Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <h3 className="text-3xl font-bold">₹1,248,000</h3>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <h3 className="text-3xl font-bold">1,842</h3>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <h3 className="text-3xl font-bold">₹677</h3>
                  <p className="text-sm text-muted-foreground">Average Order Value</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>Monthly sales and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" name="Orders" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="revenue" name="Revenue (₹)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Registration Trends</CardTitle>
              <CardDescription>Monthly user registrations by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userRegistrationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="customers" name="Customers" stackId="a" fill="#8884d8" />
                    <Bar dataKey="vendors" name="Vendors" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="authors" name="Authors" stackId="a" fill="#ffc658" />
                    <Bar dataKey="franchises" name="Franchises" stackId="a" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Category Performance</CardTitle>
                <CardDescription>Sales and revenue by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productPerformanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="sales"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {productPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Total revenue by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={productPerformanceData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue (₹)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="franchises">
          <Card>
            <CardHeader>
              <CardTitle>Franchise Performance</CardTitle>
              <CardDescription>Sales and revenue by franchise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" name="Orders" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="revenue" name="Revenue (₹)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

