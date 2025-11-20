import { CheckCircle, FileText, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProjectReportSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto border border-gray-200 shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-green-50 to-transparent">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Application Submitted Successfully!</CardTitle>
          <CardDescription className="text-gray-600">
            Your project report application has been received and is being processed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">What Happens Next?</h3>
            <ol className="list-decimal pl-5 text-gray-700 space-y-2">
              <li>Our team will review your application within 24 hours.</li>
              <li>We'll prepare your detailed project report based on your requirements.</li>
              <li>The report will be delivered to your email within 7-10 business days.</li>
              <li>You'll receive regular updates on the progress of your report.</li>
            </ol>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Report Details</h4>
                <p className="text-gray-700 mt-1">
                  Your detailed project report will include financial analysis, technical specifications, implementation
                  roadmap, market analysis, and risk assessment.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link href="/project-report">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">View My Applications</Button>
            </Link>
            <Link href="/project-category">
              <Button variant="outline" className="w-full">
                Explore More Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
