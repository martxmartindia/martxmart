"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Edit, BookOpen, Eye, Upload, Twitter, Linkedin, Facebook, Instagram, Globe, MapPin, GraduationCap, Briefcase, Award } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import Image from "next/image"

interface Author {
  id: string
  name: string
  email: string
  bio: string | null
  specialty: string | null
  status: string
  blogCount: number
  createdAt: string
  profileImage?: string | null
  location?: string | null
  education?: string | null
  experience?: string | null
  achievements?: string | null
  socialLinks?: {
    twitter?: string | null
    linkedin?: string | null
    facebook?: string | null
    instagram?: string | null
    website?: string | null
  }
  blogs?: Array<{
    id: string
    title: string
    status: string
    publishedAt: string | null
  }>
}

export default function AuthorDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [author, setAuthor] = useState<Author | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState("month")

  useEffect(() => {
    fetchAuthorDetails()
  }, [id])

  const fetchAuthorDetails = async () => {
    try {
      setIsLoading(true)
      const [authorResponse, statsResponse] = await Promise.all([
        fetch(`/api/admin/authors/${id}`),
        fetch(`/api/admin/authors/${id}/stats?timeframe=${selectedTimeframe}`)
      ])

      const [authorData, statsData] = await Promise.all([
        authorResponse.json(),
        statsResponse.json()
      ])

      if (authorResponse.ok) {
        setAuthor(authorData.author)
      } else {
        toast.error(authorData.error || "Failed to fetch author details")
      }

      if (statsResponse.ok) {
        setStats(statsData)
      } else {
        toast.error(statsData.error || "Failed to fetch author statistics")
      }
    } catch (error) {
      console.error("Error fetching author details:", error)
      toast.error("Failed to fetch author details")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      case "SUSPENDED":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Suspended
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!author) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-2">Author Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested author could not be found.</p>
          <Button onClick={() => router.push("/admin/authors")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Authors
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Author Details</h1>
          <p className="text-muted-foreground">View and manage author information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => router.push(`/admin/authors/${author.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Author
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Image</CardTitle>
            <CardDescription>Author's profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {author.profileImage ? (
              <Image
                src={`/api/admin/authors/${author.id}/profile-image`}
                alt={author.name}
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <Button variant="outline" onClick={() => document.getElementById('profile-image')?.click()}>
              Upload Image
            </Button>
            <input
              type="file"
              id="profile-image"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const formData = new FormData()
                  formData.append('image', file)
                  try {
                    const response = await fetch(`/api/admin/authors/${author.id}/profile-image`, {
                      method: 'POST',
                      body: formData,
                    })
                    if (response.ok) {
                      toast.success('Profile image updated successfully')
                      fetchAuthorDetails()
                    } else {
                      const data = await response.json()
                      toast.error(data.error || 'Failed to update profile image')
                    }
                  } catch (error) {
                    console.error('Error updating profile image:', error)
                    toast.error('Failed to update profile image')
                  }
                }
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Author's basic information and status</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-lg">{author.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-lg">{author.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Specialty</dt>
                <dd className="text-lg">{author.specialty || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="text-lg">{getStatusBadge(author.status)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Joined</dt>
                <dd className="text-lg">{new Date(author.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Biography</CardTitle>
            <CardDescription>Author's background and expertise</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">{author.bio || "No biography provided."}</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{author.location || "Location not specified"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{author.education || "Education not specified"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{author.experience || "Experience not specified"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>{author.achievements || "No achievements listed"}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Social Links</h4>
              <div className="flex gap-4">
                {author.socialLinks?.twitter && (
                  <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {author.socialLinks?.linkedin && (
                  <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {author.socialLinks?.facebook && (
                  <a href={author.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {author.socialLinks?.instagram && (
                  <a href={author.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {author.socialLinks?.website && (
                  <a href={author.socialLinks.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Author's content statistics and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{stats.performanceMetrics.totalPosts}</p>
                    <p className="text-sm text-muted-foreground">Total Posts</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{stats.performanceMetrics.totalViews}</p>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{stats.performanceMetrics.totalLikes}</p>
                    <p className="text-sm text-muted-foreground">Total Likes</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{stats.performanceMetrics.totalComments}</p>
                    <p className="text-sm text-muted-foreground">Total Comments</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Engagement Rate</p>
                    <p className="text-sm">{stats.performanceMetrics.engagementRate}%</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Post Frequency</p>
                    <p className="text-sm">{stats.performanceMetrics.postFrequency} posts/day</p>
                  </div>
                </div>

                <div>
                  <Select
                    value={selectedTimeframe}
                    onValueChange={(value) => {
                      setSelectedTimeframe(value)
                      fetchAuthorDetails()
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Published Blogs</CardTitle>
            <CardDescription>List of author's blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            {author.blogs && author.blogs.length > 0 ? (
              <div className="space-y-4">
                {author.blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{blog.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {blog.publishedAt
                          ? `Published on ${new Date(blog.publishedAt).toLocaleDateString()}`
                          : "Draft"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(blog.status)}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/blogs/${blog.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Blogs Yet</h3>
                <p className="text-muted-foreground">This author hasn't published any blogs.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}