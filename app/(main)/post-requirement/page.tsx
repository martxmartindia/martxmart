"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Check, FileText, Loader2, Send, Star, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { ImageUpload } from "@/components/imageUpload"

export default function RequestQuotePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    productCategory: "",
    productName: "",
    quantity: "",
    requirements: "",
    budget: "",
    timeframe: "1-2 weeks",
    contactPreference: "email",
    termsAccepted: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.productCategory ||
      !formData.productName ||
      !formData.quantity ||
      !formData.requirements
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setIsSubmitting(true);

    try {
      const fileUrl = null;
      if (selectedFile) {        
        // TODO: Implement file upload to storage service
        // fileUrl = await uploadFile(selectedFile);
      }

      const response = await fetch("/api/quote-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, fileUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote request");
      }

      const data = await response.json();
      setIsSubmitted(true);
      toast.success("Your quote request has been submitted successfully!");
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        productCategory: "",
        productName: "",
        quantity: "",
        requirements: "",
        budget: "",
        timeframe: "1-2 weeks",
        contactPreference: "email",
        termsAccepted: false,
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "CNC Machines",
    "Metalworking",
    "Packaging",
    "Textile",
    "Woodworking",
    "Food Processing",
    "Plastic Processing",
    "Material Handling",
    "Other",
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/quote.png?height=800&width=1600"
            alt="Request a Quote"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Request a Quote</h1>
            <p className="text-xl text-gray-300 mb-8">
              Tell us what you need, and we&apos;ll connect you with verified suppliers who can provide competitive quotes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-orange-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Submit Your Requirements</h3>
              <p className="text-gray-700">
                Fill out the form with details about the industrial machinery or equipment you need.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-orange-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Get Matched with Suppliers</h3>
              <p className="text-gray-700">
                Our system matches your request with verified suppliers who can meet your requirements.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-orange-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Receive Multiple Quotes</h3>
              <p className="text-gray-700">
                Compare quotes from different suppliers and choose the best option for your business.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md p-8 text-center"
              >
                <div className="bg-green-100 p-4 rounded-full inline-flex mb-6">
                  <Check className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted Successfully!</h2>
                <p className="text-gray-700 mb-6 max-w-lg mx-auto">
                  Thank you for submitting your quote request. Our team will review your requirements and connect you
                  with suitable suppliers within 24-48 hours.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
                  <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
                  <ul className="text-left space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>You&apos;ll receive an email confirmation of your request</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Our team will review your requirements</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Verified suppliers will be notified of your request</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>You&apos;ll start receiving quotes within 24-48 hours</span>
                    </li>
                  </ul>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setIsSubmitted(false)}>
                  Submit Another Request
                </Button>
              </motion.div>
            ) : (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Quote Form</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName" className="mb-1">
                            Full Name *
                          </Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="mb-1">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="mb-1">
                            Phone Number *
                          </Label>
                          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                        </div>
                        <div>
                          <Label htmlFor="company" className="mb-1">
                            Company Name
                          </Label>
                          <Input id="company" name="company" value={formData.company} onChange={handleChange} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Product Requirements</h3>

                      <div>
                        <Label htmlFor="productCategory" className="mb-1">
                          Product Category *
                        </Label>
                        <Select
                          value={formData.productCategory}
                          onValueChange={(value) => handleSelectChange("productCategory", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="productName" className="mb-1">
                          Product Name/Description *
                        </Label>
                        <Input
                          id="productName"
                          name="productName"
                          value={formData.productName}
                          onChange={handleChange}
                          placeholder="E.g., CNC Milling Machine, Industrial Packaging Machine"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="quantity" className="mb-1">
                            Quantity Required *
                          </Label>
                          <Input
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="budget" className="mb-1">
                            Budget Range (Optional)
                          </Label>
                          <Input
                            id="budget"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            placeholder="E.g., ₹100,000 - ₹500,000"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="requirements" className="mb-1">
                          Detailed Requirements *
                        </Label>
                        <Textarea
                          id="requirements"
                          name="requirements"
                          value={formData.requirements}
                          onChange={handleChange}
                          placeholder="Please provide specific details about your requirements, including technical specifications, features, etc."
                          className="min-h-[120px]"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="file" className="mb-1">
                          Upload Specifications (Optional)
                        </Label>
                        <div className="border border-gray-200 rounded-md p-4">
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="file"
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG (MAX. 10MB)</p>
                              </div>
                              <input id="file" type="file" className="hidden" onChange={handleFileChange} />
                            </label>
                          </div>
                          {selectedFile && (
                            <div className="mt-3 text-sm text-gray-600">Selected file: {selectedFile.name}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>

                      <div>
                        <Label className="mb-1">Timeframe</Label>
                        <RadioGroup
                          value={formData.timeframe}
                          onValueChange={(value) => handleSelectChange("timeframe", value)}
                          className="flex flex-col space-y-2 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ASAP" id="ASAP" />
                            <Label htmlFor="ASAP" className="cursor-pointer">
                              As soon as possible
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1-2 weeks" id="1-2 weeks" />
                            <Label htmlFor="1-2 weeks" className="cursor-pointer">
                              1-2 weeks
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1 month" id="1 month" />
                            <Label htmlFor="1 month" className="cursor-pointer">
                              Within a month
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3+ months" id="3+ months" />
                            <Label htmlFor="3+ months" className="cursor-pointer">
                              3+ months
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label className="mb-1">Preferred Contact Method</Label>
                        <RadioGroup
                          value={formData.contactPreference}
                          onValueChange={(value) => handleSelectChange("contactPreference", value)}
                          className="flex flex-col space-y-2 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="email-contact" />
                            <Label htmlFor="email-contact" className="cursor-pointer">
                              Email
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="phone" id="phone-contact" />
                            <Label htmlFor="phone-contact" className="cursor-pointer">
                              Phone
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="both-contact" />
                            <Label htmlFor="both-contact" className="cursor-pointer">
                              Both Email and Phone
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="termsAccepted"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => handleCheckboxChange("termsAccepted", checked as boolean)}
                        />
                        <Label
                          htmlFor="termsAccepted"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{" "}
                          <a href="/terms" className="text-orange-600 hover:underline">
                            Terms and Conditions
                          </a>{" "}
                          and{" "}
                          <a href="/privacy" className="text-orange-600 hover:underline">
                            Privacy Policy
                          </a>
                        </Label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Quote Request
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Request a Quote Through martXmart?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="bg-orange-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Suppliers</h3>
              <p className="text-gray-700">
                All suppliers on our platform undergo a rigorous verification process to ensure quality and reliability.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="bg-orange-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Quotes</h3>
              <p className="text-gray-700">
                Receive multiple competitive quotes from different suppliers, allowing you to compare and choose the
                best option.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="bg-orange-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Time Saving</h3>
              <p className="text-gray-700">
                Save time by submitting a single request instead of contacting multiple suppliers individually.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="bg-orange-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Assistance</h3>
              <p className="text-gray-700">
                Our team of industry experts can help refine your requirements and connect you with the most suitable
                suppliers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Our Customers Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    &quot;I submitted a quote request for a CNC machine and received responses from 5 verified suppliers
                    within 48 hours. The process was smooth, and I found exactly what I needed at a competitive price.&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src="/logo.png?height=100&width=100"
                        alt="Rajesh Kumar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Rajesh Kumar</p>
                      <p className="text-sm text-gray-600">Kumar Manufacturing Industries</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    &quot;The quote request system saved us so much time. Instead of researching and contacting suppliers
                    individually, we received multiple quotes for our textile machinery requirements in just a few
                    days.&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src="/logo.png?height=100&width=100"
                        alt="Priya Sharma"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Priya Sharma</p>
                      <p className="text-sm text-gray-600">Sharma Textiles Ltd.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    &quot;As a small business, finding the right equipment at the right price is crucial. martXmart&apos;s quote
                    request system connected us with suppliers we wouldn&apos;t have found otherwise, resulting in
                    significant cost savings.&quout;
                  </p>
                  <div className="flex items-center">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src="/logo.png?height=100&width=100"
                        alt="Amit Patel"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Amit Patel</p>
                      <p className="text-sm text-gray-600">Patel Engineering Works</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">How long does it take to receive quotes?</h3>
                <p className="text-gray-700">
                  Most customers start receiving quotes within 24-48 hours after submitting a request. The exact timing
                  depends on the specificity and complexity of your requirements.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Is the quote request service free?</h3>
                <p className="text-gray-700">
                  Yes, submitting a quote request on martXmart is completely free. There are no charges or obligations
                  for requesting quotes from our verified suppliers.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">How many quotes will I receive?</h3>
                <p className="text-gray-700">
                  The number of quotes varies depending on your specific requirements and the availability of suitable
                  suppliers. Most customers receive 3-5 quotes per request.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Can I request quotes for custom machinery?</h3>
                <p className="text-gray-700">
                  Many of our suppliers offer customization services. Be sure to provide detailed specifications and
                  requirements in your request to receive the most accurate quotes.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">How are suppliers verified?</h3>
                <p className="text-gray-700">
                  We verify suppliers through a comprehensive process that includes business registration checks,
                  quality control assessments, customer reviews, and on-site visits for select suppliers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Find the Perfect Machinery?</h2>
            <p className="text-xl mb-8">
              Submit your quote request today and get connected with verified suppliers who can meet your requirements.
            </p>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Request a Quote Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section> */}
    </main>
  )
}

