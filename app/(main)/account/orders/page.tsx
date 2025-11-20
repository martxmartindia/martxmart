"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, ChevronRight, ShoppingBag, Calendar, CreditCard, Eye, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { useAuth } from "@/store/auth"
interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  createdAt: string
  items: {
    id: string
    quantity: number
    price: number
    product: {
      name: string
    }
  }[]
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      fetchOrders()
    }
  }, [authLoading])

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/account/orders");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "shipped":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  if (authLoading) {
    return <OrdersSkeleton />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="bg-white rounded-full p-6 w-24 h-24 mx-auto mb-6 shadow-lg">
              <Package className="h-12 w-12 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Sign in to view orders</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Access your order history and track your purchases</p>
            <Button
              onClick={() => router.push("/auth/login?redirect=/account/orders")}
              className="bg-orange-600 hover:bg-orange-700 px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <OrdersSkeleton />
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center py-20">
            <div className="bg-white rounded-full p-6 w-24 h-24 mx-auto mb-6 shadow-lg">
              <ShoppingBag className="h-12 w-12 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">No orders yet</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Start shopping to see your orders here</p>
            <Button 
              onClick={() => router.push("/products")} 
              className="bg-orange-600 hover:bg-orange-700 px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border-0">
              <CardHeader className="bg-white border-b border-gray-100 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900 text-lg">#{order.orderNumber}</h3>
                      <Badge variant="secondary" className={`${getStatusColor(order.status)} font-medium px-3 py-1`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span className="text-xl font-bold text-gray-900">₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="bg-gray-50/50 p-6">
                <div className="space-y-3 mb-6">
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-1.5 rounded">
                          <ShoppingBag className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{item.product.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}

                  {order.items.length > 2 && (
                    <div className="text-center py-2">
                      <p className="text-sm text-gray-500 bg-white rounded-lg py-2 px-3 border border-gray-100">
                        +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`/account/orders/${order.id}`} className="flex-1">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 shadow-sm hover:shadow-md transition-all duration-200">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  {order.status.toLowerCase() === 'delivered' && (
                    <Button variant="outline" className="sm:w-auto border-gray-300 hover:bg-gray-50">
                      Reorder
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function OrdersSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-20 mb-4" />
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-9 w-48" />
          </div>
          <Skeleton className="h-5 w-64" />
        </div>

        {/* Orders Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden shadow-sm border-0">
              <CardHeader className="bg-white border-b border-gray-100 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="bg-gray-50/50 p-6">
                <div className="space-y-3 mb-6">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-7 w-7 rounded" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

