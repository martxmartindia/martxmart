"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { CheckCircle, Clock, Download, Filter, IndianRupee, Plus, RefreshCcw, Search, XCircle } from "lucide-react"

type Payment = {
  id: string
  recipientName: string
  recipientType: "franchise" | "vendor"
  amount: number
  status: "pending" | "completed" | "failed"
  paymentDate: string
  referenceId: string
  notes?: string
}

export function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [openNewPayment, setOpenNewPayment] = useState(false)
  const [selectedRecipientType, setSelectedRecipientType] = useState<"franchise" | "vendor">("franchise")
  const [franchises, setFranchises] = useState<{ id: string; name: string }[]>([])
  const [vendors, setVendors] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    // Simulate API call to get payments
    setTimeout(() => {
      setPayments([
        {
          id: "PAY-1001",
          recipientName: "Delhi North Franchise",
          recipientType: "franchise",
          amount: 25000,
          status: "completed",
          paymentDate: "2023-11-10",
          referenceId: "FR-PAY-1668076800000-abc123",
          notes: "Monthly commission payment",
        },
        {
          id: "PAY-1002",
          recipientName: "Kumar Electronics",
          recipientType: "vendor",
          amount: 12500,
          status: "pending",
          paymentDate: "2023-11-12",
          referenceId: "VN-PAY-1668249600000-def456",
          notes: "Payment for service delivery",
        },
        {
          id: "PAY-1003",
          recipientName: "Mumbai Central Franchise",
          recipientType: "franchise",
          amount: 35000,
          status: "completed",
          paymentDate: "2023-11-08",
          referenceId: "FR-PAY-1667904000000-ghi789",
          notes: "Quarterly bonus payment",
        },
        {
          id: "PAY-1004",
          recipientName: "Sharma Textiles",
          recipientType: "vendor",
          amount: 8000,
          status: "failed",
          paymentDate: "2023-11-09",
          referenceId: "VN-PAY-1667990400000-jkl012",
          notes: "Payment for uniform supplies",
        },
        {
          id: "PAY-1005",
          recipientName: "Bangalore South Franchise",
          recipientType: "franchise",
          amount: 18000,
          status: "pending",
          paymentDate: "2023-11-15",
          referenceId: "FR-PAY-1668508800000-mno345",
          notes: "Monthly commission payment",
        },
      ])

      // Simulate API call to get franchises
      setFranchises([
        { id: "FR-1001", name: "Delhi North Franchise" },
        { id: "FR-1002", name: "Mumbai Central Franchise" },
        { id: "FR-1003", name: "Bangalore South Franchise" },
        { id: "FR-1004", name: "Chennai East Franchise" },
        { id: "FR-1005", name: "Kolkata West Franchise" },
      ])

      // Simulate API call to get vendors
      setVendors([
        { id: "VN-1001", name: "Kumar Electronics" },
        { id: "VN-1002", name: "Sharma Textiles" },
        { id: "VN-1003", name: "Patel Logistics" },
        { id: "VN-1004", name: "Verma Printing Solutions" },
        { id: "VN-1005", name: "Singh IT Services" },
      ])

      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredPayments = payments.filter((payment) => {
    // Filter by search query
    const matchesSearch =
      payment.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.referenceId.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by tab
    if (activeTab === "all") return matchesSearch
    if (activeTab === "franchise") return matchesSearch && payment.recipientType === "franchise"
    if (activeTab === "vendor") return matchesSearch && payment.recipientType === "vendor"
    if (activeTab === "pending") return matchesSearch && payment.status === "pending"
    if (activeTab === "completed") return matchesSearch && payment.status === "completed"
    if (activeTab === "failed") return matchesSearch && payment.status === "failed"

    return matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" /> Failed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
    }
  }

  const getRecipientTypeBadge = (type: string) => {
    return type === "franchise" ? (
      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
        Franchise
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
        Vendor
      </Badge>
    )
  }

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement)
    const recipientType = formData.get("recipientType") as "franchise" | "vendor"
    const recipientId = formData.get("recipientId") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const purpose = formData.get("purpose") as string
    const notes = formData.get("notes") as string

    if (!recipientId || !amount || !purpose) {
      toast.error("Please fill all required fields")
      return
    }

    setIsLoading(true)

    try {
      // Determine the API endpoint based on recipient type
      const endpoint = recipientType === "franchise" ? "/api/payments/franchise" : "/api/payments/vendor"

      // Prepare the request payload
      const payload = {
        [recipientType === "franchise" ? "franchiseId" : "vendorId"]: recipientId,
        amount,
        purpose,
        narration: notes,
      }

      // Make the API request
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create payment")
      }

      const data = await response.json()

      // Show success message
      toast.success(
        `Payment to ${recipientType === "franchise" ? "franchise" : "vendor"} has been initiated successfully.`,
      )

      // Close the dialog
      setOpenNewPayment(false)

      // Refresh the payments list
      // In a real app, you would fetch the updated list from the API
      const newPayment: Payment = {
        id: `PAY-${Date.now().toString().substring(7)}`,
        recipientName:
          recipientType === "franchise"
            ? franchises.find((f) => f.id === recipientId)?.name || "Unknown Franchise"
            : vendors.find((v) => v.id === recipientId)?.name || "Unknown Vendor",
        recipientType,
        amount,
        status: "pending",
        paymentDate: new Date().toISOString().split("T")[0],
        referenceId: data.payment.referenceId,
        notes,
      }

      setPayments([newPayment, ...payments])
    } catch (error: any) {
      console.error("Error creating payment:", error)
      toast.error(error.message || "Failed to create payment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetryPayment = (paymentId: string) => {
    // In a real app, you would make an API call to retry the payment
    toast.success("The payment retry has been initiated. Please check the status later.")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Management</CardTitle>
          <CardDescription>Manage payments to franchises and vendors</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Payments</TabsTrigger>
                <TabsTrigger value="franchise">Franchise</TabsTrigger>
                <TabsTrigger value="vendor">Vendor</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search payments..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Dialog open={openNewPayment} onOpenChange={setOpenNewPayment}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Create New Payment</DialogTitle>
                      <DialogDescription>Initiate a new payment to a franchise or vendor.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreatePayment}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="recipientType" className="text-right">
                            Recipient Type
                          </Label>
                          <Select
                            name="recipientType"
                            defaultValue={selectedRecipientType}
                            onValueChange={(value) => setSelectedRecipientType(value as "franchise" | "vendor")}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select recipient type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="franchise">Franchise</SelectItem>
                              <SelectItem value="vendor">Vendor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="recipientId" className="text-right">
                            Recipient
                          </Label>
                          <Select name="recipientId">
                            <SelectTrigger className="col-span-3">
                              <SelectValue
                                placeholder={
                                  selectedRecipientType === "franchise" ? "Select franchise" : "Select vendor"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedRecipientType === "franchise"
                                ? franchises.map((franchise) => (
                                    <SelectItem key={franchise.id} value={franchise.id}>
                                      {franchise.name}
                                    </SelectItem>
                                  ))
                                : vendors.map((vendor) => (
                                    <SelectItem key={vendor.id} value={vendor.id}>
                                      {vendor.name}
                                    </SelectItem>
                                  ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            Amount (₹)
                          </Label>
                          <Input id="amount" name="amount" type="number" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="purpose" className="text-right">
                            Purpose
                          </Label>
                          <Select name="purpose" defaultValue="commission">
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedRecipientType === "franchise" ? (
                                <>
                                  <SelectItem value="commission">Commission Payment</SelectItem>
                                  <SelectItem value="bonus">Bonus</SelectItem>
                                  <SelectItem value="refund">Refund</SelectItem>
                                </>
                              ) : (
                                <>
                                  <SelectItem value="service">Service Payment</SelectItem>
                                  <SelectItem value="product">Product Payment</SelectItem>
                                  <SelectItem value="advance">Advance Payment</SelectItem>
                                </>
                              )}
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="notes" className="text-right pt-2">
                            Notes
                          </Label>
                          <Textarea
                            id="notes"
                            name="notes"
                            className="col-span-3"
                            rows={3}
                            placeholder="Additional notes about this payment..."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Processing..." : "Create Payment"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              {renderPaymentsTable(filteredPayments, isLoading)}
            </TabsContent>
            <TabsContent value="franchise" className="m-0">
              {renderPaymentsTable(filteredPayments, isLoading)}
            </TabsContent>
            <TabsContent value="vendor" className="m-0">
              {renderPaymentsTable(filteredPayments, isLoading)}
            </TabsContent>
            <TabsContent value="pending" className="m-0">
              {renderPaymentsTable(filteredPayments, isLoading)}
            </TabsContent>
            <TabsContent value="completed" className="m-0">
              {renderPaymentsTable(filteredPayments, isLoading)}
            </TabsContent>
            <TabsContent value="failed" className="m-0">
              {renderPaymentsTable(filteredPayments, isLoading)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )

  function renderPaymentsTable(payments: Payment[], isLoading: boolean) {
    return isLoading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ) : (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Reference ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.recipientName}</TableCell>
                  <TableCell>{getRecipientTypeBadge(payment.recipientType)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      {payment.amount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate" title={payment.referenceId}>
                      {payment.referenceId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {payment.status === "failed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => handleRetryPayment(payment.id)}
                        >
                          <RefreshCcw className="h-3 w-3 mr-1" /> Retry
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="h-8">
                        <Download className="h-3 w-3 mr-1" /> Receipt
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    )
  }
}
