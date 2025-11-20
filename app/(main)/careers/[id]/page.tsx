'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Briefcase, Building2, Clock, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import FileUploader from '@/components/pdfUploader';

type Career = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  salary?: string;
  postedDate: string;
};

const CareerDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const [career, setCareer] = useState<Career | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    currentCompany: '',
    noticePeriod: '',
    expectedSalary: '',
    coverLetter: '',
    portfolioUrl: '',
    resumeUrl: '',
    documents: [] as string[],
  });

  // Fetch career details
  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const response = await fetch(`/api/careers/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch career details');
        const data = await response.json();
        setCareer(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load career details');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchCareer();
    }
  }, [params.id]);

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.experience.trim()) newErrors.experience = 'Years of experience is required';
    if (!formData.resumeUrl) newErrors.resumeUrl = 'Resume is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!career || !validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/careers/${career.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: 'guest' }), // Replace 'guest' with actual user ID if authenticated
      });

      if (!response.ok) throw new Error('Failed to submit application');

      toast.success('Application submitted successfully');
      router.push('/careers');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    );
  }

  if (!career) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4">Career Not Found</h1>
        <Link href="/careers" className="inline-block">
          <button
            className="bg-brand-500 text-primary-foreground px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-brand-600 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-colors duration-200"
            aria-label="Back to Careers"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Careers
          </button>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/careers" className="inline-block mb-8">
          <button
            className="text-brand-500 hover:text-brand-600 font-medium flex items-center gap-2 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-colors duration-200"
            aria-label="Back to Careers"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Careers
          </button>
        </Link>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {/* Job Details */}
          <div className="md:col-span-2">
            <div className="bg-card rounded-lg shadow-soft p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
                {career.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{career.department}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{career.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{career.experience}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>{career.type}</span>
                </div>
              </div>
              {career.salary && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-brand-50 text-brand-500 mb-4">
                  {career.salary}
                </span>
              )}
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">About the Role</h2>
                  <p className="text-muted-foreground">{career.description}</p>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">Responsibilities</h2>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {career.responsibilities.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">Requirements</h2>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {career.requirements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">Benefits</h2>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {career.benefits.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-lg shadow-soft p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6">Apply Now</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground transition-all duration-200 ${errors.name ? 'border-red-500' : ''}`}
                      aria-label="Full Name"
                      required
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground transition-all duration-200 ${errors.email ? 'border-red-500' : ''}`}
                      aria-label="Email Address"
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground transition-all duration-200 ${errors.phone ? 'border-red-500' : ''}`}
                      aria-label="Phone Number"
                      required
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Years of Experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground transition-all duration-200 ${errors.experience ? 'border-red-500' : ''}`}
                      aria-label="Years of Experience"
                      required
                    />
                    {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Current Company"
                      value={formData.currentCompany}
                      onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground transition-all duration-200"
                      aria-label="Current Company"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Notice Period"
                      value={formData.noticePeriod}
                      onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground transition-all duration-200"
                      aria-label="Notice Period"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Expected Salary"
                      value={formData.expectedSalary}
                      onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground transition-all duration-200"
                      aria-label="Expected Salary"
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      placeholder="Portfolio URL"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground transition-all duration-200"
                      aria-label="Portfolio URL"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Cover Letter"
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground transition-all duration-200 h-32"
                      aria-label="Cover Letter"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Resume</label>
                    <FileUploader
                      onUploadComplete={(url) => setFormData({ ...formData, resumeUrl: url })}
                      acceptedTypes=".pdf"
                      maxSize={5}
                      documentType="APPLICATION"
                    />
                    {errors.resumeUrl && <p className="text-red-500 text-sm mt-1">{errors.resumeUrl}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Additional Documents</label>
                    <FileUploader
                      onUploadComplete={(url) => setFormData({ ...formData, documents: [...formData.documents, url] })}
                      acceptedTypes=".pdf,.jpg,.jpeg,.png"
                      maxSize={5}
                      documentType="OTHER"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-500 text-primary-foreground px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-brand-600 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                  aria-label="Submit Application"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Application
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CareerDetailsPage;