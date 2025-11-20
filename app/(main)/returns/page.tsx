import React from 'react';
import { RefreshCw, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Returns = () => {
  const returnSteps = [
    {
      title: 'Initiate Return',
      description: 'Notify the seller within 48 hours after delivery if there are any issues with your equipment.',
      icon: Clock,
    },
    {
      title: 'Inspection',
      description: 'Document the condition with clear photos and a detailed description for quick approval.',
      icon: CheckCircle,
    },
    {
      title: 'Resolution',
      description: 'Collaborate with the seller for repair, replacement, or refund options based on your needs.',
      icon: RefreshCw,
    },
  ];

  const policies = [
    {
      title: 'Eligible Items',
      items: [
        'Machinery not matching description',
        'Significant undisclosed defects',
        'Wrong item received',
        'Damaged during shipping (if insured)',
      ],
    },
    {
      title: 'Non-Eligible Items',
      items: [
        'Used or operated equipment (post-inspection)',
        'Buyer-caused damages',
        'Buyer-modified items',
        'Normal wear and tear',
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 space-y-12 sm:space-y-16">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground">
          Returns & Refunds
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about our hassle-free return process for industrial equipment.
        </p>
      </header>

      {/* Return Steps */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {returnSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={index}
              className="bg-card p-6 sm:p-8 rounded-lg shadow-soft障碍-shadow-medium transition-all duration-300 hover:-translate-y-1 group"
              role="article"
              aria-labelledby={`step-title-${index}`}
            >
              <div className="flex items-center justify-center bg-brand-50 rounded-full w-16 h-16 mb-6 mx-auto">
                <Icon className="text-brand-500 w-8 h-8 group-hover:text-brand-600 transition-colors" aria-hidden="true" />
              </div>
              <h3 id={`step-title-${index}`} className="text-xl font-semibold text-center mb-2 text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-center leading-relaxed">{step.description}</p>
            </div>
          );
        })}
      </section>

      {/* Buyer Protection */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          martXmart Buyer Protection
        </h2>
        <p className="text-muted-foreground mb-6 text-center max-w-3xl mx-auto">
          We ensure a secure and fair buying experience with our comprehensive protection program.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: 'Secure Transactions',
              description: 'All payments are processed through our secure escrow system.',
              icon: CheckCircle,
            },
            {
              title: 'Dispute Resolution',
              description: 'Our team mediates to resolve issues fairly and promptly.',
              icon: RefreshCw,
            },
          ].map((protection, index) => (
            <div
              key={index}
              className="flex items-start animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <protection.icon className="h-6 w-6 text-brand-500 mr-4 flex-shrink-0" aria-hidden="true" />
              <div>
                <h4 className="font-bold mb-2 text-foreground">{protection.title}</h4>
                <p className="text-muted-foreground">{protection.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Return Policies */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {policies.map((policy, index) => (
          <div key={index} className="bg-card p-6 sm:p-8 rounded-lg shadow-soft">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-foreground">{policy.title}</h2>
            <ul className="space-y-4">
              {policy.items.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  {index === 0 ? (
                    <CheckCircle className="text-green-500 w-5 h-5 mt-1 mr-3" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="text-red-500 w-5 h-5 mt-1 mr-3" aria-hidden="true" />
                  )}
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Refund Process */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
          Refund Process
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Once a return is initiated and inspected, refunds are processed based on the following timelines:
        </p>
        <ul className="list-disc list-inside mt-4 text-muted-foreground space-y-2 max-w-md mx-auto">
          <li>Credit card refunds: 5–10 business days</li>
          <li>Bank transfers: 7–14 business days</li>
          <li>UPI refunds: 3–7 business days</li>
        </ul>
      </section>

      {/* Return Shipping */}
      <section className="bg-card p-6 sm:p-8 lg:p-10 rounded-lg shadow-soft space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
          Return Shipping
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Shipping responsibilities depend on the reason for return:
        </p>
        <ul className="space-y-4 max-w-md mx-auto">
          {[
            { label: 'Item Not as Described', payer: 'Seller pays return shipping' },
            { label: 'Buyer’s Remorse', payer: 'Buyer pays return shipping' },
            { label: 'Damaged in Transit', payer: 'Covered by shipping insurance' },
          ].map((item, idx) => (
            <li key={idx} className="flex items-start">
              <CheckCircle className="text-green-500 w-5 h-5 mr-3 mt-1" aria-hidden="true" />
              <div>
                <p className="font-bold text-foreground">{item.label}</p>
                <p className="text-muted-foreground">{item.payer}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ Section */}
      <section className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {[
            {
              question: 'How do I initiate a return?',
              answer: 'Log into your account, go to your order history, and select “Request Return” within 48 hours of delivery.',
            },
            {
              question: 'What if the seller disputes my return?',
              answer: 'Our dispute resolution team will review the case and mediate to ensure a fair outcome.',
            },
            {
              question: 'Are there any fees for returns?',
              answer: 'No fees are charged for eligible returns, but buyer-paid shipping may apply for non-eligible items.',
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
          Need Help with a Return?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Our support team is ready to assist you promptly with any return or refund queries.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/account" className="inline-block">
            <button
              className="bg-brand-500 text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-brand-600 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
              aria-label="Start Return"
            >
              Start Return
            </button>
          </Link>
          <Link href="/contact" className="inline-block">
            <button
              className="border border-brand-500 text-brand-500 px-8 py-3 rounded-lg font-medium hover:bg-brand-50 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
              aria-label="Contact Support"
            >
              Contact Support
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Returns;