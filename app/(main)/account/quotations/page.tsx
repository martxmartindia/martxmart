"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {toast} from "sonner"

export default function QuotationsPage() {
  const router = useRouter()
  const [quotations, setQuotations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await fetch("/api/quotations")

        if (!response.ok) {
          throw new Error("Failed to fetch quotations")
        }

        const data = await response.json()
        setQuotations(data)
      } catch (error) {
        console.error(error)
        toast.error("Failed to fetch quotations")
      } finally {
        setLoading(false)
      }
    }

    fetchQuotations()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Quotations</h1>
      </div>

      {quotations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center py-8">You don&apos;t have any quotations yet</p>
            <Button onClick={() => router.push("/products")} className="mx-auto block">
              Browse Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {quotations.map((quotation) => (
            <Card key={quotation.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h3 className="font-semibold">Quotation #{quotation.id.substring(0, 8)}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created on {new Date(quotation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div>{getStatusBadge(quotation.status)}</div>
                    <div className="font-semibold">₹{quotation.total.toFixed(2)}</div>
                    <Link href={`/quotations/${quotation.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

