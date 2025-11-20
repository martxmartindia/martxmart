'use client';
import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search, ArrowRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const faqs = [
    {
      category: 'Selling on martXmart',
      questions: [
        {
          q: 'How do I create a seller account?',
          a: 'Click "Sell" in the navigation menu, follow the registration process, and provide your business information and identity verification details.',
        },
        {
          q: 'What are the fees for selling?',
          a: 'Fees depend on your membership plan. Basic accounts are free with limited features, while Professional plans start at $49/month. Visit our Membership page for details.',
        },
        {
          q: 'How long does it take to sell machinery?',
          a: 'Sale times vary based on machinery type, pricing, and demand. Well-priced items typically sell within 30-60 days.',
        },
      ],
    },
    {
      category: 'Buying Process',
      questions: [
        {
          q: 'How do I know if a seller is legitimate?',
          a: 'All sellers are verified. Look for the "Verified Seller" badge and check ratings/reviews. Our buyer protection program adds security.',
        },
        {
          q: 'Can I inspect machinery before buying?',
          a: 'Yes, we recommend arranging in-person inspections with sellers for large machinery purchases.',
        },
        {
          q: 'What payment methods are accepted?',
          a: 'We accept credit cards, wire transfers, and escrow services for large transactions, processed securely.',
        },
      ],
    },
    {
      category: 'Shipping & Delivery',
      questions: [
        {
          q: 'How is shipping handled?',
          a: 'Sellers arrange shipping, but we recommend trusted logistics partners. Shipping costs are typically separate from listing prices.',
        },
        {
          q: 'Do you ship internationally?',
          a: 'Yes, international shipping is supported. Buyers are responsible for customs duties and import taxes.',
        },
        {
          q: 'What if my item arrives damaged?',
          a: 'Document damage immediately and contact the seller and carrier. Our support team will assist with insured claims.',
        },
      ],
    },
    {
      category: 'Account & Security',
      questions: [
        {
          q: 'How do I reset my password?',
          a: 'Click "Forgot Password" on the login page and follow the email instructions to reset it.',
        },
        {
          q: 'Is my information secure?',
          a: 'Yes, we use industry-standard encryption and security measures to protect your data.',
        },
        {
          q: 'How do I update my business information?',
          a: 'Log into Settings and update your business profile. Some changes may require verification.',
        },
      ],
    },
  ];

  // Filter FAQs based on search term
  const filteredFaqs = useMemo(() => {
    if (!searchTerm.trim()) return faqs;
    const lowerSearch = searchTerm.toLowerCase();
    return faqs
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (faq) => faq.q.toLowerCase().includes(lowerSearch) || faq.a.toLowerCase().includes(lowerSearch)
        ),
      }))
      .filter((category) => category.questions.length > 0);
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 max-w-5xl">
      {/* Header */}
      <header className="text-center space-y-4 mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about using the martXmart platform.
        </p>
      </header>

      {/* Search Bar */}
      <section className="mb-12 sm:mb-16 max-w-3xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 outline-none text-foreground bg-card"
            aria-label="Search FAQs"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="max-w-3xl mx-auto mb-12 sm:mb-16">
        {filteredFaqs.length === 0 ? (
          <p className="text-center text-muted-foreground">No results found for your search.</p>
        ) : (
          filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const index = categoryIndex * 100 + questionIndex;
                  const isOpen = openIndex === index;
                  return (
                    <div
                      key={questionIndex}
                      className="bg-card rounded-lg shadow-soft overflow-hidden"
                      role="article"
                      aria-labelledby={`faq-question-${index}`}
                    >
                      <button
                        className="w-full px-6 py-4 text-left bg-card hover:bg-brand-50 flex justify-between items-center transition-colors duration-200"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${index}`}
                      >
                        <span id={`faq-question-${index}`} className="font-semibold text-foreground">
                          {faq.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-brand-500" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-brand-500" aria-hidden="true" />
                        )}
                      </button>
                      {isOpen && (
                        <div id={`faq-answer-${index}`} className="px-6 py-4 bg-brand-50">
                          <p className="text-muted-foreground">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Related Resources */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Related Resources
        </h2>
        <p className="text-muted-foreground mb-6 text-center max-w-3xl mx-auto">
          Explore additional guides and policies to get the most out of martXmart.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {[
            { title: 'Seller Guide', href: '/guides/seller', description: 'Learn how to list and sell equipment effectively.' },
            { title: 'Buyer Protection', href: '/guides/buyer-protection', description: 'Understand our safeguards for secure purchases.' },
            { title: 'Shipping Info', href: '/shipping', description: 'Details on shipping processes and logistics.' },
            { title: 'Privacy Policy', href: '/privacy', description: 'How we protect your personal information.' },
          ].map((resource, idx) => (
            <li
              key={idx}
              className="flex items-start animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <HelpCircle className="h-5 w-5 text-brand-500 mr-3 flex-shrink-0" aria-hidden="true" />
              <div>
                <Link href={resource.href} className="text-brand-500 hover:text-brand-600 font-medium">
                  {resource.title}
                </Link>
                <p className="text-muted-foreground">{resource.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Still Need Help Section */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Still Need Help?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Can’t find what you’re looking for? Our support team is here to assist you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/contact" className="inline-block">
            <button
              className="bg-brand-500 text-primary-foreground px-8 py-3 rounded-lg font-medium flex items-center justify-center mx-auto hover:bg-brand-600 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
              aria-label="Contact Us"
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </button>
          </Link>
          <Link href="/help" className="inline-block">
            <button
              className="border border-brand-500 text-brand-500 px-8 py-3 rounded-lg font-medium hover:bg-brand-50 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
              aria-label="Help Center"
            >
              Help Center
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FAQs;