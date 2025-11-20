import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function FranchiseFaqPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/franchise">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Franchise
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Franchise FAQs</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about our franchise opportunity</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is the initial investment required?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      The initial investment ranges from ₹20,00,000 to ₹50,00,000, which includes the franchise fee,
                      store setup costs, initial inventory, equipment, and working capital. The exact amount depends on
                      factors such as location, size of the outlet, and local market conditions.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>What is the franchise fee and what does it cover?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      The franchise fee ranges from ₹5,00,000 to ₹10,00,000 and covers the rights to use our brand name,
                      trademarks, and business system. It also includes comprehensive initial training, pre-opening
                      support, operations manual, and assistance with site selection and store setup.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>What ongoing fees will I need to pay?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      Franchisees pay a royalty fee of 5% of gross sales and a marketing fee of 2% of gross sales. The
                      royalty fee contributes to ongoing support, training, and system development, while the marketing
                      fee funds national and regional advertising campaigns that benefit all franchisees.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>What training and support do you provide?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">We provide comprehensive training and support, including:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                      <li>Initial 2-week training program at our headquarters</li>
                      <li>On-site training during store setup and launch</li>
                      <li>Operations manual and business management systems</li>
                      <li>Marketing and promotional support</li>
                      <li>Ongoing training for you and your staff</li>
                      <li>Regular business reviews and performance optimization</li>
                      <li>24/7 helpdesk for operational issues</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>What are the space requirements?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      Our standard franchise requires 800-1,200 square feet of retail space. The location should ideally
                      be in high-traffic areas such as high streets, shopping malls, or commercial complexes with good
                      visibility and accessibility. We provide guidelines for store layout and design to maximize
                      operational efficiency and customer experience.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>How long does it take to open a franchise?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      The typical timeline from signing the franchise agreement to store opening is 3-6 months. This
                      includes site selection and approval, lease negotiation, store design and construction, equipment
                      installation, inventory procurement, staff hiring and training, and pre-opening marketing.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>Do I need prior business experience?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      While prior business experience is beneficial, it is not mandatory. We look for franchisees who
                      are passionate, dedicated, and willing to follow our proven system. Strong leadership, people
                      management, and customer service skills are important. Our comprehensive training program is
                      designed to equip you with the necessary knowledge and skills to run the business successfully.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>What is the term of the franchise agreement?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      The initial term of the franchise agreement is 5 years, with an option to renew for additional
                      5-year terms subject to meeting certain criteria. Renewal fees are typically lower than the
                      initial franchise fee and are determined at the time of renewal.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger>Is financing available?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      While we do not provide direct financing, we can refer you to preferred lenders who are familiar
                      with our business model and have financed our franchisees in the past. We also provide guidance on
                      preparing business plans and loan applications. Additionally, we have established relationships
                      with equipment suppliers who offer favorable leasing terms.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                  <AccordionTrigger>What is the typical return on investment?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      While we cannot guarantee specific returns as they vary based on multiple factors including
                      location, management, local market conditions, and individual performance, our established
                      franchisees typically see a return on investment within 24-36 months. During the discovery
                      process, we share more detailed financial information and unit economics with qualified
                      candidates.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Have More Questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you couldn't find the answer to your question, please feel free to contact our franchise development
                team.
              </p>
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="font-medium mr-2">Email:</span>
                  <a href="mailto:franchise@whtsupmart.com" className="text-orange-600 hover:text-orange-700">
                    franchise@whtsupmart.com
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">Phone:</span>
                  <a href="tel:+919876543210" className="text-orange-600 hover:text-orange-700">
                    +91 9876543210
                  </a>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/contact">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">Request Information</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ready to Apply?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Take the first step towards owning your own franchise business by submitting an application today.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/franchise-application" className="w-full">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Download Franchise Brochure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Get detailed information about our franchise opportunity, investment requirements, and support system.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Download Brochure
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
