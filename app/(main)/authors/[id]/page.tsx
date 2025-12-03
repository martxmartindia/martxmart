"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Eye, Heart, MessageCircle, Calendar, ArrowLeft, Twitter, Linkedin, Github, Globe } from "lucide-react"
import { format } from "date-fns"

interface Author {
  id: string
  name: string
  bio?: string
  profileImage?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
  }
  createdAt: string
}

interface Blog {
  id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  publishedAt: string
  viewCount: number
  likeCount: number
  commentCount: number
  tags?: string[]
}

export default function AuthorPage() {
  const params = useParams()
  const authorId = params.id as string
  const [author, setAuthor] = useState<Author | null>(null)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAuthor()
  }, [authorId])

  const fetchAuthor = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/authors/${authorId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch author")
      }

      setAuthor(data.author)
      setBlogs(data.blogs)
    } catch (error) {
      console.error("Error fetching author:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-2" />
        <span className="text-lg text-gray-700">Loading author...</span>
      </div>
    )
  }

  if (!author) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Author Not Found</h1>
          <p className="text-gray-600 mb-6">The author you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </Button>
      </div>

      {/* Author Profile */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              {author.profileImage ? (
                <Image
                  src={author.profileImage}
                  alt={author.name}
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-30 h-30 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{author.name}</h1>
              {author.bio && (
                <p className="text-gray-600 mb-4">{author.bio}</p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {format(new Date(author.createdAt), "MMMM yyyy")}
                </div>
                <div>{blogs.length} published {blogs.length === 1 ? 'post' : 'posts'}</div>
              </div>

              {/* Social Links */}
              {author.socialLinks && (
                <div className="flex gap-2">
                  {author.socialLinks.twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {author.socialLinks.linkedin && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {author.socialLinks.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={author.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {author.socialLinks.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={author.socialLinks.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Author's Blogs */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Published Articles</h2>

        {blogs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No published articles yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {blog.featuredImage && (
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={blog.featuredImage}
                      alt={blog.title}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    <Link href={`/blog/${blog.slug}`} className="hover:text-orange-600 transition-colors">
                      {blog.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(blog.publishedAt), "MMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {blog.excerpt && (
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {blog.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {blog.viewCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {blog.likeCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {blog.commentCount}
                    </div>
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {blog.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{blog.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}