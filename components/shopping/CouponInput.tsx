"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Tag } from "lucide-react"

interface CouponInputProps {
  cartTotal: number
  onCouponApply: (coupon: { code: string; discount: number; discountAmount: number }) => void
  onCouponRemove: () => void
  appliedCoupon?: { code: string; discount: number; discountAmount: number } | null
}

export function CouponInput({ cartTotal, onCouponApply, onCouponRemove, appliedCoupon }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const validateCoupon = async () => {
    if (!couponCode.trim()) return
    
    setLoading(true)
    setError("")
    
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          code: couponCode.trim(),
          cartTotal,
        }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        onCouponApply({
          code: data.coupon.code,
          discount: data.coupon.discount,
          discountAmount: data.coupon.discountAmount,
        })
        setCouponCode("")
      } else {
        setError(data.error || "Invalid coupon code")
      }
    } catch (error) {
      setError("Failed to validate coupon")
    } finally {
      setLoading(false)
    }
  }

  const removeCoupon = () => {
    onCouponRemove()
    setError("")
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            {appliedCoupon.code} ({appliedCoupon.discount}% off)
          </span>
          <Badge variant="secondary" className="text-green-700">
            -₹{Number(appliedCoupon.discountAmount || 0).toFixed(2)}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={removeCoupon}
          className="text-green-600 hover:text-green-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Input
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          className="flex-1"
        />
        <Button
          onClick={validateCoupon}
          disabled={loading || !couponCode.trim()}
          variant="outline"
        >
          {loading ? "Applying..." : "Apply"}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}