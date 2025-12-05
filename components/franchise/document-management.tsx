"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Edit, FileText, Filter, MoreHorizontal, Plus, Search, Trash2, Upload, Eye, Download } from "lucide-react"

interface FranchiseDocument {
  id: string
  documentType: string
  documentUrl: string
  cloudinaryPublicId: string | null
  isVerified: boolean
  uploadedAt: string
  verifiedAt: string | null
}

export function DocumentManagement() {
  const [documents, setDocuments] = useState<FranchiseDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [openUploadDialog, setOpenUploadDialog] = useState(false)
  const [editingDocument, setEditingDocument] = useState<FranchiseDocument | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadFormData, setUploadFormData] = useState({
    documentType: "",
    file: null as File | null,
  })

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/franchise-portal/documents")
      if (!response.ok) {
        throw new Error("Failed to fetch documents")
      }
      const data = await response.json()
      setDocuments(data.documents)
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast.error("Failed to load documents. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadFormData.file || !uploadFormData.documentType) {
      toast.error("Please select a file and document type")
      return
    }

    setIsUploading(true)

    try {
      // First, upload to Cloudinary (you'll need to implement this API)
      const formData = new FormData()
      formData.append("file", uploadFormData.file)
      formData.append("folder", "franchise-documents")

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file")
      }

      const uploadData = await uploadResponse.json()

      // Then save document record
      const documentResponse = await fetch("/api/franchise-portal/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentType: uploadFormData.documentType,
          documentUrl: uploadData.url,
          cloudinaryPublicId: uploadData.publicId,
        }),
      })

      if (!documentResponse.ok) {
        const errorData = await documentResponse.json()
        throw new Error(errorData.error || "Failed to save document")
      }

      const documentData = await documentResponse.json()

      // Add the new document to the list
      setDocuments([documentData.document, ...documents])

      // Reset form and close dialog
      resetUploadForm()
      setOpenUploadDialog(false)

      toast.success("Document uploaded successfully.")
    } catch (error) {
      console.error("Error uploading document:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload document. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleUpdateDocument = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingDocument) return

    try {
      const response = await fetch(`/api/franchise-portal/documents/${editingDocument.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentType: uploadFormData.documentType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update document")
      }

      const data = await response.json()

      // Update the document in the list
      setDocuments(documents.map(d => d.id === editingDocument.id ? data.document : d))

      // Reset form and close dialog
      resetUploadForm()
      setEditingDocument(null)

      toast.success("Document updated successfully.")
    } catch (error) {
      console.error("Error updating document:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update document. Please try again.")
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      const response = await fetch(`/api/franchise-portal/documents/${documentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete document")
      }

      // Remove the document from the list
      setDocuments(documents.filter(d => d.id !== documentId))

      toast.success("Document deleted successfully.")
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete document. Please try again.")
    }
  }

  const resetUploadForm = () => {
    setUploadFormData({
      documentType: "",
      file: null,
    })
  }

  const openEditDialog = (document: FranchiseDocument) => {
    setEditingDocument(document)
    setUploadFormData({
      documentType: document.documentType,
      file: null,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadFormData({ ...uploadFormData, file })
    }
  }

  const filteredDocuments = documents.filter(
    (document) =>
      document.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getDocumentTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      "GST_CERTIFICATE": "GST Certificate",
      "PAN_CARD": "PAN Card",
      "AADHAR_CARD": "Aadhar Card",
      "BANK_STATEMENT": "Bank Statement",
      "ADDRESS_PROOF": "Address Proof",
      "BUSINESS_LICENSE": "Business License",
      "TAX_RETURNS": "Tax Returns",
      "FINANCIAL_STATEMENTS": "Financial Statements",
      "AGREEMENT": "Franchise Agreement",
      "OTHER": "Other Documents",
    }
    return typeLabels[type] || type
  }

  const formatFileSize = (url: string) => {
    // This is a placeholder - in real implementation, you'd get file size from Cloudinary or store it
    return "N/A"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
          <CardDescription>Upload and manage your franchise documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Dialog open={openUploadDialog} onOpenChange={setOpenUploadDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Upload New Document</DialogTitle>
                    <DialogDescription>
                      Upload a document for your franchise records.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleFileUpload}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="documentType">Document Type</Label>
                        <Select
                          value={uploadFormData.documentType}
                          onValueChange={(value) => setUploadFormData({ ...uploadFormData, documentType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GST_CERTIFICATE">GST Certificate</SelectItem>
                            <SelectItem value="PAN_CARD">PAN Card</SelectItem>
                            <SelectItem value="AADHAR_CARD">Aadhar Card</SelectItem>
                            <SelectItem value="BANK_STATEMENT">Bank Statement</SelectItem>
                            <SelectItem value="ADDRESS_PROOF">Address Proof</SelectItem>
                            <SelectItem value="BUSINESS_LICENSE">Business License</SelectItem>
                            <SelectItem value="TAX_RETURNS">Tax Returns</SelectItem>
                            <SelectItem value="FINANCIAL_STATEMENTS">Financial Statements</SelectItem>
                            <SelectItem value="AGREEMENT">Franchise Agreement</SelectItem>
                            <SelectItem value="OTHER">Other Documents</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="file">File</Label>
                        <Input
                          id="file"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={handleFileChange}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          Accepted formats: PDF, JPG, PNG, DOC, DOCX. Max size: 10MB
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Upload Document"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded Date</TableHead>
                    <TableHead>File Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No documents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{getDocumentTypeLabel(document.documentType)}</div>
                              <div className="text-sm text-muted-foreground">{document.id.slice(-8)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {document.isVerified ? (
                            <Badge className="bg-green-100 text-green-800">Verified</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(document.uploadedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {formatFileSize(document.documentUrl)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => window.open(document.documentUrl, '_blank')}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                const link = window.document.createElement('a')
                                link.href = document.documentUrl
                                link.download = `${getDocumentTypeLabel(document.documentType)}.${document.documentUrl.split('.').pop()}`
                                link.click()
                              }}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(document)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Type
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteDocument(document.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
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
        </CardContent>
      </Card>

      {/* Edit Document Dialog */}
      <Dialog open={!!editingDocument} onOpenChange={() => setEditingDocument(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Document Type</DialogTitle>
            <DialogDescription>
              Update the document type for this file.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateDocument}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-documentType">Document Type</Label>
                <Select
                  value={uploadFormData.documentType}
                  onValueChange={(value) => setUploadFormData({ ...uploadFormData, documentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GST_CERTIFICATE">GST Certificate</SelectItem>
                    <SelectItem value="PAN_CARD">PAN Card</SelectItem>
                    <SelectItem value="AADHAR_CARD">Aadhar Card</SelectItem>
                    <SelectItem value="BANK_STATEMENT">Bank Statement</SelectItem>
                    <SelectItem value="ADDRESS_PROOF">Address Proof</SelectItem>
                    <SelectItem value="BUSINESS_LICENSE">Business License</SelectItem>
                    <SelectItem value="TAX_RETURNS">Tax Returns</SelectItem>
                    <SelectItem value="FINANCIAL_STATEMENTS">Financial Statements</SelectItem>
                    <SelectItem value="AGREEMENT">Franchise Agreement</SelectItem>
                    <SelectItem value="OTHER">Other Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Document</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}