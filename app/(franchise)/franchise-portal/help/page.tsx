"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Book,
  Search,
  ChevronRight,
  FileText,
  Users,
  Settings,
  Package
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  })

  const faqs = [
    {
      question: "How do I add a new product to my inventory?",
      answer: "Go to the Products section and click 'Add Product'. Fill in the product details including name, price, category, and stock quantity. The product will be automatically added to your franchise inventory.",
      category: "products",
    },
    {
      question: "How do I process customer orders?",
      answer: "Navigate to the Orders section to view all incoming orders. You can update order status, process payments, and manage fulfillment from this centralized dashboard.",
      category: "orders",
    },
    {
      question: "What should I do when a product is running low on stock?",
      answer: "The system will automatically alert you when products fall below minimum stock levels. You can reorder from suppliers or transfer stock from other locations using the Inventory > Transfers section.",
      category: "inventory",
    },
    {
      question: "How do I generate reports?",
      answer: "Visit the Reports section where you can access Sales, Inventory, Customer, and Financial reports. All reports can be exported as PDF or Excel files.",
      category: "reports",
    },
    {
      question: "How do I manage customer information?",
      answer: "Use the Customers section to view customer profiles, order history, and contact information. You can also manage customer communications and support tickets.",
      category: "customers",
    },
    {
      question: "How do I update my franchise settings?",
      answer: "Go to Settings to configure business hours, payment methods, shipping preferences, and notification settings for your franchise.",
      category: "settings",
    },
  ]

  const quickLinks = [
    {
      title: "Getting Started Guide",
      description: "Complete guide for new franchise owners",
      icon: Book,
      href: "#",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video walkthroughs",
      icon: MessageCircle,
      href: "#",
    },
    {
      title: "API Documentation",
      description: "Technical documentation for integrations",
      icon: FileText,
      href: "#",
    },
    {
      title: "Community Forum",
      description: "Connect with other franchise owners",
      icon: Users,
      href: "#",
    },
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Your message has been sent. We'll get back to you soon!")
    setContactForm({ subject: "", message: "" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
            <p className="text-muted-foreground">Find answers and get assistance</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* FAQs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <span>{faq.question}</span>
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No FAQs found matching your search.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links & Contact */}
        <div className="space-y-6">
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Helpful resources and guides</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  asChild
                >
                  <a href={link.href}>
                    <link.icon className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">{link.title}</div>
                      <div className="text-sm text-muted-foreground">{link.description}</div>
                    </div>
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Can't find what you're looking for?</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Describe your issue or question..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                  Send Message
                </Button>
              </form>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+91 1800-XXX-XXXX</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>support@martxmart.com</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}