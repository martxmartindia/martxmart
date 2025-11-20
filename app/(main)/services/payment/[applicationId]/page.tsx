"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface ServiceApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  service: { title: string; priceAmount: number };
  order: { id: string; razorpayOrderId: string; amount: number; status: string } | null;
}

const PaymentPage = () => {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<ServiceApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applicationId = params.applicationId as string;

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/services/applications/${applicationId}`);
        setApplication(res.data);
      } catch (err) {
        console.error("Error fetching application:", err);
        setError("Failed to load payment details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);


  const handlePayment = async () => {
    if (!application?.order?.razorpayOrderId) {
      toast.error("No Razorpay order found for this application.");
      return;
    }
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use env variable in .env.local
      amount: application.order.amount * 100, // Amount in paise
      currency: "INR",
      name: "martXmart",
      description: `Payment for ${application.service.title}`,
      order_id: application.order.razorpayOrderId,
      handler: async function (response: any) {
        try {
          await axios.post("/api/services/payment/verify", {
            applicationId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          toast.success("Payment successful!");
          router.push(`/services/applications/${applicationId}/success`);
        } catch (err) {
          console.error("Payment verification error:", err);
          toast.error("Payment verification failed. Please contact support.");
        }
      },
      prefill: {
        name: application?.fullName || "",
        email: application?.email || "",
        contact: application?.phone || "",
      },
      theme: {
        color: "#f97316", // Orange-600
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-24 mb-6 rounded-xl" />
          <Card className="max-w-md mx-auto rounded-xl shadow-lg">
            <CardContent className="pt-6">
              <Skeleton className="h-8 w-3/4 mb-4 mx-auto rounded-xl" />
              <Skeleton className="h-6 w-full mb-4 rounded" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !application || !application.order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <Card className="max-w-md w-full rounded-xl shadow-lg">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Payment Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The requested payment could not be found."}</p>
            <Button className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl" asChild>
              <Link href="/services">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/services"
            className="inline-flex items-center text-gray-900 hover:text-orange-600 mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
          </Link>
          <Card className="max-w-md mx-auto rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Payment for {application.service.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium">{application.order.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Amount</span>
                <div className="flex items-center font-medium">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {(application.order.amount).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-medium">{application.order.status}</span>
              </div>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700 rounded-lg"
                onClick={handlePayment}
                disabled={application.order.status !== "PENDING"}
              >
                Proceed to Payment
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;