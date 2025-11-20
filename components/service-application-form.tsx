'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ServiceApplicationFormProps {
  serviceId: string;
  serviceType: string;
  price: number;
}

export default function ServiceApplicationForm({ serviceId, serviceType, price }: ServiceApplicationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    message: '',
    gstType: '',
    annualTurnover: '',
    businessType: '',
    msmeCategory: '',
    investmentInPlant: '',
    numberOfEmployees: '',
    companyType: '',
    proposedNames: '',
    businessActivity: '',
    trademarkType: '',
    trademarkClass: '',
    logoUrl: '',
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments([...documents, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit application
      const response = await fetch('/api/services/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          serviceType,
          ...formData,
          proposedNames: formData.proposedNames ? formData.proposedNames.split(',').map((name) => name.trim()) : [],
        }),
      });

      const { application, razorpayOrderId, razorpayKey } = await response.json();

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      // Initiate Razorpay payment
      const options = {
        key: razorpayKey,
        amount: price * 100,
        currency: 'INR',
        name: 'MartXmart Services',
        description: `Payment for ${serviceType}`,
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          // Verify payment
          const verifyResponse = await fetch('/api/services/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: price * 100,
            }),
          });

          if (verifyResponse.ok) {
            // Upload documents
            for (const document of documents) {
              const formData = new FormData();
              formData.append('applicationId', application.id);
              formData.append('documentType', document.name);
              formData.append('document', document);

              await fetch('/api/services/upload-documents', {
                method: 'POST',
                body: formData,
              });
            }
            toast.success('Application submitted successfully.');
            router.push('/thank-you');
          } else {
            throw new Error('Payment verification failed');
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#F97316' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit application. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
      </div>
      <div>
        <Label htmlFor="businessName">Business Name (Optional)</Label>
        <Input id="businessName" name="businessName" value={formData.businessName} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="pincode">Pincode</Label>
          <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} />
      </div>

      {/* Service-Specific Fields */}
      {serviceType.toLowerCase().includes('gst') && (
        <>
          <div>
            <Label htmlFor="gstType">GST Type</Label>
            <Select onValueChange={(value) => handleSelectChange('gstType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select GST Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REGULAR">Regular</SelectItem>
                <SelectItem value="COMPOSITION">Composition</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="annualTurnover">Annual Turnover</Label>
            <Input id="annualTurnover" name="annualTurnover" value={formData.annualTurnover} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="businessType">Business Type</Label>
            <Input id="businessType" name="businessType" value={formData.businessType} onChange={handleInputChange} />
          </div>
        </>
      )}

      {serviceType.toLowerCase().includes('msme') && (
        <>
          <div>
            <Label htmlFor="msmeCategory">MSME Category</Label>
            <Select onValueChange={(value) => handleSelectChange('msmeCategory', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select MSME Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MICRO">Micro</SelectItem>
                <SelectItem value="SMALL">Small</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="investmentInPlant">Investment in Plant (₹)</Label>
            <Input id="investmentInPlant" name="investmentInPlant" type="number" value={formData.investmentInPlant} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="numberOfEmployees">Number of Employees</Label>
            <Input id="numberOfEmployees" name="numberOfEmployees" type="number" value={formData.numberOfEmployees} onChange={handleInputChange} />
          </div>
        </>
      )}

      {serviceType.toLowerCase().includes('company') && (
        <>
          <div>
            <Label htmlFor="companyType">Company Type</Label>
            <Select onValueChange={(value) => handleSelectChange('companyType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Company Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIVATE_LIMITED">Private Limited</SelectItem>
                <SelectItem value="LLP">LLP</SelectItem>
                <SelectItem value="OPC">OPC</SelectItem>
                <SelectItem value="PARTNERSHIP">Partnership</SelectItem>
                <SelectItem value="SOLE_PROPRIETORSHIP">Sole Proprietorship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="proposedNames">Proposed Names (Comma-separated)</Label>
            <Input id="proposedNames" name="proposedNames" value={formData.proposedNames} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="businessActivity">Business Activity</Label>
            <Input id="businessActivity" name="businessActivity" value={formData.businessActivity} onChange={handleInputChange} />
          </div>
        </>
      )}

      {serviceType.toLowerCase().includes('trademark') && (
        <>
          <div>
            <Label htmlFor="trademarkType">Trademark Type</Label>
            <Select onValueChange={(value) => handleSelectChange('trademarkType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Trademark Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WORDMARK">Wordmark</SelectItem>
                <SelectItem value="LOGO">Logo</SelectItem>
                <SelectItem value="COMBINED">Combined</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="trademarkClass">Trademark Class</Label>
            <Input id="trademarkClass" name="trademarkClass" type="number" value={formData.trademarkClass} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
            <Input id="logoUrl" name="logoUrl" value={formData.logoUrl} onChange={handleInputChange} />
          </div>
        </>
      )}

      <div>
        <Label htmlFor="documents">Upload Documents</Label>
        <Input id="documents" type="file" multiple onChange={handleFileChange} />
      </div>

      <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Apply and Pay'}
      </Button>
    </form>
  );
}