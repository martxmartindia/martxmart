"use client"

import { Shield, CheckCircle, DollarSign, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function BuyerProtectionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">
            Buyer Protection Program
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Shop with confidence. Our comprehensive buyer protection program 
            ensures your machinery purchases are safe and secure.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Coverage Details */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
                Payment Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Secure payment processing and escrow services to protect your funds 
                until you receive and verify your machinery.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-orange-600" />
                Quality Assurance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Pre-shipment inspection services and quality verification to ensure 
                machinery meets specified requirements.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                On-Time Shipping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Guaranteed on-time shipping with compensation for delays. Track 
                your shipment every step of the way.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            How Buyer Protection Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-6 inline-block mb-4">
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Place Order</h3>
              <p className="text-gray-600">
                Submit your order and make secure payment through our platform
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-6 inline-block mb-4">
                <CheckCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Verification</h3>
              <p className="text-gray-600">
                We verify the supplier and conduct quality inspection
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-6 inline-block mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Shipping</h3>
              <p className="text-gray-600">
                Track your machinery during shipping and delivery
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-6 inline-block mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Protection</h3>
              <p className="text-gray-600">
                Receive and inspect your machinery before payment release
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-gray-600 mb-6">
            Browse our wide selection of industrial machinery from verified suppliers
          </p>
          <Link href="/products" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded inline-flex items-center">
            Explore Products <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}