'use client';
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, FileText, CheckCircle, AlertCircle, Calendar, DollarSign, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Service {
  id: string;
  title: string;
  slug: string;
  shortName: string;
  description: string;
  content: string;
  priceAmount: number;
  governmentFee: string;
  processingTime: string;
  validity: string;
  category: string;
  imageUrl?: string;
  features: string[];
  requiredDocuments: string[];
  processSteps: { step: string; description: string }[];
  faqs: { question: string; answer: string }[];
  relatedServices: { id: string; title: string; slug: string }[];
}

const ServiceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    message: "",
    gstType: "",
    annualTurnover: "",
    businessType: "",
    msmeCategory: "",
    investmentInPlant: "",
    numberOfEmployees: "",
    companyType: "",
    proposedNames: "",
    businessActivity: "",
    trademarkType: "",
    trademarkClass: "",
    logoUrl: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const slug = params.slug as string;
        const res = await axios.get(`/api/services/${slug}`);
        setService(res.data);
      } catch (err) {
        console.error("Error fetching service:", err);
        setError("Failed to load service details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchService();
    }
  }, [params.slug]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setFormLoading(true);
      const serviceApplicationType = service?.category.toUpperCase().replace(/\s+/g, "_") || "OTHER";
      const response = await axios.post("/api/services/apply", {
        serviceId: service?.id,
        serviceApplicationType,
        ...formData,
        proposedNames: formData.proposedNames
          ? formData.proposedNames.split(",").map((name) => name.trim()).filter(Boolean)
          : [],
      });

      toast.success("Application submitted successfully.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        businessName: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        message: "",
        gstType: "",
        annualTurnover: "",
        businessType: "",
        msmeCategory: "",
        investmentInPlant: "",
        numberOfEmployees: "",
        companyType: "",
        proposedNames: "",
        businessActivity: "",
        trademarkType: "",
        trademarkClass: "",
        logoUrl: "",
      });

      setTimeout(() => {
        router.push(`/services/payment/${response.data.applicationId}`);
      }, 2000);
    } catch (err) {
      console.error("Error submitting application:", err);
      toast.error("Failed to submit application. Please try again later.");
    } finally {
      setFormLoading(false);
    }
  };

  // Form validation
  const isFormValid = useMemo(() => {
    return formData.fullName && formData.email && formData.phone;
  }, [formData.fullName, formData.email, formData.phone]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Skeleton className="h-10 w-24 mr-4 rounded-xl" />
            <Skeleton className="h-8 w-64 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-10 w-3/4 rounded-xl" />
              <Skeleton className="h-6 w-1/4 rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <Card className="max-w-md w-full rounded-xl shadow-lg">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Service Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The requested service could not be found."}</p>
            <Button className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl" asChild>
              <Link href="/services">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-[#112239] to-blue-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/services"
              className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
            </Link>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-white">
                  {service.title}
                </h1>
                <p className="text-base sm:text-lg text-white/90">{service.description}</p>
              </div>
              <Badge className="mt-4 md:mt-0 bg-orange-600 text-white hover:bg-orange-700 text-sm px-4 py-2 rounded-full">
                {service.category}
              </Badge>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 bg-gray-100 rounded-xl p-1 mb-6">
                <TabsTrigger
                  value="overview"
                  className={activeTab === "overview" ? "bg-white text-orange-600 shadow-sm rounded-lg" : ""}
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className={activeTab === "documents" ? "bg-white text-orange-600 shadow-sm rounded-lg" : ""}
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="process"
                  className={activeTab === "process" ? "bg-white text-orange-600 shadow-sm rounded-lg" : ""}
                >
                  Process
                </TabsTrigger>
                <TabsTrigger
                  value="faqs"
                  className={activeTab === "faqs" ? "bg-white text-orange-600 shadow-sm rounded-lg" : ""}
                >
                  FAQs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-6">
                {service.imageUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative h-64 sm:h-80 w-full mb-6 rounded-xl overflow-hidden shadow-lg"
                  >
                    <Image
                      src={service.imageUrl || "/placeholder.svg?height=320&width=640"}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </motion.div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {[
                    { icon: IndianRupee, label: "Price", value: `₹${service.priceAmount.toLocaleString()}` },
                    { icon: FileText, label: "Govt. Fee", value: service.governmentFee },
                    { icon: Clock, label: "Processing", value: service.processingTime },
                    { icon: Calendar, label: "Validity", value: service.validity },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-center text-orange-600 mb-2">
                        <item.icon className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{item.value}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">About This Service</h2>
                  <p className="text-gray-700 text-sm sm:text-base whitespace-pre-line">{service.content}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Key Features</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
                {service.relatedServices && service.relatedServices.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Related Services</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.relatedServices.map((related) => (
                        <Link
                          key={related.id}
                          href={`/services/${related.slug}`}
                          className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
                        >
                          <div className="bg-orange-100 text-orange-600 rounded-full p-2 mr-3">
                            <FileText className="h-5 w-5" />
                          </div>
                          <span className="font-medium text-sm sm:text-base">{related.title}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </TabsContent>
              <TabsContent value="documents" className="pt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Required Documents</h2>
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <ul className="space-y-4">
                      {service.requiredDocuments.map((doc, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-blue-600">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Important Note
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base">
                      All documents should be clear, legible, and in the specified format (usually PDF or JPG).
                      Self-attested copies are required for most documents. Our team will guide you through the document
                      preparation process to ensure smooth processing.
                    </p>
                  </div>
                </motion.div>
              </TabsContent>
              <TabsContent value="process" className="pt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Application Process</h2>
                  <div className="space-y-6">
                    {service.processSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 h-full w-1 bg-orange-600"></div>
                        <div className="flex items-start">
                          <div className="bg-orange-100 text-orange-600 rounded-full h-8 w-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-1 text-gray-900">{step.step}</h3>
                            <p className="text-gray-700 text-sm sm:text-base">{step.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
              <TabsContent value="faqs" className="pt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="bg-white rounded-xl shadow-sm">
                    {service.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="px-6 py-4 hover:no-underline text-left">
                          <span className="font-medium text-sm sm:text-base">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <p className="text-gray-700 text-sm sm:text-base">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Application Form */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm p-6 sticky top-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Apply for {service.title}</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Fill out the form below to apply for this service. Our team will contact you shortly.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="rounded-lg"
                    aria-required="true"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="rounded-lg"
                    aria-required="true"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="rounded-lg"
                    aria-required="true"
                  />
                </div>
                <div>
                  <Label htmlFor="businessName" className="text-sm font-medium">Business Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-sm font-medium">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="pincode" className="text-sm font-medium">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="rounded-lg"
                  />
                </div>
                {/* Conditional fields */}
                {service.category === "Business Registration" && service.slug === "gst-registration" && (
                  <>
                    <div>
                      <Label htmlFor="gstType" className="text-sm font-medium">GST Type</Label>
                      <Select
                        name="gstType"
                        value={formData.gstType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, gstType: value }))}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select GST Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="REGULAR">Regular</SelectItem>
                          <SelectItem value="COMPOSITION">Composition</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="annualTurnover" className="text-sm font-medium">Annual Turnover (₹)</Label>
                      <Input
                        id="annualTurnover"
                        name="annualTurnover"
                        value={formData.annualTurnover}
                        onChange={handleInputChange}
                        className="rounded-lg"
                      />
                    </div>
                  </>
                )}
                {service.category === "Business Registration" && service.slug === "msme-registration" && (
                  <>
                    <div>
                      <Label htmlFor="msmeCategory" className="text-sm font-medium">MSME Category</Label>
                      <Select
                        name="msmeCategory"
                        value={formData.msmeCategory}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, msmeCategory: value }))}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select MSME Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MICRO">Micro</SelectItem>
                          <SelectItem value="SMALL">Small</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="investmentInPlant" className="text-sm font-medium">Investment in Plant (₹)</Label>
                      <Input
                        id="investmentInPlant"
                        name="investmentInPlant"
                        value={formData.investmentInPlant}
                        onChange={handleInputChange}
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="numberOfEmployees" className="text-sm font-medium">Number of Employees</Label>
                      <Input
                        id="numberOfEmployees"
                        name="numberOfEmployees"
                        value={formData.numberOfEmployees}
                        onChange={handleInputChange}
                        className="rounded-lg"
                      />
                    </div>
                  </>
                )}
                {service.category === "Business Registration" && service.slug === "company-registration" && (
                  <>
                    <div>
                      <Label htmlFor="companyType" className="text-sm font-medium">Company Type</Label>
                      <Select
                        name="companyType"
                        value={formData.companyType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, companyType: value }))}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select Company Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRIVATE_LIMITED">Private Limited</SelectItem>
                          <SelectItem value="LLP">LLP</SelectItem>
                          <SelectItem value="OPC">OPC</SelectItem>
                          <SelectItem value="PARTNERSHIP">Partnership</SelectItem>
                          <SelectItem value="SOLE_PROPRIETORSHIP">Sole Proprietorship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="proposedNames" className="text-sm font-medium">Proposed Names (comma-separated)</Label>
                      <Input
                        id="proposedNames"
                        name="proposedNames"
                        value={formData.proposedNames}
                        onChange={handleInputChange}
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessActivity" className="text-sm font-medium">Business Activity</Label>
                      <Input
                        id="businessActivity"
                        name="businessActivity"
                        value={formData.businessActivity}
                        onChange={handleInputChange}
                        className="rounded-lg"
                      />
                    </div>
                  </>
                )}
                {service.category === "Intellectual Property" && service.slug === "trademark-registration" && (
                  <>
                    <div>
                      <Label htmlFor="trademarkType" className="text-sm font-medium">Trademark Type</Label>
                      <Select
                        name="trademarkType"
                        value={formData.trademarkType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, trademarkType: value }))}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select Trademark Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WORDMARK">Wordmark</SelectItem>
                          <SelectItem value="LOGO">Logo</SelectItem>
                          <SelectItem value="COMBINED">Combined</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="trademarkClass" className="text-sm font-medium">Trademark Class</Label>
                      <Input
                        id="trademarkClass"
                        name="trademarkClass"
                        type="number"
                        value={formData.trademarkClass}
                        onChange={handleInputChange}
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="logoUrl" className="text-sm font-medium">Logo URL (if applicable)</Label>
                      <Input
                        id="logoUrl"
                        name="logoUrl"
                        value={formData.logoUrl}
                        onChange={handleInputChange}
                        className="rounded-lg"
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="message" className="text-sm font-medium">Additional Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="rounded-lg"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 rounded-lg"
                  disabled={formLoading || !isFormValid}
                >
                  {formLoading ? "Submitting..." : "Submit Application"}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  By submitting this form, you agree to our{" "}
                  <Link href="/terms" className="text-orange-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-orange-600 hover:underline">
                    Privacy Policy
                  </Link>.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-center mb-12 text-gray-900"
          >
            What Our Clients Say
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Rajesh Kumar",
                role: "Small Business Owner",
                quote:
                  "The team made my GST registration process incredibly smooth. They handled all the documentation and follow-ups professionally. Highly recommended!",
              },
              {
                name: "Priya Sharma",
                role: "Entrepreneur",
                quote:
                  "I was struggling with MSME registration until I found this service. Their expert guidance and prompt support made the entire process hassle-free.",
              },
              {
                name: "Amit Patel",
                role: "Tech Startup Founder",
                quote:
                  "The company registration service was excellent. They explained every step clearly and completed the process faster than expected. Great value for money!",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="inline-block"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-sm sm:text-base mb-4">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;