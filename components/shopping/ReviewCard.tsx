'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  userName: string;
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <motion.div
      className="bg-white p-4 rounded-lg shadow-md border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <p className="text-gray-600 italic mb-2">{review.comment || 'No comment'}</p>
      <p className="text-sm font-semibold text-gray-800">{review.userName}</p>
    </motion.div>
  );
}