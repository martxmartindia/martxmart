"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


interface Project {
  id: string;
  name: string;
  description: string | null;
  projectReportCost: number;
  category: {
    name: string;
  };
}

export default function ProjectReportApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        const data = await response.json();
        if (!response.ok) {
          toast.error(data.error || 'Failed to fetch project');
          router.push('/project-report');
          return;
        }
        setProject(data);
      } catch (error) {
        toast.error('Failed to fetch project details');
        router.push('/project-report');
      }
    };
    fetchProject();
  }, [params.id, router]);

  const [formData, setFormData] = useState({
    scheme: "",
    tradeName: "",
    applicantName: "",
    fatherName: "",
    dobName: "",
    panCard: "",
    aadharCard: "",
    activityNatureOfProduct: "",
    totalProjectCost: "",
    residence: {
      pincode: "",
      state: "",
      address1: "",
      district: "",
    },
    plantAddress: {
      pincode: "",
      state: "",
      address1: "",
      district: "",
    },
    documents: {
      panCardFile: null as File | null,
      aadharCardFile: null as File | null,
      quotationFile: null as File | null,
      udyamRegFile: null as File | null,
      applyFormFile: null as File | null,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");

        // Check if `parent` key exists and is an object
        const parentValue = prev[parent as keyof typeof prev];
        if (typeof parentValue === "object" && parentValue !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentValue,
              [child]: value,
            },
          };
        }

        // Fallback if parent is not an object
        return prev;
      } else {
        return {
          ...prev,
          [name]: value,
        };
      }
    });
  };



  const validateForm = () => {
    if (!project) {
      toast.error('Invalid project ID');
      return false;
    }

    const requiredFields = [
      "tradeName",
      "applicantName",
      "fatherName",
      "dobName",
      "panCard",
      "aadharCard",
      "activityNatureOfProduct",
      "totalProjectCost",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(
          `Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return false;
      }
    }

    // Validate address fields
    const addressFields = ["pincode", "state", "address1", "district"];
    for (const field of addressFields) {
      if (!formData.residence[field as keyof typeof formData.residence]) {
        toast.error(`Please fill in the residence ${field}`);
        return false;
      }
      if (!formData.plantAddress[field as keyof typeof formData.plantAddress]) {
        toast.error(`Please fill in the plant ${field}`);
        return false;
      }
    }

    // Validate documents
    const requiredDocs = [
      "panCardFile",
      "aadharCardFile",
      "quotationFile",
      "udyamRegFile",
      "applyFormFile",
    ];
    for (const doc of requiredDocs) {
      if (!formData.documents[doc as keyof typeof formData.documents]) {
        toast.error(`Please upload the ${doc.replace("File", "")}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!project) {
      toast.error('Invalid project ID');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting application...");

    try {
      const formDataToSend = new FormData();

      // Append basic form fields
      formDataToSend.append('tradeName', formData.tradeName);
      formDataToSend.append('applicantName', formData.applicantName);
      formDataToSend.append('fatherName', formData.fatherName);
      formDataToSend.append('dobName', formData.dobName);
      formDataToSend.append('panCard', formData.panCard);
      formDataToSend.append('aadharCard', formData.aadharCard);
      formDataToSend.append('activityNatureOfProduct', formData.activityNatureOfProduct);
      formDataToSend.append('totalProjectCost', formData.totalProjectCost);

      // Append residence address
      formDataToSend.append('residencePincode', formData.residence.pincode);
      formDataToSend.append('residenceState', formData.residence.state);
      formDataToSend.append('residenceAddress', formData.residence.address1);
      formDataToSend.append('residenceDistrict', formData.residence.district);

      // Append plant address
      formDataToSend.append('plantPincode', formData.plantAddress.pincode);
      formDataToSend.append('plantState', formData.plantAddress.state);
      formDataToSend.append('plantAddress', formData.plantAddress.address1);
      formDataToSend.append('plantDistrict', formData.plantAddress.district);

      // Append project ID
      formDataToSend.append('projectId', params.id as string);

      // Append document files
      Object.entries(formData.documents).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch("/api/project-report/apply", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Application submitted successfully");
        router.push(`/project-report/payment/${data.data.id}`);
      } else {
        throw new Error(data.message || "Failed to submit application");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 text-orange-600 hover:text-orange-700 flex items-center"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className="max-w-4xl mx-auto border border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Project Report Application
          </CardTitle>
          <CardDescription className="text-gray-600">
            Please fill in all the required details and upload necessary
            documents
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Business Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Business Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-4 py-2 border rounded">
                        {formData.scheme || "Select Scheme"}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup title="Schemes">
                        <DropdownMenuItem
                          onSelect={() =>
                            setFormData({ ...formData, scheme: "PMMY" })
                          }
                        >
                          Pradhan Mantri Mudra Yojana (PMMY)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            setFormData({ ...formData, scheme: "PMEGP" })
                          }
                        >
                          Prime Minister’s Employment Generation Programme
                          (PMEGP)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            setFormData({ ...formData, scheme: "PMFME" })
                          }
                        >
                          PM Formalization of Micro Food Processing Enterprises
                          Scheme (PMFME)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            setFormData({ ...formData, scheme: "SUI" })
                          }
                        >
                          Stand-Up India (SUI) Scheme
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            setFormData({
                              ...formData,
                              scheme: "Start-up-india",
                            })
                          }
                        >
                          Start-Up India Scheme{" "}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            setFormData({
                              ...formData,
                              scheme: "Bihar-Udyami-Yojana",
                            })
                          }
                        >
                          Mukhyamantri Udyami Yojana (Run by Bihar Government)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onSelect={() =>
                            setFormData({
                              ...formData,
                              scheme: "bihar-laghu-Udyami-Yojana",
                            })
                          }
                        >
                          Mukhyamantri Laghu Udyami Yojana (Run by
                          Bihar Government)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            setFormData({
                              ...formData,
                              scheme: "pm-vishwakarma-yojana",
                            })
                          }
                        >
                          Pradhan Mantri Vishwakarma Yojana
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            setFormData({
                              ...formData,
                              scheme: "new-2-crore-loan-scheme-sc-st",
                            })
                          }
                        >
                          New ₹2 Crore Loan Scheme for SC/ST and Women
                          Entrepreneurs{" "}
                        </DropdownMenuItem>
                        PM Surya Ghar Muft Bijli Yojana
                        <DropdownMenuItem
                          onSelect={() =>
                            setFormData({
                             ...formData,
                              scheme: "pm-surya-ghar-muft-bijli-yojana",
                            })
                          }
                        >
                          PM Surya Ghar Muft Bijli Yojana
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <br />
                  <Separator />
                  <Label htmlFor="tradeName">Trade Name</Label>
                  <Input
                    id="tradeName"
                    name="tradeName"
                    value={formData.tradeName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activityNatureOfProduct">
                    Nature of Business/Product
                  </Label>
                  <Input
                    id="activityNatureOfProduct"
                    name="activityNatureOfProduct"
                    value={formData.activityNatureOfProduct}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalProjectCost">Total Project Cost (₹)</Label>
                <Input
                  id="totalProjectCost"
                  name="totalProjectCost"
                  type="number"
                  value={formData.totalProjectCost}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantName">Applicant Name</Label>
                  <Input
                    id="applicantName"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Name</Label>
                  <Input
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dobName">Date of Birth</Label>
                  <Input
                    id="dobName"
                    name="dobName"
                    type="date"
                    value={formData.dobName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panCard">PAN Card Number</Label>
                  <Input
                    id="panCard"
                    name="panCard"
                    value={formData.panCard}
                    onChange={handleInputChange}
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    title="Please enter a valid PAN number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aadharCard">Aadhar Card Number</Label>
                  <Input
                    id="aadharCard"
                    name="aadharCard"
                    value={formData.aadharCard}
                    onChange={handleInputChange}
                    pattern="[0-9]{12}"
                    title="Please enter a valid 12-digit Aadhar number"
                    required
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Residence Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Residence Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="residence.address1">Address</Label>
                  <Input
                    id="residence.address1"
                    name="residence.address1"
                    value={formData.residence.address1}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="residence.district">District</Label>
                  <Input
                    id="residence.district"
                    name="residence.district"
                    value={formData.residence.district}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="residence.state">State</Label>
                  <Input
                    id="residence.state"
                    name="residence.state"
                    value={formData.residence.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="residence.pincode">PIN Code</Label>
                  <Input
                    id="residence.pincode"
                    name="residence.pincode"
                    value={formData.residence.pincode}
                    onChange={handleInputChange}
                    pattern="[0-9]{6}"
                    title="Please enter a valid 6-digit PIN code"
                    required
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Plant Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Plant Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plantAddress.address1">Address</Label>
                  <Input
                    id="plantAddress.address1"
                    name="plantAddress.address1"
                    value={formData.plantAddress.address1}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plantAddress.district">District</Label>
                  <Input
                    id="plantAddress.district"
                    name="plantAddress.district"
                    value={formData.plantAddress.district}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plantAddress.state">State</Label>
                  <Input
                    id="plantAddress.state"
                    name="plantAddress.state"
                    value={formData.plantAddress.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plantAddress.pincode">PIN Code</Label>
                  <Input
                    id="plantAddress.pincode"
                    name="plantAddress.pincode"
                    value={formData.plantAddress.pincode}
                    onChange={handleInputChange}
                    pattern="[0-9]{6}"
                    title="Please enter a valid 6-digit PIN code"
                    required
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Document Uploads */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Document Uploads</h3>
                <p className="text-sm text-gray-500">All documents must be in PDF format, max 5MB each</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="text-base font-medium mb-2 block">PAN Card</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData(prev => ({
                          ...prev,
                          documents: {
                            ...prev.documents,
                            panCardFile: file
                          }
                        }));
                      }
                    }}
                  />
                </div>

                <div>
                  <Label className="text-base font-medium mb-2 block">Aadhar Card</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData(prev => ({
                          ...prev,
                          documents: {
                            ...prev.documents,
                            aadharCardFile: file
                          }
                        }));
                      }
                    }}
                  />
                </div>

                <div>
                  <Label className="text-base font-medium mb-2 block">Quotation</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData(prev => ({
                          ...prev,
                          documents: {
                            ...prev.documents,
                            quotationFile: file
                          }
                        }));
                      }
                    }}
                  />
                </div>

                <div>
                  <Label className="text-base font-medium mb-2 block">Udyam Registration</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData(prev => ({
                          ...prev,
                          documents: {
                            ...prev.documents,
                            udyamRegFile: file
                          }
                        }));
                      }
                    }}
                  />
                </div>

                <div>
                  <Label className="text-base font-medium mb-2 block">Application Form</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData(prev => ({
                          ...prev,
                          documents: {
                            ...prev.documents,
                            applyFormFile: file
                          }
                        }));
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center bg-gray-50 px-6 py-4">
            <p className="text-sm text-gray-500">
              Please ensure all information is accurate before submitting
            </p>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
