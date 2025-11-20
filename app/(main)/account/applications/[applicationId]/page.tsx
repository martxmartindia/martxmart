'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
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
  RefreshCw,
  Copy,
  Loader2,
  Building,
  MapPin,
  DollarSign,
  Users,
  Briefcase,
  Shield,
  Package,
  MessageSquare,
  Download,
  ExternalLink,
  Eye,
  Verified
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ApplicationDetail {
  id: string;
  type?: string;
  title?: string;
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
  updatedAt?: string;
  fullName?: string;
  businessName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  message?: string;
  gstType?: string;
  annualTurnover?: string;
  businessType?: string;
  msmeCategory?: string;
  investmentInPlant?: number;
  numberOfEmployees?: number;
  companyType?: string;
  proposedNames?: string[];
  businessActivity?: string;
  trademarkType?: string;
  trademarkClass?: number;
  logoUrl?: string;
  serviceId?: string;
  serviceOrderId?: string;
  assignedToUserId?: string;
  service?: {
    title: string;
    description?: string;
  };
  order?: {
    id: string;
    amount: number;
    totalAmount: number;
    status: string;
  };
  documents?: {
    id: string;
    documentType: string;
    documentUrl: string;
    isVerified: boolean;
    uploadedAt: string;
  }[];
  notes?: {
    id: string;
    note: string;
    createdAt: string;
  }[];
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const applicationId = params.applicationId as string;
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplication = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Unauthorized. Please login.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/applications/${applicationId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Application not found');
        } else if (response.status === 401) {
          setError('Unauthorized. Please log in again.');
          localStorage.removeItem('token');
        } else {
          setError('Failed to load application details');
        }
      } else {
        const data = await response.json();
        setApplication(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching application:', err);
      setError('Failed to load application details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchApplication();
    toast.success('Application details refreshed');
  };

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="h-4 w-4" />,
          bgColor: 'bg-yellow-50'
        };
      case 'IN_REVIEW':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <AlertCircle className="h-4 w-4" />,
          bgColor: 'bg-blue-50'
        };
      case 'APPROVED':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="h-4 w-4" />,
          bgColor: 'bg-green-50'
        };
      case 'REJECTED':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="h-4 w-4" />,
          bgColor: 'bg-red-50'
        };
      case 'COMPLETED':
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <CheckCircle className="h-4 w-4" />,
          bgColor: 'bg-emerald-50'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <FileText className="h-4 w-4" />,
          bgColor: 'bg-gray-50'
        };
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
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto" />
              <p className="text-gray-600 font-medium">Loading application details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 max-w-md mx-auto"
          >
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-gray-900">Application Not Found</h2>
            <p className="text-gray-600">{error || 'The application you\'re looking for doesn\'t exist.'}</p>
            <div className="space-y-3">
              <Button onClick={handleRefresh} disabled={refreshing} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Try Again
              </Button>
              <Button variant="outline" className="rounded-xl" asChild>
                <Link href="/account/applications">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Applications
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(application.status);

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
            href="/account/applications" 
            className="inline-flex items-center text-gray-600 hover:text-orange-600 mb-4 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Applications
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Details</h1>
              <p className="text-gray-600">View your application status and information</p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
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
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={`${statusConfig.color} flex items-center gap-1`}>
                    {statusConfig.icon}
                    {application.status.replace('_', ' ')}
                  </Badge>
                </div>

                {application.service && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">Service</span>
                    <span className="text-sm font-medium text-gray-900">{application.service.title}</span>
                  </div>
                )}

                {application.type && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="text-sm font-medium text-gray-900">{application.type}</span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Applied On</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(application.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {application.updatedAt && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(application.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="h-5 w-5 text-green-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.fullName && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Full Name</p>
                      <p className="text-sm font-medium text-gray-900">{application.fullName}</p>
                    </div>
                  </div>
                )}

                {application.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                      <p className="text-sm font-medium text-gray-900">{application.email}</p>
                    </div>
                  </div>
                )}

                {application.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{application.phone}</p>
                    </div>
                  </div>
                )}

                {(application.address || application.city || application.state || application.pincode) && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                      <div className="text-sm font-medium text-gray-900 space-y-1">
                        {application.address && <p>{application.address}</p>}
                        <p>
                          {[application.city, application.state, application.pincode].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Business Information */}
        {(application.businessName || application.businessType || application.gstType) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Building className="h-5 w-5 text-purple-600" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {application.businessName && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Building className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Business Name</p>
                        <p className="text-sm font-medium text-gray-900">{application.businessName}</p>
                      </div>
                    </div>
                  )}

                  {application.businessType && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Business Type</p>
                        <p className="text-sm font-medium text-gray-900">{application.businessType}</p>
                      </div>
                    </div>
                  )}

                  {application.gstType && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">GST Type</p>
                        <p className="text-sm font-medium text-gray-900">{application.gstType}</p>
                      </div>
                    </div>
                  )}

                  {application.annualTurnover && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Annual Turnover</p>
                        <p className="text-sm font-medium text-gray-900">₹{application.annualTurnover}</p>
                      </div>
                    </div>
                  )}

                  {application.numberOfEmployees && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Employees</p>
                        <p className="text-sm font-medium text-gray-900">{application.numberOfEmployees}</p>
                      </div>
                    </div>
                  )}

                  {application.investmentInPlant && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Package className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Investment in Plant</p>
                        <p className="text-sm font-medium text-gray-900">₹{application.investmentInPlant.toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {application.msmeCategory && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">MSME Category</p>
                        <p className="text-sm font-medium text-gray-900">{application.msmeCategory}</p>
                      </div>
                    </div>
                  )}

                  {application.companyType && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Building className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Company Type</p>
                        <p className="text-sm font-medium text-gray-900">{application.companyType}</p>
                      </div>
                    </div>
                  )}

                  {application.businessActivity && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl md:col-span-2">
                      <Briefcase className="h-4 w-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Business Activity</p>
                        <p className="text-sm font-medium text-gray-900">{application.businessActivity}</p>
                      </div>
                    </div>
                  )}
                </div>

                {application.proposedNames && application.proposedNames.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-600 uppercase tracking-wide mb-2">Proposed Names</p>
                    <div className="flex flex-wrap gap-2">
                      {application.proposedNames.map((name, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Trademark Information */}
        {(application.trademarkType || application.trademarkClass) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="h-5 w-5 text-indigo-600" />
                  Trademark Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {application.trademarkType && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Trademark Type</p>
                        <p className="text-sm font-medium text-gray-900">{application.trademarkType}</p>
                      </div>
                    </div>
                  )}

                  {application.trademarkClass && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Package className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Trademark Class</p>
                        <p className="text-sm font-medium text-gray-900">Class {application.trademarkClass}</p>
                      </div>
                    </div>
                  )}
                </div>

                {application.logoUrl && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Logo</p>
                    <div className="flex items-center gap-3">
                      <Image 
                        src={application.logoUrl} 
                        alt="Logo" 
                        width={80}
                        height={80}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(application.logoUrl, '_blank')}
                        className="rounded-xl"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Full Size
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Order Information */}
        {application.order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Package className="h-5 w-5 text-orange-600" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Package className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                      <p className="text-sm font-medium text-gray-900">{application.order.id.slice(0, 8)}...</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
                      <p className="text-sm font-medium text-gray-900">₹{application.order.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                      <p className="text-sm font-medium text-gray-900">₹{application.order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <CheckCircle className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Order Status</p>
                      <Badge variant="secondary">{application.order.status}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Documents */}
        {application.documents && application.documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-red-600" />
                  Documents ({application.documents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {application.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.documentType}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded on {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        {doc.isVerified && (
                          <Verified className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open(doc.documentUrl, '_blank')}
                          className="rounded-xl"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = doc.documentUrl;
                            link.download = `${doc.documentType}.pdf`;
                            link.click();
                          }}
                          className="rounded-xl"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Notes */}
        {application.notes && application.notes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Notes & Updates ({application.notes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {application.notes.map((note) => (
                    <div key={note.id} className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                      <p className="text-sm text-gray-900 mb-2">{note.note}</p>
                      <p className="text-xs text-blue-600">
                        {new Date(note.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Message */}
        {application.message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6"
          >
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  Additional Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-400">
                  <p className="text-sm text-gray-900">{application.message}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}