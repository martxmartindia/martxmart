'use client'

import { DollarSign, Clock, FileText, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export default function FinancingPage() {
  const [loanAmount, setLoanAmount] = useState('')
  const [term, setTerm] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="container mx-auto text-center px-4">
          <DollarSign className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-5xl font-extrabold mb-4">Machinery Financing Solutions</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Flexible financing options to help you grow your business with the latest machinery.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto py-16 px-4 space-y-16">
        
        {/* Financing Options */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-10">Our Financing Options</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Equipment Loans',
                features: [
                  'Up to 100% financing',
                  'Terms up to 84 months',
                  'Competitive interest rates',
                  'Quick approval process',
                ],
              },
              {
                title: 'Leasing Options',
                features: [
                  'Low monthly payments',
                  'Flexible end-of-term options',
                  'Tax advantages',
                  'Upgrade options available',
                ],
              },
              {
                title: 'Working Capital',
                features: [
                  'Fast funding',
                  'Flexible use of funds',
                  'Simple application process',
                  'No collateral required',
                ],
              },
            ].map((option, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-orange-600 hover:bg-orange-700">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Loan Calculator */}
        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6">Payment Calculator</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="amount">Loan Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter loan amount"
                    className="pl-10"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="term">Loan Term (Months)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="term"
                    type="number"
                    placeholder="Enter loan term"
                    className="pl-10"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                  />
                </div>
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Calculate Payment
              </Button>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center flex flex-col justify-center">
              <h3 className="text-lg font-semibold mb-4">Estimated Monthly Payment</h3>
              <div className="text-4xl font-extrabold text-orange-600 mb-2">
                ₹0.00
              </div>
              <p className="text-sm text-gray-500">
                *This is an estimate. Actual payment may vary based on credit approval and terms.
              </p>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-10">Simple Application Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: 'Apply Online', icon: FileText, description: 'Complete our simple application form' },
              { title: 'Quick Review', icon: Clock, description: 'Get decision within 24-48 hours' },
              { title: 'Approval', icon: CheckCircle, description: 'Accept your financing terms' },
              { title: 'Funding', icon: DollarSign, description: 'Receive funds quickly' },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-orange-100 p-6 rounded-full inline-flex mb-4">
                  <step.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-orange-50 text-center rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Apply now and get the financing you need for your machinery purchase.
          </p>
          <Button className="bg-orange-600 hover:bg-orange-700">
            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </section>

      </div>
    </div>
  )
}
