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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Clock,
  Filter,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Send,
  Ticket,
  XCircle,
} from "lucide-react"

type TicketItem = {
  id: string
  title: string
  description: string
  category: string
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  createdBy: {
    id: string
    name: string
    image: string | null
  }
  assignedTo?: {
    id: string
    name: string
    image: string | null
  } | null
  createdAt: string
  updatedAt: string
  comments: TicketComment[]
}

type TicketComment = {
  id: string
  content: string
  user: {
    id: string
    name: string
    image: string | null
  }
  createdAt: string
}

export function TicketSystem() {
  const [tickets, setTickets] = useState<TicketItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [openNewTicket, setOpenNewTicket] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null)
  const [commentText, setCommentText] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
  })

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/tickets")
      if (!response.ok) {
        throw new Error("Failed to fetch tickets")
      }
      const data = await response.json()
      setTickets(data.tickets)
    } catch (error) {
      console.error("Error fetching tickets:", error)
      toast.error("Failed to load tickets. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTicketDetails = async (ticketId: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch ticket details")
      }
      const data = await response.json()
      setSelectedTicket(data.ticket)
    } catch (error) {
      console.error("Error fetching ticket details:", error)
      toast.error("Failed to load ticket details. Please try again.")
    }
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create ticket")
      }

      const data = await response.json()

      // Add the new ticket to the list
      setTickets([data.ticket, ...tickets])

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "MEDIUM",
      })
      setOpenNewTicket(false)

      toast.success("Your ticket has been created successfully.")
    } catch (error) {
      console.error("Error creating ticket:", error)
      toast.error("Failed to create ticket. Please try again.")
    }
  }

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedTicket) return

    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentText,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      const data = await response.json()

      // Refresh ticket details to include the new comment
      fetchTicketDetails(selectedTicket.id)

      // Clear the input
      setCommentText("")

      toast.success("Your comment has been added successfully.")
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment. Please try again.")
    }
  }

  const handleUpdateTicketStatus = async (ticketId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update ticket status")
      }

      const data = await response.json()

      // Update the selected ticket
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(data.ticket)
      }

      // Update the ticket in the list
      setTickets(tickets.map((ticket) => (ticket.id === ticketId ? data.ticket : ticket)))

      toast.success(`Ticket status has been updated to ${status.toLowerCase().replace("_", " ")}.`)
    } catch (error) {
      console.error("Error updating ticket status:", error)
      toast.error("Failed to update ticket status. Please try again.")
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" /> Critical
          </Badge>
        )
      case "HIGH":
        return (
          <Badge className="bg-orange-500">
            <AlertCircle className="mr-1 h-3 w-3" /> High
          </Badge>
        )
      case "MEDIUM":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="mr-1 h-3 w-3" /> Medium
          </Badge>
        )
      case "LOW":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <Clock className="mr-1 h-3 w-3" /> Low
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <Clock className="mr-1 h-3 w-3" /> Open
          </Badge>
        )
      case "IN_PROGRESS":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="mr-1 h-3 w-3" /> In Progress
          </Badge>
        )
      case "RESOLVED":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" /> Resolved
          </Badge>
        )
      case "CLOSED":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
            <XCircle className="mr-1 h-3 w-3" /> Closed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const filteredTickets = tickets.filter((ticket) => {
    // Filter by search query
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by tab
    if (activeTab === "all") return matchesSearch
    if (activeTab === "open") return matchesSearch && ticket.status === "OPEN"
    if (activeTab === "in_progress") return matchesSearch && ticket.status === "IN_PROGRESS"
    if (activeTab === "resolved") return matchesSearch && ticket.status === "RESOLVED"
    if (activeTab === "closed") return matchesSearch && ticket.status === "CLOSED"

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>Manage and track support tickets</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedTicket ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                  <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                  Back to Tickets
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => fetchTicketDetails(selectedTicket.id)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  {selectedTicket.status === "OPEN" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 border-yellow-300"
                      onClick={() => handleUpdateTicketStatus(selectedTicket.id, "IN_PROGRESS")}
                    >
                      Mark as In Progress
                    </Button>
                  )}
                  {(selectedTicket.status === "OPEN" || selectedTicket.status === "IN_PROGRESS") && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-300"
                      onClick={() => handleUpdateTicketStatus(selectedTicket.id, "RESOLVED")}
                    >
                      Mark as Resolved
                    </Button>
                  )}
                  {selectedTicket.status === "RESOLVED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-gray-100 text-gray-800 border-gray-300"
                      onClick={() => handleUpdateTicketStatus(selectedTicket.id, "CLOSED")}
                    >
                      Close Ticket
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedTicket.title}</CardTitle>
                        <CardDescription>Ticket ID: {selectedTicket.id}</CardDescription>
                      </div>
                      <div>{getStatusBadge(selectedTicket.status)}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Description</h4>
                        <p className="text-sm text-muted-foreground">{selectedTicket.description}</p>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium mb-2 flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Comments ({selectedTicket.comments.length})
                        </h4>
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-4">
                            {selectedTicket.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={comment.user.image || "/placeholder.svg"} />
                                  <AvatarFallback>{comment.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium text-sm">{comment.user.name}</div>
                                    <div className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</div>
                                  </div>
                                  <div className="text-sm mt-1">{comment.content}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>

                        <div className="mt-4 flex items-end gap-2">
                          <Textarea
                            placeholder="Add a comment..."
                            className="min-h-10 resize-none"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleAddComment()
                              }
                            }}
                          />
                          <Button size="sm" className="h-10" onClick={handleAddComment} disabled={!commentText.trim()}>
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Category</h4>
                        <p className="text-sm">{selectedTicket.category}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Priority</h4>
                        <div>{getPriorityBadge(selectedTicket.priority)}</div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Created By</h4>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={selectedTicket.createdBy.image || "/placeholder.svg"} />
                            <AvatarFallback>
                              {selectedTicket.createdBy.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{selectedTicket.createdBy.name}</span>
                        </div>
                      </div>
                      {selectedTicket.assignedTo && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Assigned To</h4>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={selectedTicket.assignedTo.image || "/placeholder.svg"} />
                              <AvatarFallback>
                                {selectedTicket.assignedTo.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{selectedTicket.assignedTo.name}</span>
                          </div>
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-medium mb-1">Created At</h4>
                        <p className="text-sm">{formatDate(selectedTicket.createdAt)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Last Updated</h4>
                        <p className="text-sm">{formatDate(selectedTicket.updatedAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Tickets</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tickets..."
                      className="pl-8 w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Dialog open={openNewTicket} onOpenChange={setOpenNewTicket}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Ticket
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Create New Ticket</DialogTitle>
                        <DialogDescription>Create a new support ticket to get help.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateTicket}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                              Title
                            </Label>
                            <Input
                              id="title"
                              className="col-span-3"
                              required
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                              Category
                            </Label>
                            <Select
                              value={formData.category}
                              onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Technical">Technical</SelectItem>
                                <SelectItem value="Finance">Finance</SelectItem>
                                <SelectItem value="Vendor Management">Vendor Management</SelectItem>
                                <SelectItem value="Product">Product</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-right">
                              Priority
                            </Label>
                            <Select
                              value={formData.priority}
                              onValueChange={(value) =>
                                setFormData({ ...formData, priority: value as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" })
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="CRITICAL">Critical</SelectItem>
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
                              placeholder="Describe your issue in detail..."
                              required
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Create Ticket</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <TabsContent value="all" className="m-0">
                {renderTicketsTable(filteredTickets, isLoading)}
              </TabsContent>
              <TabsContent value="open" className="m-0">
                {renderTicketsTable(filteredTickets, isLoading)}
              </TabsContent>
              <TabsContent value="in_progress" className="m-0">
                {renderTicketsTable(filteredTickets, isLoading)}
              </TabsContent>
              <TabsContent value="resolved" className="m-0">
                {renderTicketsTable(filteredTickets, isLoading)}
              </TabsContent>
              <TabsContent value="closed" className="m-0">
                {renderTicketsTable(filteredTickets, isLoading)}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )

  function renderTicketsTable(tickets: TicketItem[], isLoading: boolean) {
    return isLoading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ) : (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={ticket.title}>
                      {ticket.title}
                    </div>
                  </TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(ticket.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => fetchTicketDetails(ticket.id)}>
                      <Ticket className="mr-1 h-4 w-4" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    )
  }
}
