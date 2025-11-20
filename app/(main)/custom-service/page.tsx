"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormData {
  name: string
  email: string
  businessName: string
  description: string
  file?: File | null
}

export default function CustomServicePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    businessName: "",
    description: "",
    file: null,
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (!formData.description.trim()) newErrors.description = "Description is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmissionStatus({ type: null, message: "" })

    const formDataToSend = new FormData()
    formDataToSend.append("name", formData.name)
    formDataToSend.append("email", formData.email)
    formDataToSend.append("businessName", formData.businessName)
    formDataToSend.append("description", formData.description)
    if (formData.file) formDataToSend.append("file", formData.file)

    try {
      const response = await fetch("/api/custom-service", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to submit request")
      }

      setSubmissionStatus({
        type: "success",
        message: "Your custom service request has been submitted successfully! We'll get back to you soon.",
      })
      setFormData({ name: "", email: "", businessName: "", description: "", file: null })
      setErrors({})
    } catch (error) {
      setSubmissionStatus({
        type: "error",
        message: "Failed to submit your request. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, file }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <header className="bg-[#112239] text-white py-16 rounded-lg mb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              Request a Custom Service
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Need a specific service tailored to your business? Fill out the form below, and our team will get in touch to discuss your requirements.
            </p>
          </div>
        </header>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Custom Service Request Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={cn(errors.name && "border-red-500")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={cn(errors.email && "border-red-500")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Enter your business name (optional)"
                />
              </div>

              <div>
                <Label htmlFor="description">Service Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the custom service you need"
                  rows={5}
                  className={cn(errors.description && "border-red-500")}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? "description-error" : undefined}
                />
                {errors.description && (
                  <p id="description-error" className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="file">Upload Supporting Document (Optional)</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Accepted formats: PDF, DOC, DOCX, JPG, PNG (max 5MB)
                </p>
              </div>

              {submissionStatus.type && (
                <Alert
                  variant={submissionStatus.type === "success" ? "default" : "destructive"}
                >
                  {submissionStatus.type === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {submissionStatus.type === "success" ? "Success" : "Error"}
                  </AlertTitle>
                  <AlertDescription>{submissionStatus.message}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
