"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Heart, ShoppingCart, Minus, Plus, Share2, Truck, Shield, RotateCcw, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  originalPrice?: number
  images?: string[]
  brand?: string
  stock: number
  averageRating?: number
  reviewCount?: number
  category?: {
    name: string
    slug: string
  }
}

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    name: string
  }
}

interface RelatedProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  images?: string[]
  category?: {
    name: string
    slug: string
  }
}

interface ApiResponse {
  product: Product
  reviews: Review[]
  relatedProducts: RelatedProduct[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [togglingWishlist, setTogglingWishlist] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/shopping/products/${id}`)
      if (response.ok) {
        const apiData = await response.json()
        setData(apiData)
        
        // Check if in wishlist
        if (session) {
          checkWishlistStatus(id, session.user.id)
        } else {
          const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
          setIsInWishlist(wishlist.includes(id))
        }
      } else {
        toast.error("Product not found")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast.error("Failed to load product")
    } finally {
      setLoading(false)
    }
  }

  const checkWishlistStatus = async (productId: string, token: string) => {
    try {
      const response = await fetch("/api/shopping/wishlist");
      if (response.ok) {
        const wishlistData = await response.json()
        // Handle different response formats
        if (Array.isArray(wishlistData)) {
          setIsInWishlist(wishlistData.some((item: any) => item.shoppingId === productId))
        } else if (wishlistData.items && Array.isArray(wishlistData.items)) {
          setIsInWishlist(wishlistData.items.some((item: any) => item.shoppingId === productId))
        } else {
          setIsInWishlist(false)
        }
      }
    } catch (error) {
      console.error("Error checking wishlist:", error)
      setIsInWishlist(false)
    }
  }

  const addToCart = async () => {
    if (!data?.product) return
    
    if (!session) {
      toast.error("Please login to add items to cart")
      router.push("/auth/login")
      return
    }

    setAddingToCart(true)
    try {
      const response = await fetch("/api/shopping/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shoppingId: data.product.id,
          quantity,
        }),
      })

      if (response.ok) {
        toast.success("Added to cart successfully!")
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to add to cart")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  const toggleWishlist = async () => {
    if (!data?.product) return
    
    if (!session) {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      const newWishlist = isInWishlist
        ? wishlist.filter((id: string) => id !== data.product.id)
        : [...wishlist, data.product.id]
      localStorage.setItem("wishlist", JSON.stringify(newWishlist))
      setIsInWishlist(!isInWishlist)
      toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist")
      return
    }

    setTogglingWishlist(true)
    try {
      if (isInWishlist) {
        const response = await fetch(`/api/shopping/wishlist?shoppingId=${data.product.id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setIsInWishlist(false)
          toast.success("Removed from wishlist")
        }
      } else {
        const response = await fetch("/api/shopping/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shoppingId: data.product.id }),
        })
        if (response.ok) {
          setIsInWishlist(true)
          toast.success("Added to wishlist")
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast.error("Failed to update wishlist")
    } finally {
      setTogglingWishlist(false)
    }
  }

  const shareProduct = async () => {
    if (!data?.product) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.product.name,
          text: data.product.description || `Check out ${data.product.name}`,
          url: window.location.href,
        })
      } catch (error) {
        toast.error("Failed to share the product. Please copy and paste the link manually.")
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Product link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg p-4 mb-6">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 space-y-6">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="flex space-x-3">
                  <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data?.product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product not found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.back()} variant="outline" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Link href="/shopping/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const product = data.product
  const reviews = data.reviews || []
  const relatedProducts = data.relatedProducts || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-600 mb-8 bg-white rounded-lg px-4 py-3 shadow-sm">
          <Link href="/shopping" className="hover:text-orange-600 transition-colors">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/shopping/products" className="hover:text-orange-600 transition-colors">
            Products
          </Link>
          {product.category && (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <Link href={`/shopping/category/${product.category.slug}`} className="hover:text-orange-600 transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-orange-600 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg group">
              <Image
                src={product.images?.[selectedImage] || "/placeholder.png"}
                alt={`${product.name} - Main product image`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200 ${
                      selectedImage === index 
                        ? "ring-2 ring-orange-500 shadow-lg scale-105" 
                        : "hover:shadow-md hover:scale-102"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              {product.category && (
                <Badge variant="outline" className="mb-3 text-orange-600 border-orange-200">
                  {product.category.name}
                </Badge>
              )}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>
              {product.brand && <p className="text-lg text-gray-600 mb-4">by <span className="font-semibold">{product.brand}</span></p>}
            
              {/* Rating */}
              {reviews.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
                      return (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(avgRating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          aria-label={`${i + 1} star rating`}
                        />
                      )
                    })}
                  </div>
                  <span className="text-sm text-gray-600">
                    {(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="space-y-3 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xl text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-green-700 font-semibold">
                      You save ₹{(product.originalPrice - product.price).toLocaleString()} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                    </p>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 px-3 py-1">
                    ✓ In Stock ({product.stock} available)
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="px-3 py-1">Out of Stock</Badge>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                  <span className="font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border-2 rounded-xl bg-gray-50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="hover:bg-gray-200"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-6 py-2 font-semibold text-lg">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="hover:bg-gray-200"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={addToCart}
                  disabled={product.stock === 0 || addingToCart}
                >
                  {addingToCart ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-5 w-5 mr-2" />
                  )}
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  onClick={toggleWishlist}
                  disabled={togglingWishlist}
                  className={`px-4 py-3 rounded-xl transition-all duration-200 ${
                    isInWishlist 
                      ? "text-red-500 border-red-500 bg-red-50 hover:bg-red-100" 
                      : "hover:bg-gray-50"
                  }`}
                  aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {togglingWishlist ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} />
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="px-4 py-3 rounded-xl hover:bg-gray-50" 
                  onClick={shareProduct}
                  aria-label="Share product"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Free Delivery</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <RotateCcw className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">7 Days Return</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1 rounded-none">
              <TabsTrigger value="description" className="rounded-lg">Description</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-lg">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-6">
              <div className="prose max-w-none">
                {product.description ? (
                  <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No description available for this product.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-6">
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-xl p-4 border-l-4 border-orange-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-orange-600">{review.user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">{review.user.name}</span>
                            <div className="flex items-center mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                  aria-label={`${i + 1} star rating`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg mb-2">No reviews yet</p>
                  <p className="text-gray-400">Be the first to review this product!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="shipping" className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="font-semibold mb-4 text-green-800 flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Shipping Information
                  </h4>
                  <ul className="text-green-700 space-y-2">
                    <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Free shipping on orders above ₹999</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Standard delivery: 3-5 business days</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Express delivery: 1-2 business days</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-semibold mb-4 text-blue-800 flex items-center">
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Return Policy
                  </h4>
                  <ul className="text-blue-700 space-y-2">
                    <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>7 days return policy</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Items must be in original condition</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Free return pickup available</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-1 h-8 bg-orange-500 rounded-full mr-3"></span>
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <div className="relative h-48 bg-gray-50">
                    <Image
                      src={relatedProduct.images?.[0] || "/placeholder.png"}
                      alt={`${relatedProduct.name} - Related product image`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
                        {Math.round(((relatedProduct.originalPrice - relatedProduct.price) / relatedProduct.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    {relatedProduct.category && (
                      <Badge variant="outline" className="text-xs mb-2 text-orange-600 border-orange-200">
                        {relatedProduct.category.name}
                      </Badge>
                    )}
                    <Link href={`/shopping/product/${relatedProduct.id}`}>
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 cursor-pointer mb-2 text-sm">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-gray-900">₹{relatedProduct.price.toLocaleString()}</p>
                      {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && (
                        <p className="text-sm text-gray-500 line-through">₹{relatedProduct.originalPrice.toLocaleString()}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}