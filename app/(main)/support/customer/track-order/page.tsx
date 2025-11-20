"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) {
      toast.error("Please enter an order ID.");
      return;
    }
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      toast.success(`Order ${orderId} is out for delivery.`);
      setLoading(false);
      setOrderId("");
    }, 1000);
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Track Your Order</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8">Enter your order ID to check the status.</p>
        </motion.div>
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g., ORD123456"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? "Tracking..." : "Track Order"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;