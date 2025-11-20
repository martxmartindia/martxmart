'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Unit {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export default function UnitsPage() {
  const params = useParams();
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUnits() {
      try {
        const res = await fetch(`/api/units/${params.categoryId}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch units');
        const data = await res.json();
        setUnits(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchUnits();
  }, [params.categoryId]);

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

  if (!units.length) {
    return (
      <div className="container mx-auto p-4 min-h-[60vh] flex items-center justify-center text-gray-500 text-lg">
        No units available in this category
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">
          Available Units
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our collection of high-quality industrial units designed for optimal performance and reliability
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {units.map((unit, index) => (
          <Link
            href={`/unit/${unit.slug}`}
            key={unit.id}
            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
              height={400}
              width={600}
                src={unit.imageUrl || 'https://placehold.co/150x100'}
                alt={unit.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6 space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {unit.name}
              </h2>
              <p className="text-gray-600 line-clamp-2">
                {unit.description || 'No description available'}
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center text-primary font-medium">
                  Learn more
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}