"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Eye, Download, Share2, ArrowRight, Sparkles, Clock, Mail } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ApplicationSuccessPage = () => {
  const params = useParams();
  const applicationId = params.applicationId as string;
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -10,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 10,
                rotate: 360,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                ease: "easeOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 text-center space-y-6">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="relative mx-auto w-20 h-20"
              >
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping" />
                <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Payment Successful!
                </h1>
                <p className="text-gray-600 text-lg">
                  Your application has been submitted
                </p>
              </motion.div>

              {/* Application Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Application ID</span>
                  <span className="font-mono text-sm bg-white px-3 py-1 rounded-lg border">
                    {applicationId.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Processing will begin within 24 hours</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>Confirmation email sent</span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="space-y-3"
              >
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300 group" 
                  asChild
                >
                  <Link href={`/services/applications/${applicationId}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Application Details
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="rounded-xl border-gray-200 hover:bg-gray-50 transition-colors" 
                    asChild
                  >
                    <Link href="/services">
                      Back to Services
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-xl border-gray-200 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      navigator.share?.({
                        title: 'Application Submitted',
                        text: `Application ${applicationId} has been successfully submitted`,
                        url: window.location.href
                      });
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="bg-blue-50 rounded-2xl p-4 text-left"
              >
                <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Review and verification (1-2 business days)</li>
                  <li>• Status updates via email and SMS</li>
                  <li>• Document processing and approval</li>
                </ul>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationSuccessPage;