"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {toast} from 'sonner'
import { useCart } from "@/store/cart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  id: string
  name: string
  price: number | string
  images: string[]
  stock: number
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState("1")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!product.stock) {
      toast.error("Product is out of stock")
      return
    }

    setIsLoading(true)

    try {
      // Convert price to number if it's a string
      const price = typeof product.price === "string" ? Number.parseFloat(product.price) : product.price

      addItem(product.id, 1);

    } catch (error) {
      toast.error("Failed to add product to cart")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="text-sm mr-2">Qty:</span>
        <Select value={quantity} onValueChange={setQuantity} disabled={!product.stock || isLoading}>
          <SelectTrigger className="w-20 h-8">
            <SelectValue placeholder="1" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: Math.min(10, product.stock || 0) }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={!product.stock || isLoading}
        className="w-full bg-[#F7CA00] hover:bg-[#F0B800] text-black"
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isLoading ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  )
}

