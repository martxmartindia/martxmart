"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Package, Truck, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuth } from "@/store/auth";

interface OrderDetails {
  id: string;
  orderNumber?: string;
  createdAt: string;
  status: string;
  totalAmount: string;
  documents?: string[];
  user: { name: string; email: string };
  items: { product: { name: string; price: number }; quantity: number }[];
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Force dynamic rendering to avoid static prerendering issues
export const dynamic = "force-dynamic";

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to view your order");
      router.push("/auth/login");
      return;
    }

    const fetchOrder = async () => {
      if (!orderId) {
        toast.error("No order ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            "Content-Type": "application/json",          },
        });

        if (!response.ok) {
          const text = await response.text();
          let errorMessage = text;
          try {
            const data = JSON.parse(text);
            errorMessage = data.error || `HTTP error ${response.status}`;
          } catch (jsonError) {
            console.error("JSON parse error:", jsonError);
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setOrderDetails(data.order);
        setAddress(data.address);
      } catch (error: any) {
        toast.error(error.message || "Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [router, user, orderId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-2" />
        <span className="text-lg text-gray-700">Loading order details...</span>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <Card className="border-red-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-red-800">Order Not Found</CardTitle>
            <CardDescription className="text-red-700 mt-2">
              The order you're looking for doesn't exist or you don't have access to it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => router.push("/products")}>
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="border-green-200 shadow-md">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
              <CardTitle className="text-2xl md:text-3xl text-green-800">Order Placed Successfully!</CardTitle>
              <CardDescription className="text-green-700 mt-2">
                Thank you for your order. We've received your purchase request.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Number</h3>
                  <p className="text-lg font-bold">{orderDetails.orderNumber || orderDetails.id.substring(0, 8)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date Placed</h3>
                  <p className="text-lg font-bold">{format(new Date(orderDetails.createdAt), "PPP")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Status</h3>
                  <p className="text-lg font-bold text-orange-600">{orderDetails.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                  <p className="text-lg font-bold">₹{Number.parseFloat(orderDetails.totalAmount).toLocaleString()}</p>
                </div>
              </div>

              {address && (
                <div className="border-t border-gray-200 py-4">
                  <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                  <p className="text-gray-700">
                    {address.street}, {address.city}, {address.state} {address.postalCode}, {address.country}
                  </p>
                </div>
              )}

              {orderDetails.documents?.[0] && (
                <div className="border-t border-gray-200 py-4">
                  <h3 className="text-sm font-medium text-gray-500">Order Invoice</h3>
                  <a
                    href={orderDetails.documents[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Invoice PDF
                  </a>
                </div>
              )}

              <div className="border-t border-b border-gray-200 py-6 my-6">
                <h3 className="font-medium text-lg mb-4">What happens next?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Package className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Order Processing</p>
                      <p className="text-gray-600 text-sm">
                        We're processing your order and will notify you once it's ready for shipping.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Truck className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Shipping</p>
                      <p className="text-gray-600 text-sm">
                        Your order will be shipped within 2-3 business days. You'll receive a tracking number via email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => router.push("/account/orders")}>
                  View Order Details
                </Button>
                <Button variant="outline" onClick={() => router.push("/products")}>
                  Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-2" />
          <span className="text-lg text-gray-700">Loading order details...</span>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}