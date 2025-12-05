"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, DollarSign, TrendingUp, TrendingDown, CreditCard, Banknote, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface FinancialData {
  month: string
  revenue: number
  expenses: number
  profit: number
  orders: number
  growth?: number
}

interface FinancialSummary {
  totalRevenue: number
  totalExpenses: number
  totalProfit: number
  totalOrders: number
  averageGrowth: number
  profitMargin: number
}

export default function FinancialReportPage() {
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFinancialReport()
  }, [])

  const fetchFinancialReport = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/franchise-portal/reports/financial")

      if (!response.ok) {
        throw new Error("Failed to fetch financial report")
      }

      const data = await response.json()
      setFinancialData(data.monthlyData || [])
      setSummary(data.summary)
    } catch (error) {
      console.error("Error fetching financial report:", error)
      toast.error("Failed to load financial report")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getGrowthBadge = (growth: number) => {
    if (growth > 0) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <TrendingUp className="mr-1 h-3 w-3" />
          +{growth.toFixed(1)}%
        </Badge>
      )
    }
    return (
      <Badge className="bg-red-100 text-red-800">
        <TrendingDown className="mr-1 h-3 w-3" />
        {growth.toFixed(1)}%
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading financial report...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Report</h1>
          <p className="text-muted-foreground">Revenue, expenses, and profit analysis</p>
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(summary?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">Last 3 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(summary?.totalExpenses || 0)}</div>
            <p className="text-xs text-muted-foreground">Operating costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Banknote className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(summary?.totalProfit || 0)}</div>
            <p className="text-xs text-muted-foreground">After expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(summary?.averageGrowth || 0).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Monthly growth rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Financial Summary</CardTitle>
          <CardDescription>Detailed breakdown of revenue and expenses by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Expenses</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.month}</TableCell>
                    <TableCell className="text-green-600 font-medium">{formatCurrency(item.revenue)}</TableCell>
                    <TableCell className="text-red-600">{formatCurrency(item.expenses)}</TableCell>
                    <TableCell className="text-blue-600 font-medium">{formatCurrency(item.profit)}</TableCell>
                    <TableCell>{item.orders}</TableCell>
                    <TableCell>{item.growth !== undefined ? getGrowthBadge(item.growth) : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Financial Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profit Margin</CardTitle>
            <CardDescription>Profit as percentage of revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {(summary?.profitMargin || 0).toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Healthy profit margin indicates good financial performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Ratio</CardTitle>
            <CardDescription>Expenses as percentage of revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {summary?.totalRevenue ? ((summary.totalExpenses / summary.totalRevenue) * 100).toFixed(1) : '0.0'}%
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Lower expense ratio means better cost management
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}