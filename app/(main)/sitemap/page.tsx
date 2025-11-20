'use client';

import React, { useState } from 'react';
import { Home, ShoppingBag, Headphones, User, Scale, BookOpen, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Sitemap = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    {
      icon: Home,
      title: 'Main Pages',
      links: [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About Us' },
        { to: '/contact', label: 'Contact' },
        { to: '/blog', label: 'Blog' },
      ],
    },
    {
      icon: ShoppingBag,
      title: 'Product Categories',
      links: [
        { to: '/categories/construction', label: 'Construction Equipment' },
        { to: '/categories/manufacturing', label: 'Manufacturing Machinery' },
        { to: '/categories/agricultural', label: 'Agricultural Machinery' },
        { to: '/categories/material-handling', label: 'Material Handling' },
        { to: '/categories/tools', label: 'Industrial Tools' },
      ],
    },
    {
      icon: Headphones,
      title: 'Customer Service',
      links: [
        { to: '/help', label: 'Help Center' },
        { to: '/shipping', label: 'Shipping Information' },
        { to: '/returns', label: 'Returns & Refunds' },
        { to: '/warranty', label: 'Warranty' },
        { to: '/faqs', label: 'FAQs' },
      ],
    },
    {
      icon: User,
      title: 'Account',
      links: [
        { to: '/account/login', label: 'Login' },
        { to: '/account/register', label: 'Register' },
        { to: '/account/orders', label: 'Order History' },
        { to: '/account/profile', label: 'Profile Settings' },
      ],
    },
    {
      icon: Scale,
      title: 'Legal',
      links: [
        { to: '/privacy-policy', label: 'Privacy Policy' },
        { to: '/terms-of-service', label: 'Terms of Service' },
        { to: '/cookie-policy', label: 'Cookie Policy' },
      ],
    },
    {
      icon: BookOpen,
      title: 'Resources',
      links: [
        { to: '/guides', label: 'Buying Guides' },
        { to: '/maintenance', label: 'Maintenance Tips' },
        { to: '/news', label: 'Industry News' },
        { to: '/case-studies', label: 'Case Studies' },
      ],
    },
  ];

  // Filter sections based on search term
  const filteredSections = searchTerm.trim()
    ? sections
        .map((section) => ({
          ...section,
          links: section.links.filter((link) =>
            link.label.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((section) => section.links.length > 0)
    : sections;

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 max-w-5xl">
      {/* Header */}
      <header className="text-center space-y-4 mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground">
          Sitemap
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Navigate martXmart with ease using our organized sitemap.
        </p>
      </header>

      {/* Search Bar */}
      <section className="mb-12 sm:mb-16 max-w-3xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search the sitemap..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 outline-none text-foreground bg-card transition-all duration-200"
            aria-label="Search sitemap"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-foreground">
          Quick Navigation
        </h2>
        <p className="text-muted-foreground text-center max-w-3xl mx-auto">
          Explore all our pages organized by category for seamless navigation.
        </p>
      </section>

      {/* Main Sections */}
      <section className="grid gap-6 sm:gap-8 mb-12 sm:mb-16">
        {filteredSections.length === 0 ? (
          <p className="text-center text-muted-foreground">No results found for your search.</p>
        ) : (
          filteredSections.map((section, index) => (
            <div
              key={index}
              className="bg-card p-6 sm:p-8 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300"
              role="article"
              aria-labelledby={`section-title-${index}`}
            >
              <div className="flex items-center mb-6">
                <section.icon className="h-8 w-8 text-brand-500 mr-3" aria-hidden="true" />
                <h2 id={`section-title-${index}`} className="text-xl sm:text-2xl font-semibold text-foreground">
                  {section.title}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.links.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.to}
                    className="flex items-center text-muted-foreground hover:text-brand-500 transition-colors animate-fade-in"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <span className="w-2 h-2 bg-brand-500 rounded-full mr-3"></span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Popular Pages */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Popular Pages
        </h2>
        <p className="text-muted-foreground mb-6 text-center max-w-3xl mx-auto">
          Quick access to our most visited pages to get you started.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {[
            { to: '/', label: 'Home', description: 'Explore our platform.' },
            { to: '/categories/construction', label: 'Construction Equipment', description: 'Browse heavy machinery.' },
            { to: '/faqs', label: 'FAQs', description: 'Answers to common questions.' },
            { to: '/contact', label: 'Contact', description: 'Reach out to our support team.' },
          ].map((link, idx) => (
            <li
              key={idx}
              className="flex items-start animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <ArrowRight className="h-5 w-5 text-brand-500 mr-3 flex-shrink-0" aria-hidden="true" />
              <div>
                <Link href={link.to} className="text-brand-500 hover:text-brand-600 font-medium">
                  {link.label}
                </Link>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Can’t Find a Page?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Our support team is here to help you navigate martXmart or answer any questions.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/contact" className="inline-block">
            <button
              className="w-full sm:w-auto px-8 py-3 text-sm sm:text-base bg-brand-500 text-primary-foreground rounded-lg font-medium flex items-center justify-center mx-auto hover:bg-brand-600 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-colors duration-200"
              aria-label="Contact Support"
            >
              Contact Support
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </button>
          </Link>
          <Link href="/faqs" className="inline-block">
            <button
              className="w-full sm:w-auto px-8 py-3 text-sm sm:text-base border border-brand-500 text-brand-500 rounded-lg font-medium hover:bg-brand-50 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-colors duration-200"
              aria-label="View FAQs"
            >
              View FAQs
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Sitemap;