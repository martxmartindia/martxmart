import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, MapPin, ShieldCheck, Star, Truck, Share2, Heart, Facebook, Twitter, MessageCircle, Copy, Check } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { getProductById, getRelatedProducts } from "@/lib/products"
import AddToCartButton from "../AddTocart"
import ProductImageGallery from "../ProductImageCallery"
import ProductReviews from "../ProductReview"
import SocialShareButtons from "../SocialShareButtons"
import MobileAddToCart from "../MobileAddToCart"

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  categoryId: string
  category: { name: string }
  brand: string | null | undefined
  modelNumber: string | null | undefined
  stock: number
  averageRating: number | null | undefined
  reviewCount: number | null | undefined
  discountPercentage: number | null | undefined
  specifications: string | null | undefined
  dimensions: string | null | undefined
  weight: string | null | undefined
  material: string | null | undefined
  warranty: string | null | undefined
  madeIn: string | null | undefined
  applications: string[] | null | undefined
  certifications: string[] | null | undefined
  createdAt: Date | null | undefined
  updatedAt: Date | null | undefined
  discountStartDate: Date | null | undefined
  discountEndDate: Date | null | undefined
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  // Convert Decimal and Date objects to plain values
  const serializedProduct = {
    ...product,
    price: Number(product.price),
    createdAt: product.createdAt ?? undefined,
    updatedAt: product.updatedAt ?? undefined,
    discountStartDate: product.discountStartDate ?? undefined,
    discountEndDate: product.discountEndDate ?? undefined
  } as unknown as Product

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 max-w-7xl">
        <Suspense fallback={<ProductDetailSkeleton />}>
          <ProductDetail product={serializedProduct} />
        </Suspense>
      </div>
    </div>
  )
}

function ProductDetail({ product }: { product: Product }) {

  return (
    <div className="space-y-3 sm:space-y-6 pb-20 lg:pb-0">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs sm:text-sm text-gray-500 bg-white p-2 sm:p-3 rounded-lg shadow-sm overflow-x-auto">
        <Link href="/" className="hover:text-primary whitespace-nowrap">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 mx-1 flex-shrink-0" />
        <Link href="/products" className="hover:text-primary whitespace-nowrap">
          Products
        </Link>
        <ChevronRight className="h-3 w-3 mx-1 flex-shrink-0" />
        <Link href={`/products?category=${product.categoryId}`} className="hover:text-primary whitespace-nowrap">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3 w-3 mx-1 flex-shrink-0" />
        <span className="text-gray-700 truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
        {/* Product Images */}
        <div className="lg:col-span-7 bg-white p-3 sm:p-6 rounded-lg shadow-sm">
          <ProductImageGallery images={product.images} />
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-tight pr-4">{product.name}</h1>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="outline" size="sm" className="p-2">
                  <Heart className="h-4 w-4" />
                </Button>
                <SocialShareButtons product={product} />
              </div>
            </div>
            <Link href="#reviews" className="text-primary text-sm hover:underline">
              <div className="flex items-center flex-wrap gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= (product.averageRating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-primary font-medium">
                  {product.averageRating?.toFixed(1) || '0.0'} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </Link>

            <Separator className="my-3" />

            <div className="space-y-2">
              <div className="flex items-baseline flex-wrap gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#B12704]">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.discountPercentage && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg line-through text-gray-500">
                      ₹{(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}
                    </span>
                    <Badge className="bg-red-600 text-white font-semibold">
                      {product.discountPercentage}% OFF
                    </Badge>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600">Inclusive of all taxes • Free shipping</div>
              <div className="flex items-center gap-4 text-sm">
                <div className={`font-semibold ${
                  product.stock > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="space-y-4">
              {(product.modelNumber || product.brand) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                  {product.brand && (
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Brand</span>
                      <p className="font-medium">{product.brand}</p>
                    </div>
                  )}
                  {product.modelNumber && (
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Model</span>
                      <p className="font-medium">{product.modelNumber}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Key Features:</h3>
                <ul className="space-y-2">
                  {product.description
                    .split(". ")
                    .filter(Boolean)
                    .slice(0, 4)
                    .map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Truck className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-semibold text-green-800">FREE Delivery</div>
                  <div className="text-green-700">
                    Get it by{" "}
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-semibold text-blue-800">Delivery Location</div>
                  <div className="text-blue-700">Available across India</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-gray-600 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-semibold text-gray-800">Secure Transaction</div>
                  <div className="text-gray-700">SSL encrypted & secure payment</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <AddToCartButton product={product} />
              {/* <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 text-base">
                Buy Now
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-lg font-bold text-[#B12704]">
              ₹{product.price.toFixed(2)}
            </div>
            <div className="text-xs text-gray-600">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="px-4">
              <Heart className="h-4 w-4" />
            </Button>
            <MobileAddToCart product={product} />
            {/* <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 sm:px-6">
              Buy Now
            </Button> */}
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="description" className="text-xs sm:text-sm py-2 sm:py-3">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" className="text-xs sm:text-sm py-2 sm:py-3">
              Specs
            </TabsTrigger>
            <TabsTrigger value="features" className="text-xs sm:text-sm py-2 sm:py-3">
              Features
            </TabsTrigger>
            <TabsTrigger value="reviews" id="reviews" className="text-xs sm:text-sm py-2 sm:py-3">
              Reviews
            </TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="description" className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Product Description</h3>
              <div className="prose prose-sm sm:prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Technical Specifications</h3>
              <div className="overflow-x-auto">
                {product.specifications && <div dangerouslySetInnerHTML={{ __html: product.specifications }} />}
                {!product.specifications && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-3">
                      {product.brand && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600 font-medium">Brand</span>
                          <span className="text-gray-900">{product.brand}</span>
                        </div>
                      )}
                      {product.modelNumber && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600 font-medium">Model Number</span>
                          <span className="text-gray-900">{product.modelNumber}</span>
                        </div>
                      )}
                      {product.dimensions && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600 font-medium">Dimensions</span>
                          <span className="text-gray-900">{product.dimensions}</span>
                        </div>
                      )}
                      {product.weight && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600 font-medium">Weight</span>
                          <span className="text-gray-900">{product.weight} kg</span>
                        </div>
                      )}
                      {product.material && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600 font-medium">Material</span>
                          <span className="text-gray-900">{product.material}</span>
                        </div>
                      )}
                      {product.warranty && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600 font-medium">Warranty</span>
                          <span className="text-gray-900">{product.warranty}</span>
                        </div>
                      )}
                      {product.madeIn && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600 font-medium">Country of Origin</span>
                          <span className="text-gray-900">{product.madeIn}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="features" className="space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Features & Benefits</h3>
              <div className="space-y-6">
                {product.applications && product.applications.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-blue-900">Applications</h4>
                    <ul className="space-y-2">
                      {product.applications.map((app, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-blue-800">{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.certifications && product.certifications.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-green-900">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              <ProductReviews productId={product.id} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold mb-6">You might also like</h2>
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts productId={product.id} categoryId={product.categoryId} />
        </Suspense>
      </div>
    </div>
  )
}

async function RelatedProducts({ productId, categoryId }: { productId: string; categoryId: string }) {
  const products = await getRelatedProducts(productId, categoryId)

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No related products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`} className="group">
          <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-200">
            <div className="aspect-square relative mb-3 bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={product.images[0] || "/placeholder.svg?height=200&width=200"}
                alt={product.name}
                fill
                className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="space-y-2">
              <p className="line-clamp-2 text-sm font-medium text-gray-900 leading-tight">
                {product.name}
              </p>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= (product.averageRating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-semibold text-[#B12704]">
                  ₹{product.price.toString()}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
        <Skeleton className="h-4 sm:h-6 w-3/4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
        <div className="lg:col-span-7 bg-white p-3 sm:p-6 rounded-lg shadow-sm">
          <Skeleton className="aspect-square w-full" />
        </div>

        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <Skeleton className="h-6 sm:h-8 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-px w-full mb-4" />
            <div className="space-y-2 mb-4">
              <Skeleton className="h-8 sm:h-10 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-px w-full mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm space-y-4">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <Skeleton className="h-10 w-full mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <Skeleton className="h-6 w-1/3 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RelatedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="space-y-2">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
