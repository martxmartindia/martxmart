"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { CheckCircle, Clock, Eye, Filter, MoreHorizontal, Plus, Search, Store, UserPlus, XCircle } from "lucide-react"

type Vendor = {
  id: string
  businessName: string
  businessType: string
  address: string
  city: string
  state: string
  pincode: string
  gstNumber?: string | null
  panNumber?: string | null
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED"
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    phone: string | null
    image: string | null
  }
}

type Service = {
  id: string
  name: string
  description: string
  price: number
  category: string
  isActive: boolean
  createdAt: string
  vendor: {
    id: string
    businessName: string
  }
}

export function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("vendors")
  const [openNewVendor, setOpenNewVendor] = useState(false)
  const [openNewService, setOpenNewService] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [vendorFormData, setVendorFormData] = useState({
    businessName: "",
    businessType: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    panNumber: "",
  })
  const [serviceFormData, setServiceFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    vendorId: "",
  })

  // Fetch vendors and services on component mount
  useEffect(() => {
    fetchVendors()
    fetchServices()
  }, [])

  const fetchVendors = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/franchise-portal/vendors")
      if (!response.ok) {
        throw new Error("Failed to fetch vendors")
      }
      const data = await response.json()
      setVendors(data.vendors)
    } catch (error) {
      console.error("Error fetching vendors:", error)
      toast.error("Failed to load vendors. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchServices = async () => {
    setIsLoadingServices(true)
    try {
      // For franchise portal, services are not implemented yet
      // This would need a proper Service model linked to vendors
      setServices([])
    } catch (error) {
      console.error("Error fetching services:", error)
      toast.error("Failed to load services. Please try again.")
    } finally {
      setIsLoadingServices(false)
    }
  }

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/franchise-portal/vendors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...vendorFormData,
          userId: "new-user-id", // In a real app, you would have a user selection or creation process
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create vendor")
      }

      const data = await response.json()

      // Add the new vendor to the list
      setVendors([data.vendor, ...vendors])

      // Reset form and close dialog
      setVendorFormData({
        businessName: "",
        businessType: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        gstNumber: "",
        panNumber: "",
      })
      setOpenNewVendor(false)

      toast.success("The vendor has been added successfully.")
    } catch (error) {
      console.error("Error adding vendor:", error)
      toast.error("Failed to add vendor. Please try again.")
    }
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()

    // For now, services are not implemented in franchise portal
    toast.info("Service management will be available in a future update.")

    // Reset form and close dialog
    setServiceFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      vendorId: "",
    })
    setOpenNewService(false)
  }

  const handleStatusChange = async (vendorId: string, newStatus: "APPROVED" | "REJECTED" | "SUSPENDED") => {
    try {
      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update vendor status")
      }

      const data = await response.json()

      // Update the vendor in the list
      setVendors(vendors.map((vendor) => (vendor.id === vendorId ? data.vendor : vendor)))

      toast.success(`Vendor status has been updated to ${newStatus.toLowerCase()}.`)
    } catch (error) {
      console.error("Error updating vendor status:", error)
      toast.error("Failed to update vendor status. Please try again.")
    }
  }

  const handleServiceStatusChange = async (serviceId: string, isActive: boolean) => {
    // For now, services are not implemented in franchise portal
    toast.info("Service management will be available in a future update.")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" /> Approved
          </Badge>
        )
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        )
      case "SUSPENDED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="mr-1 h-3 w-3" /> Suspended
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.businessType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vendor Management</CardTitle>
          <CardDescription>Manage vendors and their services</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="vendors" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="vendors">Vendors</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={activeTab === "vendors" ? "Search vendors..." : "Search services..."}
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                {activeTab === "vendors" ? (
                  <Dialog open={openNewVendor} onOpenChange={setOpenNewVendor}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Vendor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Add New Vendor</DialogTitle>
                        <DialogDescription>Add a new vendor to your franchise network.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddVendor}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="businessName">Business Name</Label>
                              <Input
                                id="businessName"
                                required
                                value={vendorFormData.businessName}
                                onChange={(e) => setVendorFormData({ ...vendorFormData, businessName: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="businessType">Business Type</Label>
                              <Select
                                value={vendorFormData.businessType}
                                onValueChange={(value) => setVendorFormData({ ...vendorFormData, businessType: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Electronics">Electronics</SelectItem>
                                  <SelectItem value="Textiles">Textiles</SelectItem>
                                  <SelectItem value="Logistics">Logistics</SelectItem>
                                  <SelectItem value="Printing">Printing</SelectItem>
                                  <SelectItem value="IT Services">IT Services</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                              id="address"
                              rows={2}
                              required
                              value={vendorFormData.address}
                              onChange={(e) => setVendorFormData({ ...vendorFormData, address: e.target.value })}
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                required
                                value={vendorFormData.city}
                                onChange={(e) => setVendorFormData({ ...vendorFormData, city: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state">State</Label>
                              <Input
                                id="state"
                                required
                                value={vendorFormData.state}
                                onChange={(e) => setVendorFormData({ ...vendorFormData, state: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="pincode">Pincode</Label>
                              <Input
                                id="pincode"
                                required
                                value={vendorFormData.pincode}
                                onChange={(e) => setVendorFormData({ ...vendorFormData, pincode: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="gstNumber">GST Number</Label>
                              <Input
                                id="gstNumber"
                                value={vendorFormData.gstNumber}
                                onChange={(e) => setVendorFormData({ ...vendorFormData, gstNumber: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="panNumber">PAN Number</Label>
                              <Input
                                id="panNumber"
                                value={vendorFormData.panNumber}
                                onChange={(e) => setVendorFormData({ ...vendorFormData, panNumber: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Add Vendor</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Dialog open={openNewService} onOpenChange={setOpenNewService}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                        <DialogDescription>Add a new service offered by a vendor.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddService}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="vendor" className="text-right">
                              Vendor
                            </Label>
                            <Select
                              value={serviceFormData.vendorId}
                              onValueChange={(value) => setServiceFormData({ ...serviceFormData, vendorId: value })}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select vendor" />
                              </SelectTrigger>
                              <SelectContent>
                                  {vendors
                                    .filter((vendor) => vendor.status === "APPROVED")
                                    .map((vendor) => (
                                      <SelectItem key={vendor.id} value={vendor.id}>
                                        {vendor.businessName || vendor.user?.name || 'Unknown Vendor'}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Service Name
                            </Label>
                            <Input
                              id="name"
                              className="col-span-3"
                              required
                              value={serviceFormData.name}
                              onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                              Category
                            </Label>
                            <Input
                              id="category"
                              className="col-span-3"
                              required
                              value={serviceFormData.category}
                              onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                              Price (₹)
                            </Label>
                            <Input
                              id="price"
                              type="number"
                              className="col-span-3"
                              required
                              value={serviceFormData.price}
                              onChange={(e) => setServiceFormData({ ...serviceFormData, price: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="description" className="text-right pt-2">
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              className="col-span-3"
                              rows={3}
                              placeholder="Describe the service..."
                              required
                              value={serviceFormData.description}
                              onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Add Service</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            <TabsContent value="vendors" className="m-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVendors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No vendors found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredVendors.map((vendor) => (
                          <TableRow key={vendor.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage
                                    src={vendor.user.image || "/placeholder.svg"}
                                    alt={vendor.businessName}
                                  />
                                  <AvatarFallback>
                                    <Store className="h-4 w-4" />
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{vendor.businessName}</div>
                                  <div className="text-sm text-muted-foreground">{vendor.businessType}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>{vendor.user.name}</div>
                              <div className="text-sm text-muted-foreground">{vendor.user.email}</div>
                              <div className="text-sm text-muted-foreground">{vendor.user.phone}</div>
                            </TableCell>
                            <TableCell>
                              <div>
                                {vendor.city}, {vendor.state}
                              </div>
                              <div className="text-sm text-muted-foreground">{vendor.pincode}</div>
                            </TableCell>
                            <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                            <TableCell>{new Date(vendor.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Plus className="mr-2 h-4 w-4" /> Add Service
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {vendor.status === "PENDING" && (
                                    <>
                                      <DropdownMenuItem onClick={() => handleStatusChange(vendor.id, "APPROVED")}>
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleStatusChange(vendor.id, "REJECTED")}>
                                        <XCircle className="mr-2 h-4 w-4 text-red-500" /> Reject
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {vendor.status === "APPROVED" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(vendor.id, "SUSPENDED")}>
                                      <XCircle className="mr-2 h-4 w-4 text-red-500" /> Suspend
                                    </DropdownMenuItem>
                                  )}
                                  {(vendor.status === "REJECTED" || vendor.status === "SUSPENDED") && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(vendor.id, "APPROVED")}>
                                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Reactivate
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="services" className="m-0">
              {isLoadingServices ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service ID</TableHead>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price (₹)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No services found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredServices.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">{service.id}</TableCell>
                            <TableCell>
                              <div>{service.name}</div>
                              <div className="text-xs text-muted-foreground max-w-[200px] truncate">
                                {service.description}
                              </div>
                            </TableCell>
                            <TableCell>{service.vendor?.businessName || 'Unknown Vendor'}</TableCell>
                            <TableCell>{service.category}</TableCell>
                            <TableCell>₹{service.price.toLocaleString()}</TableCell>
                            <TableCell>
                              {service.isActive ? (
                                <Badge className="bg-green-500">Active</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{new Date(service.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                                {service.isActive ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-500"
                                    onClick={() => handleServiceStatusChange(service.id, false)}
                                  >
                                    Deactivate
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-500"
                                    onClick={() => handleServiceStatusChange(service.id, true)}
                                  >
                                    Activate
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
