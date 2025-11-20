"use client"

import { useState, useEffect } from "react"
import { FileText, Clock, AlertCircle, Download, Eye, ArrowRight, Filter, Search, Calendar, TrendingUp, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface ProjectReport {
  id: string
  projectId: string
  status: string
  paymentStatus: string
  paymentAmount: number
  createdAt: string
  updatedAt: string
  reportUrl: string | null
  project: {
    name: string
    slug: string
  }
}

export default function ProjectReportsPage() {
  const [reports, setReports] = useState<ProjectReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/project-reports")
        if (!response.ok) {
          throw new Error("Failed to fetch project reports")
        }
        const data = await response.json()
        setReports(data)
      } catch (error) {
        console.error("Error fetching project reports:", error)
        setError("Failed to load project reports. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesPayment = paymentFilter === "all" || report.paymentStatus.toLowerCase() === paymentFilter.toLowerCase()
    const matchesTab = activeTab === "all" || 
      (activeTab === "completed" && report.status === "Completed") ||
      (activeTab === "processing" && report.status === "Processing") ||
      (activeTab === "pending" && report.status === "Pending")
    
    return matchesSearch && matchesStatus && matchesPayment && matchesTab
  })

  // Calculate statistics
const stats = reports.reduce((acc, report) => {
  acc.total++;
  acc.totalAmount += report.paymentAmount;
  switch (report.status) {
    case "Completed":
      acc.completed++;
      break;
    case "Processing":
      acc.processing++;
      break;
    case "Pending":
      acc.pending++;
      break;
  }
  return acc;
}, {
  total: 0,
  completed: 0,
  processing: 0,
  pending: 0,
  totalAmount: 0,
});

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const getPaymentColor = (status: string) => {
    return status === "Paid" 
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-orange-100 text-orange-800 border-orange-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Project Reports</h1>
              <p className="text-gray-600">Track and manage your project report applications</p>
            </div>
            <Link href="/project-reports">
              <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <TrendingUp className="mr-2 h-4 w-4" />
                Explore More Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Statistics Cards */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Reports</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <FileText className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Processing</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
                    </div>
                    <Loader2 className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Invested</p>
                      <p className="text-2xl font-bold text-orange-600">₹{stats.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search and Filters */}
          {!loading && !error && reports.length > 0 && (
            <Card className="bg-white border-0 shadow-md mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search project reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabs for different views */}
        {!loading && !error && reports.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
              <TabsTrigger value="all" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                Completed ({stats.completed})
              </TabsTrigger>
              <TabsTrigger value="processing" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                Processing ({stats.processing})
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700">
                Pending ({stats.pending})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="bg-white border-0 shadow-md">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-10 w-28" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <XCircle className="h-5 w-5 mr-2" />
                Error
              </CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : reports.length === 0 ? (
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl">No Project Reports Found</CardTitle>
              <CardDescription className="text-lg">You haven't applied for any project reports yet.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Explore our project categories and apply for detailed project reports to kickstart your business journey.
              </p>
              <Link href="/project-reports">
                <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Explore Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : filteredReports.length === 0 ? (
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle>No reports match your filters</CardTitle>
              <CardDescription>Try adjusting your search criteria</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setPaymentFilter("all")
                  setActiveTab("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {report.project.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Applied on {new Date(report.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${getStatusColor(report.status)} flex items-center gap-1`}>
                        {getStatusIcon(report.status)}
                        {report.status}
                      </Badge>
                      <Badge className={getPaymentColor(report.paymentStatus)}>
                        {report.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <FileText className="h-4 w-4 mr-2 text-orange-500" />
                          <span>Report ID: {report.id.substring(0, 8).toUpperCase()}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-orange-500" />
                          <span>Updated: {new Date(report.updatedAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
                          <span>Amount: ₹{report.paymentAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                      <Link href={`/account/project-reports/${report.id}`}>
                        <Button variant="outline" className="w-full sm:w-auto flex items-center hover:bg-orange-50 hover:border-orange-300">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      {report.status === "Completed" && report.reportUrl ? (
                        <>
                          <Link href={report.reportUrl}>
                            <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center">
                              <Download className="h-4 w-4 mr-2" />
                              Download Report
                            </Button>
                          </Link>
                        </>
                      ) : report.paymentStatus === "Pending" ? (
                        <Link href={`/project-report/payment/${report.id}`}>
                          <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white">
                            Complete Payment
                          </Button>
                        </Link>
                      ) : (
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                          <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
                          <span>
                            {report.status === "Processing" ? "Report is being prepared" : "Awaiting processing"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}