"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MessageSquare, Phone, Mail, ChevronDown, ChevronUp, FileText, Truck, Store, Factory, Globe, Shield } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

const SupportCenter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string | undefined>("1");

  const supportCategories = [
    {
      id: "1",
      title: "Customer Support",
      description: "For martXmart Shopping customers",
      icon: MessageSquare,
      actions: [
        { label: "Track Your Orders", link: "/support/customer/track-order" },
        { label: "Request Returns, Refunds or Cancellations", link: "/support/customer/returns" },
        { label: "Payment or martXPay Wallet Issues", link: "/support/customer/payment-issues" },
        { label: "Download Invoice / GST Bill", link: "/support/customer/invoice" },
        { label: "Report Wrong Item or Product Quality Issue", link: "/support/customer/report-issue" },
        { label: "Reschedule Pickup or Delivery", link: "/support/customer/reschedule" },
        { label: "Chat with Customer Support", link: "/support/live-chat" },
        { label: "Request a Callback", link: "tel:+9102269718200", onClick: () => toast.success("Callback requested.") },
        { label: "Customer FAQs", link: "/support/faqs/customer" },
        { label: "Raise a Support Ticket", link: "/support/customer/support-ticket" },
      ],
    },
    {
      id: "2",
      title: "Seller Support",
      description: "For registered marketplace sellers",
      icon: Store,
      actions: [
        { label: "Seller Registration Assistance", link: "/support/seller/registration" },
        { label: "Product Listing & Inventory Support", link: "/support/seller/inventory" },
        { label: "Order Processing & Dispatch Issues", link: "/support/seller/order-processing" },
        { label: "Payment Settlement & Commission Help", link: "/support/seller/settlements" },
        { label: "Buyer Complaint / Dispute Resolution", link: "/support/seller/disputes" },
        { label: "Performance & Rating Support", link: "/support/seller/performance" },
        { label: "Tax & Compliance Guidance", link: "/support/seller/compliance" },
        { label: "Download Seller Handbook", link: "/support/seller/seller-handbook" },
        { label: "Seller FAQs", link: "/support/faqs/seller" },
      ],
    },
    {
      id: "3",
      title: "Franchise Support",
      description: "For martXmart franchise partners",
      icon: Truck,
      actions: [
        { label: "Apply for a Franchise", link: "/support/franchise/apply" },
        { label: "Franchise Dashboard Login Support", link: "/support/franchise/login" },
        { label: "Training & Onboarding Help", link: "/support/franchise/training" },
        { label: "Sales Report & ROI Support", link: "/support/franchise/sales-report" },
        { label: "KYC / Document Upload Assistance", link: "/support/franchise/kyc" },
        { label: "Contact Franchise Manager", link: "/support/franchise/franchise-manager" },
        { label: "Download Franchise Manual", link: "/support/franchise/franchise-manual" },
      ],
    },
    {
      id: "4",
      title: "Start-Up Marketplace Support",
      description: "For industrial buyers / business setups",
      icon: Factory,
      actions: [
        { label: "Help in Selecting Machinery / Plant", link: "/support/startup/machinery" },
        { label: "Project Report (CA Certified) Assistance", link: "/support/startup/project-report" },
        { label: "Installation & Setup Guidance", link: "/support/startup/installation" },
        { label: "Raw Material Procurement Help", link: "/support/startup/procurement" },
        { label: "Packaging & Branding Solutions", link: "/support/startup/branding" },
        { label: "Government Scheme & Subsidy Support", link: "/support/startup/subsidies" },
        { label: "EMI Calculator / martXPay Help", link: "/support/startup/emi-calculator" },
        { label: "Talk to a Start-Up Advisor", link: "/support/startup/advisor" },
      ],
    },
    {
      id: "5",
      title: "Website & App Support",
      description: "For all users",
      icon: Globe,
      actions: [
        { label: "Login / Signup Help", link: "/support/website-app/login-help" },
        { label: "Forgot Password / OTP Issues", link: "/support/website-app/password-help" },
        { label: "Language Settings", link: "/support/website-app/language-settings" },
        { label: "App Errors / Bug Reporting", link: "/support/website-app/bug-report" },
        { label: "Feedback & Suggestions", link: "/support/website-app/feedback" },
      ],
    },
    {
      id: "6",
      title: "Dispute Resolution",
      description: "For unresolved or critical issues",
      icon: Shield,
      actions: [
        { label: "Raise a Dispute Ticket", link: "/support/dispute/dispute-ticket" },
        { label: "Upload Documents / Images", link: "/support/dispute/upload-documents" },
        { label: "Track Dispute Status", link: "/support/dispute/dispute-status" },
        { label: "Escalate to Senior Support Team", link: "/support/dispute/escalate" },
      ],
    },
  ];

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return supportCategories;
    const lowerSearch = searchTerm.toLowerCase();
    return supportCategories
      .map((category) => ({
        ...category,
        actions: category.actions.filter(
          (action) =>
            action.label.toLowerCase().includes(lowerSearch) ||
            category.title.toLowerCase().includes(lowerSearch) ||
            category.description.toLowerCase().includes(lowerSearch)
        ),
      }))
      .filter(
        (category) =>
          category.actions.length > 0 ||
          category.title.toLowerCase().includes(lowerSearch) ||
          category.description.toLowerCase().includes(lowerSearch)
      );
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="gradient-bg tex-[#f7474f] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            martXmart Support Center
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto"
          >
            Need help? Choose your category to get the right assistance.
          </motion.p>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative flex items-center bg-white rounded-full shadow-md overflow-hidden">
            <Search className="absolute left-4 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for help (e.g., track order, seller support)..."
              className="flex-grow pl-12 pr-4 py-3 text-gray-700 focus:outline-none border-none"
              value={searchTerm}
              onChange={handleSearch}
              aria-label="Search support topics"
            />
          </div>
          {searchTerm && filteredCategories.length === 0 && (
            <p className="text-center text-gray-600 mt-4">No results found for "{searchTerm}". Try a different term.</p>
          )}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Accordion
          type="single"
          collapsible
          value={openAccordion}
          onValueChange={setOpenAccordion}
          className="space-y-4"
        >
          {filteredCategories.map((category) => (
            <AccordionItem
              key={category.id}
              value={category.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline flex items-center justify-between">
                <div className="flex items-center">
                  <category.icon className="h-6 w-6 text-orange-600 mr-3" />
                  <div className="text-left">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                {openAccordion === category.id ? (
                  <ChevronUp className="h-5 w-5 text-orange-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-orange-600" />
                )}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.actions.map((action, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full text-left text-sm sm:text-base text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-gray-200 rounded-lg py-3 px-4 flex items-center justify-between"
                        asChild
                      >
                        <Link
                          href={action.link}
                          target={action.link.startsWith("http") || action.link.startsWith("tel") ? "_blank" : "_self"}
                          rel="noopener noreferrer"
                          className="flex items-center justify-between w-full"
                          aria-label={action.label}
                          onClick={action.onClick}
                        >
                          <span>{action.label}</span>
                          <FileText className="h-4 w-4 text-orange-600" />
                        </Link>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900"
        >
          Quick Support Options
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              icon: Phone,
              title: "Phone Support",
              description: "Call us at +91 02269718200",
              action: "Request Callback",
              link: "tel:+9102269718200",
              onClick: () => toast.success("Callback requested."),
            },
            {
              icon: Mail,
              title: "Email Support",
              description: "Get help via email",
              action: "Send Email",
              link: "mailto:support@martXmart.com",
            },
          ].map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center"
            >
              <option.icon className="h-8 w-8 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{option.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{option.description}</p>
              <Button
                variant="outline"
                className="text-orange-600 border-orange-600 hover:bg-orange-50 rounded-lg"
                asChild
              >
                <Link
                  href={option.link}
                  target={option.link.startsWith("http") || option.link.startsWith("tel") || option.link.startsWith("mailto") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  aria-label={option.action}
                  onClick={option.onClick}
                >
                  {option.action}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-blue-50 text-center rounded-lg">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900"
        >
          Support Hours
        </motion.h2>
        <p className="text-sm sm:text-base mb-1">
          Monday - Friday: <span className="font-semibold">24/7</span>
        </p>
        <p className="text-sm sm:text-base mb-1">
          Saturday - Sunday: <span className="font-semibold">9:00 AM - 6:00 PM IST</span>
        </p>
        <p className="text-sm text-gray-600 mt-2">Emergency support available 24/7</p>
      </div>
    </div>
  );
};

export default SupportCenter;