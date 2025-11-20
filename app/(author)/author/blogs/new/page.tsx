"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import router from "next/router"

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  categoryId: z.string().min(1, "Category is required")
});

type BlogFormValues = z.infer<typeof blogSchema>;

const defaultValues: Partial<BlogFormValues> = {
  title: "",
  content: "",
  excerpt: "",
  metaTitle: "",
  metaDescription: "",
  tags: [],
  featuredImage: "",
  status: "DRAFT",
  categoryId: ""
};

export default function NewBlogPage() {

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" })
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/blog/categories')
        const result = await response.json()
        if (response.ok && result.data) {
          setCategories(result.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (data: BlogFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/author/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create blog post");
      }
  
      const result = await response.json();
      toast.success("Blog post created successfully");
      router.push("/author/blogs");
    } catch (error: any) {
      toast.error(error.message || "Failed to create blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setNewCategory(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
    }))
  }
  
  const handleCreateCategory = async () => {
    if (!newCategory.name || !newCategory.slug) {
      toast.error('Category name and slug are required')
      return
    }
  
    setIsCreatingCategory(true)
    try {
      const response = await fetch('/api/blog/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      })
  
      const result = await response.json()
  
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create category')
      }
  
      // Add new category to the list and select it
      setCategories([...categories, result])
      form.setValue('categoryId', result.id)
      setShowNewCategoryForm(false)
      setNewCategory({ name: '', slug: '' })
      toast.success('Category created successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create category')
    } finally {
      setIsCreatingCategory(false)
    }
  }

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featuredImage: "",
      status: "DRAFT",
      categoryId: "",
      tags: [],
      metaTitle: "",
      metaDescription: "",
    },
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    form.setValue("title", title)

    // Auto-generate slug from title
    if (title) {
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
      const response = await fetch("/api/author/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create blog post")
      }

      toast.success("Blog post created successfully")
      router.push("/author")
    } catch (error: any) {
      toast.error(error.message || "Failed to create blog post")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Blog Content</CardTitle>
                  <CardDescription>Write your blog post content here</CardDescription>
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
                            <TipTapEditor value={field.value} onChange={field.onChange} />
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
                            <Input placeholder="SEO title (optional)" {...field} />
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
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <div className="space-y-4">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                              >
                                {showNewCategoryForm ? 'Cancel' : 'Create New Category'}
                              </Button>
                            </div>

                            {showNewCategoryForm && (
                              <div className="space-y-4 border p-4 rounded-lg">
                                <div className="space-y-2">
                                  <FormLabel>Category Name</FormLabel>
                                  <Input
                                    placeholder="Enter category name"
                                    value={newCategory.name}
                                    onChange={handleNewCategoryNameChange}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <FormLabel>Category Slug</FormLabel>
                                  <Input
                                    placeholder="category-slug"
                                    value={newCategory.slug}
                                    onChange={(e) => setNewCategory(prev => ({ ...prev, slug: e.target.value }))}
                                  />
                                </div>
                                <Button
                                  type="button"
                                  onClick={handleCreateCategory}
                                  disabled={isCreatingCategory}
                                  className="w-full"
                                >
                                  {isCreatingCategory ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Creating...
                                    </>
                                  ) : (
                                    'Create Category'
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                          <FormDescription>Choose a category for your blog post</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                    "Save Blog Post"
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

