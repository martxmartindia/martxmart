"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Star, ThumbsUp, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { useAuth } from "@/store/auth"

interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  comment: string
  createdAt: string
  user: {
    name: string
  }
}

export default function ProductReviews({ productId }: { productId: string }) {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/products/${productId}/reviews`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch reviews")
      }

      setReviews(data.reviews || [])

      // Check if user has already reviewed this product
      if (user) {
        const userReview = data.reviews.find((review: Review) => review.userId === user.id)
        if (userReview) {
          setUserReview(userReview)
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRatingChange = (rating: number) => {
    setNewReview({ ...newReview, rating })
  }

  const handleSubmitReview = async () => {
    if (!user) {
      toast.info("Please login to submit a review")
      router.push("/auth/login?redirect=" + encodeURIComponent(`/products/${productId}`))
      return
    }

    if (!newReview.comment.trim()) {
      toast.info("Please add a comment before submitting")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review")
      }

      toast.success("Review submitted successfully")

      setNewReview({
        rating: 5,
        comment: "",
      })

      fetchReviews()
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <ReviewsSkeleton />
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Customer Reviews</h3>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{review.user.name}</p>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-orange-400 text-orange-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful
                </Button>
              </div>
              <p className="mt-3 text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {!userReview && (
        <div className="mt-8 border-t pt-6">
          <h4 className="font-medium mb-4">Write a Review</h4>
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-2">Rating</p>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} type="button" onClick={() => handleRatingChange(i + 1)} className="p-1">
                    <Star
                      className={`h-6 w-6 ${
                        i < newReview.rating ? "fill-orange-400 text-orange-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm mb-2">Review</p>
              <Textarea
                placeholder="Share your experience with this product..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows={4}
              />
            </div>
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting || authLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Customer Reviews</h3>

      {[1, 2, 3].map((i) => (
        <div key={i} className="border-b pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="ml-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
        </div>
      ))}
    </div>
  )
}

