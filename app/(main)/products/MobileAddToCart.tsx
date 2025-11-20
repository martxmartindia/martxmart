'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useCart } from '@/store/cart'

interface Product {
  id: string
  name: string
  price: number | string
  images: string[]
  stock: number
}

export default function MobileAddToCart({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!product.stock) {
      toast.error('Product is out of stock')
      return
    }

    setIsLoading(true)

    try {
      const price = typeof product.price === 'string' ? Number.parseFloat(product.price) : product.price

          addItem(product.id, 1);

      
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add product to cart')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={!product.stock || isLoading}
      className="bg-[#F7CA00] hover:bg-[#F0B800] text-black px-4"
      size="sm"
    >
      <ShoppingCart className="h-4 w-4" />
    </Button>
  )
}