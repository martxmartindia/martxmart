"use client"

import { useEffect, useState } from "react"
import { ChevronRight, ArrowLeft, Clock, DollarSign, FileText, Search, IndianRupee } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useParams } from "next/navigation"

// Main categories data
const categories = [
  {
    id: "food-processing",
    title: "Food Processing Projects",
    description: "Explore food processing and production opportunities under PMFME scheme",
    subcategories: [
      "Flour Mill Unit",
      "Rice Mill Plant",
      "Spice Manufacturing Unit",
      "Pulse Processing Plant",
      "Ghee Production Unit",
      "Paneer Manufacturing Plant",
      "Frozen Food Unit",
      "Ice Cream Manufacturing Plant",
      "Fruit and Vegetable Processing Unit",
      "Bakery Production Unit",
      "Clean Juice Plant",
      "Snack Manufacturing Unit",
      "Tea Manufacturing Plant",
      "Coffee Production Unit",
      "Bread and Biscuit Manufacturing Unit",
    ],
  },
  {
    id: "service-sector",
    title: "Service Sector Projects",
    description: "Discover service-based business opportunities under PMEGP scheme",
    subcategories: [
      "Digital Service Center",
      "Mobile Repairing Center",
      "Computer Repairing Center",
      "Photocopy Service",
      "Printing Service",
      "Offset Printing Press",
      "Flex Printing Press",
      "Tailoring Service",
      "Beauty Parlor Service (For Women)",
      "Hair Salon Service (For Men)",
      "Electrical Repairing Service (Fans, Motors)",
      "Wiring Service",
      "Plumbing Service",
      "Tent House Service",
      "Event Management Service",
    ],
  },
  {
    id: "manufacturing",
    title: "Manufacturing Projects",
    description: "Explore manufacturing business opportunities under PMEGP scheme",
    subcategories: [
      "Readymade Garments Manufacturing",
      "Agarbatti Manufacturing Unit",
      "Soap Manufacturing Unit",
      "Candle Manufacturing Unit",
      "Paper Bag Manufacturing",
      "Paper Cup and Plate Manufacturing",
      "Jute Bag Manufacturing",
      "Detergent Powder Manufacturing",
      "Wooden Furniture Manufacturing",
      "Leather Footwear Manufacturing",
      "Notebook and Register Manufacturing",
      "Handicraft Product Manufacturing",
      "Bamboo Product Manufacturing",
      "Khadi Textile Manufacturing",
      "Handloom Weaving Unit",
    ],
  },
  {
    id: "business-services",
    title: "Business Registration Services",
    description: "Professional services for business registration and compliance",
    subcategories: [
      "GST Registration & Filing",
      "Udyam (MSME) Registration",
      "Company Registration",
      "Import-Export Code (IEC)",
      "Shop & Establishment License",
      "FSSAI Registration & Renewal",
      "Trade License",
      "ESI & PF Registration",
      "Professional Tax Registration",
      "Factory License & Compliance",
      "Labor Law & Payroll Compliance",
      "ISO Certification",
      "Environmental Compliance",
    ],
  },
  {
    id: "government-schemes",
    title: "Government Schemes",
    description: "Access government support schemes for entrepreneurs and businesses",
    subcategories: [
      "PMEGP Scheme",
      "PMFME Scheme",
      "Startup India",
      "Stand-Up India",
      "Mudra Loan",
      "MSME Cluster Development",
      "Credit Linked Capital Subsidy",
      "Technology Upgradation Fund",
      "ZED Certification Scheme",
      "Design Clinic Scheme",
    ],
  },
  {
    id: "certifications",
    title: "Certifications & Compliance",
    description: "Essential certifications and compliance services for businesses",
    subcategories: [
      "ISO Certification",
      "Digital Signature",
      "Trademark Registration",
      "Factory License & Compliance",
      "Environmental Compliance",
      "BIS Certification",
      "FSSAI Certification",
      "Hallmark Certification",
      "Export Certification",
      "Quality Management Systems",
    ],
  },
]

// Sample projects data for each category
const projectsData = {
  "food-processing": [
    {
      id: "flour-mill",
      title: "Flour Mill Unit",
      subcategory: "Food Processing",
      description: "A small-scale flour mill unit for processing wheat and other grains into flour.",
      requirements: [
        "Flour milling machinery",
        "Storage space for raw materials",
        "Packaging equipment",
        "Quality testing tools",
      ],
      estimatedCost: "₹5L - ₹15L",
      timeline: "3-6 months",
      status: "Available",
      scheme: "PMFME",
    },
    {
      id: "rice-mill",
      title: "Rice Mill Plant",
      subcategory: "Food Processing",
      description: "A rice mill plant for processing paddy into polished rice with modern equipment.",
      requirements: ["Rice milling machinery", "Paddy cleaner and separator", "Destoner machine", "Packaging unit"],
      estimatedCost: "₹15L - ₹50L",
      timeline: "6-9 months",
      status: "Available",
      scheme: "PMFME",
    },
    {
      id: "spice-manufacturing",
      title: "Spice Manufacturing Unit",
      subcategory: "Food Processing",
      description: "A unit for processing and packaging various spices with grinding and blending facilities.",
      requirements: ["Spice grinding machines", "Blending equipment", "Packaging machinery", "Storage facilities"],
      estimatedCost: "₹10L - ₹25L",
      timeline: "4-8 months",
      status: "Available",
      scheme: "PMFME",
    },
    {
      id: "pulse-processing",
      title: "Pulse Processing Plant",
      subcategory: "Food Processing",
      description: "A facility for cleaning, sorting, and processing various pulses for market distribution.",
      requirements: [
        "Pulse cleaning and grading machines",
        "Destoner and gravity separator",
        "Packaging equipment",
        "Storage silos",
      ],
      estimatedCost: "₹20L - ₹40L",
      timeline: "6-10 months",
      status: "Available",
      scheme: "PMFME",
    },
    {
      id: "ghee-production",
      title: "Ghee Production Unit",
      subcategory: "Food Processing",
      description: "A unit for manufacturing pure ghee from milk or cream using traditional and modern methods.",
      requirements: ["Cream separator", "Ghee boiler", "Filtration system", "Packaging machinery"],
      estimatedCost: "₹8L - ₹20L",
      timeline: "3-6 months",
      status: "Available",
      scheme: "PMFME",
    },
    {
      id: "paneer-manufacturing",
      title: "Paneer Manufacturing Plant",
      subcategory: "Food Processing",
      description: "A facility for producing fresh paneer (cottage cheese) with modern equipment and packaging.",
      requirements: ["Milk pasteurizer", "Paneer press", "Cutting equipment", "Cold storage"],
      estimatedCost: "₹10L - ₹25L",
      timeline: "4-7 months",
      status: "Available",
      scheme: "PMFME",
    },
  ],
  "business-services": [
    {
      id: "gst-registration",
      title: "GST Registration & Filing",
      subcategory: "Business Services",
      description: "Professional assistance for GST registration and regular filing services.",
      requirements: ["Business PAN card", "Address proof", "Bank account details", "Business incorporation documents"],
      estimatedCost: "₹999",
      timeline: "7-15 days",
      status: "Available",
      scheme: "Service",
    },
    {
      id: "udyam-registration",
      title: "Udyam (MSME) Registration",
      subcategory: "Business Services",
      description: "Register your business as an MSME to access government benefits and schemes.",
      requirements: ["Aadhaar card", "PAN card", "Business details", "Bank account information"],
      estimatedCost: "₹499",
      timeline: "1-3 days",
      status: "Available",
      scheme: "Service",
    },
    {
      id: "company-registration",
      title: "Company Registration",
      subcategory: "Business Services",
      description:
        "Complete registration services for Private Limited, LLP, OPC, Partnership, and Sole Proprietorship.",
      requirements: [
        "Director/Partner KYC documents",
        "Business address proof",
        "Proposed company names",
        "Business activity details",
      ],
      estimatedCost: "₹1,999 - ₹12,999 + Govt Fees",
      timeline: "15-30 days",
      status: "Available",
      scheme: "Service",
    },
    {
      id: "iec-registration",
      title: "Import-Export Code (IEC)",
      subcategory: "Business Services",
      description: "Registration for businesses involved in import and export activities.",
      requirements: ["PAN card", "Business registration documents", "Bank certificate", "Photographs"],
      estimatedCost: "₹1,299",
      timeline: "3-7 days",
      status: "Available",
      scheme: "Service",
    },
    {
      id: "fssai-registration",
      title: "FSSAI Registration & Renewal",
      subcategory: "Business Services",
      description: "Food license for businesses dealing with food products, processing, or distribution.",
      requirements: ["Business registration documents", "Address proof", "ID proof", "Food category details"],
      estimatedCost: "₹5,999 + Govt Fees",
      timeline: "15-30 days",
      status: "Available",
      scheme: "Service",
    },
  ],
  "service-sector": [
    {
      id: "digital-service-center",
      title: "Digital Service Center",
      subcategory: "Service Sector",
      description: "A center offering various digital services like printing, scanning, online form filling, etc.",
      requirements: ["Computers and peripherals", "Internet connection", "Printer and scanner", "Office space"],
      estimatedCost: "₹2L - ₹5L",
      timeline: "1-2 months",
      status: "Available",
      scheme: "PMEGP",
    },
    {
      id: "mobile-repairing",
      title: "Mobile Repairing Center",
      subcategory: "Service Sector",
      description: "A service center for repairing and servicing mobile phones and accessories.",
      requirements: ["Repair tools and equipment", "Testing devices", "Spare parts inventory", "Shop space"],
      estimatedCost: "₹3L - ₹7L",
      timeline: "1-3 months",
      status: "Available",
      scheme: "PMEGP",
    },
    {
      id: "computer-repairing",
      title: "Computer Repairing Center",
      subcategory: "Service Sector",
      description: "A service center for repairing and maintaining computers, laptops, and peripherals.",
      requirements: ["Diagnostic tools", "Repair equipment", "Spare parts inventory", "Workshop space"],
      estimatedCost: "₹3L - ₹8L",
      timeline: "1-3 months",
      status: "Available",
      scheme: "PMEGP",
    },
  ],
  manufacturing: [
    {
      id: "garments-manufacturing",
      title: "Readymade Garments Manufacturing",
      subcategory: "Manufacturing",
      description: "A unit for manufacturing readymade garments with cutting, stitching, and finishing facilities.",
      requirements: ["Sewing machines", "Cutting equipment", "Finishing tools", "Production space"],
      estimatedCost: "₹5L - ₹20L",
      timeline: "3-6 months",
      status: "Available",
      scheme: "PMEGP",
    },
    {
      id: "agarbatti-manufacturing",
      title: "Agarbatti Manufacturing Unit",
      subcategory: "Manufacturing",
      description: "A unit for manufacturing incense sticks (agarbatti) with processing and packaging facilities.",
      requirements: ["Agarbatti making machines", "Raw material storage", "Drying area", "Packaging equipment"],
      estimatedCost: "₹2L - ₹10L",
      timeline: "2-4 months",
      status: "Available",
      scheme: "PMEGP",
    },
    {
      id: "soap-manufacturing",
      title: "Soap Manufacturing Unit",
      subcategory: "Manufacturing",
      description:
        "A facility for manufacturing various types of soaps with mixing, molding, and packaging capabilities.",
      requirements: ["Soap making equipment", "Mixing tanks", "Molds", "Cutting and packaging machinery"],
      estimatedCost: "₹3L - ₹15L",
      timeline: "2-5 months",
      status: "Available",
      scheme: "PMEGP",
    },
  ],
  "government-schemes": [
    {
      id: "pmegp-scheme",
      title: "PMEGP Scheme",
      subcategory: "Government Schemes",
      description: "Prime Minister's Employment Generation Programme for setting up micro-enterprises.",
      requirements: [
        "Age above 18 years",
        "Minimum 8th pass for projects above ₹10 lakh",
        "Project proposal",
        "EDP training",
      ],
      estimatedCost: "Up to ₹25L for manufacturing, ₹10L for service sector",
      timeline: "2-3 months for approval",
      status: "Available",
      scheme: "Government",
    },
    {
      id: "pmfme-scheme",
      title: "PMFME Scheme",
      subcategory: "Government Schemes",
      description: "PM Formalization of Micro Food Processing Enterprises Scheme for food processing sector.",
      requirements: [
        "Existing or new micro food processing enterprise",
        "Self Help Groups",
        "Farmer Producer Organizations",
        "Project proposal",
      ],
      estimatedCost: "Up to ₹10L with 35% subsidy",
      timeline: "2-3 months for approval",
      status: "Available",
      scheme: "Government",
    },
  ],
  certifications: [
    {
      id: "iso-certification",
      title: "ISO Certification",
      subcategory: "Certifications",
      description: "Quality compliance and ISO certification assistance for various standards.",
      requirements: ["Business registration documents", "Process documentation", "Quality manual", "Internal audit"],
      estimatedCost: "₹6,999",
      timeline: "2-3 months",
      status: "Available",
      scheme: "Service",
    },
    {
      id: "digital-signature",
      title: "Digital Signature",
      subcategory: "Certifications",
      description: "Digital Signature Certificate (DSC) for online document signing and verification.",
      requirements: ["ID proof", "Address proof", "Photograph", "Application form"],
      estimatedCost: "₹1,999",
      timeline: "3-7 days",
      status: "Available",
      scheme: "Service",
    },
    {
      id: "trademark-registration",
      title: "Trademark Registration",
      subcategory: "Certifications",
      description: "Registration of business name, logo, or slogan as a trademark for brand protection.",
      requirements: [
        "Trademark details",
        "Business registration documents",
        "Logo/brand name",
        "Class of goods/services",
      ],
      estimatedCost: "₹6,500",
      timeline: "12-18 months",
      status: "Available",
      scheme: "Service",
    },
  ],
}

export default function ProjectCategoryDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [category, setCategory] = useState<any | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"title" | "cost" | "timeline">("title")
  const [filterScheme, setFilterScheme] = useState<"All" | "PMFME" | "PMEGP" | "Service" | "Government">("All")

  useEffect(() => {
    const foundCategory = categories.find((cat) => cat.id === params.id)
    setCategory(foundCategory || null)

    // Set projects based on category ID
    if (params.id && projectsData[params.id as keyof typeof projectsData]) {
      setProjects(projectsData[params.id as keyof typeof projectsData])
    } else {
      setProjects([])
    }
  }, [params.id])

  const filteredProjects = projects
    .filter(
      (project) =>
        (filterScheme === "All" || project.scheme === filterScheme) &&
        (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.subcategory.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "cost") {
        // Extract numeric values from cost strings for comparison
        const costA = Number.parseInt(a.estimatedCost.replace(/[^\d]/g, ""))
        const costB = Number.parseInt(b.estimatedCost.replace(/[^\d]/g, ""))
        return costA - costB
      }
      if (sortBy === "timeline") {
        // Extract numeric values from timeline strings for comparison
        const timeA = Number.parseInt(a.timeline.replace(/[^\d]/g, ""))
        const timeB = Number.parseInt(b.timeline.replace(/[^\d]/g, ""))
        return timeA - timeB
      }
      return 0
    })

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Category Not Found</CardTitle>
            <CardDescription>The requested category does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/project-category">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 text-orange-600 hover:text-orange-700 flex items-center"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Categories
      </Button>

      <Card className="border border-gray-200 shadow-lg mb-8">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
          <CardTitle className="text-3xl font-bold text-gray-900">{category.title}</CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2 max-w-2xl">{category.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="subcategories">
            <TabsList className="mb-4">
              <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="subcategories">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Available Subcategories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {category.subcategories.map((subcategory: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-orange-50 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-800">{subcategory}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="projects">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">All Projects</h2>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 py-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as "title" | "cost" | "timeline")}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Sort by Title</SelectItem>
                      <SelectItem value="cost">Sort by Cost</SelectItem>
                      <SelectItem value="timeline">Sort by Timeline</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterScheme}
                    onValueChange={(value) =>
                      setFilterScheme(value as "All" | "PMFME" | "PMEGP" | "Service" | "Government")
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Schemes</SelectItem>
                      <SelectItem value="PMFME">PMFME</SelectItem>
                      <SelectItem value="PMEGP">PMEGP</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {project.title}
                        </CardTitle>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          {project.scheme}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-600">{project.subcategory}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-orange-500" />
                            Requirements
                          </h4>
                          <ul className="list-disc pl-5 text-sm text-gray-600">
                            {project.requirements.map((req: string, index: number) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                            <IndianRupee className="h-4 w-4 mr-2 text-orange-500" />
                            Estimated Cost
                          </h4>
                          <p className="text-sm text-gray-600">{project.estimatedCost}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-orange-500" />
                            Timeline
                          </h4>
                          <p className="text-sm text-gray-600">{project.timeline}</p>
                        </div>
                      </div>
                      <Link href={`/project-report/${project.id}`}>
                        <Button className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2">
                          View Project Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No projects found matching your criteria.</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchTerm("")
                      setFilterScheme("All")
                    }}
                    className="mt-4 text-orange-600 hover:text-orange-700"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
