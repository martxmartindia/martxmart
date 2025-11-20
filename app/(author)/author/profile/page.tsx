"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ImageUpload } from "@/components/imageUpload"
import { useAuthor } from "@/store/author"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function AuthorProfilePage() {
  const router = useRouter()
  const {author,isLoading,updateAuthor} = useAuthor()
  const [isLoadings, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      profileImage: "",
    },
  })

  useEffect(() => {
    if (!author && isLoading) {
      router.push("/")
      return
    }

    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/author/profile")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch profile")
        }

        form.reset({
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
          profileImage: data.profileImage || "",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    if (author) {
      fetchProfile()
    }
  }, [author, router, form])

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/author/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile")
      }

      toast.success("Profile updated successfully")

      // Update user in auth context
      if (updateAuthor) {
        updateAuthor({
          ...author,
          name: data.name,
          email: data.email,
        })
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadings) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-2" />
        <span className="text-lg text-gray-700">Loading profile...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Author Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your author profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell readers about yourself"
                            className="resize-none h-32"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>This will be displayed on your author page</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Upload your author profile picture</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUpload
                            value={field.value ? [field.value] : []}
                            onChange={(urls) => {
                              field.onChange(urls[0] || "")
                              form.handleSubmit(onSubmit)()
                            }}
                            maxImages={1}
                            label="Upload profile picture"
                          />
                        </FormControl>
                        <FormDescription>Recommended size: 400x400 pixels</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

