'use client';

import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

const InstallationSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear errors on change
  };

  const handleRadioChange = (value: string) => {
    setFormData({ ...formData, inquiryType: value });
    setErrors({ ...errors, inquiryType: '' });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Mock response for development if API is unavailable
      if (process.env.NODE_ENV === 'development') {
        setIsSubmitted(true);
        toast.success('Your message has been sent successfully (mocked)!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          inquiryType: 'general',
        });
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post('/api/contact', formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general',
      });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      toast.success('Your message has been sent successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-brand-900 to-brand-800 text-primary-foreground py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6"
          >
            Installation & After-Sales Support
          </motion.h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Seamless installation and dedicated support to keep your operations running smoothly.
          </p>
          <Link
            href="#contact"
            className="mt-8 inline-block bg-brand-500 text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-brand-600 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-all duration-200 transform hover:scale-105"
            aria-label="Get Support Now"
          >
            Get Support Now
          </Link>
        </div>
      </header>

      {/* Services Section */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground text-center mb-12">
            Our Support Services
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          >
            {[
              {
                title: 'Professional Installation',
                description: 'Expert setup for equipment and systems with precision.',
              },
              {
                title: '24/7 Support',
                description: 'Round-the-clock assistance for any technical issues.',
              },
              {
                title: 'Maintenance Plans',
                description: 'Customized plans to ensure long-term performance.',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 sm:p-8 bg-card rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 border-t-4 border-brand-500"
              >
                <h3 className="text-xl font-semibold text-foreground mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 bg-brand-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-lg shadow-soft p-6 sm:p-8"
            >
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6">
                Need Support? Reach Out
              </h2>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="bg-brand-50 p-3 rounded-full inline-flex mb-4">
                    <CheckCircle className="h-12 w-12 text-brand-500" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Thank You!</h3>
                  <p className="text-muted-foreground mb-6">
                    Your message has been sent successfully. Our team will get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: '',
                        message: '',
                        inquiryType: 'general',
                      });
                      setErrors({});
                    }}
                    className="bg-brand-500 text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-brand-600 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-all duration-200"
                    aria-label="Send Another Message"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                        Your Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground transition-all duration-200 ${errors.name ? 'border-red-500' : ''}`}
                        aria-label="Your Name"
                        required
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                          Email Address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground transition-all duration-200 ${errors.email ? 'border-red-500' : ''}`}
                          aria-label="Email Address"
                          required
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground transition-all duration-200"
                          aria-label="Phone Number"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Inquiry Type</label>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {[
                          { value: 'general', label: 'General Inquiry' },
                          { value: 'sales', label: 'Sales Support' },
                          { value: 'technical', label: 'Technical Support' },
                          { value: 'partnership', label: 'Partnership' },
                        ].map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={option.value}
                              name="inquiryType"
                              value={option.value}
                              checked={formData.inquiryType === option.value}
                              onChange={() => handleRadioChange(option.value)}
                              className="h-4 w-4 text-brand-500 focus:ring-brand-400 border-gray-300"
                              aria-label={option.label}
                            />
                            <label htmlFor={option.value} className="text-sm text-foreground cursor-pointer">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
                        Subject
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter message subject"
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground transition-all duration-200 ${errors.subject ? 'border-red-500' : ''}`}
                        aria-label="Subject"
                        required
                      />
                      {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe your support needs..."
                        rows={5}
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground transition-all duration-200 ${errors.message ? 'border-red-500' : ''}`}
                        aria-label="Your Message"
                        required
                      />
                      {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-brand-500 text-primary-foreground px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-brand-600 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                    aria-label="Send Message"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" aria-hidden="true" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-lg shadow-soft p-6 sm:p-8"
            >
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6">
                Our Location
              </h2>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.3221940211606!2d87.46947467525534!3d25.792942577332276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eff9a0cc546c61%3A0xeaaad267b03c66b0!2sTRADEMINDS%20MACHINERY%20PRIVATE%20LIMITED!5e0!3m2!1shi!2sin!4v1745759252609!5m2!1shi!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute top-0 left-0 w-full h-full"
                  title="martXmart Headquarters Location"
                />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">martXmart Headquarters</h3>
                <p className="text-muted-foreground mb-4">
                  Shashi Bhawan, Court Station Road, Jayprakash Nagar, Purnea, Bihar 854301
                </p>
                <p className="text-muted-foreground">
                  Our headquarters is conveniently located in Purnia, easily accessible by public
                  transportation and with ample parking available for visitors.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InstallationSupport;