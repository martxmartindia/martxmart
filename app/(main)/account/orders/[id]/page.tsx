"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Package, ArrowLeft, ShoppingBag, MapPin, Truck, CreditCard, Calendar, CheckCircle, Clock, AlertCircle, Copy, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";
import { useAuth } from "@/store/auth";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
}

interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingCost: number;
  tax: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress: ShippingAddress | null;
  items: OrderItem[];
  paymentMethod: string;
  paymentStatus?: string;
  transactionId?: string;
  trackingNumber: string | null;
  estimatedDelivery: string | null;
  currency: string;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && params.id && typeof params.id === "string") {
      fetchOrder(params.id);
    } else if (!params.id) {
      toast.error("Invalid order ID");
      router.push("/account/orders");
    }
  }, [authLoading, params.id, router]);

  const fetchOrder = async (orderId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/account/orders/${encodeURIComponent(orderId)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch order");
      }
      const data = await response.json();
      if (!data.order) {
        throw new Error("Order not found");
      }
      setOrder(data.order);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch order");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const statusLower = status.toLowerCase();
    const statusStyles: { [key: string]: string } = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      processing: "bg-blue-50 text-blue-700 border-blue-200",
      shipped: "bg-purple-50 text-purple-700 border-purple-200",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return statusStyles[statusLower] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <AlertCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusStepCompleted = (status: string, step: number): boolean => {
    const statusMap: { [key: string]: number } = {
      pending: 1,
      processing: 2,
      shipped: 3,
      delivered: 4,
      cancelled: 0,
    };
    const currentStep = statusMap[status.toLowerCase()] || 0;
    return step <= currentStep;
  };

  const formatCurrency = (amount: number, currency: string): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
    }).format(amount);
  };

  if (authLoading || isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="bg-white rounded-full p-6 w-24 h-24 mx-auto mb-6 shadow-lg">
              <Package className="h-12 w-12 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Sign in required</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Please sign in to view your order details</p>
            <Button
              onClick={() => router.push(`/auth/login?redirect=/account/orders/${params.id}`)}
              className="bg-orange-600 hover:bg-orange-700 px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="bg-white rounded-full p-6 w-24 h-24 mx-auto mb-6 shadow-lg">
              <Package className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Order not found</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button
              onClick={() => router.push("/account/orders")}
              className="bg-orange-600 hover:bg-orange-700 px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/account/orders")}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          </div>
          <p className="text-gray-600">Track your order and view purchase details</p>
        </div>

        {/* Order Status Card */}
        <Card className="mb-6 overflow-hidden shadow-sm border-0">
          <CardHeader className="bg-white border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">#{order.orderNumber}</h2>
                  <Badge variant="secondary" className={`${getStatusColor(order.status)} font-medium px-3 py-1 flex items-center gap-1.5`}>
                    {getStatusIcon(order.status)}
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
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.totalAmount, order.currency)}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Tracking */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-600" />
                  Order Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.status.toLowerCase() !== "cancelled" ? (
                  <>
                    <div className="relative mb-6">
                      <div className="flex justify-between mb-4">
                        {["Ordered", "Processing", "Shipped", "Delivered"].map((label, index) => (
                          <div key={label} className="text-center flex-1">
                            <div
                              className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center transition-all duration-200 ${
                                getStatusStepCompleted(order.status, index + 1)
                                  ? "bg-orange-600 text-white shadow-lg"
                                  : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              {getStatusStepCompleted(order.status, index + 1) ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <span className="text-sm font-medium">{index + 1}</span>
                              )}
                            </div>
                            <p className={`text-sm font-medium ${
                              getStatusStepCompleted(order.status, index + 1) ? "text-orange-600" : "text-gray-500"
                            }`}>{label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10 mx-5">
                        <div
                          className="h-full bg-orange-600 transition-all duration-500 ease-in-out"
                          style={{
                            width:
                              order.status.toLowerCase() === "pending"
                                ? "0%"
                                : order.status.toLowerCase() === "processing"
                                ? "33%"
                                : order.status.toLowerCase() === "shipped"
                                ? "66%"
                                : order.status.toLowerCase() === "delivered"
                                ? "100%"
                                : "0%",
                          }}
                        />
                      </div>
                    </div>

                    {order.trackingNumber && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-900">Tracking Number</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(order.trackingNumber!)}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="font-mono text-sm text-orange-800 bg-white px-3 py-2 rounded border">
                          {order.trackingNumber}
                        </p>
                        {order.estimatedDelivery && (
                          <p className="text-sm text-orange-700 mt-2">
                            Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long', 
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                    <p className="text-lg font-medium text-red-900 mb-1">Order Cancelled</p>
                    <p className="text-sm text-red-700">This order has been cancelled</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-orange-600" />
                  Order Items ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                        {item.product.images?.length > 0 ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="font-semibold text-gray-900 hover:text-orange-600 transition-colors block truncate"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span>Price: {formatCurrency(item.price, order.currency)}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-lg text-gray-900">
                          {formatCurrency(item.quantity * item.price, order.currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(order.totalAmount - (order.shippingCost + order.tax), order.currency)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{formatCurrency(order.shippingCost ?? 0, order.currency)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatCurrency(order.tax ?? 0, order.currency)}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between py-2 bg-orange-50 -mx-6 px-6 rounded-lg">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-orange-600">{formatCurrency(order.totalAmount, order.currency)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.shippingAddress ? (
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <p className="font-semibold text-gray-900 mb-2">{order.shippingAddress.fullName}</p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{order.shippingAddress.phoneNumber}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No shipping address provided</p>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-semibold text-gray-900">
                          {order.paymentMethod ? 
                            order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1).toLowerCase() 
                            : "Cash on Delivery"
                          }
                        </span>
                      </div>
                      {order.paymentStatus && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Payment Status</span>
                          <Badge 
                            variant="secondary"
                            className={order.paymentStatus.toLowerCase() === 'paid' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : order.paymentStatus.toLowerCase() === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                            }
                          >
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1).toLowerCase()}
                          </Badge>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          {order.paymentStatus?.toLowerCase() === 'paid' ? 'Amount Paid' : 'Total Amount'}
                        </span>
                        <span className="font-bold text-lg text-gray-900">{formatCurrency(order.totalAmount, order.currency)}</span>
                      </div>
                    </div>
                  </div>
                  {order.transactionId && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">Transaction ID</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(order.transactionId!)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-mono text-sm text-blue-800 mt-1 bg-white px-2 py-1 rounded border">
                        {order.transactionId}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-32 mb-4" />
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-9 w-48" />
          </div>
          <Skeleton className="h-5 w-64" />
        </div>

        {/* Status Card Skeleton */}
        <Card className="mb-6 overflow-hidden shadow-sm border-0">
          <CardHeader className="bg-white border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Skeleton */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="text-center flex-1">
                      <Skeleton className="w-10 h-10 rounded-full mx-auto mb-2" />
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Items Skeleton */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <Skeleton className="w-20 h-20 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-full max-w-[250px] mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Summary Skeleton */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between py-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                  <Separator className="my-3" />
                  <div className="flex justify-between py-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Skeleton */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>

            {/* Payment Skeleton */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}