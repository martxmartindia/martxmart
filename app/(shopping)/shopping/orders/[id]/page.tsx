"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, CreditCard, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface OrderItem {
  id: string
  quantity: number
  price: number
  subtotal: number
  shopping: {
    id: string
    name: string
    images: string[]
    brand?: string
  }
}

interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  createdAt: string
  updatedAt: string
  notes?: string
  shoppingItems: OrderItem[]
  shippingAddress: {
    contactName: string
    phone: string
    email: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    zip: string
  }
  billingAddress?: {
    contactName: string
    phone: string
    email: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    zip: string
  }
  payment?: {
    method: string
    status: string
    razorpayPaymentId?: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
}

const statusConfig = {
  PENDING: { label: "Order Placed", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: Package },
  SHIPPED: { label: "Shipped", color: "bg-purple-100 text-purple-800", icon: Truck },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: Clock },
}

export default function OrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string)
    }
  }, [params.id])

  const fetchOrder = async (orderId: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/auth/login"
      return
    }

    try {
      const response = await fetch(`/api/shopping/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      }
    } catch (error) {
      console.error("Error fetching order:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-200 h-64 rounded-lg"></div>
              <div className="bg-gray-200 h-48 rounded-lg"></div>
            </div>
            <div className="bg-gray-200 h-96 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Order not found</h2>
          <Link href="/orders">
            <Button className="mt-4">Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock
  const statusInfo = statusConfig[order.status as keyof typeof statusConfig]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/orders">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
            <p className="text-gray-600 mt-1">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="text-right">
            <Badge className={statusInfo?.color || "bg-gray-100 text-gray-800"}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo?.label || order.status}
            </Badge>
            <p className="text-2xl font-bold mt-2">₹{order.totalAmount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.shoppingItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.shopping.images[0] || "/placeholder.svg?height=80&width=80"}
                        alt={item.shopping.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link href={`/products/${item.shopping.id}`}>
                        <h4 className="font-medium text-gray-900 hover:text-orange-600 transition-colors">
                          {item.shopping.name}
                        </h4>
                      </Link>
                      {item.shopping.brand && <p className="text-sm text-gray-600">{item.shopping.brand}</p>}
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.price}</p>
                      <p className="text-sm text-gray-600">Subtotal: ₹{item.subtotal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{order.shippingAddress.contactName}</p>
                <p className="text-gray-600">{order.shippingAddress.phone}</p>
                <p className="text-gray-600">{order.shippingAddress.email}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium">{order.payment?.method || "Cash on Delivery"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <Badge variant={order.payment?.status === "SUCCESS" ? "default" : "secondary"}>
                    {order.payment?.status || "Pending"}
                  </Badge>
                </div>
                {order.payment?.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-sm">{order.payment.razorpayPaymentId}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.shoppingItems.reduce((sum, item) => sum + item.subtotal, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{order.totalAmount > 999 ? 0 : 99}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Information */}
          {order.trackingNumber && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Tracking Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Tracking Number:</p>
                    <p className="font-mono font-medium">{order.trackingNumber}</p>
                  </div>
                  {order.estimatedDelivery && (
                    <div>
                      <p className="text-sm text-gray-600">Estimated Delivery:</p>
                      <p className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString("en-IN")}</p>
                    </div>
                  )}
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    <Truck className="h-4 w-4 mr-2" />
                    Track Package
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-transparent" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              {order.status === "DELIVERED" && (
                <Button className="w-full bg-transparent" variant="outline">
                  Write Review
                </Button>
              )}
              {order.status === "PENDING" && (
                <Button className="w-full" variant="destructive">
                  Cancel Order
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
