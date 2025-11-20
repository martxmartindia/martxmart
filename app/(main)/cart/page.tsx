"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useCart } from "@/store/cart"

export default function CartPage() {
  const router = useRouter()
  const { items, updateItem, removeItem, clearCart, applyCoupon, removeCoupon, appliedCoupon, isLoading } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return
    updateItem(id, quantity)
  }

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id)
    toast.success(`${name} removed from cart`)
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code")
      return
    }

    setCouponLoading(true)
    await applyCoupon(couponCode)
    setCouponLoading(false)
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    setCouponCode("")
  }

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * (item.quantity || 1), 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    return Math.max(0, subtotal - (appliedCoupon?.discountAmount || 0))
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }
    router.push("/checkout")
  }

  const handleGenerateQuotation = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }
    
    const quotationData = {
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price,
        image: item.image
      })),
      subtotal: calculateSubtotal(),
      discount: appliedCoupon?.discountAmount || 0,
      total: calculateTotal()
    }
    
    localStorage.setItem('quotationData', JSON.stringify(quotationData))
    router.push("/quotations")
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-2" />
            <span className="text-lg text-gray-700">Loading your cart...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingCart className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven&apos;t added any products to your cart yet.</p>
            <Button className="bg-orange-600 hover:bg-orange-700" size="lg" onClick={() => router.push("/products")}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Cart Items ({items.reduce((total, item) => total + (item.quantity || 1), 0)})
                    </h2>
                    <Button variant="ghost" className="text-red-600" onClick={() => clearCart()}>
                      Clear Cart
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-200">
                            <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 rounded-md overflow-hidden">
                              <Image
                                src={item.image || "/logo.png"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex flex-col sm:flex-row justify-between">
                                <div>
                                  <Link
                                    href={`/products/${item.id}`}
                                    className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                                  >
                                    {item.name}
                                  </Link>
                                  <p className="text-gray-600 text-sm mt-1">
                                    Unit Price: ₹{item.price.toLocaleString()}
                                  </p>
                                </div>
                                <div className="mt-2 sm:mt-0 text-right">
                                  <p className="text-lg font-bold text-orange-600">
                                    ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
                                <div className="flex items-center">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-r-none"
                                    onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                                    disabled={(item.quantity || 1) <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <div className="h-8 w-12 flex items-center justify-center border-y border-gray-300">
                                    {item.quantity || 1}
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-l-none"
                                    onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 mt-2 sm:mt-0"
                                  onClick={() => handleRemoveItem(item.id, item.name)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  <span>Remove</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div> 

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-20">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{calculateSubtotal().toLocaleString()}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span className="flex items-center">
                          Discount ({appliedCoupon.discount}%)
                          <button 
                            className="ml-2 text-xs text-red-600 hover:text-red-800"
                            onClick={handleRemoveCoupon}
                          >
                            Remove
                          </button>
                        </span>
                        <span className="font-medium">-₹{appliedCoupon.discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-orange-600">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Coupon Section */}
                  {!appliedCoupon && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Have a coupon code?</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                        >
                          {couponLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      size="lg"
                      onClick={handleCheckout}
                    >
                      Continue to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                      size="lg"
                      onClick={handleGenerateQuotation}
                    >
                      Generate Quotation
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}