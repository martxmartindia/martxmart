'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
import Link from 'next/link'
import { toast } from "sonner"

interface TransactionDetails {
  status: string
  transactionId: string
  amount: number
  paymentMethod: string
  createdAt: string
}

const StatusPage = () => {
  const params = useParams()
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    try {
      const orderId = localStorage.getItem("currentOrderId")
      if (!orderId) {
        setError("Order ID not found. Please contact support.")
        return
      }

      const response = await axios.post('/api/payment/status', {
        transactionId: params?.transactionId,
        orderId
      })

      setTransactionDetails(response.data)
      
      if (response.data.status === "SUCCESS") {
        localStorage.removeItem("currentOrderId")
        // clearCart()
        toast.success("Payment completed successfully")
      } else if (response.data.status === "FAILED") {
        toast.error("Payment failed. Please try again.")
      } else {
        toast.info("Payment status: " + response.data.status.toLowerCase())
      }
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : 'Something went wrong. Please contact the website owner.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params?.transactionId) {
      fetchStatus()
    }
  }, [params?.transactionId])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <div className="w-8 h-8 border-4 border-t-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-gray-700">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={() => {
                setLoading(true)
                setError(null)
                setStatus(null)
                if (params?.transactionId) {
                  fetchStatus()
                }
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Payment {transactionDetails?.status.toLowerCase()}
              </h1>
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gray-100">
                <span className="text-sm text-gray-600">Transaction ID: {transactionDetails?.transactionId}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold">  ${transactionDetails?.amount ? transactionDetails.amount.toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold">{transactionDetails?.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Date</span>
                <span className="font-semibold">
                  {transactionDetails?.createdAt ? new Date(transactionDetails.createdAt).toLocaleDateString() : '-'}
                </span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Link href="/" passHref>
                <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Back to Home
                </button>
              </Link>
              <Link href="/account/orders" passHref>
                <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  View Orders
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatusPage
