"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Plus, X } from "lucide-react"
import { toast } from "sonner"

const vendorFormSchema = z.object({
  // User Information
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  
  // Business Information
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessType: z.string().min(2, "Business type must be at least 2 characters"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  
  // Legal Information
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  
  // Banking Information
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  
  // Business Details
  category: z.string().optional(),
  experience: z.number().min(0, "Experience cannot be negative").optional(),
  annualTurnover: z.number().min(0, "Annual turnover cannot be negative").optional(),
  employeeCount: z.number().min(0, "Employee count cannot be negative").optional(),
  
  // Additional Information
  certifications: z.array(z.string()).default([]),
  specializations: z.array(z.string()).default([]),
  serviceAreas: z.array(z.string()).default([]),
})

export default function NewVendorPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [certifications, setCertifications] = useState<string[]>([])
  const [specializations, setSpecializations] = useState<string[]>([])
  const [serviceAreas, setServiceAreas] = useState<string[]>([])
  const [newCertification, setNewCertification] = useState("")
  const [newSpecialization, setNewSpecialization] = useState("")
  const [newServiceArea, setNewServiceArea] = useState("")

  const form = useForm<z.infer<typeof vendorFormSchema>>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      // User Information
      name: "",
      email: "",
      phone: "",
      
      // Business Information
      businessName: "",
      businessType: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      website: "",
      
      // Legal Information
      gstNumber: "",
      panNumber: "",
      
      // Banking Information
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      
      // Business Details
      category: "",
      experience: 0,
      annualTurnover: 0,
      employeeCount: 0,
      
      // Additional Information
      certifications: [],
      specializations: [],
      serviceAreas: [],
    },
  })

  const addItem = (item: string, list: string[], setList: (items: string[]) => void, setInput: (value: string) => void) => {
    if (item.trim() && !list.includes(item.trim())) {
      setList([...list, item.trim()])
      setInput("")
    }
  }

  const removeItem = (index: number, list: string[], setList: (items: string[]) => void) => {
    setList(list.filter((_, i) => i !== index))
  }

  async function onSubmit(values: z.infer<typeof vendorFormSchema>) {
    try {
      setIsSubmitting(true)
      
      // Clean phone number (remove +91 if present)
      const cleanPhone = values.phone.replace(/^\+?91/, "").trim()
      
      // Create vendor directly with the admin vendors API
      const vendorResponse = await fetch("/api/admin/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // User creation data
          name: values.name,
          email: values.email || null,
          phone: cleanPhone,
          
          // Vendor profile data
          businessName: values.businessName,
          businessType: values.businessType,
          address: values.address || null,
          city: values.city || null,
          state: values.state || null,
          pincode: values.pincode || null,
          website: values.website || null,
          gstNumber: values.gstNumber || null,
          panNumber: values.panNumber || null,
          bankName: values.bankName || null,
          accountNumber: values.accountNumber || null,
          ifscCode: values.ifscCode || null,
          category: values.category || null,
          experience: values.experience || null,
          annualTurnover: values.annualTurnover || null,
          employeeCount: values.employeeCount || null,
          
          // Array fields
          certifications,
          specializations,
          serviceAreas,
          
          // Set default values for required fields
          status: "PENDING",
          isVerified: false,
          isActive: true,
        }),
      })

      if (!vendorResponse.ok) {
        const error = await vendorResponse.json()
        throw new Error(error.error || "Failed to create vendor")
      }

      toast.success("Vendor created successfully")
      router.push("/admin/vendors")
      router.refresh()
    } catch (error) {
      console.error("Error creating vendor:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create vendor")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Vendor</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Information</CardTitle>
          <CardDescription>Enter the vendor&apos;s details below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder="+1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Business Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type *</FormLabel>
                        <FormControl>
                          <Input placeholder="Business Type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Manufacturing, Trading" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employeeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Employees</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter complete business address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                          <Input placeholder="Pincode" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Legal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Legal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gstNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GST Number</FormLabel>
                        <FormControl>
                          <Input placeholder="GST Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="panNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN Number</FormLabel>
                        <FormControl>
                          <Input placeholder="PAN Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Banking Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Banking Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Bank Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Account Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ifscCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code</FormLabel>
                        <FormControl>
                          <Input placeholder="IFSC Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="annualTurnover"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Turnover (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Certifications</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add certification"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addItem(newCertification, certifications, setCertifications, setNewCertification)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addItem(newCertification, certifications, setCertifications, setNewCertification)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                      >
                        {cert}
                        <button
                          type="button"
                          onClick={() => removeItem(index, certifications, setCertifications)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Specializations</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add specialization"
                      value={newSpecialization}
                      onChange={(e) => setNewSpecialization(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addItem(newSpecialization, specializations, setSpecializations, setNewSpecialization)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addItem(newSpecialization, specializations, setSpecializations, setNewSpecialization)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm"
                      >
                        {spec}
                        <button
                          type="button"
                          onClick={() => removeItem(index, specializations, setSpecializations)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service Areas</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add service area"
                      value={newServiceArea}
                      onChange={(e) => setNewServiceArea(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addItem(newServiceArea, serviceAreas, setServiceAreas, setNewServiceArea)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addItem(newServiceArea, serviceAreas, setServiceAreas, setNewServiceArea)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {serviceAreas.map((area, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm"
                      >
                        {area}
                        <button
                          type="button"
                          onClick={() => removeItem(index, serviceAreas, setServiceAreas)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Vendor
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}