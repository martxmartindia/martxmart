"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Package, Truck, CheckCircle, Clock, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"

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
  shoppingItems: OrderItem[]
  shippingAddress: {
    contactName: string
    addressLine1: string
    city: string
    state: string
    zip: string
  }
  payment?: {
    method: string
    status: string
  }
  trackingNumber?: string
}

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: Package },
  SHIPPED: { label: "Shipped", color: "bg-purple-100 text-purple-800", icon: Truck },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: Clock },
}

export default function OrdersPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    if (!session) {
      window.location.href = "/auth/login"
      return
    }

    try {
      const response = await fetch("/api/shopping/orders")

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    return order.status.toLowerCase() === activeTab
  })

  const OrderCard = ({ order }: { order: Order }) => {
    const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock
    const statusInfo = statusConfig[order.status as keyof typeof statusConfig]

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
              <p className="text-sm text-gray-600">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <Badge className={statusInfo?.color || "bg-gray-100 text-gray-800"}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusInfo?.label || order.status}
              </Badge>
              <p className="text-lg font-bold mt-1">₹{order.totalAmount}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Order Items */}
            <div className="space-y-3">
              {order.shoppingItems.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.shopping.images[0] || "/placeholder.svg?height=64&width=64"}
                      alt={item.shopping.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.shopping.name}</h4>
                    {item.shopping.brand && <p className="text-sm text-gray-600">{item.shopping.brand}</p>}
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                </div>
              ))}
              {order.shoppingItems.length > 2 && (
                <p className="text-sm text-gray-600">+{order.shoppingItems.length - 2} more items</p>
              )}
            </div>

            {/* Shipping Address */}
            <div className="border-t pt-3">
              <h5 className="font-medium text-gray-900 mb-1">Shipping Address</h5>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.contactName}
                <br />
                {order.shippingAddress.addressLine1}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-3 border-t">
              <Link href={`/orders/${order.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>
              {order.trackingNumber && (
                <Button variant="outline" size="sm">
                  <Truck className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Invoice
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-200 h-48 rounded-lg mb-6"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">Track and manage your orders</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-8">
                {activeTab === "all" ? "You haven't placed any orders yet." : `No ${activeTab} orders found.`}
              </p>
              <Link href="/products">
                <Button className="bg-orange-500 hover:bg-orange-600">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div>
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
