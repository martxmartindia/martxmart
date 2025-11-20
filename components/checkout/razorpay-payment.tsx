"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface RazorpayPaymentProps {
  orderId: string
  razorpayOrderId: string
  amount: number
  currency: string
  key: string
  customerName: string
  customerEmail: string
  customerPhone: string
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function RazorpayPayment({
  orderId,
  razorpayOrderId,
  amount,
  currency,
  key,
  customerName,
  customerEmail,
  customerPhone,
}: RazorpayPaymentProps) {
  const router = useRouter()

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = () => {
    const options = {
      key,
      amount: amount * 100, // Amount in paise
      currency,
      name: "martXmart",
      description: "Payment for Order #" + orderId.substring(0, 8),
      order_id: razorpayOrderId,
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
      theme: {
        color: "#ea580c", // Orange-600
      },
      handler: async (response: any) => {
        try {
          // Verify payment
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          })

          const verifyResult = await verifyResponse.json()

          if (!verifyResponse.ok) {
            throw new Error(verifyResult.error || "Payment verification failed")
          }

          toast.success("Payment successful!")
          router.push("/checkout/success")
        } catch (error: any) {
          toast.error(error.message || "Payment verification failed")
        }
      },
      modal: {
        ondismiss: () => {
          toast.error("Payment cancelled")
        },
      },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  }

  return (
    <Button onClick={handlePayment} className="w-full bg-orange-600 hover:bg-orange-700 mt-4" size="lg">
      Pay ₹{amount.toLocaleString()}
    </Button>
  )
}

