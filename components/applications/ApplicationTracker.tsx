'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Calendar,
  FileText,
  Building,
  User,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface ApplicationTrackerProps {
  applications: {
    id: string;
    type?: string;
    title?: string;
    status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    createdAt: string;
    name?: string;
    businessName?: string;
    serviceId?: string;
    careerId?: string;
  }[];
  careers: {
    id: string;
    title?: string;
    status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    createdAt: string;
    name?: string;
    position?: string;
  }[];
  error?: string;
}

export default function ApplicationTracker({ applications, careers, error }: ApplicationTrackerProps) {
  if (error) {
    return (
      <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="text-red-600 text-lg font-medium">{error}</div>
        </CardContent>
      </Card>
    );
  }

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

  const getApplicationTitle = (app: any) => {
    return app.title || app.businessName || app.name || 'Application';
  };

  const getApplicationIcon = (app: any) => {
    if (app.businessName) return <Building className="h-5 w-5" />;
    if (app.careerId) return <User className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const renderApplicationCard = (app: any, index: number, isCareer: boolean = false) => {
    const statusConfig = getStatusConfig(app.status);
    
    return (
      <motion.div
        key={app.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-xl ${statusConfig.bgColor} flex-shrink-0`}>
                  {isCareer ? <User className="h-5 w-5" /> : getApplicationIcon(app)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {isCareer ? (app.position || app.title || 'Career Application') : getApplicationTitle(app)}
                    </h3>
                    <Badge className={`${statusConfig.color} flex items-center gap-1 text-xs`}>
                      {statusConfig.icon}
                      {app.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {!isCareer && app.type && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>Type: {app.type}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Applied: {new Date(app.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    
                    {!isCareer && (
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        {app.serviceId && <span>Service ID: {app.serviceId.slice(0, 8)}...</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-shrink-0">
                {isCareer ? (
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-xl">
                    Career Application
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl group-hover:border-orange-300 group-hover:bg-orange-50 transition-colors"
                    asChild
                  >
                    <Link href={`/account/applications/${app.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>{isCareer ? 'Career Progress' : 'Application Progress'}</span>
                <span>{app.status === 'COMPLETED' ? '100%' : app.status === 'APPROVED' ? '80%' : app.status === 'IN_REVIEW' ? '60%' : '20%'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    app.status === 'COMPLETED' ? 'bg-emerald-500 w-full' :
                    app.status === 'APPROVED' ? 'bg-green-500 w-4/5' :
                    app.status === 'IN_REVIEW' ? 'bg-blue-500 w-3/5' :
                    app.status === 'REJECTED' ? 'bg-red-500 w-1/5' :
                    'bg-yellow-500 w-1/5'
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {applications.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Service Applications</h3>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {applications.length}
            </Badge>
          </div>
          <div className="space-y-4">
            {applications.map((app, index) => renderApplicationCard(app, index, false))}
          </div>
        </div>
      )}

      {careers.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Career Applications</h3>
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              {careers.length}
            </Badge>
          </div>
          <div className="space-y-4">
            {careers.map((career, index) => renderApplicationCard(career, index, true))}
          </div>
        </div>
      )}
    </div>
  );
}