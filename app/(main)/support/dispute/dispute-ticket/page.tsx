"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const DisputeTicket = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderId: "",
    disputeType: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    field?: string
  ) => {
    if (typeof e === "string" && field) {
      setFormData((prev) => ({ ...prev, [field]: e }));
    } else {
      const { name, value } = (e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>).target;
      setFormData((prev) => ({...prev, [name]: value }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.orderId || !formData.disputeType || !formData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Dispute ticket raised successfully.");
      setFormData({ name: "", email: "", orderId: "", disputeType: "", description: "" });
    } catch (error) {
      toast.error("Failed to raise dispute. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Raise a Dispute Ticket</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8">Submit your dispute for review by our team.</p>
        </motion.div>
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
                placeholder="e.g., ORD123456"
                required
              />
            </div>
            <div>
              <Label htmlFor="disputeType">Dispute Type</Label>
              <Select
                value={formData.disputeType}
                onValueChange={(value) => handleChange(value, "disputeType")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select dispute type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="non-delivered">Non-Delivered</SelectItem>
                  <SelectItem value="defective">Defective Product</SelectItem>
                  <SelectItem value="wrong-item">Wrong Item</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your dispute"
                rows={4}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Dispute"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DisputeTicket;