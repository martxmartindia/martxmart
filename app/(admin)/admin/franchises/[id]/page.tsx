"use client"

import { useState, useEffect } from "react"
import { useRouter,useParams } from "next/navigation"
import { format } from "date-fns"
import {
  Loader2,
  ArrowLeft,
  Save,
  MapPin,
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  DollarSign,
  Percent,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Franchise {
  id: string
  name: string
  ownerId: string
  businessAddress: string
  contactEmail: string
  contactPhone: string
  gstNumber: string
  panNumber: string
  territory: string
  commissionRate: number
  initialFee: number
  renewalFee: number
  contractStartDate: string | null
  contractEndDate: string | null
  status: string
  isActive: boolean
  createdAt: string
  owner: {
    id: string
    name: string
    email: string
    phone: string
  }
  documents: any[]
  territories: any[]
  payments: any[]
}

export default function FranchiseDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [franchise, setFranchise] = useState<Franchise | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchFranchiseDetails()
  }, [router, id])

  const fetchFranchiseDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/franchises/${id}`)
      const data = await response.json()

      if (response.ok) {
        setFranchise(data.franchise)
      } else {
        toast.error(data.error || "Failed to fetch franchise details")
      }
    } catch (error) {
      console.error("Error fetching franchise details:", error)
      toast.error("Failed to fetch franchise details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (!franchise) return
    setFranchise({
      ...franchise,
      [field]: value,
    })
  }

  const handleSave = async () => {
    if (!franchise) return

    try {
      setIsSaving(true)
      const response = await fetch(`/api/admin/franchises/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: franchise.name,
          businessAddress: franchise.businessAddress,
          contactEmail: franchise.contactEmail,
          contactPhone: franchise.contactPhone,
          gstNumber: franchise.gstNumber,
          panNumber: franchise.panNumber,
          territory: franchise.territory,
          commissionRate: franchise.commissionRate,
          initialFee: franchise.initialFee,
          renewalFee: franchise.renewalFee,
          contractStartDate: franchise.contractStartDate,
          contractEndDate: franchise.contractEndDate,
          status: franchise.status,
          isActive: franchise.isActive,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Franchise updated successfully")
        setIsEditing(false)
        fetchFranchiseDetails()
      } else {
        toast.error(data.error || "Failed to update franchise")
      }
    } catch (error) {
      console.error("Error updating franchise:", error)
      toast.error("Failed to update franchise")
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Inactive
        </Badge>
      )
    }

    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      case "TERMINATED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Terminated
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
        <span className="text-lg">Loading franchise details...</span>
      </div>
    )
  }

  if (!franchise) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Franchise Not Found</h1>
        </div>
        <p>The requested franchise could not be found.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{franchise.name}</h1>
            <div className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{franchise.territory}</span>
              <span className="mx-2">•</span>
              {getStatusBadge(franchise.status, franchise.isActive)}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Franchise</Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="owner">Owner</TabsTrigger>
          <TabsTrigger value="territories">Territories</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Franchise Information</CardTitle>
                <CardDescription>Basic details about the franchise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Franchise Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={franchise.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-gray-50">{franchise.name}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="businessAddress"
                      value={franchise.businessAddress}
                      onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-gray-50 whitespace-pre-line">
                      {franchise.businessAddress}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    {isEditing ? (
                      <Input
                        id="contactEmail"
                        type="email"
                        value={franchise.contactEmail}
                        onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">{franchise.contactEmail}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    {isEditing ? (
                      <Input
                        id="contactPhone"
                        value={franchise.contactPhone}
                        onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">{franchise.contactPhone}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    {isEditing ? (
                      <Input
                        id="gstNumber"
                        value={franchise.gstNumber || ""}
                        onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">{franchise.gstNumber || "Not provided"}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="panNumber">PAN Number</Label>
                    {isEditing ? (
                      <Input
                        id="panNumber"
                        value={franchise.panNumber || ""}
                        onChange={(e) => handleInputChange("panNumber", e.target.value)}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">{franchise.panNumber || "Not provided"}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
                <CardDescription>Financial and contract information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="territory">Territory</Label>
                  {isEditing ? (
                    <Input
                      id="territory"
                      value={franchise.territory}
                      onChange={(e) => handleInputChange("territory", e.target.value)}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-gray-50">{franchise.territory}</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                    {isEditing ? (
                      <Input
                        id="commissionRate"
                        type="number"
                        value={franchise.commissionRate}
                        onChange={(e) => handleInputChange("commissionRate", Number.parseFloat(e.target.value))}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">{franchise.commissionRate}%</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="initialFee">Initial Fee (₹)</Label>
                    {isEditing ? (
                      <Input
                        id="initialFee"
                        type="number"
                        value={franchise.initialFee}
                        onChange={(e) => handleInputChange("initialFee", Number.parseFloat(e.target.value))}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">₹{(franchise.initialFee ?? 0).toLocaleString("en-IN")}</div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="renewalFee">Renewal Fee (₹)</Label>
                  {isEditing ? (
                    <Input
                      id="renewalFee"
                      type="number"
                      value={franchise.renewalFee}
                      onChange={(e) => handleInputChange("renewalFee", Number.parseFloat(e.target.value))}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-gray-50">₹{(franchise.renewalFee ?? 0).toLocaleString("en-IN")}</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractStartDate">Contract Start Date</Label>
                    {isEditing ? (
                      <Input
                        id="contractStartDate"
                        type="date"
                        value={
                          franchise.contractStartDate
                            ? new Date(franchise.contractStartDate).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => handleInputChange("contractStartDate", e.target.value)}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">
                        {franchise.contractStartDate
                          ? format(new Date(franchise.contractStartDate), "dd MMM yyyy")
                          : "Not specified"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contractEndDate">Contract End Date</Label>
                    {isEditing ? (
                      <Input
                        id="contractEndDate"
                        type="date"
                        value={
                          franchise.contractEndDate
                            ? new Date(franchise.contractEndDate).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => handleInputChange("contractEndDate", e.target.value)}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">
                        {franchise.contractEndDate
                          ? format(new Date(franchise.contractEndDate), "dd MMM yyyy")
                          : "Not specified"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    {isEditing ? (
                      <Select value={franchise.status} onValueChange={(value) => handleInputChange("status", value)}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="APPROVED">Approved</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                          <SelectItem value="TERMINATED">Terminated</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">
                        {getStatusBadge(franchise.status, franchise.isActive)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="isActive">Active Status</Label>
                    {isEditing ? (
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          id="isActive"
                          checked={franchise.isActive}
                          onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                        />
                        <Label htmlFor="isActive" className="cursor-pointer">
                          {franchise.isActive ? "Active" : "Inactive"}
                        </Label>
                      </div>
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">
                        {franchise.isActive ? "Active" : "Inactive"}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="owner">
          <Card>
            <CardHeader>
              <CardTitle>Franchise Owner</CardTitle>
              <CardDescription>Details about the franchise owner</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{franchise.owner.name}</h3>
                    <p className="text-sm text-muted-foreground">Franchise Owner</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 border rounded-md">
                    <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{franchise.owner.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 border rounded-md">
                    <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{franchise.owner.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => router.push(`/admin/users/${franchise.owner.id}`)}>
                    View User Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="territories">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Territories</CardTitle>
                  <CardDescription>Manage franchise territories</CardDescription>
                </div>
                <Button>Add Territory</Button>
              </div>
            </CardHeader>
            <CardContent>
              {franchise.territories && franchise.territories.length > 0 ? (
                <div className="space-y-4">
                  {franchise.territories.map((territory) => (
                    <div key={territory.id} className="flex justify-between items-center p-4 border rounded-md">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{territory.name}</p>
                          <p className="text-sm text-muted-foreground">{territory.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Territories Assigned</h3>
                  <p className="text-muted-foreground mb-4">
                    This franchise doesn't have any specific territories assigned yet.
                  </p>
                  <Button>Add First Territory</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Track franchise payments and commissions</CardDescription>
                </div>
                <Button>Record Payment</Button>
              </div>
            </CardHeader>
            <CardContent>
              {franchise.payments && franchise.payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Type</th>
                        <th className="text-left py-3 px-4 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Reference</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {franchise.payments.map((payment) => (
                        <tr key={payment.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{format(new Date(payment.createdAt), "dd MMM yyyy")}</td>
                          <td className="py-3 px-4">{payment.type}</td>
                          <td className="py-3 px-4">₹{payment.amount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge variant={payment.status === "PAID" ? "default" : "secondary"}>
                              {payment.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{payment.reference || "—"}</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Payment History</h3>
                  <p className="text-muted-foreground mb-4">There are no payments recorded for this franchise yet.</p>
                  <Button>Record First Payment</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Manage franchise documents and contracts</CardDescription>
                </div>
                <Button>Upload Document</Button>
              </div>
            </CardHeader>
            <CardContent>
              {franchise.documents && franchise.documents.length > 0 ? (
                <div className="space-y-4">
                  {franchise.documents.map((document) => (
                    <div key={document.id} className="flex justify-between items-center p-4 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{document.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded on {format(new Date(document.createdAt), "dd MMM yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Documents</h3>
                  <p className="text-muted-foreground mb-4">There are no documents uploaded for this franchise yet.</p>
                  <Button>Upload First Document</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <DollarSign className="h-8 w-8 text-green-500 mb-2" />
                  <h3 className="text-xl font-bold">₹120,500</h3>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Percent className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="text-xl font-bold">₹12,050</h3>
                  <p className="text-sm text-muted-foreground">Commission Earned</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Calendar className="h-8 w-8 text-purple-500 mb-2" />
                  <h3 className="text-xl font-bold">215</h3>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>View franchise performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border rounded-md bg-gray-50">
                <p className="text-muted-foreground">Performance chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

