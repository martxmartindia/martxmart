"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  Truck, 
  Shield, 
  Clock, 
  Tag, 
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { formatCurrency } from "@/lib/utils"

interface OrderItem {
  id: string
  productId?: string
  shoppingId?: string
  name: string
  quantity: number
  price: number
  image: string | null
  brand?: string
  modelNumber?: string
}

interface Coupon {
  code: string
  discount: number
  discountAmount: number
  type: 'PERCENTAGE' | 'FIXED_AMOUNT'
}

interface OrderSummaryProps {
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  appliedCoupon?: Coupon | null
  showItemDetails?: boolean
  compact?: boolean
  className?: string
}

export default function OrderSummary({
  items,
  subtotal,
  tax,
  shipping,
  total,
  appliedCoupon,
  showItemDetails = true,
  compact = false,
  className = ""
}: OrderSummaryProps) {
  const [showItems, setShowItems] = useState(!compact)
  const [showBreakdown, setShowBreakdown] = useState(!compact)

  const savings = appliedCoupon?.discountAmount || 0
  const finalTotal = total - savings

  return (
    <Card className={`h-fit sticky top-4 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Summary
          </div>
          <Badge variant="outline" className="text-sm">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Items List */}
        {showItemDetails && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Items in your order</h4>
              {compact && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowItems(!showItems)}
                  className="h-auto p-1"
                >
                  {showItems ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              )}
            </div>
            
            {showItems && (
              <div className="max-h-60 overflow-y-auto space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                      {item.image && (
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          width={48} 
                          height={48} 
                          className="w-full h-full object-cover rounded-lg" 
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium truncate">{item.name}</h5>
                      {item.brand && (
                        <p className="text-xs text-gray-600">{item.brand}</p>
                      )}
                      {item.modelNumber && (
                        <p className="text-xs text-gray-500">Model: {item.modelNumber}</p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                        <div className="text-right">
                          <div className="text-xs text-gray-600">
                            {formatCurrency(item.price)} × {item.quantity}
                          </div>
                          <div className="text-sm font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Price Details</h4>
            {compact && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="h-auto p-1"
              >
                {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            )}
          </div>

          {showBreakdown && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({items.length} items)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-green-600">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Discount ({appliedCoupon.code})</span>
                  </div>
                  <span>-{formatCurrency(savings)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <span>Tax (GST 18%)</span>
                  <Info className="w-3 h-3 text-gray-400" />
                </div>
                <span>{formatCurrency(tax)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  <span>Shipping</span>
                </div>
                <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
              </div>

              {shipping === 0 && subtotal >= 500 && (
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Free shipping on orders above ₹500</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* Total */}
        <div className="space-y-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total Amount</span>
            <div className="text-right">
              {savings > 0 && (
                <div className="text-sm text-gray-500 line-through">
                  {formatCurrency(total)}
                </div>
              )}
              <div className="text-orange-600">
                {formatCurrency(finalTotal)}
              </div>
            </div>
          </div>
          
          {savings > 0 && (
            <div className="text-sm text-green-600 text-right">
              You save {formatCurrency(savings)}!
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="text-xs text-gray-500 space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3" />
            <span>Secure checkout with SSL encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>Estimated delivery: 3-5 business days</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-3 h-3" />
            <span>Free returns within 7 days</span>
          </div>
        </div>

        {/* Savings Summary */}
        {savings > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-800">
              <Tag className="w-4 h-4" />
              <span className="font-medium">Great savings!</span>
            </div>
            <div className="text-sm text-green-700 mt-1">
              You're saving {formatCurrency(savings)} with coupon "{appliedCoupon?.code}"
            </div>
          </div>
        )}

        {/* Price Match Guarantee */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <Shield className="w-4 h-4" />
            <span className="font-medium text-sm">Price Match Guarantee</span>
          </div>
          <div className="text-xs text-blue-700 mt-1">
            Found a lower price? We'll match it!
          </div>
        </div>
      </CardContent>
    </Card>
  )
}