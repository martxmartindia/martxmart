"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Loader2, ArrowLeft, CheckCircle2, XCircle, RefreshCw, Upload } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

const franchiseSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  alternatePhone: z.string().optional().or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Pincode must be at least 6 digits").max(6, "Pincode must be 6 digits"),

  // Business Information
  businessExperience: z.string().min(10, "Please provide more details about your business experience"),
  investmentCapacity: z.string().min(1, "Please select your investment capacity"),
  preferredLocation: z.string().min(5, "Preferred location is required"),
  propertyType: z.string().min(1, "Please select property type"),
  propertySize: z.string().min(1, "Please enter property size"),
  propertyOwnership: z.string().min(1, "Please select property ownership status"),

  // Financial Information
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format")
    .optional()
    .or(z.literal("")),
  nameAsPerPan: z.string().optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),

  gstNumber: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number format")
    .optional()
    .or(z.literal("")),

  bankName: z.string().optional().or(z.literal("")),
  accountNumber: z.string().optional().or(z.literal("")),
  ifscCode: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format")
    .optional()
    .or(z.literal("")),

  // Additional Information
  referralSource: z.string().optional().or(z.literal("")),
  additionalComments: z.string().optional().or(z.literal("")),
})

type FranchiseFormValues = z.infer<typeof franchiseSchema>

export default function FranchiseApplicationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [formProgress, setFormProgress] = useState(25)

  // Verification states
  const [isPincodeVerifying, setIsPincodeVerifying] = useState(false)
  const [isGstVerifying, setIsGstVerifying] = useState(false)
  const [isPanVerifying, setIsPanVerifying] = useState(false)
  const [isBankVerifying, setIsBankVerifying] = useState(false)

  // Verification results
  const [pincodeVerified, setPincodeVerified] = useState<boolean | null>(null)
  const [gstVerified, setGstVerified] = useState<boolean | null>(null)
  const [panVerified, setPanVerified] = useState<boolean | null>(null)
  const [bankVerified, setBankVerified] = useState<boolean | null>(null)

  // Verification data
  const [pincodeData, setPincodeData] = useState<{ district?: string; state?: string } | null>(null)
  const [gstData, setGstData] = useState<any>(null)
  const [panData, setPanData] = useState<any>(null)
  const [bankData, setBankData] = useState<any>(null)

  const form = useForm<FranchiseFormValues>({
    resolver: zodResolver(franchiseSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      businessExperience: "",
      investmentCapacity: "",
      preferredLocation: "",
      propertyType: "",
      propertySize: "",
      propertyOwnership: "",
      panNumber: "",
      nameAsPerPan: "",
      dateOfBirth: "",
      gstNumber: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      referralSource: "",
      additionalComments: "",
    },
  })

  const watchPincode = form.watch("pincode")
  const watchGstNumber = form.watch("gstNumber")
  const watchPanNumber = form.watch("panNumber")
  const watchIfscCode = form.watch("ifscCode")
  const watchAccountNumber = form.watch("accountNumber")
  const watchNameAsPerPan = form.watch("nameAsPerPan")
  const watchDateOfBirth = form.watch("dateOfBirth")

  // Update progress based on active tab
  useEffect(() => {
    switch (activeTab) {
      case "personal":
        setFormProgress(25)
        break
      case "business":
        setFormProgress(50)
        break
      case "financial":
        setFormProgress(75)
        break
      case "additional":
        setFormProgress(100)
        break
      default:
        setFormProgress(25)
    }
  }, [activeTab])


  // Verify pincode and auto-fill city and state
  useEffect(() => {
    const verifyPincode = async () => {
      if (watchPincode && watchPincode.length === 6) {
        try {
          setIsPincodeVerifying(true)
          setPincodeVerified(null)

          const response = await fetch(`/api/kyc/verify/pincode?pincode=${watchPincode}`)
          const data = await response.json()          

          if (response.ok   && data.success) {
            setPincodeVerified(true)
            setPincodeData(data.data)

            // Auto-fill city and state
            form.setValue("city", data.data.district || "")
            form.setValue("state", data.data.state || "")

            toast.success("Pincode verified")
          } else {
            setPincodeVerified(false)
            toast.error(data.message || "Failed to verify pincode")
          }
        } catch (error) {
          setPincodeVerified(false)
          toast.error("Failed to verify pincode")
          console.error("Pincode verification error:", error)
        } finally {
          setIsPincodeVerifying(false)
        }
      } else {
        setPincodeVerified(null)
      }
    }

    // Debounce the pincode verification
    const timeoutId = setTimeout(() => {
      if (watchPincode && watchPincode.length === 6) {
        verifyPincode()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [watchPincode, form])

  // Verify GST number
  const verifyGst = async () => {
    if (!watchGstNumber) {
      toast.error("Please enter a valid GST number")
      return
    }

    try {
      setIsGstVerifying(true)
      setGstVerified(null)

      const response = await fetch(`/api/verify/gst`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gstin: watchGstNumber }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setGstVerified(true)
        setGstData(data.data)

        toast.success("GST verified")
      } else {
        setGstVerified(false)
        toast.error(data.message || "Failed to verify GST number")
      }
    } catch (error) {
      setGstVerified(false)
      toast.error("Failed to verify GST number")
      console.error("GST verification error:", error)
    } finally {
      setIsGstVerifying(false)
    }
  }

  // Verify PAN details
  const verifyPan = async () => {
    if (!watchPanNumber) {
      toast.error("Please enter a valid PAN number")
      return
    }

    if (!watchNameAsPerPan) {
      toast.error("Please enter your name as per PAN")
      return
    }

    if (!watchDateOfBirth) {
      toast.error("Please enter your date of birth")
      return
    }

    try {
      setIsPanVerifying(true)
      setPanVerified(null)

      const response = await fetch(`/api/verify/pan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pan: watchPanNumber,
          name_as_per_pan: watchNameAsPerPan,
          date_of_birth: watchDateOfBirth,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setPanVerified(true)
        setPanData(data.data)
        toast.success("PAN verified")
      } else {
        setPanVerified(false)
        toast.error(data.message || "Failed to verify PAN details")
      }
    } catch (error) {
      setPanVerified(false)
      toast.error("Failed to verify PAN details")
      console.error("PAN verification error:", error)
    } finally {
      setIsPanVerifying(false)
    }
  }

  // Verify bank account
  const verifyBankAccount = async () => {
    if (!watchIfscCode) {
      toast.error("Please enter a valid IFSC code")
      return
    }

    if (!watchAccountNumber) {
      toast.error("Please enter a valid account number")
      return
    }

    try {
      setIsBankVerifying(true)
      setBankVerified(null)

      const response = await fetch(`/api/verify/bank-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ifsc: watchIfscCode,
          account_number: watchAccountNumber,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setBankVerified(true)
        setBankData(data.data)

        // Auto-fill bank name if empty
        if (!form.getValues("bankName") && data.data.bank_name) {
          form.setValue("bankName", data.data.bank_name)
        }

        toast.success("Bank account verified")
      } else {
        setBankVerified(false)
        toast.error(data.message || "Failed to verify bank account")
      }
    } catch (error) {
      setBankVerified(false)
      toast.error("Failed to verify bank account")
      console.error("Bank verification error:", error)
    } finally {
      setIsBankVerifying(false)
    }
  }

  const onSubmit = async (data: FranchiseFormValues) => {
    // Check if PAN number is provided but not verified
    if (data.panNumber && !panVerified) {
      toast.error("Please verify your PAN number before submitting")
      setActiveTab("financial")
      return
    }

    // Check if GST number is provided but not verified
    if (data.gstNumber && !gstVerified) {
      toast.error("Please verify your GST number before submitting")
      setActiveTab("financial")
      return
    }

    // Check if bank details are provided but not verified
    if ((data.accountNumber || data.ifscCode) && !bankVerified) {
      toast.error("Please verify your bank account before submitting")
      setActiveTab("financial")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/franchise/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          gstVerified: gstVerified,
          panVerified: panVerified,
          bankVerified: bankVerified,
          gstData: gstData,
          panData: panData,
          bankData: bankData,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application")
      }

      toast.success("Application submitted successfully")
      router.push("/franchise/success")
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderVerificationStatus = (isVerifying: boolean, isVerified: boolean | null, fieldName: string) => {
    if (isVerifying) {
      return (
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500 mr-1" />
          <span className="text-xs text-blue-500">Verifying...</span>
        </div>
      )
    }

    if (isVerified === true) {
      return (
        <div className="flex items-center">
          <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-xs text-green-500">Verified</span>
        </div>
      )
    }

    if (isVerified === false) {
      return (
        <div className="flex items-center">
          <XCircle className="h-4 w-4 text-red-500 mr-1" />
          <span className="text-xs text-red-500">Invalid {fieldName}</span>
        </div>
      )
    }

    return null
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Franchise Application</h1>
          <p className="text-gray-500 mt-1">Join our growing network of successful franchisees</p>
        </div>
      </div>

      <div className="mb-8">
        <Progress value={formProgress} className="h-2 bg-gray-100" />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>Personal Details</span>
          <span>Business Details</span>
          <span>Financial Details</span>
          <span>Additional Info</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Franchise Application Form</CardTitle>
          <CardDescription>Please complete all sections to apply for a franchise opportunity</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="additional">Additional</TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Personal Information</h3>
                    <p className="text-sm text-gray-500">Provide your contact details for communication</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Alternate Phone */}
                    <FormField
                      control={form.control}
                      name="alternatePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alternate Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter alternate phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Address */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter your complete address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Pincode with verification */}
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                placeholder="Enter pincode"
                                {...field}
                                maxLength={6}
                                className={`${pincodeVerified === true ? "border-green-500 pr-20" : pincodeVerified === false ? "border-red-500 pr-20" : ""}`}
                              />
                            </FormControl>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                              {renderVerificationStatus(isPincodeVerifying, pincodeVerified, "pincode")}
                            </div>
                          </div>
                          <FormDescription className="text-xs">
                            Enter a valid 6-digit pincode to auto-fill city and state
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* City */}
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City/District</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter city"
                              {...field}
                              readOnly={pincodeVerified === true}
                              className={pincodeVerified === true ? "bg-gray-50" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* State */}
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter state"
                              {...field}
                              readOnly={pincodeVerified === true}
                              className={pincodeVerified === true ? "bg-gray-50" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("business")}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Next: Business Details
                    </Button>
                  </div>
                </TabsContent>

                {/* Business Information Tab */}
                <TabsContent value="business" className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Business Information</h3>
                    <p className="text-sm text-gray-500">
                      Tell us about your business experience and franchise preferences
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Business Experience */}
                    <FormField
                      control={form.control}
                      name="businessExperience"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Business Experience</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your business experience and background"
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Include any relevant experience in business management, retail, or related fields
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Investment Capacity */}
                    <FormField
                      control={form.control}
                      name="investmentCapacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Investment Capacity</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select investment range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="below-5-lakhs">Below ₹5 Lakhs</SelectItem>
                              <SelectItem value="5-10-lakhs">₹5 Lakhs - ₹10 Lakhs</SelectItem>
                              <SelectItem value="10-20-lakhs">₹10 Lakhs - ₹20 Lakhs</SelectItem>
                              <SelectItem value="20-50-lakhs">₹20 Lakhs - ₹50 Lakhs</SelectItem>
                              <SelectItem value="above-50-lakhs">Above ₹50 Lakhs</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Preferred Location */}
                    <FormField
                      control={form.control}
                      name="preferredLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter preferred location for franchise" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">Specify area, locality, or landmark</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Property Type */}
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="commercial-shop">Commercial Shop</SelectItem>
                              <SelectItem value="commercial-complex">Commercial Complex</SelectItem>
                              <SelectItem value="mall">Mall</SelectItem>
                              <SelectItem value="high-street">High Street</SelectItem>
                              <SelectItem value="residential-converted">Residential Converted</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Property Size */}
                    <FormField
                      control={form.control}
                      name="propertySize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Size (sq. ft.)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter property size in sq. ft." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Property Ownership */}
                    <FormField
                      control={form.control}
                      name="propertyOwnership"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Ownership</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="owned" id="owned" />
                                <Label htmlFor="owned">Owned</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="rented" id="rented" />
                                <Label htmlFor="rented">Rented</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="leased" id="leased" />
                                <Label htmlFor="leased">Leased</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yet-to-acquire" id="yet-to-acquire" />
                                <Label htmlFor="yet-to-acquire">Yet to Acquire</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("personal")}>
                      Back: Personal Details
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("financial")}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Next: Financial Details
                    </Button>
                  </div>
                </TabsContent>

                {/* Financial Information Tab */}
                <TabsContent value="financial" className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Financial Information</h3>
                    <p className="text-sm text-gray-500">
                      Provide your financial details for verification (optional but recommended)
                    </p>
                  </div>

                  {/* PAN Verification Section */}
                  <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">PAN Verification</h3>
                      <Badge variant={panVerified ? "default" : "outline"}>
                        {panVerified ? "Verified" : "Optional"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="panNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PAN Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter PAN number"
                                {...field}
                                className={`${panVerified === true ? "border-green-500" : panVerified === false ? "border-red-500" : ""}`}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">Format: AAAAA0000A</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nameAsPerPan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name as per PAN</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name as per PAN" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input placeholder="DD/MM/YYYY" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs">Format: DD/MM/YYYY</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={verifyPan}
                        disabled={isPanVerifying || !watchPanNumber || !watchNameAsPerPan || !watchDateOfBirth}
                      >
                        {isPanVerifying ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-1" />
                        )}
                        Verify PAN Details
                      </Button>
                    </div>

                    {panVerified && panData && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <AlertTitle>PAN Details Verified</AlertTitle>
                        <AlertDescription>
                          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                            <div>
                              <span className="font-medium">Name:</span> {panData.name || watchNameAsPerPan}
                            </div>
                            <div>
                              <span className="font-medium">PAN Status:</span> {panData.status || "Active"}
                            </div>
                            {panData.category && (
                              <div>
                                <span className="font-medium">Category:</span> {panData.category}
                              </div>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* GST Verification Section */}
                  <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">GST Verification</h3>
                      <Badge variant={gstVerified ? "default" : "outline"}>
                        {gstVerified ? "Verified" : "Optional"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="gstNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GST Number</FormLabel>
                            <div className="flex space-x-2">
                              <div className="relative flex-1">
                                <FormControl>
                                  <Input
                                    placeholder="Enter GST number"
                                    {...field}
                                    className={`${gstVerified === true ? "border-green-500" : gstVerified === false ? "border-red-500" : ""}`}
                                  />
                                </FormControl>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={verifyGst}
                                disabled={isGstVerifying || !watchGstNumber}
                              >
                                {isGstVerifying ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                  <RefreshCw className="h-4 w-4 mr-1" />
                                )}
                                Verify
                              </Button>
                            </div>
                            <FormDescription className="text-xs">Format: 22AAAAA0000A1Z5</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {gstVerified && gstData && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <AlertTitle>GST Details Verified</AlertTitle>
                        <AlertDescription>
                          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                            <div>
                              <span className="font-medium">Business Name:</span>{" "}
                              {gstData.legalName || gstData.tradeName}
                            </div>
                            <div>
                              <span className="font-medium">Status:</span> {gstData.status || "Active"}
                            </div>
                            {gstData.address && (
                              <div className="col-span-2">
                                <span className="font-medium">Address:</span> {gstData.address}
                              </div>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Bank Details */}
                  <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Bank Details</h3>
                      <Badge variant={bankVerified ? "default" : "outline"}>
                        {bankVerified ? "Verified" : "Optional"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter bank name"
                                {...field}
                                readOnly={bankVerified === true}
                                className={bankVerified === true ? "bg-gray-50" : ""}
                              />
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
                              <Input
                                placeholder="Enter account number"
                                {...field}
                                className={`${bankVerified === true ? "border-green-500" : bankVerified === false ? "border-red-500" : ""}`}
                              />
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
                              <Input
                                placeholder="Enter IFSC code"
                                {...field}
                                className={`${bankVerified === true ? "border-green-500" : bankVerified === false ? "border-red-500" : ""}`}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">Format: ABCD0123456</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={verifyBankAccount}
                        disabled={isBankVerifying || !watchAccountNumber || !watchIfscCode}
                      >
                        {isBankVerifying ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-1" />
                        )}
                        Verify Bank Account
                      </Button>
                    </div>

                    {bankVerified && bankData && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <AlertTitle>Bank Account Verified</AlertTitle>
                        <AlertDescription>
                          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                            <div>
                              <span className="font-medium">Account Holder:</span> {bankData.name_at_bank || "Verified"}
                            </div>
                            <div>
                              <span className="font-medium">Bank:</span>{" "}
                              {bankData.bank_name || form.getValues("bankName")}
                            </div>
                            <div>
                              <span className="font-medium">Branch:</span> {bankData.branch || "Verified"}
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("business")}>
                      Back: Business Details
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("additional")}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Next: Additional Info
                    </Button>
                  </div>
                </TabsContent>

                {/* Additional Information Tab */}
                <TabsContent value="additional" className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Additional Information</h3>
                    <p className="text-sm text-gray-500">
                      Provide any additional information that might help us evaluate your application
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {/* Referral Source */}
                    <FormField
                      control={form.control}
                      name="referralSource"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How did you hear about us?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select referral source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="website">Company Website</SelectItem>
                              <SelectItem value="social-media">Social Media</SelectItem>
                              <SelectItem value="existing-franchise">Existing Franchise</SelectItem>
                              <SelectItem value="newspaper">Newspaper/Magazine</SelectItem>
                              <SelectItem value="exhibition">Exhibition/Trade Show</SelectItem>
                              <SelectItem value="friend">Friend/Family</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Additional Comments */}
                    <FormField
                      control={form.control}
                      name="additionalComments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Comments</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional information you'd like to share"
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Document Upload Section */}
                    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Supporting Documents</h3>
                        <Badge variant="outline">Optional</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="id-proof">ID Proof (Aadhaar/PAN/Passport)</Label>
                          <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50">
                            <div className="space-y-1 text-center">
                              <Upload className="mx-auto h-8 w-8 text-gray-400" />
                              <div className="text-sm text-gray-600">
                                <label
                                  htmlFor="id-proof"
                                  className="relative cursor-pointer text-orange-600 hover:text-orange-700"
                                >
                                  <span>Upload a file</span>
                                  <input id="id-proof" name="id-proof" type="file" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="business-proof">Business Proof (if applicable)</Label>
                          <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50">
                            <div className="space-y-1 text-center">
                              <Upload className="mx-auto h-8 w-8 text-gray-400" />
                              <div className="text-sm text-gray-600">
                                <label
                                  htmlFor="business-proof"
                                  className="relative cursor-pointer text-orange-600 hover:text-orange-700"
                                >
                                  <span>Upload a file</span>
                                  <input id="business-proof" name="business-proof" type="file" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="terms"
                          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          required
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the{" "}
                          <a href="/terms" className="text-orange-600 hover:text-orange-700">
                            Terms and Conditions
                          </a>{" "}
                          and{" "}
                          <a href="/privacy" className="text-orange-600 hover:text-orange-700">
                            Privacy Policy
                          </a>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="marketing"
                          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <Label htmlFor="marketing" className="text-sm">
                          I agree to receive marketing communications about franchise opportunities and related services
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("financial")}>
                      Back: Financial Details
                    </Button>
                    <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t">
          <div className="w-full text-sm text-gray-500">
            <TooltipProvider>
              <div className="flex flex-wrap items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                      <span>Pincode Verification</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Auto-fills city and state based on pincode</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                      <span>GST Verification</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verifies GST number with government database</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                      <span>PAN Verification</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verifies PAN details with government database</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                      <span>Bank Verification</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verifies bank account details without penny drop</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
