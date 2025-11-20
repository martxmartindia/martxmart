"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Download,
  Share2,
  Copy,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface ServiceApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  service: { title: string; description?: string };
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

const ApplicationDetailsPage = () => {
  const params = useParams();
  const applicationId = params.applicationId as string;
  const [application, setApplication] = useState<ServiceApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/services/applications/${applicationId}`);
      setApplication(res.data);
    } catch (err) {
      console.error("Error fetching application:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshApplication = async () => {
    setRefreshing(true);
    await fetchApplication();
    setRefreshing(false);
    toast.success("Application details refreshed");
  };

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'processing': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-8">
            <Skeleton className="h-10 w-32 mb-4 rounded-xl" />
            <Skeleton className="h-8 w-64 rounded-xl" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4 rounded" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-20 rounded" />
                      <Skeleton className="h-4 w-32 rounded" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-24 mb-4 rounded" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full rounded" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900">Application Not Found</h2>
          <p className="text-gray-600">The application you're looking for doesn't exist or has been removed.</p>
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl px-8" asChild>
            <Link href="/services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/services" 
            className="inline-flex items-center text-gray-600 hover:text-orange-600 mb-4 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Details</h1>
              <p className="text-gray-600">Track your service application status and details</p>
            </div>
            <Button
              variant="outline"
              onClick={refreshApplication}
              disabled={refreshing}
              className="rounded-xl"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Application Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Application Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Application ID</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                      {application.id.slice(0, 8)}...
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(application.id, 'Application ID')}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Service</span>
                  <span className="font-medium text-gray-900">{application.service.title}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={`${getStatusColor(application.status)} flex items-center gap-1`}>
                    {getStatusIcon(application.status)}
                    {application.status}
                  </Badge>
                </div>

                {application.createdAt && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">Submitted</span>
                    <span className="text-sm text-gray-900">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="h-5 w-5 text-green-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <User className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <span className="text-sm text-gray-600">Full Name</span>
                    <p className="font-medium text-gray-900">{application.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <span className="text-sm text-gray-600">Email</span>
                    <p className="font-medium text-gray-900">{application.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(application.email, 'Email')}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <span className="text-sm text-gray-600">Phone</span>
                    <p className="font-medium text-gray-900">{application.phone}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(application.phone, 'Phone')}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-8"
            onClick={() => {
              navigator.share?.({
                title: 'Application Details',
                text: `Application ${application.id} - ${application.service.title}`,
                url: window.location.href
              });
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Application
          </Button>
          <Button
            variant="outline"
            className="rounded-xl px-8 border-gray-200 hover:bg-gray-50"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;