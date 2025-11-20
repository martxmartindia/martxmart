"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Eye, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {toast} from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await fetch("/api/admin/quotations")

        if (!response.ok) {
          throw new Error("Failed to fetch quotations")
        }

        const data = await response.json()
        setQuotations(data)
      } catch (error) {
        console.error(error)
        toast.error("Failed to fetch quotations")
      } finally {
        setLoading(false)
      }
    }

    fetchQuotations()
  }, [])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/quotations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update quotation status")
      }

      // Update the quotation in the local state
      setQuotations(quotations.map((q) => (q.id === id ? { ...q, status } : q)))

      toast.success("Quotation status updated successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to update quotation status")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredQuotations =
    statusFilter === "all" ? quotations : quotations.filter((q) => q.status === statusFilter.toUpperCase())

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Quotations</h1>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quotations</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No quotations found
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">#{quotation.id.substring(0, 8)}</TableCell>
                    <TableCell>{quotation.user?.name || "Unknown"}</TableCell>
                    <TableCell>{new Date(quotation.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>₹{quotation.total.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(quotation.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/quotations/${quotation.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {quotation.status === "PENDING" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateStatus(quotation.id, "APPROVED")}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateStatus(quotation.id, "REJECTED")}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

