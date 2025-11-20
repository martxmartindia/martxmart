'use client';

import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import ProductGrid from '@/components/shopping/ProductGrid';

export default function TrendingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      const response = await fetch('/api/shopping/products?filter=trending');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching trending products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-orange-100 rounded-lg">
          <TrendingUp className="h-8 w-8 text-orange-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Trending Products</h1>
          <p className="text-gray-600">Most popular products right now</p>
        </div>
      </div>
      
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}