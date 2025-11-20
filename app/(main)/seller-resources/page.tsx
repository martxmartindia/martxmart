import React from 'react';
import { BookOpen, Award, FileText, Video, ArrowRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const SellerResources = () => {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 max-w-5xl">
      {/* Header */}
      <header className="text-center space-y-4 mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground">
          Seller Learning Hub
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore resources and guides to help you succeed as a seller on martXmart.
        </p>
      </header>

      {/* Resource Categories */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {[
          {
            icon: Video,
            title: 'Video Tutorials',
            description: 'Step-by-step video guides to navigate and use our platform effectively.',
            href: '/resources/videos',
          },
          {
            icon: BookOpen,
            title: 'Best Practices',
            description: 'Learn proven strategies from top-performing sellers.',
            href: '/resources/best-practices',
          },
          {
            icon: FileText,
            title: 'Documentation',
            description: 'Access detailed guides and technical references for sellers.',
            href: '/resources/docs',
          },
        ].map((resource, index) => (
          <div
            key={index}
            className="bg-card p-6 sm:p-8 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group"
            role="article"
            aria-labelledby={`resource-title-${index}`}
          >
            <div className="flex items-center justify-center bg-brand-50 rounded-full w-16 h-16 mb-6 mx-auto">
              <resource.icon className="h-8 w-8 text-brand-500 group-hover:text-brand-600 transition-colors" aria-hidden="true" />
            </div>
            <h3 id={`resource-title-${index}`} className="text-xl font-semibold mb-2 text-center text-foreground">
              {resource.title}
            </h3>
            <p className="text-muted-foreground mb-4 text-center">{resource.description}</p>
            <Link href={resource.href} className="text-brand-500 hover:text-brand-600 font-medium text-center block">
              Explore Now →
            </Link>
          </div>
        ))}
      </section>

      {/* Featured Video Spotlight */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Featured Video: Getting Started
        </h2>
        <p className="text-muted-foreground mb-6 text-center max-w-3xl mx-auto">
          Watch our introductory video to learn how to set up your seller account and create your first listing.
        </p>
        <div className="relative max-w-3xl mx-auto aspect-video bg-gray-200 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Link href="/resources/videos/getting-started" className="group">
              <button
                className="bg-brand-500 text-primary-foreground px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-brand-600 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-colors duration-200"
                aria-label="Watch Getting Started Video"
              >
                <Video className="h-5 w-5" aria-hidden="true" />
                Watch Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="bg-card p-6 sm:p-8 lg:p-10 rounded-lg shadow-soft mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Featured Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            {
              title: 'Optimizing Your Listings',
              description: 'Learn how to create compelling listings that attract buyers.',
              href: '/resources/optimizing-listings',
            },
            {
              title: 'Pricing Strategies',
              description: 'Set competitive prices to maximize your sales.',
              href: '/resources/pricing-strategies',
            },
            {
              title: 'Customer Service Excellence',
              description: 'Tips for building strong buyer relationships.',
              href: '/resources/customer-service',
            },
          ].map((resource, index) => (
            <div
              key={index}
              className="bg-card p-4 rounded-lg shadow-soft flex items-start animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Award className="h-6 w-6 text-brand-500 mr-4 flex-shrink-0" aria-hidden="true" />
              <div>
                <h4 className="font-bold text-foreground mb-1">{resource.title}</h4>
                <p className="text-muted-foreground mb-2">{resource.description}</p>
                <Link href={resource.href} className="text-brand-500 hover:text-brand-600 font-medium">
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {[
            {
              question: 'How do I create high-quality listings?',
              answer: 'Use clear photos, detailed descriptions, and competitive pricing. Check our "Optimizing Your Listings" guide for more tips.',
            },
            {
              question: 'What types of machinery can I sell?',
              answer: 'You can sell a wide range of industrial equipment, including heavy machinery, tools, and parts, as long as they meet our listing guidelines.',
            },
            {
              question: 'How do I handle buyer inquiries?',
              answer: 'Respond promptly and professionally. Our "Customer Service Excellence" resource offers strategies for effective communication.',
            },
          ].map((faq, index) => (
            <details
              key={index}
              className="bg-card p-4 rounded-lg shadow-soft"
              open={index === 0}
            >
              <summary className="font-medium text-foreground cursor-pointer">
                {faq.question}
              </summary>
              <p className="text-muted-foreground mt-2">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Need More Help?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Our seller support team is here to guide you through every step of your selling journey.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/contact" className="inline-block">
            <button
              className="w-full sm:w-auto px-8 py-3 text-sm sm:text-base bg-brand-500 text-primary-foreground rounded-lg font-medium flex items-center justify-center mx-auto hover:bg-brand-600 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-colors duration-200"
              aria-label="Contact Seller Support"
            >
              Contact Seller Support
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

export default SellerResources;