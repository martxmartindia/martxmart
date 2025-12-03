'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { TipTapEditor } from '@/components/tiptap-editor'
import { ImageUpload } from '@/components/imageUpload'

const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(5, 'Slug must be at least 5 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  excerpt: z.string().max(200, 'Excerpt must be at most 200 characters').optional(),
  featuredImage: z.array(z.string()).max(1, 'Only one featured image is allowed').optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(Boolean)),
  metaTitle: z.string().optional(),
  metaDescription: z.string().max(160, 'Meta description must be at most 160 characters').optional(),
})

type BlogFormValues = z.infer<typeof blogSchema>
 
export default function NewBlogPage() {
   const router = useRouter()
   const { data: session, status } = useSession()
   const isAuthenticated = status === 'authenticated' && session?.user?.role === 'ADMIN'
   const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featuredImage: [],
      status: 'DRAFT',
      categoryId: '',
      tags: [] as string[],
      metaTitle: '',
      metaDescription: '',
    },
  })
  
  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/blog/categories')
        const data = await response.json()
        if (response.ok) {
          setCategories(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Update slug when title changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title') {
        const currentSlug = form.getValues('slug')
        if (!currentSlug || currentSlug === generateSlug(form.getValues('title'))) {
          form.setValue('slug', generateSlug(value.title || ''))
        }
      }
    })
    
    return () => subscription.unsubscribe()
  }, [form])
  
  const onSubmit = async (data: BlogFormValues) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to create a blog post')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          featuredImage: data.featuredImage?.[0] || null,
        }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create blog post')
      }
      
      toast.success('Blog post created successfully')
      router.push('/admin/blogs')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create blog post')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Blog Post Details</CardTitle>
          <CardDescription>
            Create a new blog post for your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter blog title" {...field} />
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
                        <Input placeholder="Enter URL slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be used in the URL: /blog/your-slug
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <FormControl>
                        <Input placeholder="Enter tags separated by commas" {...field} />
                      </FormControl>
                      <FormDescription>
                        E.g., technology, news, tutorial
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a short excerpt" {...field} />
                      </FormControl>
                      <FormDescription>
                        A short summary of the blog post (max 200 characters)
                      </FormDescription>
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
                        <Input placeholder="Enter meta title" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional SEO title (defaults to post title)
                      </FormDescription>
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
                        <Input placeholder="Enter meta description" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional SEO description (max 160 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="featuredImage"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Featured Image</FormLabel> */}
                    <FormControl>
                      <ImageUpload
                        value={field.value || []}
                        onChange={field.onChange}
                        maxImages={1}
                        label="Featured Image"
                      />
                    </FormControl>
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
                      <TipTapEditor
                        content={field.value}
                        onChange={field.onChange}
                        placeholder="Write your blog post content here..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Blog Post'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

