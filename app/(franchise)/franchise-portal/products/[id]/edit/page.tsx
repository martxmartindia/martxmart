"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, Trash2, Plus, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
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
export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    stock: "",
    images: [] as string[],
    featured: false,
    brand: "",
    modelNumber: "",
    hsnCode: "",
    gstPercentage: "",
    dimensions: "",
    weight: "",
    specifications: "",
  })

  // Fetch product details and categories
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true)

        // Fetch product details
        const productResponse = await fetch(`/api/franchise-portal/products/${productId}`)
        if (!productResponse.ok) {
          throw new Error("Failed to fetch product details")
        }
        const productData = await productResponse.json()

        // Fetch categories for dropdown
        const categoriesResponse = await fetch(`/api/franchise-portal/products?franchiseId=fr-001`)
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories")
        }
        const categoriesData = await categoriesResponse.json()

        setCategories(categoriesData.categories || [])

        // Set form data
        setFormData({
          name: productData.name || "",
          description: productData.description || "",
          categoryId: productData.categoryId || "",
          price: productData.price?.toString() || "",
          stock: productData.stock?.toString() || "",
          images: productData.images || [],
          featured: productData.featured || false,
          brand: productData.brand || "",
          modelNumber: productData.modelNumber || "",
          hsnCode: productData.hsnCode || "",
          gstPercentage: productData.gstPercentage?.toString() || "",
          dimensions: productData.dimensions || "",
          weight: productData.weight?.toString() || "",
          specifications: productData.specifications || "",
        })
      } catch (error) {
        console.error("Error fetching product data:", error)
        toast.error("Failed to fetch product data")
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProductData()
    }
  }, [productId, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAddImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }))
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData((prev) => ({ ...prev, images: newImages }))
  }

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, images: newImages }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSaving(true)

      // Validate form data
      if (!formData.name || !formData.categoryId || !formData.price) {
        toast.error("Please fill in all required fields")
        return
      }

      // Prepare data for API
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        gstPercentage: formData.gstPercentage ? Number.parseFloat(formData.gstPercentage) : 18,
        weight: formData.weight ? Number.parseFloat(formData.weight) : null,
      }

      // Update product
      const response = await fetch(`/api/franchise-portal/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error("Failed to update product")
      }

      const data = await response.json()

      toast.success("Product updated successfully")

      // Navigate back to product details
      router.push(`/franchise-portal/products/${productId}`)
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`/api/franchise-portal/products/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      toast.success("Product deleted successfully")

      // Navigate back to products list
      router.push("/franchise-portal/products")
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product")
    } finally {
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
        <p className="text-gray-500">Loading product data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Product</h2>
          <p className="text-gray-500">Update product information and details</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/franchise-portal/products/${productId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
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
                <Button variant="destructive" onClick={handleDeleteProduct}>
                  Delete Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button className="bg-orange-600 hover:bg-orange-700" size="sm" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="details">Details & Specifications</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Edit the basic details of your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => handleSelectChange("categoryId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price (₹) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                    />
                  </div>
                  <div className="space-y-2 flex items-center justify-between">
                    <Label htmlFor="featured">Featured Product</Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Add detailed specifications and information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" name="brand" value={formData.brand} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modelNumber">Model Number</Label>
                    <Input
                      id="modelNumber"
                      name="modelNumber"
                      value={formData.modelNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hsnCode">HSN Code</Label>
                    <Input id="hsnCode" name="hsnCode" value={formData.hsnCode} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gstPercentage">GST Percentage (%)</Label>
                    <Input
                      id="gstPercentage"
                      name="gstPercentage"
                      type="number"
                      value={formData.gstPercentage}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleInputChange}
                      placeholder="e.g. 10 x 20 x 5 cm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="specifications">Specifications</Label>
                    <Textarea
                      id="specifications"
                      name="specifications"
                      value={formData.specifications}
                      onChange={handleInputChange}
                      rows={8}
                      placeholder="Enter detailed product specifications..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Add and manage product images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="Enter image URL"
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveImage(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={handleAddImage} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                </div>

                {formData.images.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Image Preview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="aspect-square rounded-md overflow-hidden border">
                          <Image
                            src={image || "/placeholder.svg?height=200&width=200"}
                            alt={`Product image ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/franchise-portal/products/${productId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>

          <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
