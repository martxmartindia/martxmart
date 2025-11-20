'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, AlertCircle } from 'lucide-react';

const Custom404 = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/support?query=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background text-foreground px-4 sm:px-6 lg:px-8">
      {/* Error Illustration */}
      <div className="mb-8">
        <AlertCircle className="h-16 w-16 text-brand-500 animate-pulse" aria-hidden="true" />
      </div>

      <div className="w-full max-w-md sm:max-w-lg p-6 sm:p-8 bg-card border border-gray-200 dark:border-gray-600 rounded-lg shadow-soft">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-center mb-4 text-foreground">
          404 - Page Not Found
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground text-center mb-6 max-w-md mx-auto">
          Looks like you’ve wandered off the path in martXmart’s bazaar. Let’s get you back on track!
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-10 pr-4 py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 outline-none bg-card text-foreground transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search support topics"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-3 text-sm sm:text-base bg-brand-500 text-primary-foreground rounded-lg hover:bg-brand-600 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-colors duration-200"
            aria-label="Search"
          >
            Search
          </button>
        </form>

        {/* Suggested Links */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-center text-foreground mb-4">Explore martXmart</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            {[
              { title: 'Browse Machinery', href: '/marketplace', description: 'Find industrial equipment.' },
              { title: 'Browse Products', href: '/shopping/products', description: 'Discover our wide range of products.' },
              { title: 'FAQs', href: '/faqs', description: 'Answers to common questions.' },
              { title: 'Support Center', href: '/support', description: 'Get help from our team.' },
            ].map((link, idx) => (
              <li
                key={idx}
                className="flex items-start animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <ArrowRight className="h-5 w-5 text-brand-500 mr-3 flex-shrink-0" aria-hidden="true" />
                <div>
                  <Link href={link.href} className="text-brand-500 hover:text-brand-600 font-medium">
                    {link.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/" className="inline-block">
            <button
              className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base bg-brand-500 text-primary-foreground rounded-lg font-medium hover:bg-brand-600 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-colors duration-200"
              aria-label="Return to Home"
            >
              Back to Home
            </button>
          </Link>
          <Link href="/support" className="inline-block">
            <button
              className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base border border-brand-500 text-brand-500 rounded-lg font-medium hover:bg-brand-50 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-colors duration-200"
              aria-label="Visit Support Center"
            >
              Support Center
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Custom404;