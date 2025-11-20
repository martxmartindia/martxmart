"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import QuotationTemplate from "@/components/quotation/QuotationTemplate"
import { toast } from "sonner"
 
export default function QuotationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [quotation, setQuotation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const response = await fetch(`/api/quotations/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch quotation")
        }

        const data = await response.json()
        setQuotation(data)
      } catch (error) {
        toast.error("Failed to fetch quotation")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchQuotation()
    }
  }, [params.id])

  const handleDownload = () => {
    window.print()
  }

  const handleBackToShopping = () => {
    router.push("/products")
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!quotation) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Quotation not found</p>
            <Button onClick={handleBackToShopping} className="mt-4 mx-auto block">
              Back to Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quotation #{quotation.id.substring(0, 8)}</h1>
        <div className="flex gap-4">
          <Button onClick={handleDownload} variant="outline">
            Download PDF
          </Button>
          <Button onClick={handleBackToShopping}>Continue Shopping</Button>
        </div>
      </div>

      <div className="print:hidden mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Quotation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{quotation.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created On</p>
                <p className="font-medium">{new Date(quotation.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="font-medium">₹{quotation.subtotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tax (18% GST)</p>
                <p className="font-medium">₹{quotation.tax.toFixed(2)}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-bold text-lg">₹{quotation.total.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="print:block hidden">
        <QuotationTemplate quotation={quotation} />
      </div>

      <div className="print:hidden">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <Card>
          <CardContent className="pt-6">
            {quotation.items.map((item: any) => (
              <div key={item.id} className="flex justify-between py-2">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator className="my-4" />
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{quotation.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18% GST)</span>
              <span>₹{quotation.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mt-2">
              <span>Total</span>
              <span>₹{quotation.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

