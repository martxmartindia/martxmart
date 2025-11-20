"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, FileText, DollarSign, Clock, CheckCircle, AlertCircle, ChevronRight, IndianRupee, Users, MapPin, Zap, Factory, TrendingUp, Award, Shield, BookOpen, Download, Share2, Heart, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

interface Project {
  id: string
  name: string
  slug: string
  description: string | null
  longDescription: string | null
  scheme: string | null
  estimatedCost: string | null
  timeline: string | null
  requirements: string[]
  landRequirement: string | null
  powerRequirement: string | null
  manpower: string | null
  rawMaterials: string[]
  marketPotential: string | null
  profitMargin: string | null
  breakEven: string | null
  subsidyDetails: string | null
  documents: string[]
  projectReportCost: number
  category: {
    id: string
    name: string
    slug: string
  }
  machinery: {
    id: string
    name: string
    cost: string
  }[]
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [error, setError] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.slug}`)
        if (!response.ok) {
          let apiErrorPayload = "No additional error payload from API."
          try {
            const errorJson = await response.json()
            apiErrorPayload = JSON.stringify(errorJson)
          } catch (jsonError) {
            try {
              apiErrorPayload = await response.text()
            } catch (textError) {
              apiErrorPayload = "Failed to read error payload from API response."
            }
          }
          const errorMessage = `Failed to fetch project. Status: ${response.status}. API Response: ${apiErrorPayload}`
          console.error(errorMessage)
          throw new Error(errorMessage)
        }
        const data = await response.json()
        setProject(data)
      } catch (error) {
        console.error("Error fetching project:", error)
        setError("Failed to load project. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchProject()
    }
  }, [params.slug])

  const handleShare = async () => {
    if (navigator.share && project) {
      try {
        await navigator.share({
          title: project.name,
          text: project.description || "",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // Here you would typically save to backend
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white border-0 shadow-lg mb-8">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-12">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-red-600">{error || "Project Not Found"}</CardTitle>
              <CardDescription>
                {error ? "An error occurred while loading the project." : "The requested project does not exist."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/project-reports">
                <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Project Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleBookmark}
              className={`${isBookmarked ? 'bg-orange-50 border-orange-200 text-orange-700' : ''}`}
            >
              <Heart className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <Card className="bg-white border-0 shadow-lg mb-8 overflow-hidden">
              <div className="relative h-64 bg-gradient-to-r from-orange-600 to-orange-700">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
                    <p className="text-orange-100 text-lg">{project.category?.name}</p>
                  </div>
                </div>
                {project.scheme && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      <Award className="h-3 w-3 mr-1" />
                      {project.scheme} Scheme
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="p-6 border-b">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.estimatedCost && (
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <IndianRupee className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Investment</p>
                      <p className="font-semibold text-gray-900">{project.estimatedCost}</p>
                    </div>
                  )}
                  {project.timeline && (
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Timeline</p>
                      <p className="font-semibold text-gray-900">{project.timeline}</p>
                    </div>
                  )}
                  {project.profitMargin && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Profit Margin</p>
                      <p className="font-semibold text-gray-900">{project.profitMargin}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Main Content Tabs */}
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="border-b px-6 pt-6">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-50">
                      <TabsTrigger value="overview" className="data-[state=active]:bg-white">Overview</TabsTrigger>
                      <TabsTrigger value="details" className="data-[state=active]:bg-white">Details</TabsTrigger>
                      <TabsTrigger value="financials" className="data-[state=active]:bg-white">Financials</TabsTrigger>
                      <TabsTrigger value="requirements" className="data-[state=active]:bg-white">Requirements</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-6">
                    <TabsContent value="overview" className="mt-0">
                      <div className="space-y-8">
                        {/* Description */}
                        <div>
                          <h3 className="text-2xl font-bold mb-4 text-gray-900">Project Overview</h3>
                          <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed text-lg">
                              {project.longDescription || project.description}
                            </p>
                          </div>
                        </div>

                        {/* Key Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {project.marketPotential && (
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                              <div className="flex items-center mb-3">
                                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                                <h4 className="font-semibold text-blue-900">Market Potential</h4>
                              </div>
                              <p className="text-blue-800">{project.marketPotential}</p>
                            </div>
                          )}

                          {project.breakEven && (
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                              <div className="flex items-center mb-3">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                <h4 className="font-semibold text-green-900">Break-Even Period</h4>
                              </div>
                              <p className="text-green-800">{project.breakEven}</p>
                            </div>
                          )}
                        </div>

                        {/* Subsidy Information */}
                        {project.subsidyDetails && (
                          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                            <div className="flex items-center mb-4">
                              <Shield className="h-6 w-6 text-orange-600 mr-3" />
                              <h4 className="text-xl font-semibold text-orange-900">Government Subsidy Available</h4>
                            </div>
                            <p className="text-orange-800 leading-relaxed">{project.subsidyDetails}</p>
                          </div>
                        )}

                        {/* Key Requirements Preview */}
                        {project.requirements.length > 0 && (
                          <div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Key Requirements</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {project.requirements.slice(0, 6).map((req, index) => (
                                <div key={index} className="flex items-start bg-gray-50 p-3 rounded-lg">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700 text-sm">{req}</span>
                                </div>
                              ))}
                            </div>
                            {project.requirements.length > 6 && (
                              <p className="text-sm text-gray-500 mt-2">
                                +{project.requirements.length - 6} more requirements
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="mt-0">
                      <div className="space-y-8">
                        {/* Infrastructure Requirements */}
                        <div>
                          <h3 className="text-2xl font-bold mb-6 text-gray-900">Infrastructure Requirements</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {project.landRequirement && (
                              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                                <div className="flex items-center mb-3">
                                  <MapPin className="h-5 w-5 text-green-600 mr-2" />
                                  <h4 className="font-semibold text-green-900">Land/Space Requirement</h4>
                                </div>
                                <p className="text-green-800">{project.landRequirement}</p>
                              </div>
                            )}

                            {project.powerRequirement && (
                              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                                <div className="flex items-center mb-3">
                                  <Zap className="h-5 w-5 text-yellow-600 mr-2" />
                                  <h4 className="font-semibold text-yellow-900">Power Requirement</h4>
                                </div>
                                <p className="text-yellow-800">{project.powerRequirement}</p>
                              </div>
                            )}

                            {project.manpower && (
                              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                                <div className="flex items-center mb-3">
                                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                                  <h4 className="font-semibold text-blue-900">Manpower Requirement</h4>
                                </div>
                                <p className="text-blue-800">{project.manpower}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Machinery & Equipment */}
                        {project.machinery.length > 0 && (
                          <div>
                            <h3 className="text-2xl font-bold mb-6 text-gray-900">Machinery & Equipment</h3>
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Equipment Name
                                      </th>
                                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estimated Cost
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {project.machinery.map((item, index) => (
                                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <Factory className="h-4 w-4 text-gray-400 mr-3" />
                                            <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                          <span className="text-sm font-semibold text-gray-900">{item.cost}</span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Raw Materials */}
                        {project.rawMaterials.length > 0 && (
                          <div>
                            <h3 className="text-2xl font-bold mb-6 text-gray-900">Raw Materials</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {project.rawMaterials.map((material, index) => (
                                <div key={index} className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                                    <span className="text-gray-800 font-medium">{material}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="financials" className="mt-0">
                      <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-gray-900">Financial Analysis</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {project.estimatedCost && (
                            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-semibold text-orange-900">Total Investment</h4>
                                  <IndianRupee className="h-5 w-5 text-orange-600" />
                                </div>
                                <p className="text-2xl font-bold text-orange-800">{project.estimatedCost}</p>
                              </CardContent>
                            </Card>
                          )}

                          {project.profitMargin && (
                            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-semibold text-green-900">Profit Margin</h4>
                                  <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <p className="text-2xl font-bold text-green-800">{project.profitMargin}</p>
                              </CardContent>
                            </Card>
                          )}

                          {project.breakEven && (
                            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-semibold text-blue-900">Break-Even Period</h4>
                                  <Clock className="h-5 w-5 text-blue-600" />
                                </div>
                                <p className="text-2xl font-bold text-blue-800">{project.breakEven}</p>
                              </CardContent>
                            </Card>
                          )}

                          {project.marketPotential && (
                            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-semibold text-purple-900">Market Potential</h4>
                                  <Star className="h-5 w-5 text-purple-600" />
                                </div>
                                <p className="text-sm text-purple-800">{project.marketPotential}</p>
                              </CardContent>
                            </Card>
                          )}
                        </div>

                        {/* Project Report Cost */}
                        <Card className="border-2 border-orange-300 bg-gradient-to-r from-orange-100 to-orange-200">
                          <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                              <BookOpen className="h-6 w-6 text-orange-600 mr-3" />
                              <h4 className="text-xl font-semibold text-orange-900">Detailed Project Report</h4>
                            </div>
                            <p className="text-orange-800 mb-4">
                              Get a comprehensive project report with detailed financial analysis, technical specifications, 
                              implementation roadmap, and market research for just{" "}
                              <span className="text-2xl font-bold">₹{project.projectReportCost?.toLocaleString() || 0}</span>
                            </p>
                            <div className="flex items-center text-sm text-orange-700">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              <span>Suitable for bank loans and government schemes</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="requirements" className="mt-0">
                      <div className="space-y-8">
                        {/* All Requirements */}
                        {project.requirements.length > 0 && (
                          <div>
                            <h3 className="text-2xl font-bold mb-6 text-gray-900">Complete Requirements List</h3>
                            <div className="space-y-3">
                              {project.requirements.map((req, index) => (
                                <div key={index} className="flex items-start bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-xs font-semibold text-orange-600">{index + 1}</span>
                                  </div>
                                  <span className="text-gray-700">{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Required Documents */}
                        {project.documents.length > 0 && (
                          <div>
                            <h3 className="text-2xl font-bold mb-6 text-gray-900">Required Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {project.documents.map((doc, index) => (
                                <div key={index} className="flex items-center bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                  <FileText className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                                  <span className="text-blue-800 font-medium">{doc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Scheme-specific Eligibility */}
                        {project.scheme && (
                          <div>
                            <h3 className="text-2xl font-bold mb-6 text-gray-900">Eligibility Criteria</h3>
                            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                              <CardContent className="p-6">
                                <div className="flex items-center mb-4">
                                  <Shield className="h-6 w-6 text-blue-600 mr-3" />
                                  <h4 className="text-xl font-semibold text-blue-900">{project.scheme} Scheme Eligibility</h4>
                                </div>
                                {project.scheme === "PMFME" && (
                                  <ul className="space-y-2 text-blue-800">
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                                      Existing or new micro food processing enterprises
                                    </li>
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                                      Self Help Groups (SHGs)
                                    </li>
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                                      Farmer Producer Organizations (FPOs)
                                    </li>
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                                      Cooperatives and Individual entrepreneurs
                                    </li>
                                  </ul>
                                )}
                                {project.scheme === "PMEGP" && (
                                  <ul className="space-y-2 text-blue-800">
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                                      Individuals above 18 years of age
                                    </li>
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                                      VIII Std. pass for projects above ₹10 lakh (manufacturing) / ₹5 lakh (service)
                                    </li>
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                                      Self Help Groups and Charitable Trusts
                                    </li>
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                                      Institutions registered under Societies Registration Act 1860
                                    </li>
                                  </ul>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Application Process */}
                        <div>
                          <h3 className="text-2xl font-bold mb-6 text-gray-900">Application Process</h3>
                          <div className="space-y-4">
                            {[
                              "Submit application with required documents",
                              "Initial screening and verification",
                              "Technical evaluation (if applicable)",
                              "Approval and sanction",
                              "Disbursement of funds/service delivery"
                            ].map((step, index) => (
                              <div key={index} className="flex items-center bg-white border border-gray-200 p-4 rounded-lg">
                                <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mr-4">
                                  <span className="text-sm font-bold">{index + 1}</span>
                                </div>
                                <span className="text-gray-700 font-medium">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply for Report Card */}
            <Card className="bg-white border-0 shadow-lg sticky top-6">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
                <CardTitle className="text-xl font-bold flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Get Detailed Project Report
                </CardTitle>
                <CardDescription className="text-orange-100">
                  Comprehensive report with technical and financial details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Report Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Report Includes:</h4>
                    <div className="space-y-2">
                      {[
                        "Detailed financial analysis & projections",
                        "Technical specifications & requirements",
                        "Implementation roadmap & timeline",
                        "Market analysis & competition study",
                        "Risk assessment & mitigation strategies",
                        "Government schemes & subsidy details"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="text-center">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-4">
                      <p className="text-sm text-gray-600 mb-1">Report Cost</p>
                      <p className="text-3xl font-bold text-orange-700">
                        ₹{project.projectReportCost?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">One-time payment</p>
                    </div>

                    <Link href={`/project-report/apply/${project.slug}`}>
                      <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                        Apply for Project Report
                      </Button>
                    </Link>
                  </div>

                  <Separator />

                  {/* Additional Info */}
                  <div className="text-center">
                    <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                      <Clock className="h-4 w-4 mr-1" />
                      Delivery: 7-10 business days
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Shield className="h-4 w-4 mr-1" />
                      Bank loan & scheme approved format
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
                <CardDescription>Get expert guidance for your project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Talk to Expert
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download Brochure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}