'use client';

import { useEffect, useState } from 'react';
import CouponList from '@/components/coupons/CouponList';
import Link from 'next/link';

type CouponData = {
  id: string;
  code: string;
  discount: number;
  isActive: boolean;
  expiresAt: string;
};

export default function CouponPage() {
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Unauthorized. Please login.');
      return;
    }

    const fetchCoupons = async (retryCount = 0) => {
      try {
        setLoading(true);
        const response = await fetch('/api/coupons', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Unauthorized. Please log in again.');
            localStorage.removeItem('token'); // Clear invalid token
          } else if (response.status === 404) {
            setError('Coupons service not found.');
          } else {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            setError(errorData.error || 'Failed to fetch coupons');
          }
        } else {
          const data = await response.json();
          setCoupons(Array.isArray(data) ? data : []);
          if (!Array.isArray(data) || data.length === 0) {
            setError('No coupons available at the moment.');
          }
        }
      } catch (err) {
        console.error('Coupon fetch error:', err);
        console.error('Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
          token: token ? 'Present' : 'Missing',
          retryCount
        });
        
        // Retry up to 2 times for network errors
        if (retryCount < 2 && (err instanceof TypeError || (err instanceof Error && err.message.includes('fetch')))) {
          setTimeout(() => fetchCoupons(retryCount + 1), 1000 * (retryCount + 1));
          return;
        }
        
        setError(`Failed to load coupons. ${err instanceof Error ? err.message : 'Please check your connection.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-gray-500">Loading coupons...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {error ? (
        <div className="text-red-500 mb-4">
          {error}{' '}
          {error.includes('Unauthorized') && (
            <Link href="/auth/login" className="text-blue-600 underline">
              Login
            </Link>
          )}
        </div>
      ) : (
        <CouponList coupons={coupons} error={error} />
      )}
    </div>
  );
}
