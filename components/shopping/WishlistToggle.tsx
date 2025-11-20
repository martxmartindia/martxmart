"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useShopping } from "@/store/shopping"

interface WishlistToggleProps {
  productId: string
  isInWishlist?: boolean
  className?: string
}

export function WishlistToggle({ productId, isInWishlist = false, className }: WishlistToggleProps) {
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist)
  const [loading, setLoading] = useState(false)
  const { updateWishlistCount } = useShopping()

  const toggleWishlist = async () => {
    setLoading(true)
    try {
      if (isWishlisted) {
        const response = await fetch(`/api/shopping/wishlist?shoppingId=${productId}`, {
          method: "DELETE",
          credentials: "include"
        })
        if (response.ok) {
          setIsWishlisted(false)
          updateWishlistCount()
        }
      } else {
        const response = await fetch("/api/shopping/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ shoppingId: productId }),
        })
        if (response.ok) {
          setIsWishlisted(true)
          updateWishlistCount()
        } else if (response.status === 401) {
          window.location.href = "/auth/login"
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleWishlist}
      disabled={loading}
      className={className}
    >
      <Heart
        className={`h-4 w-4 ${
          isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
        }`}
      />
    </Button>
  )
}