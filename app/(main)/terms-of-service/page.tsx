import React from 'react';
import { FileText, ShieldCheck, Scale, Truck, RotateCcw, AlertTriangle, Book, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const TermsOfService = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Agreement to Terms',
      content: [
        'Acceptance of terms',
        'Changes to terms',
        'Access to services',
        'User obligations',
      ],
    },
    {
      icon: ShieldCheck,
      title: 'User Responsibilities',
      content: [
        'Account security',
        'Content guidelines',
        'Prohibited activities',
        'Data accuracy',
      ],
    },
    {
      icon: Scale,
      title: 'Legal Compliance',
      content: [
        'Applicable laws',
        'Intellectual property',
        'User rights',
        'Dispute resolution',
      ],
    },
    {
      icon: AlertTriangle,
      title: 'Limitations',
      content: [
        'Service availability',
        'Warranty disclaimers',
        'Liability limits',
        'Force majeure',
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 max-w-5xl">
      {/* Header */}
      <header className="text-center space-y-4 mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Please read these terms carefully before using our platform and services.
        </p>
      </header>

      {/* Quick Summary */}
      <section className="mb-12 sm:mb-16">
        <div className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg shadow-soft">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-foreground">
            Welcome to martXmart
          </h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto">
            These Terms of Service govern your use of the martXmart platform. By accessing our services, you agree to comply with these terms.
          </p>
        </div>
      </section>

      {/* Main Sections */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-card p-6 sm:p-8 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group"
            role="article"
            aria-labelledby={`section-title-${index}`}
          >
            <div className="flex items-center mb-4">
              <section.icon className="h-8 w-8 text-brand-500 mr-3 group-hover:text-brand-600 transition-colors" aria-hidden="true" />
              <h2 id={`section-title-${index}`} className="text-xl sm:text-2xl font-semibold text-foreground">
                {section.title}
              </h2>
            </div>
            <ul className="space-y-3">
              {section.content.map((item, idx) => (
                <li key={idx} className="flex items-center text-muted-foreground animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  <span className="w-2 h-2 bg-brand-500 rounded-full mr-3"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Termination Policy */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Termination Policy
        </h2>
        <p className="text-muted-foreground mb-6 text-center max-w-3xl mx-auto">
          We reserve the right to terminate or suspend accounts for violations of our terms.
        </p>
        <ul className="space-y-3 max-w-3xl mx-auto">
          {[
            'Non-compliance with user responsibilities',
            'Engaging in prohibited activities',
            'Fraudulent or misleading information',
            'Repeated policy violations',
          ].map((item, idx) => (
            <li key={idx} className="flex items-center text-muted-foreground animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Dispute Resolution */}
      <section className="bg-card p-6 sm:p-8 lg:p-10 rounded-lg shadow-soft mb-12 sm:mb-16">
        <div className="flex items-center mb-6">
          <Scale className="h-8 w-8 text-brand-500 mr-3" aria-hidden="true" />
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">Dispute Resolution</h2>
        </div>
        <p className="text-muted-foreground mb-4 max-w-3xl mx-auto">
          We aim to resolve disputes fairly and efficiently through the following process:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground max-w-3xl mx-auto">
          {[
            'Contact our support team to initiate a dispute',
            'Mediation with a neutral third party if needed',
            'Resolution within 30 days of filing',
            'Arbitration as a final step, if necessary',
          ].map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Shipping and Delivery */}
      <section className="bg-card p-6 sm:p-8 lg:p-10 rounded-lg shadow-soft mb-12 sm:mb-16">
        <div className="flex items-center mb-6">
          <Truck className="h-8 w-8 text-brand-500 mr-3" aria-hidden="true" />
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">Shipping and Delivery</h2>
        </div>
        <p className="text-muted-foreground mb-4 max-w-3xl mx-auto">
          Our shipping terms ensure reliable delivery of your heavy machinery:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground max-w-3xl mx-auto">
          {[
            'Delivery times are estimates and not guaranteed',
            'Risk of loss transfers upon delivery to the carrier',
            'Customer is responsible for accurate shipping information',
            'Additional charges may apply for special shipping requirements',
          ].map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Returns and Refunds */}
      <section className="bg-card p-6 sm:p-8 lg:p-10 rounded-lg shadow-soft mb-12 sm:mb-16">
        <div className="flex items-center mb-6">
          <RotateCcw className="h-8 w-8 text-brand-500 mr-3" aria-hidden="true" />
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">Returns and Refunds</h2>
        </div>
        <p className="text-muted-foreground mb-4 max-w-3xl mx-auto">
          Our return policy is designed to be fair and straightforward:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground max-w-3xl mx-auto">
          {[
            '30-day return window from date of receipt',
            'Items must be in original condition and packaging',
            'Return shipping costs are buyer’s responsibility unless otherwise stated',
            'Refunds processed within 14 business days',
          ].map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Intellectual Property */}
      <section className="bg-card p-6 sm:p-8 lg:p-10 rounded-lg shadow-soft mb-12 sm:mb-16">
        <div className="flex items-center mb-6">
          <Book className="h-8 w-8 text-brand-500 mr-3" aria-hidden="true" />
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">Intellectual Property</h2>
        </div>
        <p className="text-muted-foreground mb-4 max-w-3xl mx-auto">
          All content on martXmart is protected by intellectual property rights:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground max-w-3xl mx-auto">
          {[
            'Trademarks and logos are our exclusive property',
            'Content may not be reproduced without permission',
            'User-generated content remains user property',
            'License granted for personal, non-commercial use',
          ].map((item, idx) => (
            <li key={idx}>{item}</li>
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
              question: 'What happens if I violate the Terms of Service?',
              answer: 'Violations may lead to account suspension or termination, as outlined in our Termination Policy.',
            },
            {
              question: 'How can I dispute a transaction or issue?',
              answer: 'Contact our support team to initiate a dispute, and we’ll guide you through our resolution process.',
            },
            {
              question: 'Can the Terms of Service change?',
              answer: 'Yes, we may update these terms. You’ll be notified via email or through our platform.',
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

      {/* Contact Section */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Contact Us</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Have questions about our Terms of Service? Reach out to our support team for assistance.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/contact" className="inline-block">
            <button
              className="bg-brand-500 text-primary-foreground px-8 py-3 rounded-lg font-medium flex items-center justify-center mx-auto hover:bg-brand-600 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
              aria-label="Contact Support"
            >
              Contact Support
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </button>
          </Link>
          <Link href="/terms/faq" className="inline-block">
            <button
              className="border border-brand-500 text-brand-500 px-8 py-3 rounded-lg font-medium hover:bg-brand-50 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
              aria-label="View Terms FAQ"
            >
              View Terms FAQ
            </button>
          </Link>
        </div>
        <p className="text-muted-foreground mt-4">
          <strong>Last Updated: July 6, 2025</strong>
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;