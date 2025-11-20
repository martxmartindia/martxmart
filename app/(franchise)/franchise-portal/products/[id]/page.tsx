"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Tag,
  Truck,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
  Info,
  BarChart4,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import Image from "next/image"
export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/franchise-portal/products/${productId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch product details")
        }

        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product details:", error)
        toast.error("Failed to fetch product details")
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProductDetails()
    }
  }, [productId, toast])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            In Stock
          </Badge>
        )
      case "low-stock":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Low Stock
          </Badge>
        )
      case "out-of-stock":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Out of Stock
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleDeleteProduct = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/franchise-portal/products/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      const data = await response.json()

      toast.success("Product deleted successfully")

      // Navigate back to products page
      router.push("/franchise-portal/products")
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
        <p className="text-gray-500">Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-4">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/franchise-portal/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/franchise-portal/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{product.name}</h2>
            <div className="flex items-center gap-2">
              <p className="text-gray-500">SKU: {product.sku}</p>
              {getStockStatusBadge(product.stockStatus)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/franchise-portal/products/${productId}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this product? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteProduct} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete Product"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Detailed information about this product</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p>{product.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p>{product.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Price</h3>
                    <p>{formatCurrency(product.price)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Stock</h3>
                    <p>{product.stock} units</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Brand</h3>
                    <p>{product.brand || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Model Number</h3>
                    <p>{product.modelNumber || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">HSN Code</h3>
                    <p>{product.hsnCode || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">GST Percentage</h3>
                    <p>{product.gstPercentage || "18"}%</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1">{product.description}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="space-y-6 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Dimensions</h3>
                    <p>{product.dimensions || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                    <p>{product.weight ? `${product.weight} kg` : "N/A"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Specifications</h3>
                    <p className="mt-1 whitespace-pre-line">
                      {product.specifications || "No specifications available"}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-6 pt-4">
                {product.images && product.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.images.map((image: string, index: number) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden border">
                        <Image
                          src={image || "/placeholder.svg?height=200&width=200"}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 border rounded-md">
                    <Info className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">No images available for this product</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Price</span>
                  <span className="font-medium">{formatCurrency(product.price)}</span>
                </div>
                {product.originalPrice && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Original Price</span>
                    <span className="line-through text-gray-500">{formatCurrency(product.originalPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">GST ({product.gstPercentage || 18}%)</span>
                  <span>{formatCurrency((product.price * (product.gstPercentage || 18)) / 100)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(product.price * (1 + (product.gstPercentage || 18) / 100))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Stock Level</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">{product.stock} units available</p>
                      {getStockStatusBadge(product.stockStatus)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">SKU</p>
                    <p className="text-sm text-gray-500">{product.sku}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Shipping</p>
                    <p className="text-sm text-gray-500">Standard shipping available</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Create Order with this Product
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BarChart4 className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Sales Overview</p>
                    <p className="text-sm text-gray-500">42 units sold this month</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Conversion Rate</p>
                    <p className="text-sm text-gray-500">24% of views convert to sales</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <BarChart4 className="mr-2 h-4 w-4" />
                View Full Analytics
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/franchise-portal/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <Button
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => router.push(`/franchise-portal/products/${productId}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Product
        </Button>
      </div>
    </div>
  )
}
