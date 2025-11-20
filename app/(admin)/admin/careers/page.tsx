"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type Career = {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  salary?: string
  postedDate: string
}

export default function AdminCareersPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchCareers()
  }, [searchTerm])

  const fetchCareers = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/careers?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch careers")
      const data = await response.json()
      setCareers(data)
    } catch (error) {
      console.error("Error fetching careers:", error)
      toast.error("Failed to load careers")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return

    try {
      const response = await fetch(`/api/careers/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete career")

      toast.success("Job posting deleted successfully")
      fetchCareers()
    } catch (error) {
      console.error("Error deleting career:", error)
      toast.error("Failed to delete job posting")
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Job Postings</h1>
        <Button onClick={() => router.push("/admin/careers/new")} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" /> Add New Job
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search job postings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
        </div>
      ) : careers.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-600">No job postings found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {careers.map((career) => (
            <Card key={career.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{career.title}</h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary">{career.department}</Badge>
                      <Badge variant="secondary">{career.location}</Badge>
                      <Badge variant="secondary">{career.type}</Badge>
                      {career.salary && <Badge variant="secondary">{career.salary}</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">Posted: {formatDate(career.postedDate)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/careers/${career.id}/edit`)}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(career.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}