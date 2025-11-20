'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Deal {
  id: string;
  shopping: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
  discount: number;
  endDate: string;
}

export function DealCard({ deal }: { deal: Deal }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const endDate = new Date(deal.endDate);
    const updateTimer = () => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [deal.endDate]);

  const discountedPrice = deal.shopping.price * (1 - deal.discount / 100);

  return (
    <motion.div
      className="bg-red-50 p-6 rounded-lg shadow-lg border border-red-200"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-bold text-red-600 mb-2">Deal of the Day</h3>
      <Image
        src={deal.shopping.images[0] || '/logo.png'}
        alt={deal.shopping.name}
        width={300}
        height={200}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h4 className="text-lg font-semibold">{deal.shopping.name}</h4>
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-red-600 font-bold">${discountedPrice.toFixed(2)}</span>
        <span className="text-gray-500 line-through">${deal.shopping.price.toFixed(2)}</span>
        <span className="text-green-600">({deal.discount}% off)</span>
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Clock className="w-5 h-5 mr-1" />
        <span>{timeLeft}</span>
      </div>
      <button
        onClick={() => {
          router.push(`/shopping/${deal.shopping.id}`);
        }}
        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
      >
        Buy Now
      </button>
    </motion.div>
  );
}