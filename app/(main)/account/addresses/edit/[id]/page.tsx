"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams();
  // const id= params?.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    type: string;
    contactName: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    placeOfSupply: string;
  }>({
    type: '',
    contactName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    placeOfSupply: ''
  });

  useEffect(() => {
    if (!params.id) {
      toast.error('Invalid address ID');
      router.push('/account');
      return; 
    }
    const fetchAddress = async () => {
      try {
        const response = await fetch(`/api/account/address/${params.id}`);
        const data = await response.json();
        if (response.ok) {
          if (data && typeof data === 'object') {
            setFormData({
              type: data.type || '',
              contactName: data.contactName || '',
              phone: data.phone || '',
              email: data.email || '',
              addressLine1: data.addressLine1 || '',
              addressLine2: data.addressLine2 || '',
              city: data.city || '',
              state: data.state || '',
              zip: data.zip || '',
              placeOfSupply: data.placeOfSupply || ''
            });
          } else {
            throw new Error('Invalid address data format');
          }
        } else {
          toast.error(data.message);
          router.push('/account');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch address');
        router.push('/account');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddress();
  }, [params.id,router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/account/address/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Address updated successfully');
        router.push('/account');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update address');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-8 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Edit Address</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Address Type</label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select address type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BILLING">Billing Address</SelectItem>
                <SelectItem value="DISPATCH">Dispatch Address</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Name*</label>
            <Input
              required
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address Line 1*</label>
            <Input
              required
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address Line 2</label>
            <Input
              value={formData.addressLine2}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City*</label>
              <Input
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State*</label>
              <Input
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">ZIP Code*</label>
              <Input
                required
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Place of Supply</label>
              <Input
                value={formData.placeOfSupply}
                onChange={(e) => setFormData({ ...formData, placeOfSupply: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Address'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}