"use client"

import { useState, useEffect } from "react"
import { useRouter ,useParams} from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Edit, Check, X } from "lucide-react"
import { toast } from "sonner"

export default function VendorDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [vendor, setVendor] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(`/api/admin/vendors/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch vendor details")
        }

        const data = await response.json()
        setVendor(data.vendor)
      } catch (error) {        
        toast.error("Failed to load vendor details")
        router.push("/admin/vendors")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVendor()
  }, [params.id, router])

  const handleUpdateStatus = async (status: string) => {
    try {
      const response = await fetch(`/api/admin/vendors/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update vendor status")
      }

      const data = await response.json()
      setVendor(data.vendor)
      toast.success(`Vendor ${status.toLowerCase()} successfully`)
    } catch (error) {
      toast.error("Failed to update vendor status")
    }
  }

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-2" />
        <span className="text-lg text-gray-700">Loading vendor details...</span>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Vendor not found</p>
        <Button onClick={() => router.push("/admin/vendors")} className="mt-4">
          Back to Vendors
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Details</h1>
        </div>
        <div className="flex gap-2">
          {vendor.status === "PENDING" && (
            <>
              <Button onClick={() => handleUpdateStatus("APPROVED")} className="bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button onClick={() => handleUpdateStatus("REJECTED")} variant="destructive">
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          <Button onClick={() => router.push(`/admin/vendors/${params.id}/edit`)} variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Details about the vendor&apso;s business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{vendor.businessName}</h2>
                  <p className="text-muted-foreground">{vendor.description}</p>
                </div>
                <div>{getStatusBadge(vendor.status)}</div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                  <div className="mt-2 space-y-1">
                    <p>
                      <span className="font-medium">Email:</span> {vendor.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {vendor.phone}
                    </p>
                    {vendor.website && (
                      <p>
                        <span className="font-medium">Website:</span> {vendor.website}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                  <div className="mt-2 space-y-1">
                    <p>{vendor.address}</p>
                    <p>
                      {vendor.city}, {vendor.state} - {vendor.pincode}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Business Details</h3>
                  <div className="mt-2 space-y-1">
                    {vendor.gstNumber && (
                      <p>
                        <span className="font-medium">GST Number:</span> {vendor.gstNumber}
                      </p>
                    )}
                    {vendor.panNumber && (
                      <p>
                        <span className="font-medium">PAN Number:</span> {vendor.panNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Bank Details</h3>
                  <div className="mt-2 space-y-1">
                    {vendor.bankName && (
                      <p>
                        <span className="font-medium">Bank Name:</span> {vendor.bankName}
                      </p>
                    )}
                    {vendor.accountNumber && (
                      <p>
                        <span className="font-medium">Account Number:</span> {vendor.accountNumber}
                      </p>
                    )}
                    {vendor.ifscCode && (
                      <p>
                        <span className="font-medium">IFSC Code:</span> {vendor.ifscCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Associated user account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="mt-1">{vendor.user.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="mt-1">{vendor.user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                <p className="mt-1">{vendor.user.role}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Application Date</h3>
                <p className="mt-1">{new Date(vendor.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

