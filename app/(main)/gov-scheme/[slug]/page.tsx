'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Image from 'next/image';

interface GovernmentScheme {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ministry: string | null;
  eligibility: string[];
  benefits: string[];
  applicationProcess: string[];
  documents: string[];
  sectors: string[];
  status: string;
  website: string | null;
}

export default function GovernmentSchemeDetailsPage() {
  const params = useParams();
  const [scheme, setScheme] = useState<GovernmentScheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const response = await fetch(`/api/government-schemes/${params.slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch government scheme');
        }
        const data = await response.json();
        setScheme(data);
      } catch (error) {
        console.error('Error fetching government scheme:', error);
        setError('Failed to load scheme. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchScheme();
    } else {
      setError('Invalid scheme slug');
      setLoading(false);
    }
  }, [params.slug]);

  const handleDownloadChecklist = () => {
    if (!scheme) return;
    const content = `
      Document Checklist for ${scheme.name}
      --------------------------------
      ${scheme.documents.map((doc, i) => `${i + 1}. ${doc}`).join('\n')}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scheme.slug}-checklist.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: scheme?.name,
        text: scheme?.description || 'Check out this government scheme!',
        url: window.location.href,
      });
    } else {
      alert('Share this link: ' + window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-6 w-40 mb-6" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {error || 'Scheme Not Found'}
          </h1>
          <Link href="/gov-scheme">
            <Button className="bg-orange-600 hover:bg-orange-700 rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schemes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/gov-scheme">Schemes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="text-gray-900">{scheme.name}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="relative h-64">
          <Image
            src="/placeholder.jpg"
            alt=""
            height={250}
            width={200}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-4 right-4 bg-green-600 text-white">
            {scheme.status}
          </Badge>
        </div>

        <div className="p-8 space-y-8">
          <header>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{scheme.name}</h1>
            <p className="text-lg text-gray-500">{scheme.ministry}</p>
            <div className="flex gap-2 mt-4">
              {scheme.sectors.map((sector, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100">
                  {sector}
                </Badge>
              ))}
            </div>
          </header>

          <section className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
            <p className="text-gray-700">{scheme.description || 'No description available.'}</p>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-3">
                <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
                Important Information
              </h3>
              <p className="text-gray-700">
                Visit the official website for the latest guidelines.
              </p>
              {scheme.website && (
                <a
                  href={scheme.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-flex items-center"
                  aria-label={`Visit official website for ${scheme.name}`}
                >
                  Official Website <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Eligibility</h2>
            <ul className="space-y-2">
              {scheme.eligibility.map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Benefits</h2>
            <ul className="space-y-2">
              {scheme.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Application Process</h2>
            <Accordion type="single" collapsible className="w-full">
              {scheme.applicationProcess.map((step, index) => (
                <AccordionItem key={index} value={`step-${index}`}>
                  <AccordionTrigger className="text-left">
                    Step {index + 1}
                  </AccordionTrigger>
                  <AccordionContent>{step}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-3">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                Application Tips
              </h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Ensure all documents are attested.</li>
                <li>Track your application status.</li>
                <li>Submit a detailed project report.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Required Documents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scheme.documents.map((doc, index) => (
                <div key={index} className="flex items-start bg-gray-50 p-3 rounded-md">
                  <FileText className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                  <span className="text-gray-700">{doc}</span>
                </div>
              ))}
            </div>
            <Button
              className="bg-orange-600 hover:bg-orange-700 rounded-full"
              onClick={handleDownloadChecklist}
              aria-label={`Download document checklist for ${scheme.name}`}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Checklist
            </Button>
          </section>

          <footer className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8 pt-8 border-t">
            <Button
              variant="outline"
              onClick={handleShare}
              className="rounded-full"
              aria-label="Share this scheme"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <div className="flex gap-4">
              {scheme.website && (
                <Button
                  className="bg-orange-600 hover:bg-orange-700 rounded-full"
                  asChild
                >
                  <a
                    href={scheme.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Apply online for ${scheme.name}`}
                  >
                    Apply Now <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              )}
              <Link
                href={`/project-reports/${
                  scheme.slug === 'pmegp'
                    ? 'manufacturing'
                    : scheme.slug === 'pmfme'
                    ? 'food-processing'
                    : 'service-sector'
                }`}
              >
                <Button className="bg-gray-600 hover:bg-gray-700 rounded-full">
                  Explore Projects
                </Button>
              </Link>
            </div>
          </footer>
        </div>
      </motion.article>
    </div>
  );
}