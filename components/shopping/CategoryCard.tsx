'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  isFestival?: boolean;
}

// Static subcategory mapping (extendable via API in the future)
const subcategories: { [key: string]: string[] } = {
  'fashion-apparel': ['Men', 'Women', 'Kids', 'Accessories'],
  'grocery-staples': ['Rice', 'Pulses', 'Oils', 'Spices'],
  'home-cleaning': ['Detergents', 'Cleaning Tools', 'Disinfectants'],
  'beauty-personal-care': ['Skincare', 'Haircare', 'Makeup'],
  'snacks-beverages': ['Chips', 'Drinks', 'Chocolates'],
  'electronics-appliances': ['TVs', 'Appliances', 'Gadgets'],
  'mobile-accessories': ['Cases', 'Chargers', 'Earphones'],
  'baby-kids': ['Toys', 'Clothing', 'Diapers'],
  'home-decor-kitchen': ['Decor', 'Utensils', 'Appliances'],
  'pet-care': ['Food', 'Accessories', 'Grooming'],
  'books-stationery': ['Books', 'Pens', 'Notebooks'],
  'gifting-items': ['Hampers', 'Cards', 'Personalized Gifts'],
  'puja-samagri': ['Thali', 'Incense', 'Diyas'],
  'religious-items': ['Idols', 'Books', 'Puja Kits'],
  'festival-gifting-hampers': ['Diwali Hampers', 'Eid Hampers', 'Holi Hampers'],
  'traditional-wear': ['Sarees', 'Kurtas', 'Lehengas'],
  'home-decor-lighting': ['Lamps', 'Lights', 'Candles'],
  'sweets-snacks': ['Sweets', 'Snacks', 'Dry Fruits'],
  'festival-bundles': ['Diwali Bundle', 'Holi Bundle', 'Eid Bundle', 'Chhath Bundle'],
};

export default function CategoryCard({ category }: { category: Category }) {
  const [isHovered, setIsHovered] = useState(false);
  const currentDate = new Date();
  const isFestivalSeason = currentDate.getMonth() === 9 || currentDate.getMonth() === 10; // Diwali season

  return (
    <motion.div
      className="relative w-full group"
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/shopping?categoryId=${category.id}`}
        onClick={() => console.info(`Category clicked: ${category.name}`)}
        className="block"
      >
        <div className="relative bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <Image
            src={`/categories/${category.slug}.jpg` || '/placeholder.jpg'}
            alt={`${category.name} category image`}
            width={300}
            height={200}
            className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            priority={category.isFestival}
          />
          {category.isFestival && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-full flex items-center">
              <Sparkles className="w-4 h-4 mr-1" />
              Festival Special
            </div>
          )}
          <div className="p-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{category.name}</h3>
            {isFestivalSeason && category.isFestival && (
              <p className="text-xs sm:text-sm text-green-600 mt-1">Exclusive {category.name} Deals!</p>
            )}
          </div>
        </div>
      </Link>
      <AnimatePresence>
        {isHovered && subcategories[category.slug]?.length && (
          <motion.div
            className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg p-3 z-20 mt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {subcategories[category.slug].map((sub) => (
              <Link
                key={sub}
                href={`/shopping?categoryId=${category.id}&subcategory=${encodeURIComponent(sub)}`}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                onClick={() => console.info(`Subcategory clicked: ${sub} in ${category.name}`)}
              >
                {sub}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}