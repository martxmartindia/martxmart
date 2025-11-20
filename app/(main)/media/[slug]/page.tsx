"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "next/navigation"

type PressRelease = {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
  image?: string
  content: string
}

export default function PressReleaseDetailPage() {
  const [pressRelease, setPressRelease] = useState<PressRelease | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()

  useEffect(() => {
    const fetchPressRelease = async () => {
      try {
        const response = await fetch(`/api/media/press-releases/${params.slug}`)
        if (!response.ok) {
          throw new Error('Failed to fetch press release')
        }
        const data = await response.json()
        setPressRelease(data)
      } catch (error) {
        console.error('Error fetching press release:', error)
        setError('Failed to load press release. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPressRelease()
  }, [params.slug])

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !pressRelease) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {error || 'Press Release Not Found'}
              </h2>
              <p className="text-gray-600 mb-6">
                {error ? 'An error occurred while loading the press release.' : 'The requested press release does not exist.'}
              </p>
              <Link href="/media">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Media Center
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/media">
            <Button variant="ghost" className="mb-8 text-orange-600 hover:text-orange-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Media Center
            </Button>
          </Link>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {pressRelease.image && (
              <div className="relative h-96 w-full">
                <Image
                  src={pressRelease.image}
                  alt={pressRelease.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(pressRelease.date)}</span>
                </div>
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                  {pressRelease.category}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{pressRelease.title}</h1>

              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: pressRelease.content }} />
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <Button variant="outline" className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  Share Press Release
                </Button>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </main>
  )
}