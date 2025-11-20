import React from 'react';
import { Target, Users, TrendingUp, Zap, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Advertise = () => {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
      {/* Header */}
      <header className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 text-foreground">
          Amplify Your Listings with martXmart Ads
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Reach more buyers and sell faster with our powerful advertising solutions tailored for your machinery.
        </p>
      </header>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {[
          {
            icon: Target,
            title: 'Featured Listings',
            description: 'Gain premium placement at the top of search results and category pages to attract more buyers.',
            cta: 'Learn More',
            href: '/advertise/featured',
          },
          {
            icon: Users,
            title: 'Targeted Campaigns',
            description: 'Reach specific buyer segments based on location, industry, and interests for maximum impact.',
            cta: 'Start Campaign',
            href: '/advertise/campaigns',
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-card p-6 sm:p-8 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group"
            role="article"
            aria-labelledby={`feature-title-${index}`}
          >
            <item.icon className="h-12 w-12 text-brand-500 mb-4 group-hover:text-brand-600 transition-colors" />
            <h3 id={`feature-title-${index}`} className="text-xl sm:text-2xl font-bold mb-4 text-foreground">
              {item.title}
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">{item.description}</p>
            <Link href={item.href} className="inline-block">
              <button
                className="bg-brand-500 text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-brand-600 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
                aria-label={item.cta}
              >
                {item.cta}
              </button>
            </Link>
          </div>
        ))}
      </section>

      {/* Benefits Section */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Why Advertise with martXmart?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: TrendingUp,
              title: 'Increased Visibility',
              description: 'Get up to 5x more views on your listings with premium ad placements.',
            },
            {
              icon: Zap,
              title: 'Faster Sales',
              description: 'Reduce time to sell by up to 50% with targeted advertising.',
            },
            {
              icon: Star,
              title: 'Higher ROI',
              description: 'Maximize returns with cost-effective ad solutions tailored to your goals.',
            },
            {
              icon: Users,
              title: 'Global Reach',
              description: 'Connect with buyers worldwide through our extensive marketplace network.',
            },
          ].map((benefit, index) => (
            <div
              key={index}
              className="flex items-start animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <benefit.icon className="h-6 w-6 text-brand-500 mr-4 flex-shrink-0" aria-hidden="true" />
              <div>
                <h4 className="font-bold mb-2 text-foreground">{benefit.title}</h4>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Choose Your Advertising Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              name: 'Basic',
              price: '₹999/mo',
              features: ['1 Featured Listing', 'Standard Analytics', 'Email Support'],
              cta: 'Choose Basic',
              href: '/advertise/basic',
            },
            {
              name: 'Pro',
              price: '₹2,999/mo',
              features: ['5 Featured Listings', 'Advanced Analytics', 'Priority Support', 'Targeted Campaign Tools'],
              cta: 'Choose Pro',
              href: '/advertise/pro',
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              features: ['Unlimited Listings', 'Custom Analytics', 'Dedicated Account Manager', 'Full Campaign Suite'],
              cta: 'Contact Us',
              href: '/advertise/enterprise',
            },
          ].map((plan, index) => (
            <div
              key={index}
              className={`bg-card p-6 rounded-lg shadow-soft ${index === 1 ? 'border-2 border-brand-500' : ''}`}
              role="article"
              aria-labelledby={`plan-title-${index}`}
            >
              <h3 id={`plan-title-${index}`} className="text-xl font-bold mb-4 text-foreground">
                {plan.name}
              </h3>
              <p className="text-2xl font-bold mb-4 text-brand-500">{plan.price}</p>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-muted-foreground">
                    <Star className="h-4 w-4 text-brand-500 mr-2" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className="inline-block w-full">
                <button
                  className={`w-full px-6 py-2 rounded-lg font-medium transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none ${
                    index === 1
                      ? 'bg-brand-500 text-primary-foreground hover:bg-brand-600'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                  aria-label={`Choose ${plan.name} plan`}
                >
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          What Our Advertisers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              name: 'Vikram P., Equipment Seller',
              quote: 'The featured listings boosted my sales by 40% in just one month!',
            },
            {
              name: 'Priya M., Industrial Supplier',
              quote: 'Targeted campaigns helped me reach the right buyers, saving time and effort.',
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
              question: 'How do I start advertising on martXmart?',
              answer: 'Choose an advertising plan, set up your campaign, and watch your listings gain traction.',
            },
            {
              question: 'What is the difference between Featured Listings and Targeted Campaigns?',
              answer: 'Featured Listings boost visibility with premium placement, while Targeted Campaigns focus on specific buyer segments.',
            },
            {
              question: 'Can I track the performance of my ads?',
              answer: 'Yes, our analytics dashboard provides real-time insights into views, clicks, and conversions.',
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
          Ready to Boost Your Sales?
        </h2>
        <p className="text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto">
          Start advertising today and connect with more buyers in minutes.
        </p>
        <Link href="/auth/login" className="inline-block">
          <button
            className="bg-brand-500 text-primary-foreground px-8 py-3 rounded-lg font-medium flex items-center justify-center mx-auto hover:bg-brand-600 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
            aria-label="Get Started with Advertising"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </button>
        </Link>
      </section>
    </div>
  );
};

export default Advertise;