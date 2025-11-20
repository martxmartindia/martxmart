'use client';

import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import ProductGrid from '@/components/shopping/ProductGrid';

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const response = await fetch('/api/shopping/products?filter=new-arrivals');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Package className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">New Arrivals</h1>
          <p className="text-gray-600">Latest products just added to our store</p>
        </div>
      </div>
      
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}