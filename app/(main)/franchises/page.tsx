import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle2, DollarSign, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FranchisePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Become a Franchise Partner
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Join our growing network of successful franchisees and build a profitable business with our proven
                  business model and comprehensive support system.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/franchise/apply">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#benefits">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] w-full overflow-hidden rounded-full">
              <Image src="/franchise.png" alt="Franchise Opportunity" fill className="object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Partner With Us?</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover the advantages of joining our franchise network
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Proven Business Model</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Benefit from our established and successful business model with a track record of profitability and
                  growth.
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    "Established brand recognition",
                    "Tested and refined operations",
                    "Comprehensive business systems",
                    "Ongoing innovation and development",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Comprehensive Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive extensive training and ongoing support to ensure your franchise success.
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    "Initial training program",
                    "Marketing and advertising support",
                    "Operational guidance",
                    "Regular business reviews",
                    "Technology and systems support",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Financial Advantages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Enjoy strong financial potential with multiple revenue streams and competitive investment
                  requirements.
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    "Lower startup costs than independent business",
                    "Established supplier relationships",
                    "Bulk purchasing advantages",
                    "Multiple revenue streams",
                    "Financing assistance available",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Investment Overview</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Transparent information about what it takes to become a franchise partner
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Investment Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Initial Franchise Fee</span>
                    <span className="text-orange-600 font-bold">₹5,00,000 - ₹10,00,000</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Total Investment</span>
                    <span className="text-orange-600 font-bold">₹20,00,000 - ₹50,00,000</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Royalty Fee</span>
                    <span className="text-orange-600 font-bold">5% of Gross Sales</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Marketing Fee</span>
                    <span className="text-orange-600 font-bold">2% of Gross Sales</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Term of Agreement</span>
                    <span className="text-orange-600 font-bold">5 Years (Renewable)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Space & Location Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Minimum Space Required</span>
                    <span className="text-orange-600 font-bold">800 - 1,200 sq. ft.</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Preferred Locations</span>
                    <span className="text-orange-600 font-bold">High Street, Malls, Commercial Areas</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Population Requirement</span>
                    <span className="text-orange-600 font-bold">Min. 50,000 in catchment area</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Frontage Requirement</span>
                    <span className="text-orange-600 font-bold">Min. 20 feet</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Parking</span>
                    <span className="text-orange-600 font-bold">Preferred</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Franchise Process */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Franchise Process</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Simple steps to become our franchise partner
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <Card className="border-none shadow-md text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-orange-600">1</span>
                </div>
                <CardTitle>Application</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Submit your franchise application and initial qualification process</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-orange-600">2</span>
                </div>
                <CardTitle>Evaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Meet with our team for detailed discussions and location assessment</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-orange-600">3</span>
                </div>
                <CardTitle>Agreement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Sign franchise agreement and complete initial investment</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-orange-600">4</span>
                </div>
                <CardTitle>Launch</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Complete training, set up your location, and grand opening</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Franchise Success Stories</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from our successful franchise partners
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image src="/testimonial-1.jpg" alt="Testimonial" fill className="object-cover" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Rajesh Sharma</CardTitle>
                    <CardDescription>Mumbai Franchise</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "Joining this franchise network was the best business decision I've made. The support system and
                  proven business model helped me achieve profitability within 6 months."
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image src="/testimonial-2.jpg" alt="Testimonial" fill className="object-cover" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Priya Patel</CardTitle>
                    <CardDescription>Bangalore Franchise</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "The comprehensive training and ongoing support have been invaluable. I had no prior experience in
                  this industry, but the team guided me every step of the way."
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image src="/testimonial-3.jpg" alt="Testimonial" fill className="object-cover" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Amit Verma</CardTitle>
                    <CardDescription>Delhi Franchise</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "What impressed me most was the marketing support. The brand recognition and promotional strategies
                  helped us attract customers from day one."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-orange-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to become a franchise partner?
            </h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl">
              Take the first step towards owning your successful franchise business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link href="/franchise-application">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/franchises/faq">
                <Button size="lg" variant="outline">
                  Franchise FAQs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
