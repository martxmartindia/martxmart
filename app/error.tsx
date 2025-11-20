'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    console.error('Error occurred:', error)
  }, [error])

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      reset()
    } catch {
      window.location.reload()
    } finally {
      setTimeout(() => setIsRetrying(false), 1000)
    }
  }

  const getErrorMessage = () => {
    if (error.message.includes('ENOTFOUND') || error.message.includes('network')) {
      return 'Network connection issue. Please check your internet connection.'
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. The server is taking too long to respond.'
    }
    if (error.message.includes('404')) {
      return 'The requested resource was not found.'
    }
    return 'An unexpected error occurred. Our team has been notified.'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {getErrorMessage()}
            </p>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Error Details
              </summary>
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-xs font-mono text-gray-700 dark:text-gray-300 overflow-auto max-h-32">
                {error.message}
                {error.digest && (
                  <div className="mt-1 text-gray-500 dark:text-gray-400">
                    Digest: {error.digest}
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleRetry} 
              disabled={isRetrying}
              className="w-full"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </>
              )}
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              If this problem persists, please{' '}
              <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
