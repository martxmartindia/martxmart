"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter,useParams } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { TipTapEditor } from "@/components/tiptap-editor"
import { ImageUpload } from "@/components/imageUpload"

const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z
    .string()
    .min(5, "Slug must be at least 5 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})

type BlogFormValues = z.infer<typeof blogSchema>

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState("")

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featuredImage: "",
      status: "DRAFT",
      tags: [],
      metaTitle: "",
      metaDescription: "",
    },
  })

  useEffect(() => {

    const fetchBlog = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/author/blogs/${params.id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch blog")
        }

        form.reset({
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt || "",
          featuredImage: data.featuredImage || "",
          status: data.status,
          tags: data.tags || [],
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
        })
      } catch (error) {
        console.error("Error fetching blog:", error)
        toast.error("Failed to load blog")
        router.push("/author/blogs")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlog()
  }, [params.id, router, form])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    form.setValue("title", title)

    // Only auto-generate slug if it's a new blog (slug is empty)
    if (!form.getValues("slug")) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")

      form.setValue("slug", slug)
    }
  }

  const handleAddTag = () => {
    if (!tagInput.trim()) return

    const currentTags = form.getValues("tags") || []
    if (!currentTags.includes(tagInput.trim())) {
      form.setValue("tags", [...currentTags, tagInput.trim()])
    }

    setTagInput("")
  }

  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues("tags") || []
    form.setValue(
      "tags",
      currentTags.filter((t) => t !== tag),
    )
  }

  const onSubmit = async (data: BlogFormValues) => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/author/blogs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to update blog post")
      }

      toast.success("Blog post updated successfully")
      router.push("/author/blogs")
    } catch (error: any) {
      toast.error(error.message || "Failed to update blog post")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-2" />
        <span className="text-lg text-gray-700">Loading blog...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Blog Content</CardTitle>
                  <CardDescription>Edit your blog post content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter blog title" {...field} onChange={handleTitleChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="enter-blog-slug" {...field} />
                          </FormControl>
                          <FormDescription>The URL-friendly version of the title</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <TipTapEditor content={field.value} onChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>Optimize your blog post for search engines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief summary of the blog post"
                              className="resize-none h-20"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>A short summary that appears in search results</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Title</FormLabel>
                          <FormControl>
                            <Input placeholder="SEO title (optional)" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormDescription>Leave blank to use the blog title</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="SEO description (optional)"
                              className="resize-none h-20"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>Leave blank to use the excerpt</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing Options</CardTitle>
                  <CardDescription>Configure your blog post settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                              <SelectItem value="PUBLISHED">Published</SelectItem>
                              <SelectItem value="ARCHIVED">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Set the visibility of your blog post</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featuredImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image</FormLabel>
                          <FormControl>
                            <ImageUpload
                              value={field.value ? [field.value] : []}
                              onChange={(urls) => field.onChange(urls[0] || "")}
                              maxImages={1}
                              label="Upload featured image"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a tag"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  handleAddTag()
                                }
                              }}
                            />
                            <Button type="button" variant="secondary" onClick={handleAddTag}>
                              Add
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {field.value?.map((tag) => (
                              <div
                                key={tag}
                                className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm flex items-center"
                              >
                                {tag}
                                <button
                                  type="button"
                                  className="ml-1 text-gray-500 hover:text-gray-700"
                                  onClick={() => handleRemoveTag(tag)}
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Update Blog Post"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

