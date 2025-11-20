'use client';

import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import ProductGrid from '@/components/shopping/ProductGrid';

export default function BestSellingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestSelling();
  }, []);

  const fetchBestSelling = async () => {
    try {
      const response = await fetch('/api/shopping/products?filter=best-selling');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching best selling products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-green-100 rounded-lg">
          <TrendingUp className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Best Selling Products</h1>
          <p className="text-gray-600">Customer favorites and top performers</p>
        </div>
      </div>
      
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}