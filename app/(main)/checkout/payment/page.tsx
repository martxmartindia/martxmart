"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CartItem {
  id: string;
  price: number;
  quantity: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  description: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods: PaymentMethod[] = [
    {
      id: "razorpay",
      name: "Razorpay",
      logo: "/payment-icons/razorpay.png",
      description: "Pay with cards, UPI, or net banking",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      logo: "/payment-icons/cash.png",
      description: "Pay when you receive your order",
    },
  ];

  // useEffect(() => {
  //   return () => {
  //     const script = document.querySelector(
  //       'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
  //     );
  //     if (script) {
  //       document.body.removeChild(script);
  //     }
  //   };
  // }, []);

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessing(true);

    try {
      const createOrderResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item: CartItem) => ({
            price: item.price,
            productId: item.id,
            quantity: item.quantity,
          })),
          totalAmount: totalPrice,
          paymentMethod: selectedMethod.toUpperCase(),
        }),
      });
      if (!createOrderResponse.ok) {
        let errorData;
        try {
          const text = await createOrderResponse.text();
          errorData = text ? JSON.parse(text) : { error: "No response data" };
        } catch (jsonError) {
          console.error("Failed to parse checkout response:", jsonError);
          throw new Error(
            `Checkout failed with status ${createOrderResponse.status}`
          );
        }
        throw new Error(
          errorData.error ||
            `Checkout failed with status ${createOrderResponse.status}`
        );
      }

      const { orderId } = await createOrderResponse.json();
      localStorage.setItem("currentOrderId", orderId);

      if (selectedMethod === "razorpay") {
        const response = await fetch("/api/payment", {
          // Fixed endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
          }),
        });

        if (!response.ok) {
          let errorData;
          try {
            const text = await response.text();
            errorData = text
              ? JSON.parse(text)
              : {
                  error: `Server returned no data (status ${response.status})`,
                };
          } catch (jsonError) {
            console.error("Failed to parse Razorpay response:", jsonError);
            throw new Error(
              `Payment initialization failed with status ${response.status}: Unable to parse server response`
            );
          }
          throw new Error(
            errorData.error ===
            "Order not found, unauthorized, or not in pending status"
              ? "Order could not be processed. Please try again or contact support."
              : errorData.error ||
                `Payment initialization failed with status ${response.status}`
          );
        }

        const data = await response.json();
        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () =>
            reject(new Error("Failed to load Razorpay script"));
        });
        if (!(window as any).Razorpay) {
          throw new Error("Razorpay SDK not available");
        }

        const options = {
          key: data.key,
          amount: data.amount * 100, // Convert to paise
          currency: data.currency,
          name: "martXmart",
          description: `Payment for Order #${orderId.substring(0, 8)}`,
          order_id: data.razorpayOrderId,
          handler: async (response: any) => {
            try {
              const verifyResponse = await fetch("/api/payment/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });
              if (!verifyResponse.ok) {
                const errorData = await verifyResponse.json();
                throw new Error(
                  errorData.error || "Payment verification failed"
                );
              }

              clearCart();
              router.push(`/checkout/success?orderId=${orderId}`);
            } catch (error: any) {
              console.error("Payment verification error:", error);
              toast.error(error.message || "Payment verification failed");
            }
          },
          prefill: {
            name: data.customerName,
            email: data.customerEmail,
            contact: data.customerPhone,
          },
          theme: {
            color: "#ea580c",
          },
        };
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.on("payment.failed", (response: any) => {
          console.error("Payment failed:", response.error);
          toast.error(`Payment failed: ${response.error.description}`);
        });
        paymentObject.open();
        // ... rest of Razorpay logic ...
      } else if (selectedMethod === "cod") {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "CONFIRMED",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to place COD order");
        }

        clearCart();
        router.push(`/checkout/success?orderId=${orderId}`);
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(
        error.message ||
          "Failed to process checkout. Please try again or contact support."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Select Payment Method</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className={`cursor-pointer transition-all ${
              selectedMethod === method.id ? "ring-2 ring-orange-600" : ""
            }`}
            onClick={() => setSelectedMethod(method.id)}
            role="tab"
            aria-selected={selectedMethod === method.id}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setSelectedMethod(method.id);
              }
            }}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="relative h-12 w-12">
                <Image
                  src={method.logo}
                  alt={method.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <CardTitle>{method.name}</CardTitle>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Total Amount</span>
            <span className="text-2xl font-bold text-orange-600">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <Button
            className="w-full bg-orange-600 hover:bg-orange-700"
            size="lg"
            onClick={handlePayment}
            disabled={isProcessing || !selectedMethod}
            aria-disabled={isProcessing || !selectedMethod}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Pay"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
