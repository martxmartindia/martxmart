"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const navSections = [
    {
      title: "Company",
      links: [
        { href: "/about-us", label: "About Us" },
        { href: "/contact", label: "Contact Us" },
        { href: "/careers", label: "Careers" },
        { href: "/media", label: "Press & Media" },
      ],
    },
    {
      title: "Shop",
      links: [
        { href: "/shopping", label: "All Products" },
        { href: "/shopping?category=fashion", label: "Fashion" },
        { href: "/shopping?category=electronics", label: "Electronics" },
        { href: "/shopping?category=groceries", label: "Groceries" },
      ],
    },
    {
      title: "Sell with Us",
      links: [
        { href: "/sell", label: "Become a Seller" },
        { href: "/advertise", label: "Advertise Products" },
        { href: "/success-stories", label: "Success Stories" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/support", label: "Help Center" },
        { href: "/faqs", label: "FAQs" },
        { href: "/shipping", label: "Shipping Info" },
        { href: "/returns", label: "Returns & Refunds" },
      ],
    },
  ];

  const paymentMethods = [
    { name: "Paytm", image: "/payment-icons/paytm.png" },
    { name: "PhonePe", image: "/payment-icons/phonepay.png" },
    { name: "Google Pay", image: "/payment-icons/googlepay.png" },
    { name: "Visa", image: "/visa.png" },
    { name: "Mastercard", image: "/mastercard.png" },
  ];

  const socialLinks = [
    { href: "https://www.facebook.com/martXmartretail", icon: Facebook },
    { href: "https://x.com/martXmart_", icon: Twitter },
    { href: "https://www.instagram.com/martxmartofficial", icon: Instagram },
    { href: "https://www.linkedin.com/company/martxmart", icon: Linkedin },
    { href: "https://www.youtube.com/@martXmart", icon: Youtube },
  ];

  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/logo1.png"
                alt="martXmart"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-white">martXmart</span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              India's trusted marketplace for fashion, electronics, groceries
              and more.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>support@martxmart.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-green-400" />
                <span>+91 02269718200</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-red-400 mt-0.5" />
                <span>Purnea, Bihar 854301</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {navSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h5 className="font-medium mb-4 text-white">We Accept</h5>
          <div className="flex flex-wrap gap-3">
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white p-2 rounded-lg hover:scale-105 transition-transform"
              >
                <Image
                  src={method.image}
                  alt={method.name}
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
      <div className="border-t border-gray-800 py-4 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} martXmart. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy-policy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
