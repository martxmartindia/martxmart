"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function NewAuthorPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const authorData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      bio: formData.get("bio"),
      specialty: formData.get("specialty"),
      status: "PENDING"
    }

    try {
      const response = await fetch("/api/admin/authors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authorData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Author created successfully")
        router.push("/admin/authors")
      } else {
        toast.error(data.error || "Failed to create author")
      }
    } catch (error) {
      console.error("Error creating author:", error)
      toast.error("Failed to create author")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Add New Author</h1>
        <p className="text-muted-foreground">Create a new content creator account</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Author Details</CardTitle>
          <CardDescription>Enter the author's information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Enter author's name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter author's email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter author's password"
                />
              </div>

              <div>
                <Label htmlFor="specialty">Specialty</Label>
                <Select name="specialty" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select author's specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                    <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                    <SelectItem value="FINANCE">Finance</SelectItem>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Enter author's bio"
                  className="h-32"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Author
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}