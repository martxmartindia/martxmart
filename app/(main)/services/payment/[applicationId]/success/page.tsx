"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const PaymentSuccessPage = () => {
  const params = useParams();
  const applicationId = params.applicationId as string;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <Card className="max-w-md mx-auto rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              Payment Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Your payment for application ID <span className="font-medium">{applicationId}</span> has been processed successfully. You’ll receive a confirmation email soon.
            </p>
            <div className="space-y-2">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl" asChild>
                <Link href="/services">Back to Services</Link>
              </Button>
              <Button variant="outline" className="w-full rounded-xl" asChild>
                <Link href={`/services/applications/${applicationId}`}>
                  View Application Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;