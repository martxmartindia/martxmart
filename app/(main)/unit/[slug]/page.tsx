'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
}

interface Unit {
  id: string;
  name: string;
  slug: string;
  description?: string;
  longDescription?: string;
  imageUrl?: string;
  capacity?: string;
  powerConsumption?: string;
  price?: number;
  specifications: string[];
  plantCategory: { name: string; slug: string };
  products: Product[];
}

export default function UnitDetailPage() {
  const params = useParams();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUnit() {
      try {
        const res = await fetch(`/api/unit/${params.slug}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch unit details');
        const data = await res.json();
        setUnit(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchUnit();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="container mx-auto p-4 min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <div className="text-xl mb-4">Unit not found</div>
        <Link
          href="/plant-and-machinery"
          className="text-primary hover:text-primary/90 transition-colors"
        >
          Browse all units
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{unit.name}</h1>
        </div>
        {unit.price && (
          <div className="bg-primary/10 px-6 py-3 rounded-lg">
            <span className="text-sm text-primary/70">Starting from</span>
            <div className="text-2xl font-bold text-primary">₹{unit.price.toLocaleString()}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="aspect-video overflow-hidden rounded-xl bg-gray-100">
            <Image
            height={400}
            width={600}
              src={unit.imageUrl || 'https://placehold.co/300x200'}
              alt={unit.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900">Description</h2>
            <p className="text-gray-600">
              {unit.longDescription || unit.description || 'No description available'}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Specifications</h2>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-500">Capacity</div>
                  <div className="font-medium">{unit.capacity || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Power Consumption</div>
                  <div className="font-medium">{unit.powerConsumption || 'N/A'}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {unit.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {spec}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {unit.products.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Related Products</h2>
              <div className="space-y-4">
                {unit.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-gray-900">{product.name}</span>
                    <span className="text-primary font-semibold">₹{product.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}