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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { FileText, ImageIcon, Package, Plus, Search, ShoppingCart } from "lucide-react"

type PromotionRequest = {
  id: string
  title: string
  type: "advertisement" | "marketing" | "event"
  status: "pending" | "approved" | "rejected"
  requestDate: string
  description: string
}

type PromotionalItem = {
  id: string
  name: string
  type: "banner" | "flyer" | "tshirt" | "card" | "other"
  quantity: number
  available: number
  lastOrdered?: string
}

export function PromotionManagement() {
  const [activeTab, setActiveTab] = useState("requests")
  const [requests, setRequests] = useState<PromotionRequest[]>([])
  const [items, setItems] = useState<PromotionalItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [openNewRequest, setOpenNewRequest] = useState(false)
  const [openOrderItems, setOpenOrderItems] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRequests([
        {
          id: "PR-1001",
          title: "Diwali Special Campaign",
          type: "advertisement",
          status: "approved",
          requestDate: "2023-10-15",
          description: "Approval for Diwali special promotional campaign in local newspapers.",
        },
        {
          id: "PR-1002",
          title: "Product Launch Event",
          type: "event",
          status: "pending",
          requestDate: "2023-11-05",
          description: "Request for organizing a product launch event in the district.",
        },
        {
          id: "PR-1003",
          title: "Social Media Campaign",
          type: "marketing",
          status: "rejected",
          requestDate: "2023-10-28",
          description: "Proposal for social media marketing campaign targeting local audience.",
        },
        {
          id: "PR-1004",
          title: "Festival Discount Flyers",
          type: "marketing",
          status: "approved",
          requestDate: "2023-10-20",
          description: "Request for festival discount flyers to distribute in the district.",
        },
        {
          id: "PR-1005",
          title: "Radio Advertisement",
          type: "advertisement",
          status: "pending",
          requestDate: "2023-11-08",
          description: "Proposal for radio advertisement in local FM channels.",
        },
      ])

      setItems([
        {
          id: "PI-1001",
          name: "Company Branded T-shirts",
          type: "tshirt",
          quantity: 50,
          available: 15,
          lastOrdered: "2023-09-20",
        },
        {
          id: "PI-1002",
          name: "Promotional Banners",
          type: "banner",
          quantity: 20,
          available: 5,
          lastOrdered: "2023-10-10",
        },
        {
          id: "PI-1003",
          name: "Product Flyers",
          type: "flyer",
          quantity: 1000,
          available: 350,
          lastOrdered: "2023-10-25",
        },
        {
          id: "PI-1004",
          name: "Staff ID Cards",
          type: "card",
          quantity: 30,
          available: 8,
          lastOrdered: "2023-08-15",
        },
        {
          id: "PI-1005",
          name: "Promotional Pens",
          type: "other",
          quantity: 500,
          available: 120,
          lastOrdered: "2023-09-05",
        },
      ])

      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredRequests = requests.filter(
    (request) =>
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRequestTypeBadge = (type: string) => {
    switch (type) {
      case "advertisement":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
            <FileText className="mr-1 h-3 w-3" /> Advertisement
          </Badge>
        )
      case "marketing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <ImageIcon className="mr-1 h-3 w-3" /> Marketing
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <FileText className="mr-1 h-3 w-3" /> Event
          </Badge>
        )
    }
  }

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending
          </Badge>
        )
    }
  }

  const getItemTypeBadge = (type: string) => {
    switch (type) {
      case "banner":
        return (
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-300">
            <ImageIcon className="mr-1 h-3 w-3" /> Banner
          </Badge>
        )
      case "flyer":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <FileText className="mr-1 h-3 w-3" /> Flyer
          </Badge>
        )
      case "tshirt":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <Package className="mr-1 h-3 w-3" /> T-shirt
          </Badge>
        )
      case "card":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
            <FileText className="mr-1 h-3 w-3" /> Card
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Package className="mr-1 h-3 w-3" /> Other
          </Badge>
        )
    }
  }

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault()
    // Create request logic would go here
    setOpenNewRequest(false)
    toast.success("Promotion request submitted successfully!")
  }

  const handleOrderItems = (e: React.FormEvent) => {
    e.preventDefault()
    // Order items logic would go here
    setOpenOrderItems(false)
    toast.success("Item order placed successfully!")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Promotion Management (Prachar)</CardTitle>
          <CardDescription>Manage promotional requests and materials</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="requests" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="requests">Promotion Requests</TabsTrigger>
                <TabsTrigger value="inventory">Promotional Items</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={activeTab === "requests" ? "Search requests..." : "Search items..."}
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {activeTab === "requests" ? (
                  <Dialog open={openNewRequest} onOpenChange={setOpenNewRequest}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Create Promotion Request</DialogTitle>
                        <DialogDescription>Submit a new promotional request for approval.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateRequest}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                              Title
                            </Label>
                            <Input id="title" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                              Type
                            </Label>
                            <Select defaultValue="advertisement">
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="advertisement">Advertisement</SelectItem>
                                <SelectItem value="marketing">Marketing Material</SelectItem>
                                <SelectItem value="event">Event</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="description" className="text-right pt-2">
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              className="col-span-3"
                              rows={5}
                              placeholder="Describe your promotional request in detail..."
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="budget" className="text-right">
                              Budget (₹)
                            </Label>
                            <Input id="budget" type="number" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="timeline" className="text-right">
                              Timeline
                            </Label>
                            <Input id="timeline" type="date" className="col-span-3" required />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Submit Request</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Dialog open={openOrderItems} onOpenChange={setOpenOrderItems}>
                    <DialogTrigger asChild>
                      <Button>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Order Items
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Order Promotional Items</DialogTitle>
                        <DialogDescription>Request new promotional items from admin.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleOrderItems}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="item" className="text-right">
                              Item
                            </Label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select item" />
                              </SelectTrigger>
                              <SelectContent>
                                {items.map((item) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-right">
                              Quantity
                            </Label>
                            <Input id="quantity" type="number" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="notes" className="text-right pt-2">
                              Notes
                            </Label>
                            <Textarea
                              id="notes"
                              className="col-span-3"
                              rows={3}
                              placeholder="Any special requirements or notes..."
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="delivery" className="text-right">
                              Needed By
                            </Label>
                            <Input id="delivery" type="date" className="col-span-3" required />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Place Order</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            <TabsContent value="requests" className="m-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No promotion requests found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.id}</TableCell>
                            <TableCell>
                              <div className="max-w-[200px] truncate" title={request.title}>
                                {request.title}
                              </div>
                              <div
                                className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate"
                                title={request.description}
                              >
                                {request.description}
                              </div>
                            </TableCell>
                            <TableCell>{getRequestTypeBadge(request.type)}</TableCell>
                            <TableCell>{getRequestStatusBadge(request.status)}</TableCell>
                            <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="inventory" className="m-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Total Quantity</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Last Ordered</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No promotional items found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{getItemTypeBadge(item.type)}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              <span className={item.available < 10 ? "text-red-500 font-medium" : ""}>
                                {item.available}
                              </span>
                            </TableCell>
                            <TableCell>
                              {item.lastOrdered ? new Date(item.lastOrdered).toLocaleDateString() : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline">
                                Order More
                              </Button>
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
