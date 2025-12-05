"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { DollarSign, TrendingUp, Calendar, MoreHorizontal, Eye, Download } from "lucide-react"

interface FranchisePayment {
  id: string
  amount: number
  type: "INITIAL_FEE" | "RENEWAL_FEE" | "ROYALTY" | "MARKETING_FEE" | "INVOICE_PAYMENT" | "SERVICE_PAYMENT" | "OTHER"
  status: "PENDING" | "SUCCESS" | "FAILED"
  razorpayPayoutId: string | null
  referenceId: string | null
  notes: string | null
  dueDate: string | null
  paidDate: string | null
  failureReason: string | null
  createdAt: string
  updatedAt: string
}

interface PaymentSummary {
  totalReceived: number
  pendingPayments: number
  thisMonthPayments: number
  totalPayments: number
}

export function FranchisePaymentsManagement() {
  const [payments, setPayments] = useState<FranchisePayment[]>([])
  const [summary, setSummary] = useState<PaymentSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/franchise-portal/payments")
      if (!response.ok) {
        throw new Error("Failed to fetch payments")
      }
      const data = await response.json()
      setPayments(data.payments)
      setSummary(data.summary)
    } catch (error) {
      console.error("Error fetching payments:", error)
      toast.error("Failed to load payments. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getPaymentTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      "INITIAL_FEE": "Initial Fee",
      "RENEWAL_FEE": "Renewal Fee",
      "ROYALTY": "Royalty",
      "MARKETING_FEE": "Marketing Fee",
      "INVOICE_PAYMENT": "Invoice Payment",
      "SERVICE_PAYMENT": "Service Payment",
      "OTHER": "Other",
    }
    return typeLabels[type] || type
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUCCESS: {
        label: "Received",
        className: "bg-green-100 text-green-800",
      },
      PENDING: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800",
      },
      FAILED: {
        label: "Failed",
        className: "bg-red-100 text-red-800",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Badge className={config.className}>{config.label}</Badge>;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.totalReceived || 0)}</div>
            <p className="text-xs text-muted-foreground">All time payments received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.pendingPayments || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.thisMonthPayments || 0}</div>
            <p className="text-xs text-muted-foreground">Payments this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalPayments || 0}</div>
            <p className="text-xs text-muted-foreground">All payment records</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Track all payments received from the main company</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="font-mono text-sm">{payment.id.slice(-8)}</div>
                        {payment.referenceId && (
                          <div className="text-xs text-muted-foreground">Ref: {payment.referenceId}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{getPaymentTypeLabel(payment.type)}</div>
                        {payment.notes && (
                          <div className="text-xs text-muted-foreground max-w-[150px] truncate" title={payment.notes}>
                            {payment.notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        {payment.dueDate ? formatDate(payment.dueDate) : "N/A"}
                      </TableCell>
                      <TableCell>
                        {payment.paidDate ? formatDate(payment.paidDate) : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {payment.razorpayPayoutId && (
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download Receipt
                              </DropdownMenuItem>
                            )}
                            {payment.failureReason && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem disabled>
                                  <div className="text-red-600">
                                    Failed: {payment.failureReason}
                                  </div>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Types Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Types Breakdown</CardTitle>
          <CardDescription>Distribution of payments by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(
              payments.reduce((acc, payment) => {
                acc[payment.type] = (acc[payment.type] || 0) + Number(payment.amount);
                return acc;
              }, {} as Record<string, number>)
            ).map(([type, total]) => (
              <div key={type} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{getPaymentTypeLabel(type)}</p>
                  <p className="text-sm text-muted-foreground">Payment Type</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(total)}</p>
                  <p className="text-sm text-muted-foreground">
                    {payments.filter(p => p.type === type).length} transactions
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}