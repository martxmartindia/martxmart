"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useAuth } from "@/store/auth"

interface ShoppingContextType {
  cartCount: number
  wishlistCount: number
  appliedCoupon: { code: string; discount: number; discountAmount: number } | null
  updateCartCount: () => void
  updateWishlistCount: () => void
  applyCoupon: (coupon: { code: string; discount: number; discountAmount: number }) => void
  removeCoupon: () => void
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined)

export function ShoppingProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; discountAmount: number } | null>(null)
  const { user } = useAuth()

  const updateCartCount = async () => {
    try {
      const response = await fetch("/api/shopping/cart", {
        credentials: "include"
      })
      if (response.ok) {
        const data = await response.json()
        setCartCount(data.summary.itemCount || 0)
      }
    } catch (error) {
      console.error("Error fetching cart count:", error)
    }
  }

  const updateWishlistCount = async () => {
    try {
      const response = await fetch("/api/shopping/wishlist", {
        credentials: "include"
      })
      if (response.ok) {
        const data = await response.json()
        setWishlistCount(data.length || 0)
      }
    } catch (error) {
      console.error("Error fetching wishlist count:", error)
    }
  }

  useEffect(() => {
    if (user) {
      updateCartCount()
      updateWishlistCount()
    } else {
      setCartCount(0)
      setWishlistCount(0)
    }
  }, [user])

  const applyCoupon = (coupon: { code: string; discount: number; discountAmount: number }) => {
    setAppliedCoupon(coupon)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  return (
    <ShoppingContext.Provider value={{ 
      cartCount, 
      wishlistCount, 
      appliedCoupon,
      updateCartCount, 
      updateWishlistCount,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </ShoppingContext.Provider>
  )
}

export function useShopping() {
  const context = useContext(ShoppingContext)
  if (context === undefined) {
    throw new Error("useShopping must be used within a ShoppingProvider")
  }
  return context
}