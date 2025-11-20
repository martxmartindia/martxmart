import React from 'react';
import { Truck, Shield, Clock, DollarSign, Scale, ArrowRight, Globe } from 'lucide-react';
import Link from 'next/link';

const ShippingInfo = () => {
  const shippingMethods = [
    {
      name: 'Standard Ground',
      time: '5-7 business days',
      cost: 'Based on weight and distance',
      icon: Truck,
    },
    {
      name: 'Express',
      time: '2-3 business days',
      cost: 'Premium rates apply',
      icon: Clock,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 space-y-12 sm:space-y-16">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground">
          Shipping & Delivery
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Seamless transport solutions for your heavy machinery, delivered worldwide with ease.
        </p>
      </header>

      {/* Shipping Methods */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {shippingMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <div
              key={index}
              className="bg-card p-6 sm:p-8 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group text-center"
              role="article"
              aria-labelledby={`method-title-${index}`}
            >
              <div className="flex items-center justify-center bg-brand-50 rounded-full w-16 h-16 mb-6 mx-auto">
                <Icon className="h-8 w-8 text-brand-500 group-hover:text-brand-600 transition-colors" aria-hidden="true" />
              </div>
              <h3 id={`method-title-${index}`} className="text-xl font-semibold mb-3 text-foreground">
                {method.name}
              </h3>
              <p className="text-muted-foreground mb-2">⏱ Delivery: {method.time}</p>
              <p className="text-muted-foreground">💵 Cost: {method.cost}</p>
            </div>
          );
        })}
      </section>

      {/* Shipping Process */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-foreground">
          How Shipping Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {[
            {
              title: 'For Sellers',
              steps: [
                'Prepare equipment (clean & document)',
                'Select shipping method & receive quotes',
                'Schedule pickup with an approved carrier',
              ],
            },
            {
              title: 'For Buyers',
              steps: [
                'Review shipping options and costs',
                'Confirm delivery location and access',
                'Inspect machinery upon delivery',
              ],
            },
          ].map((section, index) => (
            <div key={index}>
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-foreground">{section.title}</h3>
              <ol className="space-y-4 text-muted-foreground">
                {section.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    <span className="bg-brand-500 text-primary-foreground w-8 h-8 flex items-center justify-center rounded-full mr-4">{idx + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* International Shipping */}
      <section className="bg-card p-6 sm:p-8 lg:p-10 rounded-lg shadow-soft mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          International Shipping
        </h2>
        <p className="text-muted-foreground mb-6 text-center max-w-3xl mx-auto">
          Expand your reach with our global shipping solutions tailored for heavy machinery.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: 'Customs Support',
              description: 'We handle customs documentation and compliance for smooth international delivery.',
              icon: Globe,
            },
            {
              title: 'Global Carriers',
              description: 'Partnered with top logistics providers for reliable worldwide shipping.',
              icon: Truck,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-start animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="h-6 w-6 text-brand-500 mr-4 flex-shrink-0" aria-hidden="true" />
              <div>
                <h4 className="font-bold mb-2 text-foreground">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {[
          { icon: Shield, title: 'Insurance Coverage', desc: 'All shipments fully insured for peace of mind.' },
          { icon: Scale, title: 'Size & Weight Flexibility', desc: 'Specialized transport for all machinery types.' },
          { icon: DollarSign, title: 'Transparent Pricing', desc: 'No hidden fees or surprise charges.' },
        ].map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-card p-6 sm:p-8 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group text-center"
              role="article"
              aria-labelledby={`feature-title-${index}`}
            >
              <div className="flex items-center justify-center bg-brand-50 rounded-full w-16 h-16 mb-6 mx-auto">
                <Icon className="h-8 w-8 text-brand-500 group-hover:text-brand-600 transition-colors" aria-hidden="true" />
              </div>
              <h3 id={`feature-title-${index}`} className="text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          );
        })}
      </section>

      {/* FAQ Section */}
      <section className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {[
            {
              question: 'How are shipping costs calculated?',
              answer: 'Costs are based on weight, dimensions, distance, and selected shipping method (Standard or Express).',
            },
            {
              question: 'Can I track my shipment?',
              answer: 'Yes, you’ll receive a tracking link to monitor your shipment in real-time.',
            },
            {
              question: 'What happens if my equipment is damaged during shipping?',
              answer: 'All shipments are insured, and our support team will assist with claims and resolutions.',
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

      {/* Contact CTA */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Still Have Questions?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Our logistics experts are here to guide you through every step of the shipping process.
        </p>
        <Link href="/contact" className="inline-block">
          <button
            className="bg-brand-500 text-primary-foreground px-8 py-3 rounded-lg font-medium flex items-center justify-center mx-auto hover:bg-brand-600 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
            aria-label="Contact Shipping Support"
          >
            Contact Shipping Support
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </button>
        </Link>
      </section>
    </div>
  );
};

export default ShippingInfo;