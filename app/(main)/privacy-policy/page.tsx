import React from 'react';
import { Shield, Lock, Share2, UserCheck, Database, Settings, Bell, HelpCircle, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: [
        'Personal identification information',
        'Contact information',
        'Payment details',
        'Device and usage data',
        'Location information',
      ],
    },
    {
      icon: Lock,
      title: 'How We Protect Your Data',
      content: [
        'SSL/TLS encryption',
        'Regular security audits',
        'Secure data storage',
        'Employee training',
        'Access controls',
      ],
    },
    {
      icon: Share2,
      title: 'Information Sharing',
      content: [
        'Service providers',
        'Legal requirements',
        'Business transfers',
        'With your consent',
      ],
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: [
        'Access your data',
        'Correct your data',
        'Delete your data',
        'Data portability',
        'Withdraw consent',
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 max-w-5xl">
      {/* Header */}
      <header className="text-center space-y-4 mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Learn how we collect, use, and protect your personal information at martXmart.
        </p>
      </header>

      {/* Quick Summary */}
      <section className="mb-12 sm:mb-16">
        <div className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg shadow-soft">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-foreground">
            Your Privacy Matters
          </h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto">
            At martXmart, we are committed to safeguarding your personal information with industry-leading security measures and transparent practices.
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

      {/* Data Retention Policy */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Data Retention Policy
        </h2>
        <p className="text-muted-foreground mb-6 text-center max-w-3xl mx-auto">
          We retain your data only as long as necessary to fulfill the purposes outlined in this policy.
        </p>
        <ul className="space-y-3 max-w-3xl mx-auto">
          {[
            'Account data: Retained while your account is active or as needed to provide services.',
            'Transaction data: Kept for 7 years to comply with legal and tax obligations.',
            'Usage data: Stored for up to 2 years for analytics and service improvement.',
          ].map((item, idx) => (
            <li key={idx} className="flex items-center text-muted-foreground animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Cookie Policy */}
      <section className="bg-card p-6 sm:p-8 lg:p-10 rounded-lg shadow-soft mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Cookie Policy
        </h2>
        <p className="text-muted-foreground mb-6 text-center max-w-3xl mx-auto">
          We use cookies to enhance your experience and provide personalized services.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: 'Essential Cookies',
              description: 'Required for website functionality and user authentication.',
            },
            {
              title: 'Analytics Cookies',
              description: 'Help us understand how users interact with our platform.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-start animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Database className="h-6 w-6 text-brand-500 mr-4 flex-shrink-0" aria-hidden="true" />
              <div>
                <h4 className="font-bold mb-2 text-foreground">{item.title}</h4>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/privacy/cookie-settings" className="inline-block">
            <button
              className="bg-brand-500 text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-brand-600 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
              aria-label="Manage Cookie Settings"
            >
              Manage Cookie Settings
            </button>
          </Link>
        </div>
      </section>

      {/* Data Storage and Processing */}
      <section className="bg-card p-6 sm:p-8 lg:p-10 rounded-lg shadow-soft mb-12 sm:mb-16">
        <div className="flex items-center mb-6">
          <Database className="h-8 w-8 text-brand-500 mr-3" aria-hidden="true" />
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">Data Storage and Processing</h2>
        </div>
        <p className="text-muted-foreground mb-4 max-w-3xl mx-auto">
          Your data is stored securely in certified data centers with state-of-the-art security measures, compliant with GDPR, CCPA, and other privacy laws.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground max-w-3xl mx-auto">
          {[
            'Regular security audits and penetration testing',
            'Encryption at rest and in transit',
            'Access logging and monitoring',
            'Regular backups and disaster recovery planning',
          ].map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Privacy Controls */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg mb-12 sm:mb-16">
        <div className="flex items-center mb-6">
          <Settings className="h-8 w-8 text-brand-500 mr-3" aria-hidden="true" />
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">Your Privacy Controls</h2>
        </div>
        <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
          Take control of your data with our user-friendly privacy management tools.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: 'Privacy Dashboard',
              items: ['View collected data', 'Download your data', 'Modify preferences'],
            },
            {
              title: 'Communication Preferences',
              items: ['Email notifications', 'Marketing communications', 'Newsletter subscriptions'],
            },
          ].map((control, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-3 text-foreground">{control.title}</h3>
              <ul className="space-y-2 text-muted-foreground">
                {control.items.map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="w-2 h-2 bg-brand-500 rounded-full mr-3"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12 sm:mb-16">
        <h2 className= "text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {[
            {
              question: 'How do I access or delete my data?',
              answer: 'Visit our Privacy Dashboard to view, download, or request deletion of your data.',
            },
            {
              question: 'Do you share my data with third parties?',
              answer: 'We only share data with trusted service providers or when required by law, as outlined in our policy.',
            },
            {
              question: 'How can I manage my cookie preferences?',
              answer: 'Use our Cookie Settings tool to customize which cookies we use on your device.',
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

      {/* Updates to Policy */}
      <section className="bg-card p-6 sm:p-8 lg:p-10 rounded-lg shadow-soft mb-12 sm:mb-16">
        <div className="flex items-center mb-6">
          <Bell className="h-8 w-8 text-brand-500 mr-3" aria-hidden="true" />
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">Updates to This Policy</h2>
        </div>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          We may update this privacy policy periodically. You will be notified of changes via email or by checking the “Last Updated” date on this page.
          <br />
          <strong>Last Updated: July 6, 2025</strong>
        </p>
      </section>

      {/* Contact Section */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Contact Us</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Have questions about our Privacy Policy? Reach out to our dedicated support team.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/contact" className="inline-block">
            <button
              className="bg-brand-500 text-primary-foreground px-8 py-3 rounded-lg font-medium flex items-center justify-center mx-auto hover:bg-brand-600 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
              aria-label="Contact Privacy Support"
            >
              Contact Privacy Support
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </button>
          </Link>
          <Link href="/privacy/faq" className="inline-block">
            <button
              className="border border-brand-500 text-brand-500 px-8 py-3 rounded-lg font-medium hover:bg-brand-50 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
              aria-label="View Privacy FAQ"
            >
              View Privacy FAQ
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;