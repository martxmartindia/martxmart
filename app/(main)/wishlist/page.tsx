"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/store/cart';
import { toast } from 'sonner';
import Image from 'next/image';
import { useWishlist } from '@/store/wishlist';

export default function WishlistPage() {
  const { items, removeItem, sortByPrice, filterByPriceRange, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleAddToCart = (item: any) => {
    addToCart(item.id, 1);
  };

  const handleRemoveFromWishlist = (id: string) => {
    removeItem(id);
    toast.success('Removed from wishlist');
  };

  const handleSortChange = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    sortByPrice(newOrder === 'asc');
  };

  const handlePriceRangeChange = () => {
    filterByPriceRange(priceRange.min, priceRange.max);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleSortChange}
            className="flex items-center gap-2"
          >
            Sort by Price {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
          {items.length > 0 && (
            <Button
              variant="destructive"
              onClick={clearWishlist}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex gap-4 items-center">
          <input
            type="number"
            placeholder="Min Price"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
            className="border rounded p-2"
          />
          <Button onClick={handlePriceRangeChange}>Apply Filter</Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500">Start adding items to your wishlist!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative pb-[100%]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    height={100}
                    width={100}
                    
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.name}</h3>
                  <p className="text-xl font-bold text-orange-600 mb-4">₹{item.price.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="p-2"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}