"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Search, AlertTriangle, CheckCircle, Info, Download, RefreshCw, Calendar, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { toast } from "sonner"

interface LogEntry {
  id: string
  timestamp: string
  level: string
  source: string
  message: string
  details: string
  userId?: string
  userName?: string
  ip?: string
  userAgent?: string
}

export default function AdminLogsPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchLogs()
  }, [ router, currentPage, levelFilter, sourceFilter, dateRange])

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        level: levelFilter !== "all" ? levelFilter : "",
        source: sourceFilter !== "all" ? sourceFilter : "",
        search: searchQuery,
        from: dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "",
        to: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "",
      })

      const response = await fetch(`/api/admin/logs?${queryParams}`)
      const data = await response.json()

      if (response.ok) {
        setLogs(data.logs)
        setTotalPages(data.pagination.totalPages)
      } else {
        toast.error("Failed to fetch logs")
      }
    } catch (error) {
      console.error("Error fetching logs:", error)
      toast.error("Failed to fetch logs")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchLogs()
  }

  const getLevelBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Error
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Warning
          </Badge>
        )
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Info
          </Badge>
        )
      case "debug":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Debug
          </Badge>
        )
      case "success":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Success
          </Badge>
        )
      default:
        return <Badge variant="outline">{level}</Badge>
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />
      case "debug":
        return <Info className="h-4 w-4 text-gray-600" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const exportLogs = () => {
    toast.success("Logs exported successfully")
    //TODO  In a real implementation, this would generate and download a CSV file
  }

  const refreshLogs = () => {
    fetchLogs()
    toast.success("Logs refreshed successfully")
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Logs</h1>
          <p className="text-muted-foreground">View and analyze system activity logs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshLogs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>View detailed logs of system activities and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="secondary">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>

              <div className="flex gap-2">
                <Select
                  value={levelFilter}
                  onValueChange={(value) => {
                    setLevelFilter(value)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={sourceFilter}
                  onValueChange={(value) => {
                    setSourceFilter(value)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="auth">Authentication</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[250px] justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange({
                          from: range?.from,
                          to: range?.to || range?.from
                        })
                        setCurrentPage(1)
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
                <span className="text-lg">Loading logs...</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Logs Found</h3>
                <p className="text-muted-foreground mb-4">No logs match your current filters.</p>
                <Button onClick={refreshLogs}>Refresh Logs</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Timestamp</TableHead>
                      <TableHead className="w-[100px]">Level</TableHead>
                      <TableHead className="w-[120px]">Source</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead className="w-[120px]">User</TableHead>
                      <TableHead className="w-[120px]">IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id} className="group cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-mono text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getLevelIcon(log.level)}
                            {getLevelBadge(log.level)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.source}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{log.message}</div>
                          <div className="text-xs text-muted-foreground hidden group-hover:block">{log.details}</div>
                        </TableCell>
                        <TableCell>{log.userName || "—"}</TableCell>
                        <TableCell>{log.ip || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

