'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/imageUpload';
import { HsnCodeSearch } from '@/components/HsnCodeSearch';
import { toast } from 'sonner';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [productId, setProductId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    images: [] as string[],
    brand: '',
    hsnCode: '',
    isFeatured: false,
    gstPercentage: '',
    categoryId: '',
    isFestival: false,
    festivalType: '',
    weight: '',
    dimensions: '',
    discount: '',
    discountType: 'PERCENTAGE',
    discountStartDate: '',
    discountEndDate: '',
    shippingCharges: '',
    isAvailable: true,
    expiryDate: '',
    attributes: '{}'
  });

  useEffect(() => {
    const initializePage = async () => {
      const resolvedParams = await params;
      setProductId(resolvedParams.id);
      await Promise.all([fetchCategories(), fetchProduct(resolvedParams.id)]);
      setInitialLoading(false);
    };
    initializePage();
  }, [params]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?type=SHOP');
      if (response.ok) {
        const data = await response.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/shopping/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const product = await response.json();
        if (!product) {
          toast.error('Product not found');
          router.push('/admin/shopping/products');
          return;
        }
        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          originalPrice: product.originalPrice?.toString() || '',
          stock: product.stock?.toString() || '',
          images: product.images || [],
          brand: product.brand || '',
          hsnCode: product.hsnCode || '',
          isFeatured: product.isFeatured || false,
          gstPercentage: product.gstPercentage?.toString() || '',
          categoryId: product.categoryId || '',
          isFestival: product.isFestival || false,
          festivalType: product.festivalType || '',
          weight: product.weight?.toString() || '',
          dimensions: product.dimensions || '',
          discount: product.discount?.toString() || '',
          discountType: product.discountType || 'PERCENTAGE',
          discountStartDate: product.discountStartDate ? new Date(product.discountStartDate).toISOString().slice(0, 16) : '',
          discountEndDate: product.discountEndDate ? new Date(product.discountEndDate).toISOString().slice(0, 16) : '',
          shippingCharges: product.shippingCharges?.toString() || '',
          isAvailable: product.isAvailable ?? true,
          expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().slice(0, 10) : '',
          attributes: product.attributes ? JSON.stringify(product.attributes) : '{}'
        });
      } else {
        toast.error('Failed to fetch product');
        router.push('/admin/shopping/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product');
      router.push('/admin/shopping/products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/shopping/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          stock: parseInt(formData.stock) || 0,
          gstPercentage: formData.gstPercentage ? parseFloat(formData.gstPercentage) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          discount: formData.discount ? parseFloat(formData.discount) : 0,
          shippingCharges: formData.shippingCharges ? parseFloat(formData.shippingCharges) : null,
          discountStartDate: formData.discountStartDate ? new Date(formData.discountStartDate).toISOString() : null,
          discountEndDate: formData.discountEndDate ? new Date(formData.discountEndDate).toISOString() : null,
          expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
          attributes: formData.attributes ? JSON.parse(formData.attributes) : null
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Product updated successfully');
        router.push('/admin/shopping/products');
      } else {
        toast.error(data.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
            <div>
              <Label>Product Images</Label>
              <ImageUpload
                value={formData.images}
                onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
                maxImages={5}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">Original Price</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount">Discount</Label>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="discountType">Discount Type</Label>
                <Select value={formData.discountType} onValueChange={(value) => setFormData(prev => ({ ...prev, discountType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountStartDate">Discount Start Date</Label>
                <Input
                  id="discountStartDate"
                  type="datetime-local"
                  value={formData.discountStartDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountStartDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="discountEndDate">Discount End Date</Label>
                <Input
                  id="discountEndDate"
                  type="datetime-local"
                  value={formData.discountEndDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountEndDate: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoryId">Category *</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <HsnCodeSearch
                  value={formData.hsnCode}
                  onChange={(value) => setFormData(prev => ({ ...prev, hsnCode: value }))}
                />
              </div>
              <div>
                <Label htmlFor="gstPercentage">GST %</Label>
                <Input
                  id="gstPercentage"
                  type="number"
                  step="0.01"
                  value={formData.gstPercentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, gstPercentage: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="attributes">Attributes (JSON)</Label>
                <Textarea
                  id="attributes"
                  value={formData.attributes}
                  onChange={(e) => setFormData(prev => ({ ...prev, attributes: e.target.value }))}
                  placeholder='{"size": "Large", "color": "Red"}'
                  rows={2}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="shippingCharges">Shipping Charges</Label>
                <Input
                  id="shippingCharges"
                  type="number"
                  step="0.01"
                  value={formData.shippingCharges}
                  onChange={(e) => setFormData(prev => ({ ...prev, shippingCharges: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isFeatured">Featured Product</Label>
                <p className="text-sm text-gray-500">Show this product in featured sections</p>
              </div>
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isAvailable">Available for Sale</Label>
                <p className="text-sm text-gray-500">Enable/disable product availability</p>
              </div>
              <Switch
                id="isAvailable"
                checked={formData.isAvailable}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isFestival">Festival Product</Label>
                <p className="text-sm text-gray-500">Mark as festival-specific product</p>
              </div>
              <Switch
                id="isFestival"
                checked={formData.isFestival}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFestival: checked }))}
              />
            </div>
            {formData.isFestival && (
              <div>
                <Label htmlFor="festivalType">Festival Type</Label>
                <Input
                  id="festivalType"
                  value={formData.festivalType}
                  onChange={(e) => setFormData(prev => ({ ...prev, festivalType: e.target.value }))}
                  placeholder="e.g., Diwali, Christmas, Eid"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Product
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}