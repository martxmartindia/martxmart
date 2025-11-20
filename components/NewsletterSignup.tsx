'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Mail, Loader2 } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValidEmail = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>, retryCount = 0) => {
    e.preventDefault();

    if (!isValidEmail) {
      setError('Please enter a valid email address.');
      toast.error('Invalid email address', { style: { background: '#ef4446', color: '#fff' } });
      return;
    }

    setIsSubmitting(true);
    setError('');
    setIsSubmitted(false);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error('Invalid server response. Please try again later.');
      }

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
        toast.success('Successfully subscribed to our newsletter!', {
          style: { background: '#059669', color: '#fff' },
        });
      } else {
        setError(data?.message || 'Failed to subscribe. Please try again.');
        toast.error(data?.message || 'Failed to subscribe', { style: { background: '#ef4444', color: '#fff' } });
        console.error(`Newsletter subscription failed: ${email}, Error: ${data?.message}`);
      }
    } catch (err: any) {
      console.error(`Newsletter subscription error: ${email}, Error: ${err}`, {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        retryCount
      });
      
      // Retry up to 2 times for network errors
      if (retryCount < 2 && (err instanceof TypeError || (err instanceof Error && err.message.includes('fetch')))) {
        setTimeout(() => {
          const syntheticEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
          handleEmailSubmit(syntheticEvent, retryCount + 1);
        }, 1000 * (retryCount + 1));
        return;
      }
      
      setError(`An unexpected error occurred. ${err instanceof Error ? err.message : 'Please try again later.'}`);
      toast.error('An unexpected error occurred', { style: { background: '#ef4444', color: '#fff' } });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      className="relative w-full mx-auto py-6 px-4 b bg-[#112245]  text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >

      <div className="relative z-10 flex flex-col items-center gap-4">
        <motion.div
          className="text-center"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-2">Stay Updated</h2>
          <p className="text-sm">Sign up for our newsletter and receive exclusive offers and updates!</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              className="bg-white/10 backdrop-blur-md p-4 rounded-lg w-full max-w-md text-center"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium">Thank You!</h3>
              <p className="text-sm">
                You have successfully subscribed to our newsletter. Check your inbox for updates.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div className="relative w-full">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:outline-none transition text-sm"
                  aria-label="Email address for newsletter subscription"
                  required
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting || !isValidEmail}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-6 py-2 bg-white text-orange-600 font-medium rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label={isSubmitting ? 'Subscribing to newsletter' : 'Subscribe to newsletter'}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin inline-block" />
                ) : (
                  'Subscribe'
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-sm text-red-200 max-w-md text-center"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}