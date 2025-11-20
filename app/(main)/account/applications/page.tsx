'use client';

import { useEffect, useState } from 'react';
import ApplicationTracker from '@/components/applications/ApplicationTracker';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { 
  FileText, 
  Plus, 
  RefreshCw, 
  AlertCircle, 
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

type ApplicationData = {
  id: string;
  type?: string;
  title?: string;
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
  name?: string;
  businessName?: string;
  serviceId?: string;
  careerId?: string;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [careers, setCareers] = useState<ApplicationData[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = async (retryCount = 0, showToast = false) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Unauthorized. Please login.');
      setLoading(false);
      return;
    }

    try {
      if (!refreshing) setLoading(true);
      const response = await fetch('/api/applications', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized. Please log in again.');
          localStorage.removeItem('token');
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          setError(errorData.error || 'Failed to load applications. Please try again later.');
        }
      } else {
        const data = await response.json();
        const allData = Array.isArray(data) ? data : [];
        
        // Separate applications and careers
        const serviceApplications = allData.filter(item => !item.careerId);
        const careerApplications = allData.filter(item => item.careerId);
        
        setApplications(serviceApplications);
        setCareers(careerApplications);
        setError('');
        if (showToast) toast.success('Applications refreshed successfully');
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      
      if (retryCount < 2 && (err instanceof TypeError || (err instanceof Error && err.message.includes('fetch')))) {
        setTimeout(() => fetchApplications(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      setError(`Failed to load applications. ${err instanceof Error ? err.message : 'Please check your connection.'}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchApplications(0, true);
  };

  const getStatusStats = () => {
    const allItems = [...applications, ...careers];
    const stats = {
      total: allItems.length,
      pending: allItems.filter(app => app.status === 'PENDING').length,
      inReview: allItems.filter(app => app.status === 'IN_REVIEW').length,
      approved: allItems.filter(app => app.status === 'APPROVED').length,
    };
    return stats;
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-4" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto" />
              <p className="text-gray-600 font-medium">Loading your applications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                  <FileText className="h-6 w-6" />
                </div>
                My Applications
              </h1>
              <p className="text-gray-600">Track and manage all your submitted applications</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="rounded-xl"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl" asChild>
                <Link href="/services">
                  <Plus className="h-4 w-4 mr-2" />
                  New Application
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {!error && (applications.length > 0 || careers.length > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8"
          >
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">In Review</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.inReview}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {error ? (
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="p-4 bg-red-100 rounded-full w-fit mx-auto">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Applications</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={handleRefresh} disabled={refreshing} className="rounded-xl">
                        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Try Again
                      </Button>
                      {error.includes('Unauthorized') && (
                        <Button variant="outline" className="rounded-xl" asChild>
                          <Link href="/auth/login">
                            Login
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : applications.length === 0 && careers.length === 0 ? (
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="space-y-6">
                  <div className="p-6 bg-gray-100 rounded-full w-fit mx-auto">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      You haven't submitted any applications yet. Start by exploring our services.
                    </p>
                    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl px-8" asChild>
                      <Link href="/services">
                        <Plus className="h-4 w-4 mr-2" />
                        Browse Services
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ApplicationTracker applications={applications} careers={careers} error={error} />
          )}
        </motion.div>
      </div>
    </div>
  );
}