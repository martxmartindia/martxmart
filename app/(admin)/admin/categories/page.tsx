"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Search, Edit, Trash2, ChevronDown, ChevronRight, Package } from "lucide-react"
import { toast } from "sonner"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface Category {
  id: string
  name: string
  slug?: string
  type: 'MACHINE' | 'SHOP'
  isFestival: boolean
  festivalType?: string
  createdAt: string
  updatedAt: string
  productCount: number
  shoppingCount: number
  subcategories: Subcategory[]
}

interface Subcategory {
  id: string
  name: string
  slug?: string
  productCount: number
  shoppingCount: number
  products: Product[]
  shopping: Product[]
}

interface Product {
  id: string
  name: string
  slug?: string
  price: number
  originalPrice?: number
  stock: number
  images: string[]
  brand?: string
  manufacturer?: string
  isAvailable?: boolean
  isFeatured?: boolean
  featured?: boolean
  averageRating?: number
  _count?: {
    reviews: number
    orderItems: number
  }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<'MACHINE' | 'SHOP' | 'ALL'>('ALL')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set())
  
  // Dialog states
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [isAddSubcategoryDialogOpen, setIsAddSubcategoryDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null)
  
  // Form states
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: 'MACHINE' as 'MACHINE' | 'SHOP',
    isFestival: false,
    festivalType: "",
  })

  const [newSubcategory, setNewSubcategory] = useState({
    name: "",
    parentId: "",
  })

  useEffect(() => {
    fetchCategories()
  }, [selectedType])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('includeSubcategories', 'true')
      params.set('includeProducts', 'true')
      if (selectedType !== 'ALL') {
        params.set('type', selectedType)
      }

      const response = await fetch(`/api/admin/categories?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch categories")
      }

      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to load categories")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create category")
      }

      toast.success("Category created successfully")
      setIsAddCategoryDialogOpen(false)
      setNewCategory({
        name: "",
        type: 'MACHINE',
        isFestival: false,
        festivalType: "",
      })
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message || "Failed to create category")
    }
  }

  const handleCreateSubcategory = async () => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newSubcategory,
          type: selectedType === 'ALL' ? 'MACHINE' : selectedType,
          parentId: newSubcategory.parentId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create subcategory")
      }

      toast.success("Subcategory created successfully")
      setIsAddSubcategoryDialogOpen(false)
      setNewSubcategory({
        name: "",
        parentId: "",
      })
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message || "Failed to create subcategory")
    }
  }

  const handleUpdateCategory = async () => {
    const itemToUpdate = selectedSubcategory || selectedCategory
    if (!itemToUpdate) return

    try {
      const response = await fetch(`/api/admin/categories/${itemToUpdate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemToUpdate),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update category")
      }

      toast.success(`${selectedSubcategory ? 'Subcategory' : 'Category'} updated successfully`)
      setIsEditDialogOpen(false)
      setSelectedCategory(null)
      setSelectedSubcategory(null)
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message || "Failed to update category")
    }
  }

  const handleDeleteCategory = async () => {
    const itemToDelete = selectedSubcategory || selectedCategory
    if (!itemToDelete) return

    try {
      const response = await fetch(`/api/admin/categories/${itemToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete category")
      }

      toast.success(`${selectedSubcategory ? 'Subcategory' : 'Category'} deleted successfully`)
      setIsDeleteDialogOpen(false)
      setSelectedCategory(null)
      setSelectedSubcategory(null)
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category")
    }
  }

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleSubcategoryExpansion = (subcategoryId: string) => {
    const newExpanded = new Set(expandedSubcategories)
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId)
    } else {
      newExpanded.add(subcategoryId)
    }
    setExpandedSubcategories(newExpanded)
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.subcategories.some(sub => 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const getProductCount = (category: Category) => {
    return category.type === 'SHOP' ? category.shoppingCount : category.productCount
  }

  const getSubcategoryProductCount = (subcategory: Subcategory, categoryType: string) => {
    return categoryType === 'SHOP' ? subcategory.shoppingCount : subcategory.productCount
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Categories & Products</h1>
        <div className="flex gap-2">
          <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>Create a new product category</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter category name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Category Type</Label>
                  <Select value={newCategory.type} onValueChange={(value: 'MACHINE' | 'SHOP') => setNewCategory({ ...newCategory, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MACHINE">Machine/Equipment</SelectItem>
                      <SelectItem value="SHOP">Shopping Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFestival"
                    checked={newCategory.isFestival}
                    onChange={(e) => setNewCategory({ ...newCategory, isFestival: e.target.checked })}
                  />
                  <Label htmlFor="isFestival">Festival Category</Label>
                </div>
                {newCategory.isFestival && (
                  <div className="space-y-2">
                    <Label htmlFor="festivalType">Festival Type</Label>
                    <Input
                      id="festivalType"
                      placeholder="e.g., Diwali, Holi, Eid"
                      value={newCategory.festivalType}
                      onChange={(e) => setNewCategory({ ...newCategory, festivalType: e.target.value })}
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory}>Create Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search categories and subcategories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={(value: 'MACHINE' | 'SHOP' | 'ALL') => setSelectedType(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="MACHINE">Machines</SelectItem>
                <SelectItem value="SHOP">Shopping</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Categories Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Category Hierarchy</CardTitle>
          <CardDescription>Manage categories, subcategories, and products</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-2" />
              <span className="text-lg text-gray-700">Loading categories...</span>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No categories found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Collapsible
                        open={expandedCategories.has(category.id)}
                        onOpenChange={() => toggleCategoryExpansion(category.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            {expandedCategories.has(category.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </Collapsible>
                      <div>
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={category.type === 'SHOP' ? 'default' : 'secondary'}>
                            {category.type}
                          </Badge>
                          {category.isFestival && (
                            <Badge variant="outline">Festival: {category.festivalType}</Badge>
                          )}
                          <span className="text-sm text-gray-500">
                            {getProductCount(category)} products
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setNewSubcategory({ ...newSubcategory, parentId: category.id })}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Subcategory
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Subcategory</DialogTitle>
                            <DialogDescription>Create a subcategory for {category.name}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="subcategory-name">Subcategory Name</Label>
                              <Input
                                id="subcategory-name"
                                placeholder="Enter subcategory name"
                                value={newSubcategory.name}
                                onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddSubcategoryDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleCreateSubcategory}>Create Subcategory</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setSelectedCategory(category)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  <Collapsible open={expandedCategories.has(category.id)}>
                    <CollapsibleContent className="mt-4">
                      <div className="ml-8 space-y-3">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="border rounded p-3 bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Collapsible
                                  open={expandedSubcategories.has(subcategory.id)}
                                  onOpenChange={() => toggleSubcategoryExpansion(subcategory.id)}
                                >
                                  <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                                      {expandedSubcategories.has(subcategory.id) ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </CollapsibleTrigger>
                                </Collapsible>
                                <div>
                                  <h4 className="font-medium">{subcategory.name}</h4>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Package className="h-3 w-3 text-gray-400" />
                                    <span className="text-sm text-gray-500">
                                      {getSubcategoryProductCount(subcategory, category.type)} products
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedSubcategory(subcategory)
                                    setIsEditDialogOpen(true)
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    setSelectedSubcategory(subcategory)
                                    setIsDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Products */}
                            <Collapsible open={expandedSubcategories.has(subcategory.id)}>
                              <CollapsibleContent className="mt-3">
                                <div className="ml-6 space-y-2">
                                  {category.type === 'SHOP' ? (
                                    subcategory.shopping?.length > 0 ? (
                                      subcategory.shopping.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                          <div className="flex items-center space-x-3">
                                            <Image
                                              src={product.images[0] || '/placeholder.svg'}
                                              alt={product.name}
                                              className="w-8 h-8 rounded object-cover"
                                            />
                                            <div>
                                              <span className="font-medium text-sm">{product.name}</span>
                                              <div className="text-xs text-gray-500">
                                                ₹{product.price} • {product.stock} in stock
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <Badge variant={product.isAvailable ? 'default' : 'secondary'} className="text-xs">
                                              {product.isAvailable ? 'Active' : 'Inactive'}
                                            </Badge>
                                            {product.isFeatured && (
                                              <Badge variant="outline" className="text-xs">Featured</Badge>
                                            )}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-sm text-gray-500 italic p-2">No products in this subcategory</div>
                                    )
                                  ) : (
                                    subcategory.products?.length > 0 ? (
                                      subcategory.products.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                          <div className="flex items-center space-x-3">
                                            <Image
                                              src={product.images[0] || '/placeholder.svg'}
                                              alt={product.name}
                                              className="w-8 h-8 rounded object-cover"
                                            />
                                            <div>
                                              <span className="font-medium text-sm">{product.name}</span>
                                              <div className="text-xs text-gray-500">
                                                ₹{product.price} • {product.stock} in stock
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <Badge variant={product.featured ? 'default' : 'secondary'} className="text-xs">
                                              {product.featured ? 'Featured' : 'Regular'}
                                            </Badge>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-sm text-gray-500 italic p-2">No products in this subcategory</div>
                                    )
                                  )}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        ))}
                        {category.subcategories.length === 0 && (
                          <div className="text-sm text-gray-500 italic ml-6">No subcategories</div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Category/Subcategory Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {selectedSubcategory ? 'Subcategory' : 'Category'}</DialogTitle>
            <DialogDescription>Update {selectedSubcategory ? 'subcategory' : 'category'} details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{selectedSubcategory ? 'Subcategory' : 'Category'} Name</Label>
              <Input
                id="edit-name"
                placeholder={`Enter ${selectedSubcategory ? 'subcategory' : 'category'} name`}
                value={selectedCategory?.name || selectedSubcategory?.name || ""}
                onChange={(e) => {
                  if (selectedSubcategory) {
                    setSelectedSubcategory({ ...selectedSubcategory, name: e.target.value })
                  } else {
                    setSelectedCategory({ ...selectedCategory, name: e.target.value })
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory}>
              Update {selectedSubcategory ? 'Subcategory' : 'Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category/Subcategory Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedSubcategory ? 'Subcategory' : 'Category'}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the {selectedSubcategory ? 'subcategory' : 'category'} "{selectedCategory?.name || selectedSubcategory?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete {selectedSubcategory ? 'Subcategory' : 'Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
