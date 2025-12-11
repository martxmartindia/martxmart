'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/imageUpload';
import { toast } from 'sonner';

interface Advertisement {
  id: string;
  name: string;
  image?: string;
  offer: string;
  offerExpiry: string;
  benefits: string[];
  link: string;
  bgColor: string;
  hoverColor: string;
  isActive: boolean;
  priority: number;
}

interface AdvertisementFormProps {
  advertisement?: Advertisement | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdvertisementForm({ advertisement, onSuccess, onCancel }: AdvertisementFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    offer: '',
    offerExpiry: '',
    benefits: [''],
    link: '',
    bgColor: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600',
    isActive: true,
    priority: 0
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (advertisement) {
      setFormData({
        name: advertisement.name,
        image: advertisement.image || '',
        offer: advertisement.offer,
        offerExpiry: advertisement.offerExpiry,
        benefits: advertisement.benefits.length > 0 ? advertisement.benefits : [''],
        link: advertisement.link,
        bgColor: advertisement.bgColor,
        hoverColor: advertisement.hoverColor,
        isActive: advertisement.isActive,
        priority: advertisement.priority
      });
    }
  }, [advertisement]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.offer.trim()) newErrors.offer = 'Offer is required';
    if (!formData.offerExpiry.trim()) newErrors.offerExpiry = 'Offer expiry is required';
    if (!formData.link.trim()) newErrors.link = 'Link is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);

    try {
      const filteredBenefits = formData.benefits.filter(benefit => benefit.trim() !== '');
      
      const url = advertisement 
        ? `/api/admin/advertisements/${advertisement.id}`
        : '/api/admin/advertisements';
      
      const method = advertisement ? 'PUT' : 'POST';

      // NextAuth automatically handles authentication via cookies
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          benefits: filteredBenefits
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Advertisement ${advertisement ? 'updated' : 'created'} successfully`);
        onSuccess();
      } else {
        toast.error(data.message || 'Failed to save advertisement');
      }
    } catch (error) {
      console.error('Error saving advertisement:', error);
      toast.error('Failed to save advertisement');
    } finally {
      setLoading(false);
    }
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit)
    }));
  };

  return (
    <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Advertisement Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter advertisement name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                min="0"
              />
              <p className="text-xs text-gray-500">Higher priority shows first</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Advertisement Image</Label>
            <ImageUpload
              value={formData.image ? [formData.image] : []}
              onChange={(urls) => setFormData(prev => ({ ...prev, image: urls[0] || '' }))}
              maxImages={1}
            />
            <p className="text-xs text-gray-500">Upload an image for the advertisement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="offer">Offer Description <span className="text-red-500">*</span></Label>
              <Input
                id="offer"
                value={formData.offer}
                onChange={(e) => setFormData(prev => ({ ...prev, offer: e.target.value }))}
                placeholder="e.g., 50% OFF on all products"
                className={errors.offer ? 'border-red-500' : ''}
              />
              {errors.offer && <p className="text-sm text-red-500">{errors.offer}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="offerExpiry">Offer Expiry <span className="text-red-500">*</span></Label>
              <Input
                id="offerExpiry"
                value={formData.offerExpiry}
                onChange={(e) => setFormData(prev => ({ ...prev, offerExpiry: e.target.value }))}
                placeholder="e.g., Valid till 31st Dec 2024"
                className={errors.offerExpiry ? 'border-red-500' : ''}
              />
              {errors.offerExpiry && <p className="text-sm text-red-500">{errors.offerExpiry}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Target Link <span className="text-red-500">*</span></Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              placeholder="https://example.com"
              className={errors.link ? 'border-red-500' : ''}
            />
            {errors.link && <p className="text-sm text-red-500">{errors.link}</p>}
            <p className="text-xs text-gray-500">URL where users will be redirected when clicking the advertisement</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Benefits & Features</Label>
              <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
                <Plus className="w-4 h-4 mr-2" />
                Add Benefit
              </Button>
            </div>
            <div className="space-y-3">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder="Enter benefit or feature"
                    className="flex-1"
                  />
                  {formData.benefits.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeBenefit(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">Add key benefits or features to highlight in the advertisement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="bgColor"
                  value={formData.bgColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, bgColor: e.target.value }))}
                  placeholder="bg-orange-500"
                  className="flex-1"
                />
                <div className={`w-10 h-10 rounded border ${formData.bgColor}`}></div>
              </div>
              <p className="text-xs text-gray-500">Tailwind CSS background color class</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoverColor">Hover Color</Label>
              <div className="flex gap-2">
                <Input
                  id="hoverColor"
                  value={formData.hoverColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, hoverColor: e.target.value }))}
                  placeholder="hover:bg-orange-600"
                  className="flex-1"
                />
                <div className={`w-10 h-10 rounded border ${formData.hoverColor.replace('hover:', '')}`}></div>
              </div>
              <p className="text-xs text-gray-500">Tailwind CSS hover color class</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="isActive" className="text-base font-medium">Advertisement Status</Label>
              <p className="text-sm text-gray-500">Enable or disable this advertisement</p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Saving...' : (advertisement ? 'Update Advertisement' : 'Create Advertisement')}
            </Button>
          </div>
        </form>
    </div>
  );
}