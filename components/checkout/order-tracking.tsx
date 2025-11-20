"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  CreditCard, 
  Phone, 
  Mail,
  Download,
  RefreshCw,
  AlertCircle
} from "lucide-react"
import Image from "next/image"
import { formatCurrency, formatDate } from "@/lib/utils"

interface OrderItem {
  id: string
  type: 'product' | 'shopping'
  productId?: string
  shoppingId?: string
  name: string
  quantity: number
  price: number
  subtotal: number
  image: string | null
  slug?: string
  brand?: string
  modelNumber?: string
}

interface Address {
  id: string
  contactName: string
  phone: string
  email?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zip: string
  type: string
}

interface Payment {
  id: string
  amount: number
  currency: string
  method: string
  status: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  transactionId?: string
  createdAt: string
  updatedAt: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  createdAt: string
  updatedAt: string
  notes?: string
  items: OrderItem[]
  payment: Payment | null
  shippingAddress: Address
  billingAddress: Address
  user: {
    id: string
    name: string
    email: string
    phone: string
  }
}

interface OrderTrackingProps {
  orderId: string
}

const statusSteps = [
  { key: 'PENDING', label: 'Order Placed', icon: Package, description: 'Your order has been placed successfully' },
  { key: 'PROCESSING', label: 'Processing', icon: Clock, description: 'We are preparing your order' },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck, description: 'Your order is on the way' },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle, description: 'Order delivered successfully' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200'
    case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200'
    case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'SUCCESS': return 'bg-green-100 text-green-800'
    case 'PENDING': return 'bg-yellow-100 text-yellow-800'
    case 'FAILED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function OrderTracking({ orderId }: OrderTrackingProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${orderId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch order')
      }
      
      const data = await response.json()
      setOrder(data.order)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const getCurrentStepIndex = (status: string) => {
    return statusSteps.findIndex(step => step.key === status)
  }

  const downloadInvoice = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/invoice`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice-${order?.orderNumber}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to download invoice:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'The requested order could not be found.'}</p>
          <Button onClick={fetchOrder} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentStepIndex = getCurrentStepIndex(order.status)

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Order #{order.orderNumber}</CardTitle>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Badge className={`${getStatusColor(order.status)} border`}>
                {order.status.replace('_', ' ')}
              </Badge>
              <Button onClick={downloadInvoice} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Invoice
              </Button>
              <Button onClick={fetchOrder} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Order Status Timeline */}
      {order.status !== 'CANCELLED' && (
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex
                const isCurrent = index === currentStepIndex
                const StepIcon = step.icon
                
                return (
                  <div key={step.key} className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      isCompleted 
                        ? 'bg-green-600 border-green-600 text-white' 
                        : isCurrent
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}>
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <div className="text-center mt-2">
                      <div className={`text-sm font-medium ${
                        isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 max-w-24">
                        {step.description}
                      </div>
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div className={`hidden sm:block w-full h-0.5 mt-6 ${
                        index < currentStepIndex ? 'bg-green-600' : 'bg-gray-200'
                      }`} style={{ marginLeft: '50%', marginRight: '-50%' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                      {item.image && (
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          width={64} 
                          height={64} 
                          className="w-full h-full object-cover rounded-lg" 
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.name}</h4>
                      {item.brand && (
                        <p className="text-sm text-gray-600">Brand: {item.brand}</p>
                      )}
                      {item.modelNumber && (
                        <p className="text-sm text-gray-600">Model: {item.modelNumber}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            {formatCurrency(item.price)} × {item.quantity}
                          </div>
                          <div className="font-medium">
                            {formatCurrency(item.subtotal)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Details */}
        <div className="space-y-6">
          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.payment ? (
                <>
                  <div className="flex justify-between">
                    <span>Method</span>
                    <span className="font-medium">{order.payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <Badge className={getPaymentStatusColor(order.payment.status)}>
                      {order.payment.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span className="font-medium">{formatCurrency(order.payment.amount)}</span>
                  </div>
                  {order.payment.razorpayPaymentId && (
                    <div className="flex justify-between">
                      <span>Transaction ID</span>
                      <span className="font-mono text-sm">{order.payment.razorpayPaymentId}</span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500">No payment information available</p>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.items.reduce((sum, item) => sum + item.subtotal, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(order.totalAmount * 0.15)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-medium">{order.shippingAddress.contactName}</div>
              <div className="text-sm text-gray-600">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 && (
                  <><br />{order.shippingAddress.addressLine2}</>
                )}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {order.shippingAddress.phone}
              </div>
              {order.shippingAddress.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  {order.shippingAddress.email}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}