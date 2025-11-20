"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

const SupportTicket = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueType: "",
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
    if (!formData.name || !formData.email || !formData.issueType || !formData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Replace with actual API
      // await axios.post("/api/support/ticket", formData);
      toast.success("Support ticket raised successfully.");
      setFormData({ name: "", email: "", issueType: "", description: "" });
    } catch (error) {
      toast.error("Failed to raise ticket. Please try again.");
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Raise a Support Ticket</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8">Submit your issue, and our team will assist you.</p>
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
              <Label htmlFor="issueType">Issue Type</Label>
              <Select
                value={formData.issueType}
                onValueChange={(value) => handleChange(value, "issueType")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order">Order Issue</SelectItem>
                  <SelectItem value="payment">Payment Issue</SelectItem>
                  <SelectItem value="delivery">Delivery Issue</SelectItem>
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
                placeholder="Describe your issue"
                rows={4}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportTicket;