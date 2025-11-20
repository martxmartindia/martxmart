import React from 'react';
import { ArrowRight, Package, IndianRupee, BarChart, Star } from 'lucide-react';
import Link from 'next/link';

const Sell = () => {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
      {/* Header */}
      <header className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 text-foreground">
          Start Selling Your Machinery on martXmart
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Join thousands of successful sellers and reach a global audience of buyers with ease.
        </p>
      </header>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {[
          {
            icon: Package,
            title: 'List Your Equipment',
            description: 'Create detailed listings with high-quality photos and specifications to attract buyers.',
          },
          {
            icon: IndianRupee,
            title: 'Set Your Price',
            description: 'Use competitive pricing tools and market insights to maximize your profits.',
          },
          {
            icon: BarChart,
            title: 'Track Performance',
            description: 'Monitor listing views, buyer inquiries, and detailed sales analytics in real-time.',
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-card p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group"
            role="article"
            aria-labelledby={`feature-title-${index}`}
          >
            <item.icon className="h-12 w-12 text-brand-500 mb-4 group-hover:text-brand-600 transition-colors" />
            <h3 id={`feature-title-${index}`} className="text-xl font-bold mb-2 text-foreground">
              {item.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
          </div>
        ))}
      </section>

      {/* Benefits Section */}
      <section className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Why Sell on martXmart?
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {[
            'Reach millions of buyers worldwide',
            'Secure payment processing',
            'Dedicated seller support team',
            'Customizable seller dashboard',
            'Marketing tools to boost visibility',
            'Flexible listing options',
          ].map((benefit, index) => (
            <li
              key={index}
              className="flex items-center space-x-2 text-muted-foreground animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Star className="h-5 w-5 text-brand-500" aria-hidden="true" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Testimonial Section */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          What Our Sellers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              name: 'Rajesh K., Machinery Dealer',
              quote: 'martXmart helped me sell my equipment faster than ever. The analytics dashboard is a game-changer!',
            },
            {
              name: 'Anita S., Industrial Supplier',
              quote: 'The listing process is so simple, and the support team is always there when I need them.',
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg shadow-soft"
              role="blockquote"
              aria-labelledby={`testimonial-name-${index}`}
            >
              <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
              <p id={`testimonial-name-${index}`} className="font-medium text-foreground">
                — {testimonial.name}
              </p>
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
              question: 'How do I start selling on martXmart?',
              answer: 'Sign up for a seller account, complete your profile, and create your first listing. It takes just a few minutes!',
            },
            {
              question: 'Are there any fees for listing?',
              answer: 'Listing is free! We charge a small commission only when your item sells.',
            },
            {
              question: 'Can I sell internationally?',
              answer: 'Yes, martXmart connects you with buyers worldwide, with tools to manage international shipping.',
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

      {/* CTA Section */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
          Ready to Start Selling?
        </h2>
        <p className="text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto">
          Create your seller account and list your first item in just minutes.
        </p>
        <Link href="/vendor-registration" className="inline-block">
          <button
            className="bg-brand-500 text-primary-foreground px-6 py-3 rounded-lg font-medium flex items-center justify-center mx-auto hover:bg-brand-600 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
            aria-label="Create Seller Account"
          >
            Create Seller Account
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </button>
        </Link>
      </section>
    </div>
  );
};

export default Sell;