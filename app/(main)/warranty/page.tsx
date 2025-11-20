import React from 'react';
import { Shield, PenTool as Tool, Clock, FileText, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Warranty = () => {
  const coverageTypes = [
    {
      title: 'Standard Coverage',
      duration: '30 days',
      features: [
        'Basic mechanical issues',
        'Manufacturing defects',
        'Parts replacement',
        'Technical support',
      ],
      icon: Shield,
    },
    {
      title: 'Extended Protection',
      duration: '1 year',
      features: [
        'All standard coverage',
        'Preventive maintenance',
        'Priority service',
        'Loaner equipment',
      ],
      icon: Clock,
    },
    {
      title: 'Premium Service',
      duration: '2-5 years',
      features: [
        'Comprehensive coverage',
        '24/7 support',
        'On-site repairs',
        'Full replacement guarantee',
      ],
      icon: Tool,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 space-y-12 sm:space-y-16">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground">
          Warranty & Service Policies
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Protect your investment with our comprehensive warranty plans for industrial equipment.
        </p>
      </header>

      {/* Coverage Types */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {coverageTypes.map((coverage, index) => {
          const Icon = coverage.icon;
          return (
            <div
              key={index}
              className="bg-card p-6 sm:p-8 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group"
              role="article"
              aria-labelledby={`coverage-title-${index}`}
            >
              <div className="flex items-center justify-center bg-brand-50 rounded-full w-16 h-16 mb-6 mx-auto">
                <Icon className="h-8 w-8 text-brand-500 group-hover:text-brand-600 transition-colors" aria-hidden="true" />
              </div>
              <h3 id={`coverage-title-${index}`} className="text-xl font-semibold mb-2 text-foreground">
                {coverage.title}
              </h3>
              <p className="text-brand-500 font-bold mb-4">Duration: {coverage.duration}</p>
              <ul className="space-y-2">
                {coverage.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" aria-hidden="true" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      {/* Warranty Registration */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Register Your Warranty
        </h2>
        <p className="text-muted-foreground mb-6 text-center max-w-3xl mx-auto">
          Activate your warranty to ensure full coverage and access to our service network.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: 'Online Registration',
              description: 'Submit your warranty details through our secure online portal.',
              icon: FileText,
            },
            {
              title: 'Quick Activation',
              description: 'Get confirmation within 24 hours and start enjoying your coverage.',
              icon: CheckCircle,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-start animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <item.icon className="h-6 w-6 text-brand-500 mr-4 flex-shrink-0" aria-hidden="true" />
              <div>
                <h4 className="font-bold mb-2 text-foreground">{item.title}</h4>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/warranty/register" className="inline-block">
            <button
              className="bg-brand-500 text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-brand-600 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
              aria-label="Register Your Warranty"
            >
              Register Now
            </button>
          </Link>
        </div>
      </section>

      {/* Warranty Claim Process */}
      <section className="bg-card p-6 sm:p-8 lg:p-10 rounded-lg shadow-soft mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-foreground">
          Warranty Claim Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-foreground">How to File a Claim</h3>
            <ol className="space-y-4 text-muted-foreground">
              {[
                'Document the issue with photos and description',
                'Contact our warranty department',
                'Receive claim number and instructions',
                'Schedule service or repairs',
              ].map((step, idx) => (
                <li key={idx} className="flex items-start animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  <span className="bg-brand-500 text-primary-foreground w-8 h-8 flex items-center justify-center rounded-full mr-4">{idx + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-foreground">Required Documentation</h3>
            <ul className="space-y-4">
              {[
                'Original purchase invoice',
                'Warranty certificate',
                'Maintenance records',
                'Inspection reports',
              ].map((doc, idx) => (
                <li key={idx} className="flex items-center">
                  <FileText className="h-5 w-5 text-brand-500 mr-3" aria-hidden="true" />
                  <span className="text-muted-foreground">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Coverage Details */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
        <div className="bg-card p-6 sm:p-8 rounded-lg shadow-soft">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">What’s Covered</h3>
          <ul className="space-y-3">
            {[
              'Manufacturing defects',
              "Mechanical failures",
              'Electrical system issues',
              'Material defects',
            ].map((item, idx) => (
              <li key={idx} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card p-6 sm:p-8 rounded-lg shadow-soft">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">What’s Not Covered</h3>
          <ul className="space-y-3">
            {[
              'Normal wear and tear',
              'Unauthorized modifications',
              'Improper maintenance',
              'Accidental damage',
            ].map((item, idx) => (
              <li key={idx} className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-3" aria-hidden="true" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Service Network */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Authorized Service Network
        </h2>
        <p className="text-muted-foreground mb-6 text-center max-w-3xl mx-auto">
          Our nationwide network of certified service providers ensures quick and reliable repairs.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {[
            'Factory-trained technicians',
            'Genuine replacement parts',
            'Mobile service units',
            'Emergency repair service',
          ].map((item, idx) => (
            <li key={idx} className="flex items-center animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" />
              <span className="text-muted-foreground">{item}</span>
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
              question: 'How do I register my warranty?',
              answer: 'Visit our online portal, submit your purchase details, and receive confirmation within 24 hours.',
            },
            {
              question: 'What is covered under the warranty?',
              answer: 'Coverage includes manufacturing defects, mechanical and electrical issues, and material defects, depending on your plan.',
            },
            {
              question: 'Can I transfer my warranty if I sell the equipment?',
              answer: 'Yes, warranties are transferable with prior approval. Contact our support team for assistance.',
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
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Need Warranty Service?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Our warranty team is available 24/7 to assist with claims and service needs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/claim" className="inline-block">
            <button
              className="bg-brand-500 text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-brand-600 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
              aria-label="File Warranty Claim"
            >
              File Warranty Claim
            </button>
          </Link>
          <Link href="/contact" className="inline-block">
            <button
              className="border border-brand-500 text-brand-500 px-8 py-3 rounded-lg font-medium hover:bg-brand-50 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
              aria-label="Contact Service Center"
            >
              Contact Service Center
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Warranty;