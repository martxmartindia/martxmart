"use client"
  
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { useCart } from "@/store/cart"
import { useWishlist } from "@/store/wishlist"
import { toast } from "sonner"

interface UnitProductCardProps {
    product: {
        id: string
        name: string
        slug: string
        price: number
        images: string[]
    }
}

export default function UnitProductCard({ product }: UnitProductCardProps) {
    const { addItem } = useCart()
    const { addItem: addToWishlist, removeItem: removeFromWishlist, hasItem: isInWishlist } = useWishlist()
    const [isWishlisted, setIsWishlisted] = useState(false)

    useEffect(() => {
        setIsWishlisted(isInWishlist(product.id))
    }, [product.id, isInWishlist])

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        addItem(product.id, 1)
        toast.success("Added to cart")
    }

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (isWishlisted) {
            removeFromWishlist(product.id)
            toast.success("Removed from wishlist")
        } else {
            addToWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images && product.images.length > 0 ? product.images[0] : "",
            })
            toast.success("Added to wishlist")
        }
        setIsWishlisted(!isWishlisted)
    }

    return (
        <Link
            href={`/product/${product.slug}`}
            className="block bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow border border-gray-100 group relative"
        >
            <div className="aspect-square relative bg-white">
                <Image
                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/300x300'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                    onClick={toggleWishlist}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10 shadow-sm opacity-0 group-hover:opacity-100"
                >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                </button>
            </div>
            <div className="p-4">
                <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2 min-h-[48px]">
                    {product.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                    <div className="text-primary font-bold">
                        ₹{product.price.toLocaleString()}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-200"
                        title="Add to Cart"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Link>
    )
}
