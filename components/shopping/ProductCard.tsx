"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  brand?: string;
  manufacturer?: string;
  averageRating?: number;
  featured?: boolean;
  discount?: number;
  discountType?: "PERCENTAGE" | "FIXED";
  discountStartDate?: string;
  discountEndDate?: string;
}

export function ProductCard({ product }: { product: Product }) {
  const now = new Date();
  const discount = Number(product.discount) || 0;
  const price = Number(product.price) || 0;

  const isDiscountActive =
    discount > 0 &&
    product.discountType &&
    (!product.discountStartDate || new Date(product.discountStartDate) <= now) &&
    (!product.discountEndDate || new Date(product.discountEndDate) >= now);

  const discountedPrice = isDiscountActive
    ? product.discountType === "PERCENTAGE"
      ? price * (1 - discount / 100)
      : price - discount
    : price;

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative w-full h-48">
        <Image
          src={product.images[0] || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={product.featured || (product.averageRating ?? 0) >= 4}
        />
        {isDiscountActive && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
            {product.discountType === "PERCENTAGE"
              ? `${discount}% Off`
              : `₹${discount} Off`}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description || "No description available"}
        </p>

        <div className="flex items-center mt-2">
          {product.averageRating ? (
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(product.averageRating ?? 0)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill={
                    i < Math.round(product.averageRating ?? 0)
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </div>
          ) : product.featured ? (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Featured
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ₹{Number(discountedPrice).toFixed(2)}
            </span>
            {isDiscountActive && product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ₹{Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-600">
            {product.brand || product.manufacturer || "Generic"}
          </span>
        </div>

        <Link
          href={`/${product.brand ? "shopping" : "products"}/${product.slug}`}
          className="mt-4 block w-full text-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
