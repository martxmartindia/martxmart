"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "next/navigation"
import Link from "next/link"
import Script from "next/script"

interface ProjectReport {
  id: string
  projectId: string
  status: string
  paymentStatus: string
  paymentAmount: number
  project: {
    name: string
    projectCategory: {
      name: string
    }
  }
}

export default function ProjectReportPaymentPage() {
  const params = useParams()
  const [report, setReport] = useState<ProjectReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/project-reports/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch project report")
        }
        const data = await response.json()
        setReport(data)
      } catch (error) {
        console.error("Error fetching project report:", error)
        setError("Failed to load project report. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchReport()
    } else {
      setError("Invalid report ID")
      setLoading(false)
    }
  }, [params.id])

  const handlePayment = async () => {
    if (!report) return

    setPaymentProcessing(true)

    try {
      // Check if Razorpay is available
      if (!(window as any).Razorpay) {
        throw new Error("Razorpay script not loaded")
      }

      // In a real application, create an order on the backend first
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: report.id,
          amount: report.paymentAmount,
        }),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create payment order")
      }

      const { orderId } = await orderResponse.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_ID", // Use environment variable
        amount: report.paymentAmount * 100, // Amount in paise
        currency: "INR",
        name: "Business Project Portal",
        description: `Payment for ${report.project.name} Project Report`,
        order_id: orderId, // From backend
        handler: (response: any) => {
          verifyPayment(response.razorpay_payment_id, orderId, response.razorpay_signature)
        },
        prefill: {
          name: "", // Ideally, fetch from user profile
          email: "", // Ideally, fetch from user profile
        },
        theme: {
          color: "#ea580c",
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.on("payment.failed", () => {
        setError("Payment failed. Please try again.")
        setPaymentProcessing(false)
      })
      razorpay.open()
    } catch (error) {
      console.error("Payment error:", error)
      setError("Payment failed. Please try again.")
      setPaymentProcessing(false)
    }
  }

  const verifyPayment = async (paymentId: string, orderId: string, signature: string) => {
    if (!report) return

    try {
      const response = await fetch("/api/project-reports/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: report.id,
          paymentId,
          orderId,
          signature,
        }),
      })

      if (!response.ok) {
        throw new Error("Payment verification failed")
      }

      setPaymentSuccess(true)
    } catch (error) {
      console.error("Payment verification error:", error)
      setError("Payment verification failed. Please contact support.")
    } finally {
      setPaymentProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Skeleton className="h-10 w-40" />
        </div>
        <Card className="max-w-2xl mx-auto border border-gray-200 shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/project-reports">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>Project Report Not Found</CardTitle>
            <CardDescription>The requested project report does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/project-reports">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto border border-gray-200 shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-green-50 to-transparent">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Payment Successful!</CardTitle>
            <CardDescription className="text-gray-600">
              Your payment for the project report has been processed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">What Happens Next?</h3>
              <ol className="list-decimal pl-5 text-gray-700 space-y-2">
                <li>Our team will start preparing your detailed project report.</li>
                <li>You'll receive regular updates on the progress of your report.</li>
                <li>The report will be delivered to your email within 7-10 business days.</li>
                <li>You can track the status of your report in the "My Project Reports" section.</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Link href="/account/project-reports">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">View My Reports</Button>
              </Link>
              <Link href="/project-reports">
                <Button variant="outline" className="w-full">
                  Explore More Projects
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/project-reports">
        <Button
          variant="ghost"
          className="mb-6 text-orange-600 hover:text-orange-700 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Reports
        </Button>
      </Link>

      <Card className="max-w-2xl mx-auto border border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
          <CardTitle className="text-2xl font-bold text-gray-900">Complete Payment</CardTitle>
          <CardDescription className="text-gray-600">
            {report.project.name} - {report.project.projectCategory.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Project Report</h3>
                <p className="text-gray-700">{report.project.name}</p>
              </div>
              <span className="text-lg font-bold text-gray-900">
                ₹{report.paymentAmount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Payment Summary</h3>
            <div className="flex justify-between text-gray-600">
              <span>Report Cost</span>
              <span>
                ₹{report.paymentAmount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (18%)</span>
              <span>Included</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total Amount</span>
              <span>
                ₹{report.paymentAmount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-gray-700 text-sm">
              Your payment is secure and encrypted. After payment, your project report will be prepared and delivered
              within 7-10 business days.
            </p>
          </div>

          <Button
            onClick={handlePayment}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center"
            disabled={paymentProcessing || !report}
          >
            {paymentProcessing ? (
              "Processing..."
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay ₹{report.paymentAmount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="bg-gray-50 text-sm text-gray-600">
          <p>By proceeding with the payment, you agree to our terms and conditions.</p>
        </CardFooter>
      </Card>

      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </div>
  )
}