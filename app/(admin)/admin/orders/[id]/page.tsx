"use client"

import { useState, useEffect } from "react"
import { useRouter,useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Truck, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"

export default function AdminOrderDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [])

  const fetchOrder = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch order")
      }

      setOrder(data.order)
    } catch (error) {
      console.error("Error fetching order:", error)
      toast.error("Failed to load order details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update order status")
      }

      toast.success(`Order status updated to ${status.toLowerCase()}`)
      fetchOrder()
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status")
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
      case "PROCESSING":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Processing
          </Badge>
        )
      case "SHIPPED":
        return (
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
            Shipped
          </Badge>
        )
      case "DELIVERED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Delivered
          </Badge>
        )
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Paid
          </Badge>
        )
      case "FAILED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Failed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-2" />
        <span className="text-lg text-gray-700">Loading order details...</span>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-4">The order you&apos;re looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/admin/orders")}>Back to Orders</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Order #{order.id.substring(0, 8)}</h1>
        </div>
        <div className="flex gap-2">
          {order.status === "PENDING" && (
            <>
              <Button
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                onClick={() => handleUpdateStatus("PROCESSING")}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Process Order
              </Button>
              <Button
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                onClick={() => handleUpdateStatus("CANCELLED")}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Order
              </Button>
            </>
          )}
          {order.status === "PROCESSING" && (
            <>
              <Button
                variant="outline"
                className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                onClick={() => handleUpdateStatus("SHIPPED")}
              >
                <Truck className="h-4 w-4 mr-2" />
                Mark as Shipped
              </Button>
              <Button
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                onClick={() => handleUpdateStatus("CANCELLED")}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Order
              </Button>
            </>
          )}
          {order.status === "SHIPPED" && (
            <Button
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              onClick={() => handleUpdateStatus("DELIVERED")}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Delivered
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>Products included in this order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-start gap-4 py-4 border-b last:border-0">
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium">
                      ₹{Number.parseFloat(item.product.price).toLocaleString()} per unit
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ₹{(Number.parseFloat(item.product.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹{Number.parseFloat(order.totalAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span>Included</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{Number.parseFloat(order.totalAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Order Status</h4>
                  <div className="mt-1">{getStatusBadge(order.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Order Date</h4>
                  <p className="mt-1">{format(new Date(order.createdAt), "PPP")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                  <p className="mt-1">{order.payment?.method || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Payment Status</h4>
                  <div className="mt-1">{getPaymentStatusBadge(order.payment?.status || "PENDING")}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Name</h4>
                  <p className="mt-1">{order.user.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="mt-1">{order.user.email}</p>
                </div>
                {order.user.phone && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                    <p className="mt-1">{order.user.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

