"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function NewAddressPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    contactName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    placeOfSupply: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/account/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            localStorage.getItem("auth-storage")?.split(" ")[1]
          }`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Address added successfully");
        router.push("/account");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };
  const verifyPincode = async () => {
    if (formData.zip.length === 6) {
      try {
        const response = await fetch(
          `/api/kyc/verify/pincode?pincode=${formData.zip}`
        );
        const data = await response.json();

        if (response.ok && data.success) {
          setFormData((prev) => ({
            ...prev,
            city: data.data.district || "",
            state: data.data.state || "",
          }));
          toast.success("Pincode verified successfully");
        } else {
          toast.error(data.message || "Invalid pincode");
        }
      } catch (error) {
        toast.error("Failed to verify pincode");
        console.error("Pincode verification error:", error);
      }
    } else {
      toast.error("Pincode must be 6 digits");
    }
  };

  return (
    <div className="container max-w-2xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Add New Address</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Address Type
            </label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select address type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BILLING">Billing Address</SelectItem>
                <SelectItem value="DISPATCH">Dispatch Address</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Contact Name*
            </label>
            <Input
              required
              value={formData.contactName}
              placeholder="Contact Name"
              onChange={(e) =>
                setFormData({ ...formData, contactName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              type="tel"
              value={formData.phone}
              pattern="[0-9]{10}"
              minLength={10}
              maxLength={10}
              inputMode="numeric"
              placeholder="10 digit mobile number"
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              placeholder="Email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Address Line *
            </label>
            <Input
              required
              value={formData.addressLine1}
              placeholder="Full Address"
              onChange={(e) =>
                setFormData({ ...formData, addressLine1: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                ZIP Code*
              </label>
              <Input
                required
                value={formData.zip}
                onChange={(e) => {
                  const zip = e.target.value;
                  if (/^\d{0,6}$/.test(zip)) {
                    setFormData({ ...formData, zip });
                  }
                }}
                onBlur={verifyPincode} // Trigger pincode verification when input loses focus
                placeholder="6-digit PIN"
                maxLength={6}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City*</label>
              <Input
                required
                value={formData.city}
                // onChange={(e) =>
                //   setFormData({ ...formData, city: e.target.value })
                // }
                readOnly={true} // Make the input read-only to prevent user input
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State*</label>
              <Input
                required
                value={formData.state}
                readOnly={true} // Make the input read-only to prevent user input her
                // onChange={(e) =>
                //   setFormData({ ...formData, state: e.target.value })
                // }
              />
            </div>
          </div>

          

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Address"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
