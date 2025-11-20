"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CareerForm } from "../../components/career-form"
import { toast } from "sonner"
import { useParams } from "next/navigation"

export default function EditCareerPage() {
  const [career, setCareer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const response = await fetch(`/api/careers/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch career details")
        const data = await response.json()

        // Format the array fields back to strings for the form
        const formattedData = {
          ...data,
          responsibilities: data.responsibilities.join("\n"),
          requirements: data.requirements.join("\n"),
          benefits: data.benefits.join("\n"),
        }

        setCareer(formattedData)
      } catch (error) {
        console.error("Error:", error)
        toast.error("Failed to load job posting")
        router.push("/admin/careers")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCareer()
  }, [params.id, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
        </div>
      </div>
    )
  }

  if (!career) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Job Posting</h1>
      <CareerForm initialData={career} />
    </div>
  )
}