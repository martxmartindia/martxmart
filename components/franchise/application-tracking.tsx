"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock, Eye, FileText, Filter, Search, UserPlus, XCircle } from "lucide-react"

type Application = {
  id: string
  applicantName: string
  type: "franchise" | "vendor" | "service" | "project" | "product"
  status: "pending" | "in_review" | "approved" | "rejected" | "completed"
  submittedDate: string
  lastUpdated: string
  priority: "low" | "medium" | "high"
}

export function ApplicationTracking() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApplications([
        {
          id: "APP-1001",
          applicantName: "Rajesh Kumar",
          type: "vendor",
          status: "pending",
          submittedDate: "2023-11-10",
          lastUpdated: "2023-11-10",
          priority: "medium",
        },
        {
          id: "APP-1002",
          applicantName: "Priya Sharma",
          type: "service",
          status: "in_review",
          submittedDate: "2023-11-08",
          lastUpdated: "2023-11-09",
          priority: "high",
        },
        {
          id: "APP-1003",
          applicantName: "Amit Patel",
          type: "project",
          status: "approved",
          submittedDate: "2023-11-05",
          lastUpdated: "2023-11-07",
          priority: "medium",
        },
        {
          id: "APP-1004",
          applicantName: "Neha Singh",
          type: "product",
          status: "completed",
          submittedDate: "2023-11-01",
          lastUpdated: "2023-11-05",
          priority: "low",
        },
        {
          id: "APP-1005",
          applicantName: "Vikram Verma",
          type: "franchise",
          status: "rejected",
          submittedDate: "2023-10-28",
          lastUpdated: "2023-11-02",
          priority: "high",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredApplications = applications.filter((application) => {
    // Filter by search query
    const matchesSearch =
      application.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.type.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by tab
    if (activeTab === "all") return matchesSearch
    if (activeTab === "pending") return matchesSearch && application.status === "pending"
    if (activeTab === "in_review") return matchesSearch && application.status === "in_review"
    if (activeTab === "approved")
      return matchesSearch && (application.status === "approved" || application.status === "completed")
    if (activeTab === "rejected") return matchesSearch && application.status === "rejected"

    return matchesSearch
  })

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "franchise":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <UserPlus className="mr-1 h-3 w-3" /> Franchise
          </Badge>
        )
      case "vendor":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
            <UserPlus className="mr-1 h-3 w-3" /> Vendor
          </Badge>
        )
      case "service":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <FileText className="mr-1 h-3 w-3" /> Service
          </Badge>
        )
      case "project":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
            <FileText className="mr-1 h-3 w-3" /> Project
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-teal-100 text-teal-800 border-teal-300">
            <FileText className="mr-1 h-3 w-3" /> Product
          </Badge>
        )
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "in_review":
        return (
          <Badge className="bg-blue-500">
            <Clock className="mr-1 h-3 w-3" /> In Review
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" /> Approved
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-700">
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" /> High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="mr-1 h-3 w-3" /> Medium
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" /> Low
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Tracking</CardTitle>
          <CardDescription>Track and manage all applications from vendors and customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Applications</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in_review">In Review</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              {renderApplicationsTable(filteredApplications, isLoading)}
            </TabsContent>
            <TabsContent value="pending" className="m-0">
              {renderApplicationsTable(filteredApplications, isLoading)}
            </TabsContent>
            <TabsContent value="in_review" className="m-0">
              {renderApplicationsTable(filteredApplications, isLoading)}
            </TabsContent>
            <TabsContent value="approved" className="m-0">
              {renderApplicationsTable(filteredApplications, isLoading)}
            </TabsContent>
            <TabsContent value="rejected" className="m-0">
              {renderApplicationsTable(filteredApplications, isLoading)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )

  function renderApplicationsTable(applications: Application[], isLoading: boolean) {
    return isLoading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ) : (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application ID</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.id}</TableCell>
                  <TableCell>{application.applicantName}</TableCell>
                  <TableCell>{getTypeBadge(application.type)}</TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>{getPriorityBadge(application.priority)}</TableCell>
                  <TableCell>{new Date(application.submittedDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(application.lastUpdated).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" /> View
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
