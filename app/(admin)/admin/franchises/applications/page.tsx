"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle, XCircle, Eye } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface FranchiseApplication {
  id: string
  applicantName: string
  businessName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  investmentCapacity: number
  preferredLocation: string
  businessExperience: string
  status: string
  submittedAt: string
  reviewedAt: string | null
  notes: string | null
}

export default function FranchiseApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<FranchiseApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<FranchiseApplication | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [notes, setNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [router])

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/franchises/applications")
      const data = await response.json()

      if (response.ok) {
        setApplications(data.applications)
      } else {
        toast.error(data.error || "Failed to fetch applications")
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast.error("Failed to fetch applications")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewApplication = (application: FranchiseApplication) => {
    setSelectedApplication(application)
    setViewDialogOpen(true)
  }

  const handleAction = (application: FranchiseApplication, action: "approve" | "reject") => {
    setSelectedApplication(application)
    setActionType(action)
    setNotes("")
    setActionDialogOpen(true)
  }

  const processAction = async () => {
    if (!selectedApplication || !actionType) return

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/franchises/applications/${selectedApplication.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: actionType === "approve" ? "APPROVED" : "REJECTED",
          notes,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Application ${actionType === "approve"? "approved" : "rejected"} successfully`)
        setActionDialogOpen(false)
        fetchApplications()
      } else {
        throw new Error(data.error || `Failed to ${actionType} application`)
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "UNDER_REVIEW":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Under Review
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
      case "INTERVIEW_SCHEDULED":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Interview Scheduled
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
        <span className="text-lg">Loading applications...</span>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Franchise Applications</h1>
        <p className="text-muted-foreground">Manage and review franchise applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>Review and process franchise applications from potential partners</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No franchise applications found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.applicantName}</TableCell>
                    <TableCell>{application.businessName}</TableCell>
                    <TableCell>{application.preferredLocation}</TableCell>
                    <TableCell>₹{application.investmentCapacity.toLocaleString()}</TableCell>
                    <TableCell>{format(new Date(application.submittedAt), "dd MMM yyyy")}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewApplication(application)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {application.status === "PENDING" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleAction(application, "approve")}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleAction(application, "reject")}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Application Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedApplication && format(new Date(selectedApplication.submittedAt), "dd MMMM yyyy")}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Applicant Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p>{selectedApplication.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p>{selectedApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p>{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p>
                      {selectedApplication.address}, {selectedApplication.city}, {selectedApplication.state} -{" "}
                      {selectedApplication.zip}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Business Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Business Name</p>
                    <p>{selectedApplication.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Preferred Location</p>
                    <p>{selectedApplication.preferredLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Investment Capacity</p>
                    <p>₹{selectedApplication.investmentCapacity.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p>{getStatusBadge(selectedApplication.status)}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm font-medium">Business Experience</p>
                <p className="text-sm mt-1">{selectedApplication.businessExperience}</p>
              </div>

              {selectedApplication.notes && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm mt-1">{selectedApplication.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve/Reject Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === "approve" ? "Approve Application" : "Reject Application"}</DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Approve this franchise application and notify the applicant."
                : "Reject this franchise application and provide a reason."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label htmlFor="notes" className="text-sm font-medium">
              {actionType === "approve" ? "Additional Notes (Optional)" : "Rejection Reason"}
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                actionType === "approve"
                  ? "Add any additional information or next steps..."
                  : "Provide a reason for rejecting this application..."
              }
              className="mt-1"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={processAction}
              disabled={isProcessing || (actionType === "reject" && !notes)}
              variant={actionType === "approve" ? "default" : "destructive"}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : actionType === "approve" ? (
                "Approve"
              ) : (
                "Reject"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

