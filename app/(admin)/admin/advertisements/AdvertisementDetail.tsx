'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

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
  createdAt: string;
  updatedAt: string;
}

interface AdvertisementDetailProps {
  advertisement: Advertisement;
  onClose: () => void;
}

export default function AdvertisementDetail({ advertisement, onClose }: AdvertisementDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{advertisement.name}</h2>
          <Badge variant={advertisement.isActive ? 'default' : 'secondary'} className="mt-2">
            {advertisement.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div>Priority: {advertisement.priority}</div>
          <div>Created: {new Date(advertisement.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      {advertisement.image && (
        <Card>
          <CardHeader>
            <CardTitle>Image</CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              src={advertisement.image}
              alt={advertisement.name}
              height={300}
              width={300}
              className="w-full max-w-md h-48 object-cover rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Offer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Offer</h4>
            <p>{advertisement.offer}</p>
          </div>
          <div>
            <h4 className="font-semibold">Expiry</h4>
            <p>{advertisement.offerExpiry}</p>
          </div>
          <div>
            <h4 className="font-semibold">Link</h4>
            <div className="flex items-center gap-2">
              <a
                href={advertisement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {advertisement.link}
              </a>
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1">
            {advertisement.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Styling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Background Color</h4>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded ${advertisement.bgColor}`}></div>
              <span className="font-mono text-sm">{advertisement.bgColor}</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold">Hover Color</h4>
            <span className="font-mono text-sm">{advertisement.hoverColor}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}