'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const res = await fetch('/api/slides', { cache: 'no-store' });
        const data = await res.json();
        setSlides(data);
      } catch (error) {
        console.error('Error fetching slides:', error);      }
    }
    fetchSlides();
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (slides.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
      {slides.map((slide: any, index: number) => (
        <motion.div
          key={slide.id}
          className={`absolute inset-0 ${index === currentSlide ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={slide.imageorVideo}
            alt="Promotional Banner"
            fill
            className="object-cover hidden md:block"
            priority={index === 0}
          />
          <Image
            src={slide.mobileImageorVideo || slide.imageorVideo}
            alt="Promotional Banner"
            fill
            className="object-cover md:hidden"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Festival Sale!</h2>
              <p className="text-lg md:text-xl mb-6">Up to 50% off on Diwali, Holi, and more!</p>
              <div className="flex space-x-4 justify-center">
                <Link
                  href="/shopping?festivalType=Diwali"
                  className="bg-white text-blue-600 px-6 py-3 rounded-md hover:bg-gray-100"
                  onClick={() => console.info('Shop Now clicked in hero')}
                >
                  Shop Now
                </Link>
                <Link
                  href="/shopping"
                  className="bg-transparent border border-white text-white px-6 py-3 rounded-md hover:bg-white/20"
                  onClick={() => console.info('View Deals clicked in hero')}
                >
                  View Deals
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}