'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function ApplicationSuccessPage() {
  return (
    <div className="container mx-auto py-20 px-4 max-w-2xl">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Application Submitted Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">
            Thank you for your interest in becoming a franchise partner. We have received your application
            and our team will review it shortly.
          </p>
          <p className="text-gray-600">
            You will receive a confirmation email with further details about the next steps.
            Our team will contact you within 2-3 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}