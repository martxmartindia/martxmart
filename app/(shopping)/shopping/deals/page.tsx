'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import ProductGrid from '@/components/shopping/ProductGrid';

export default function DealsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/shopping/products?filter=deals');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-red-100 rounded-lg">
          <Clock className="h-8 w-8 text-red-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Deal of the Day</h1>
          <p className="text-gray-600">Limited time offers you can't miss</p>
        </div>
      </div>
      
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}