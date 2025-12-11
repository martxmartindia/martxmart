'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AdvertisementForm from '../AdvertisementForm';

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

export default function EditAdvertisementPage({ params }: { params: Promise<{ id: string }> }) {
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        const { id } = await params;
        // NextAuth automatically handles authentication via cookies
        const response = await fetch(`/api/admin/advertisements/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setAdvertisement(data);
        } else {
          router.push('/admin/advertisements');
        }
      } catch (error) {
        console.error('Failed to fetch advertisement:', error);
        router.push('/admin/advertisements');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisement();
  }, [params, router]);

  const handleSuccess = () => {
    router.push('/admin/advertisements');
  };

  const handleCancel = () => {
    router.push('/admin/advertisements');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!advertisement) {
    return <div className="text-center">Advertisement not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Advertisement</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advertisement Details</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvertisementForm
            advertisement={advertisement}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}