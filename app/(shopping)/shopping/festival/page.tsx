'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import ProductGrid from '@/components/shopping/ProductGrid';

export default function FestivalPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFestivalProducts();
  }, []);

  const fetchFestivalProducts = async () => {
    try {
      const response = await fetch('/api/shopping/products?filter=festival');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching festival products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-yellow-100 rounded-lg">
          <Sparkles className="h-8 w-8 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Festival Collection</h1>
          <p className="text-gray-600">Special products for festive celebrations</p>
        </div>
      </div>
      
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}