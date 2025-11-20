"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const LiveChat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Live Chat Support</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            Connect with our support team in real-time. Our chat widget will load below.
          </p>
        </motion.div>
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
          <MessageSquare className="h-12 w-12 text-orange-600 mx-auto mb-4" />
          <p className="text-center text-gray-600">
            Chat widget placeholder. Integrate with Intercom, Zendesk, or similar service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;