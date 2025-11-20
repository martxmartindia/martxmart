import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const SuccessStories = () => {
  const stories = [
    {
      name: 'Ravi Kumar',
      company: 'Kumar Earth Movers',
      image: 'https://images.unsplash.com/photo-1603415526960-f8f0b0b6c1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      story: 'After joining martXmart, our business grew by 250% in just 8 months. We now supply heavy equipment across multiple states in India.',
      rating: 5,
    },
    {
      name: 'Priya Shah',
      company: 'Shah Construction Equipments',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      story: 'martXmart gave us nationwide exposure. We saw a 180% increase in high-quality leads and secured major projects across Gujarat and Maharashtra.',
      rating: 5,
    },
    {
      name: 'Arjun Mehta',
      company: 'Mehta Industrial Solutions',
      image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      story: 'Through martXmart, we expanded our client base beyond Delhi to South India. Our revenue has increased by 200% within the first year.',
      rating: 5,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
      {/* Header */}
      <header className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 text-foreground">
          Seller Success Stories
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover how Indian sellers are scaling their businesses with martXmart’s powerful platform.
        </p>
      </header>

      {/* Stories Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {stories.map((story, index) => (
          <div
            key={index}
            className="bg-card p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group"
            role="blockquote"
            aria-labelledby={`story-name-${index}`}
          >
            <div className="flex items-center mb-4">
              <Image
                src={story.image}
                alt={story.name}
                width={64}
                height={64}
                className="Rounded-full mr-4"
                loading="lazy"
              />
              <div>
                <h3 id={`story-name-${index}`} className="font-bold text-foreground">
                  {story.name}
                </h3>
                <p className="text-muted-foreground">{story.company}</p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(story.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-brand-400 fill-current"
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed">{story.story}</p>
          </div>
        ))}
      </section>

      {/* Video Testimonial Section */}
      <section className="bg-brand-50 p-6 sm:p-8 lg:p-10 rounded-lg mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Hear from Our Sellers
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Placeholder; replace with actual video
              title="martXmart Seller Testimonial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-center text-muted-foreground mt-4">
            Watch how martXmart transformed this seller’s business in just months.
          </p>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="mb-12 sm:mb-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-foreground">
          Our Impact Across India
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {[
            { value: '2,00+', label: 'Active Indian Sellers' },
            { value: '₹5Cr+', label: 'Total Sales Volume' },
            { value: '97%', label: 'Seller Satisfaction Rate' },
          ].map((stat, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="text-3xl sm:text-4xl font-bold text-brand-500">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
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
              question: 'How does martXmart help sellers grow?',
              answer: 'We provide tools like featured listings, analytics, and targeted campaigns to boost visibility and sales.',
            },
            {
              question: 'Is it easy to start selling on martXmart?',
              answer: 'Yes! Create an account, list your equipment, and start selling in minutes with our user-friendly platform.',
            },
            {
              question: 'What kind of support do sellers receive?',
              answer: 'Our dedicated support team is available via email, phone, and chat to assist you at every step.',
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
          Ready to Write Your Success Story?
        </h2>
        <p className="text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto">
          Join thousands of successful Indian sellers and start scaling your business today.
        </p>
        <Link href="/vendor-registration" className="inline-block">
          <button
            className="bg-brand-500 text-primary-foreground px-8 py-3 rounded-lg font-medium flex items-center justify-center mx-auto hover:bg-brand-600 transition-colors duration-200 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none"
            aria-label="Start Selling Today"
          >
            Start Selling Today
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </button>
        </Link>
      </section>
    </div>
  );
};

export default SuccessStories;