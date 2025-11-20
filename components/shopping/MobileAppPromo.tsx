'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function MobileAppPromo() {
  return (
    <motion.section
      className="container mx-auto p-4 bg-blue-50 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">Shop on the Go!</h2>
          <p className="text-gray-600 mb-4">
            Download our app for exclusive deals, faster checkout, and personalized offers on Fashion, Festival Items, and more!
          </p>
          <div className="flex space-x-4">
            <Link href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <Image src="/app-store.png" alt="App Store" width={120} height={40} />
            </Link>
            <Link href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
              <Image src="/play-store.png" alt="Play Store" width={120} height={40} />
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <Image src="/qr-code.png" alt="QR Code for App" width={150} height={150} className="mx-auto" />
        </div>
      </div>
    </motion.section>
  );
}