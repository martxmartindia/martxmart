import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from './button';
import { useCart } from '@/store/cart';
import Image from 'next/image';
import { toast } from 'sonner';
interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export function ProductCard({ id, name, price, image, description, category }: ProductCardProps) {
  const { addItem } = useCart();
  const handleAddToCart = () => {
    addItem(id, 1);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden group"
    >
      <Link href={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            width={400}
            height={400}
            src={image}
            alt={name}
            className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-2">
          <span className="text-sm text-gray-500">{category}</span>
          <h3 className="font-semibold text-lg truncate">{name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-orange-600">₹{price.toLocaleString()}</span>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-red-500"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleAddToCart}
              variant="default"
              className="bg-orange-600 hover:bg-orange-700"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}