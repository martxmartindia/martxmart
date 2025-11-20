'use client'
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Clock, Tag, User } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

async function getBlog(slug: any) {
  try {
    const response = await fetch(`/api/blogs/${slug}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch blog')
    }
    const data = await response.json()
    return data.blog
  } catch (error) {
    console.error("Error fetching blog:", error)
    return null
  }
}

export default  function BlogDetailPage() {
  const params = useParams()
  const { slug } = useParams()
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const blogs =  getBlog(params.slug)

  useEffect(() => {
    async function loadBlog() {
      if (!slug) return
      const data = await getBlog(slug as string)
      if (!data) {
        // Handle not found gracefully (client components can't call notFound())
        setBlog(null)
      } else {
        setBlog(data)
      }
      setLoading(false)
    }
    loadBlog()
  }, [slug])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!blog) {
    return <div>Blog not found</div>
  }
  return (
    <article className="max-w-4xl mx-auto p-6">
      {blog.featuredImage && (
        <div className="aspect-video overflow-hidden rounded-lg mb-8">
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            width={1200}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="flex items-center gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{blog.author.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(blog.createdAt), "MMM d, yyyy")}</span>
          </div>
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>{blog.tags.join(", ")}</span>
            </div>
          )}
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 text-gray-600">
          <span className={`px-3 py-1 rounded-full text-sm ${blog.status === "PUBLISHED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
            Status: {blog.status}
          </span>
        </div>
      </div>
    </article>
  )
}