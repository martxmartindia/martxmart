'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export default function CategoriesPage() {
  const params = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectTitle = typeof params.projectType === 'string'
    ? params.projectType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : Array.isArray(params.projectType)
      ? params.projectType.join(', ').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      : 'Unknown';

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`/api/project-categories/${params.projectType}`, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchCategories();
  }, [params.projectType]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4" />
          <p className="text-gray-600 animate-pulse">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-red-50 p-6 rounded-lg max-w-md mx-auto">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Categories</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {projectTitle} Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our range of {projectTitle.toLowerCase()} solutions tailored for your business
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No categories found for {projectTitle}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <Link
                  href={`/units/${category.id}`}
                  className="group block h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {category.imageUrl && (
                    <div className="relative overflow-hidden pt-[56.25%]">
                      <Image
                      height={400}
                      width={600}
                        src={category.imageUrl}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {category.name}
                    </h2>
                    <p className="text-gray-600">
                      {category.description || 'Explore our comprehensive range of solutions in this category'}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}