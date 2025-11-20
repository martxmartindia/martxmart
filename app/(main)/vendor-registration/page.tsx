'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Loader2, ArrowLeft, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import FileUploader from '@/components/pdfUploader';

const vendorSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Pincode must be 6 digits').max(6, 'Pincode must be 6 digits'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  gstNumber: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format')
    .optional()
    .or(z.literal('')),
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format')
    .optional()
    .or(z.literal('')),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format')
    .optional()
    .or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  nameAsPerPan: z.string().optional().or(z.literal('')),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

interface Document {
  type: 'GST' | 'PAN' | 'BANK' | 'OTHER';
  url: string;
}

export default function VendorApplicationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  // Verification states
  const [isPincodeVerifying, setIsPincodeVerifying] = useState(false);
  const [isGstVerifying, setIsGstVerifying] = useState(false);
  const [isPanVerifying, setIsPanVerifying] = useState(false);
  const [isBankVerifying, setIsBankVerifying] = useState(false);

  // Verification results
  const [pincodeVerified, setPincodeVerified] = useState<boolean | null>(null);
  const [gstVerified, setGstVerified] = useState<boolean | null>(null);
  const [panVerified, setPanVerified] = useState<boolean | null>(null);
  const [bankVerified, setBankVerified] = useState<boolean | null>(null);

  // Verification data
  const [pincodeData, setPincodeData] = useState<{ district?: string; state?: string } | null>(null);
  const [gstData, setGstData] = useState<any>(null);
  const [panData, setPanData] = useState<any>(null);
  const [bankData, setBankData] = useState<any>(null);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      businessName: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      email: '',
      website: '',
      gstNumber: '',
      panNumber: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      dateOfBirth: '',
      nameAsPerPan: '',
    },
  });

  const watchPincode = form.watch('pincode');
  const watchGstNumber = form.watch('gstNumber');
  const watchPanNumber = form.watch('panNumber');
  const watchIfscCode = form.watch('ifscCode');
  const watchAccountNumber = form.watch('accountNumber');
  const watchNameAsPerPan = form.watch('nameAsPerPan');
  const watchDateOfBirth = form.watch('dateOfBirth');

  // Handle document upload
  const handleDocumentUpload = (url: string, documentType: 'GST' | 'PAN' | 'BANK' | 'OTHER') => {
    setDocuments((prev) => [
      ...prev.filter((doc) => doc.type !== documentType),
      { type: documentType, url },
    ]);
  };

  // Verify pincode and auto-fill city and state
  useEffect(() => {
    const verifyPincode = async () => {
      if (watchPincode && watchPincode.length === 6) {
        try {
          setIsPincodeVerifying(true);
          setPincodeVerified(null);

          const response = await fetch(`/api/kyc/verify/pincode?pincode=${watchPincode}`);
          const data = await response.json();

          if (response.ok && data.success) {
            setPincodeVerified(true);
            setPincodeData(data.data);

            form.setValue('city', data.data.district || '');
            form.setValue('state', data.data.state || '');

            toast.success('Pincode verified successfully');
          } else {
            setPincodeVerified(false);
            toast.error(data.message || 'Invalid pincode');
          }
        } catch (error) {
          setPincodeVerified(false);
          toast.error('Failed to verify pincode');
          console.error('Pincode verification error:', error);
        } finally {
          setIsPincodeVerifying(false);
        }
      } else {
        setPincodeVerified(null);
      }
    };

    const timeoutId = setTimeout(() => {
      if (watchPincode && watchPincode.length === 6) {
        verifyPincode();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [watchPincode, form]);

  // Verify GST number
  const verifyGst = async () => {
    if (!watchGstNumber) {
      toast.error('Please enter a GST number');
      return;
    }

    try {
      setIsGstVerifying(true);
      setGstVerified(null);

      const response = await fetch('/api/kyc/verify/gst', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gstin: watchGstNumber }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setGstVerified(true);
        setGstData(data.data);

        if (!form.getValues('businessName')) {
          form.setValue('businessName', data.data.legalName || data.data.tradeName || '');
        }

        toast.success('GST number verified successfully');
      } else {
        setGstVerified(false);
        toast.error(data.message || 'Invalid GST number');
      }
    } catch (error) {
      setGstVerified(false);
      toast.error('Failed to verify GST number');
      console.error('GST verification error:', error);
    } finally {
      setIsGstVerifying(false);
    }
  };

  // Verify PAN details
  const verifyPan = async () => {
    if (!watchPanNumber) {
      toast.error('Please enter a PAN number');
      return;
    }

    if (!watchNameAsPerPan) {
      toast.error('Please enter name as per PAN');
      return;
    }

    if (!watchDateOfBirth) {
      toast.error('Please enter date of birth');
      return;
    }

    try {
      setIsPanVerifying(true);
      setPanVerified(null);

      const response = await fetch('/api/kyc/verify/pan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pan: watchPanNumber,
          name_as_per_pan: watchNameAsPerPan,
          date_of_birth: watchDateOfBirth,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPanVerified(true);
        setPanData(data.data);
        toast.success('PAN details verified successfully');
      } else {
        setPanVerified(false);
        toast.error(data.message || 'Invalid PAN details');
      }
    } catch (error) {
      setPanVerified(false);
      toast.error('Failed to verify PAN details');
      console.error('PAN verification error:', error);
    } finally {
      setIsPanVerifying(false);
    }
  };

  // Verify bank account
  const verifyBankAccount = async () => {
    if (!watchIfscCode) {
      toast.error('Please enter IFSC code');
      return;
    }

    if (!watchAccountNumber) {
      toast.error('Please enter account number');
      return;
    }

    try {
      setIsBankVerifying(true);
      setBankVerified(null);

      const response = await fetch('/api/kyc/verify/bank-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ifsc: watchIfscCode,
          account_number: watchAccountNumber,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBankVerified(true);
        setBankData(data.data);

        if (!form.getValues('bankName') && data.data.bank_name) {
          form.setValue('bankName', data.data.bank_name);
        }

        toast.success('Bank account verified successfully');
      } else {
        setBankVerified(false);
        toast.error(data.message || 'Invalid bank account details');
      }
    } catch (error) {
      setBankVerified(false);
      toast.error('Failed to verify bank account');
      console.error('Bank verification error:', error);
    } finally {
      setIsBankVerifying(false);
    }
  };

  const onSubmit = async (data: VendorFormValues) => {
    if (data.gstNumber && !gstVerified) {
      toast.error('Please verify your GST number before submitting');
      return;
    }

    if (data.panNumber && !panVerified) {
      toast.error('Please verify your PAN details before submitting');
      return;
    }

    if ((data.accountNumber || data.ifscCode) && !bankVerified) {
      toast.error('Please verify your bank account details before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('businessName', data.businessName);
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('state', data.state);
      formData.append('pincode', data.pincode);
      formData.append('phone', data.phone);
      formData.append('email', data.email);
      if (data.website) formData.append('website', data.website);
      if (data.gstNumber) formData.append('gstNumber', data.gstNumber);
      if (data.panNumber) formData.append('panNumber', data.panNumber);
      if (data.bankName) formData.append('bankName', data.bankName);
      if (data.accountNumber) formData.append('accountNumber', data.accountNumber);
      if (data.ifscCode) formData.append('ifscCode', data.ifscCode);
      if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
      if (data.nameAsPerPan) formData.append('nameAsPerPan', data.nameAsPerPan);
      formData.append('gstVerified', String(gstVerified));
      formData.append('panVerified', String(panVerified));
      formData.append('bankVerified', String(bankVerified));
      if (gstData) formData.append('gstData', JSON.stringify(gstData));
      if (panData) formData.append('panData', JSON.stringify(panData));
      if (bankData) formData.append('bankData', JSON.stringify(bankData));
      formData.append('documents', JSON.stringify(documents));

      const response = await fetch('/api/kyc/vendor/apply', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      toast.success('Vendor application submitted successfully');
      router.push('/vendor/success');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderVerificationStatus = (isVerifying: boolean, isVerified: boolean | null, fieldName: string) => {
    if (isVerifying) {
      return (
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500 mr-1" />
          <span className="text-xs text-blue-500">Verifying...</span>
        </div>
      );
    }

    if (isVerified === true) {
      return (
        <div className="flex items-center">
          <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-xs text-green-500">Verified</span>
        </div>
      );
    }

    if (isVerified === false) {
      return (
        <div className="flex items-center">
          <XCircle className="h-4 w-4 text-red-500 mr-1" />
          <span className="text-xs text-red-500">Invalid {fieldName}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Vendor Application</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Please provide your business details to apply as a vendor</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter business name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter business email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter business phone"
                         type='tel' minLength={10} maxLength={10} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter business address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="Enter pincode"
                            {...field}
                            maxLength={6}
                            className={`${pincodeVerified === true ? 'border-green-500 pr-20' : pincodeVerified === false ? 'border-red-500 pr-20' : ''}`}
                          />
                        </FormControl>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          {renderVerificationStatus(isPincodeVerifying, pincodeVerified, 'pincode')}
                        </div>
                      </div>
                      <FormDescription className="text-xs">
                        Enter a valid 6-digit pincode to auto-fill city and state
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City/District</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter city"
                          {...field}
                          readOnly={pincodeVerified === true}
                          className={pincodeVerified === true ? 'bg-gray-50' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter state"
                          {...field}
                          readOnly={pincodeVerified === true}
                          className={pincodeVerified === true ? 'bg-gray-50' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">GST Verification</h3>
                  <Badge variant={gstVerified ? 'default' : 'outline'}>{gstVerified ? 'Verified' : 'Optional'}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="gstNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GST Number</FormLabel>
                        <div className="flex space-x-2">
                          <div className="relative flex-1">
                            <FormControl>
                              <Input
                                placeholder="Enter GST number"
                                {...field}
                                className={`${gstVerified === true ? 'border-green-500' : gstVerified === false ? 'border-red-500' : ''}`}
                              />
                            </FormControl>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={verifyGst}
                            disabled={isGstVerifying || !watchGstNumber}
                          >
                            {isGstVerifying ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <RefreshCw className="h-4 w-4 mr-1" />
                            )}
                            Verify
                          </Button>
                        </div>
                        <FormDescription className="text-xs">Format: 22AAAAA0000A1Z5</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FileUploader
                    documentType="GST"
                    onUploadComplete={(url) => handleDocumentUpload(url, 'GST')}
                    acceptedTypes=".pdf,.jpg,.jpeg,.png"
                    maxSize={5}
                  />
                </div>

                {gstVerified && gstData && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle>GST Details Verified</AlertTitle>
                    <AlertDescription>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <span className="font-medium">Business Name:</span> {gstData.legalName || gstData.tradeName}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {gstData.status || 'Active'}
                        </div>
                        {gstData.address && (
                          <div className="col-span-2">
                            <span className="font-medium">Address:</span> {gstData.address}
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">PAN Verification</h3>
                  <Badge variant={panVerified ? 'default' : 'outline'}>{panVerified ? 'Verified' : 'Optional'}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="panNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter PAN number"
                            {...field}
                            className={`${panVerified === true ? 'border-green-500' : panVerified === false ? 'border-red-500' : ''}`}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">Format: AAAAA0000A</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nameAsPerPan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name as per PAN</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name as per PAN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth/Incorporation</FormLabel>
                        <FormControl>
                          <Input placeholder="DD/MM/YYYY" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">Format: DD/MM/YYYY</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={verifyPan}
                    disabled={isPanVerifying || !watchPanNumber || !watchNameAsPerPan || !watchDateOfBirth}
                  >
                    {isPanVerifying ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-1" />
                    )}
                    Verify PAN Details
                  </Button>
                </div>

                <FileUploader
                  documentType="PAN"
                  onUploadComplete={(url) => handleDocumentUpload(url, 'PAN')}
                  acceptedTypes=".pdf,.jpg,.jpeg,.png"
                  maxSize={5}
                />

                {panVerified && panData && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle>PAN Details Verified</AlertTitle>
                    <AlertDescription>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <span className="font-medium">Name:</span> {panData.name || watchNameAsPerPan}
                        </div>
                        <div>
                          <span className="font-medium">PAN Status:</span> {panData.status || 'Active'}
                        </div>
                        {panData.category && (
                          <div>
                            <span className="font-medium">Category:</span> {panData.category}
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Bank Details</h3>
                  <Badge variant={bankVerified ? 'default' : 'outline'}>{bankVerified ? 'Verified' : 'Optional'}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter bank name"
                            {...field}
                            readOnly={bankVerified === true}
                            className={bankVerified === true ? 'bg-gray-50' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter account number"
                            {...field}
                            className={`${bankVerified === true ? 'border-green-500' : bankVerified === false ? 'border-red-500' : ''}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ifscCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter IFSC code"
                            {...field}
                            className={`${bankVerified === true ? 'border-green-500' : bankVerified === false ? 'border-red-500' : ''}`}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">Format: ABCD0123456</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={verifyBankAccount}
                    disabled={isBankVerifying || !watchAccountNumber || !watchIfscCode}
                  >
                    {isBankVerifying ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-1" />
                    )}
                    Verify Bank Account
                  </Button>
                </div>

                <FileUploader
                  documentType="BANK"
                  onUploadComplete={(url) => handleDocumentUpload(url, 'BANK')}
                  acceptedTypes=".pdf,.jpg,.jpeg,.png"
                  maxSize={5}
                />

                {bankVerified && bankData && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle>Bank Account Verified</AlertTitle>
                    <AlertDescription>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <span className="font-medium">Account Holder:</span> {bankData.name_at_bank || 'Verified'}
                        </div>
                        <div>
                          <span className="font-medium">Bank:</span> {bankData.bank_name || form.getValues('bankName')}
                        </div>
                        <div>
                          <span className="font-medium">Branch:</span> {bankData.branch || 'Verified'}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <FileUploader
                documentType="OTHER"
                onUploadComplete={(url) => handleDocumentUpload(url, 'OTHER')}
                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                maxSize={5}
              />

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t">
          <div className="w-full text-sm text-gray-500">
            <TooltipProvider>
              <div className="flex items-center space-x-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                      <span>Pincode Verification</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Auto-fills city and state based on pincode</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                      <span>GST Verification</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verifies GST number with government database</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                      <span>PAN Verification</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verifies PAN details with government database</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                      <span>Bank Verification</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verifies bank account details without penny drop</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}