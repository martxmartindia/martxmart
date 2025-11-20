"use client";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Send,
  Shield,
  Truck,
  RotateCcw,
  Headphones,
  Award,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-2">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/shopping" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Image
                  width={32}
                  height={32}
                  src="/logo.png"
                  alt="martXmart logo"
                  className="rounded"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                martXmart
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              India's fastest-growing multi-vendor marketplace. Discover
              millions of products from trusted sellers with guaranteed quality
              and lightning-fast delivery.
            </p>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Follow Us</h4>
              <div className="flex space-x-3">
                {[
                  {
                    href: "https://www.facebook.com/martXmartretail",
                    icon: Facebook,
                    name: "Facebook",
                    color: "hover:text-blue-500",
                  },
                  {
                    href: "https://x.com/martXmart_",
                    icon: Twitter,
                    name: "Twitter",
                    color: "hover:text-sky-400",
                  },
                  {
                    href: "https://www.instagram.com/martxmartofficial",
                    icon: Instagram,
                    name: "Instagram",
                    color: "hover:text-pink-500",
                  },
                  {
                    href: "https://www.linkedin.com/company/martxmart",
                    icon: Linkedin,
                    name: "LinkedIn",
                    color: "hover:text-blue-600",
                  },
                  {
                    href: "https://www.youtube.com/@martXmart",
                    icon: Youtube,
                    name: "YouTube",
                    color: "hover:text-red-500",
                  },
                ].map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={social.href}
                      className={`text-gray-400 ${social.color} transition-all duration-300 p-2 bg-gray-800 rounded-lg hover:bg-gray-700`}
                      aria-label={social.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <social.icon className="h-5 w-5" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white border-b border-gray-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                ["About Us", "/about-us"],
                ["Contact Us", "/contact"],
                ["Shipping Info", "/shipping"],
                ["Returns & Exchanges", "/returns"],
                ["FAQ", "/faqs"],
                ["Track Order", "/track-order"],
                ["Bulk Orders", "/bulk-orders"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white border-b border-gray-700 pb-2">
              Categories
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                ["Electronics", "electronics"],
                ["Fashion", "fashion"],
                ["Home & Garden", "home"],
                ["Sports & Fitness", "sports"],
                ["Books", "books"],
                ["Beauty & Health", "beauty"],
                ["Automotive", "automotive"],
              ].map(([label, category]) => (
                <li key={category}>
                  <Link
                    href={`/shopping/products?category=${category}`}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-purple-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white border-b border-gray-700 pb-2">
              Contact Us
            </h3>
            <div className="text-sm space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="bg-green-600 p-2 rounded-lg group-hover:bg-green-500 transition-colors">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Call Us</p>
                  <p className="text-gray-400">+91 02269718200</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Email Us</p>
                  <p className="text-gray-400">support@martxmart.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="bg-red-600 p-2 rounded-lg group-hover:bg-red-500 transition-colors">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Visit Us</p>
                  <p className="text-gray-400 leading-relaxed">
                    Shashi Bhawan, Jayprakash Nagar, Purnea, Bihar 854301
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="text-center space-y-4">
            <h4 className="font-semibold text-white">We Accept</h4>
            <div className="flex justify-center items-center space-x-6 flex-wrap gap-4">
              {[
                { name: "Paytm", image: "/payment-icons/paytm.png" },
                { name: "PhonePe", image: "/payment-icons/phonepay.png" },
                { name: "Google Pay", image: "/payment-icons/googlepay.png" },
                { name: "Visa", image: "/visa.png" },
                { name: "Mastercard", image: "/mastercard.png" },
              ].map((payment, index) => (
                <div
                  key={index}
                  className="bg-white p-2 rounded-lg hover:scale-105 transition-transform"
                >
                <Image 
                  src={payment.image} 
                  alt={payment.name} 
                  width={32} 
                  height={20} 
                  className="h-5 w-auto"
                />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-center text-sm space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <p className="text-gray-400">
                © {new Date().getFullYear()} martXmart. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-gray-500">
                <Shield className="h-4 w-4" />
                <span>SSL Secured</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-gray-400">
              {[
                ["Privacy Policy", "/privacy-policy"],
                ["Terms of Service", "/terms-of-service"],
                ["Cookie Policy", "/cookie-policy"],
                ["Sitemap", "/sitemap"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="hover:text-white transition-colors hover:underline"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
