"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Printer,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
  CreditCard,
  User,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/franchise-portal/orders/${orderId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch order details")
        }

        const data = await response.json()
        setOrder(data)
      } catch (error) {
        console.error("Error fetching order details:", error)
        toast.error("Failed to fetch order details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId, toast])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="mr-1 h-4 w-4" />
            Completed
          </Badge>
        )
      case "PROCESSING":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="mr-1 h-4 w-4" />
            Processing
          </Badge>
        )
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertTriangle className="mr-1 h-4 w-4" />
            Pending
          </Badge>
        )
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="mr-1 h-4 w-4" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const updateOrderStatus = async (status: string) => {
    try {
      setIsUpdating(true)
      const response = await fetch(`/api/franchise-portal/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      const data = await response.json()

      // Update local state
      setOrder((prev: any) => ({ ...prev, status }))

      toast.success("Order status updated successfully")

      // Close dialog if open
      setShowCancelDialog(false)
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Failed to update order status. Please try again later.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePrintOrder = () => {
    window.print()
  }

  const handleDownloadInvoice = () => {
    toast.success("Invoice downloaded successfully")
    // In a real app, this would trigger a download of a PDF invoice
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
        <p className="text-gray-500">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-4">The order you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/franchise-portal/orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/franchise-portal/orders")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Order #{order.id}</h2>
            <div className="flex items-center gap-2">
              <p className="text-gray-500">Placed on {order.date}</p>
              {getStatusBadge(order.status)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrintOrder}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
            <Download className="mr-2 h-4 w-4" />
            Invoice
          </Button>
          {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => updateOrderStatus("COMPLETED")}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Completed
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Order Summary and Customer Info */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Order details and items</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatCurrency(order.payment.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span>{formatCurrency(order.payment.tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span>{formatCurrency(order.payment.shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(order.payment.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{order.customer.name}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="mr-1 h-3 w-3" />
                      {order.customer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="mr-1 h-3 w-3" />
                      {order.customer.phone}
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Shipping Address</p>
                    <p className="text-sm text-gray-500">{order.customer.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/franchise-portal/customers/${order.customer.id}`} className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  View Customer Profile
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{order.payment.method}</p>
                    <p className="text-sm text-gray-500">{order.payment.cardNumber}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{order.shipping.method}</p>
                    <p className="text-sm text-gray-500">
                      Tracking: <span className="font-medium">{order.shipping.trackingNumber}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-gray-500">{order.shipping.estimatedDelivery}</p>
                    {order.shipping.deliveredOn && (
                      <p className="text-sm text-green-600">Delivered on {order.shipping.deliveredOn}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
          <CardDescription>Track the progress of this order</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="relative border-l border-gray-200 ml-3">
            {order.timeline.map((event: any, index: number) => (
              <li key={index} className="mb-10 ml-6 last:mb-0">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white">
                  {event.status === "Order Placed" && <Package className="w-3 h-3 text-orange-600" />}
                  {event.status === "Payment Confirmed" && <CreditCard className="w-3 h-3 text-orange-600" />}
                  {event.status === "Processing" && <Clock className="w-3 h-3 text-orange-600" />}
                  {event.status === "Shipped" && <Truck className="w-3 h-3 text-orange-600" />}
                  {event.status === "Delivered" && <CheckCircle2 className="w-3 h-3 text-orange-600" />}
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                  {event.status}
                  {index === 0 && (
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                      Latest
                    </span>
                  )}
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                  {new Date(event.date).toLocaleString()}
                </time>
                <p className="mb-4 text-base font-normal text-gray-500">{event.description}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/franchise-portal/orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>

        {order.status !== "CANCELLED" && (
          <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-red-600 hover:bg-red-50">
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Order
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Order</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel this order? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                  No, Keep Order
                </Button>
                <Button variant="destructive" onClick={() => updateOrderStatus("CANCELLED")} disabled={isUpdating}>
                  {isUpdating ? "Cancelling..." : "Yes, Cancel Order"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
