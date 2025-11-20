'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';


export default function UnsubscribePage() {
  const searchParams = useParams();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleUnsubscribe = async () => {
    const email = searchParams.email;
    if (!email) {
      setMessage('Invalid email address');
      setStatus('error');
      return;
    }

    try {
      setStatus('loading');
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('You have been successfully unsubscribed from our newsletter.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to unsubscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Newsletter Unsubscribe
        </h1>

        {status === 'idle' && (
          <>
            <p className="text-gray-600 mb-6">
              Are you sure you want to unsubscribe from our newsletter?
            </p>
            <button
              onClick={handleUnsubscribe}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Unsubscribe
            </button>
          </>
        )}

        {status === 'loading' && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {(status === 'success' || status === 'error') && (
          <div
            className={`p-4 rounded-md ${status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
          >
            <p>{message}</p>
            {status === 'success' && (
              <p className="mt-4 text-sm text-gray-600">
                You can always subscribe again from our website.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}