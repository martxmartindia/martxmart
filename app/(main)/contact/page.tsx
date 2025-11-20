"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import axios from "axios"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, inquiryType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // call api/contact
      const response = await axios.post("/api/contact", formData)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiryType: "general",
      })
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSubmitted(true)
      toast.success("Your message has been sent successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-orange-600" />,
      title: "Our Location",
      details: "Shashi Bhawan, Court Station Road, Jayprakash Nagar, Purnea, Bihar 854301",
    },
    {
      icon: <Phone className="h-6 w-6 text-orange-600" />,
      title: "Phone Number",
      details: "+91 02269718200",
    },
    {
      icon: <Mail className="h-6 w-6 text-orange-600" />,
      title: "Email Address",
      details: "support@martXmart.com",
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-600" />,
      title: "Working Hours",
      details: "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-300">
              Have questions or need assistance? Our team is here to help you with any inquiries about our industrial
              machinery marketplace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {contactInfo.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="bg-white rounded-lg p-6 shadow-md h-full border border-gray-100 hover:border-orange-200 transition-colors">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-orange-100 p-3 rounded-full mb-4">{item.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-700 whitespace-pre-line">{item.details}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-md p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 p-3 rounded-full inline-flex mb-4">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-700 mb-6">
                    Your message has been sent successfully. Our team will get back to you shortly.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: "",
                        inquiryType: "general",
                      })
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="inquiryType">Inquiry Type</Label>
                      <RadioGroup
                        value={formData.inquiryType}
                        onValueChange={handleRadioChange}
                        className="flex flex-wrap gap-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="general" id="general" />
                          <Label htmlFor="general" className="cursor-pointer">
                            General Inquiry
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sales" id="sales" />
                          <Label htmlFor="sales" className="cursor-pointer">
                            Sales Support
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="technical" id="technical" />
                          <Label htmlFor="technical" className="cursor-pointer">
                            Technical Support
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="partnership" id="partnership" />
                          <Label htmlFor="partnership" className="cursor-pointer">
                            Partnership
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter message subject"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Enter your message here..."
                        rows={5}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span> Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Map */}
            <motion.div 
      initial={{ opacity: 0, x: 30 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white rounded-lg shadow-md p-8 h-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Location</h2>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.3221940211606!2d87.46947467525534!3d25.792942577332276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eff9a0cc546c61%3A0xeaaad267b03c66b0!2sTRADEMINDS%20MACHINERY%20PRIVATE%20LIMITED!5e0!3m2!1shi!2sin!4v1745759252609!5m2!1shi!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">martXmart Headquarters</h3>
          <p className="text-gray-700 mb-4">
            Shashi Bhawan, Court Station Road, Jayprakash Nagar, Purnea, Bihar 854301
          </p>
          <p className="text-gray-700">
            Our headquarters is conveniently located in Purnia, easily accessible by public
            transportation and with ample parking available for visitors.
          </p>
        </div>
      </div>
    </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Find quick answers to common questions about contacting and working with martXmart.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">What are your customer service hours?</h3>
                <p className="text-gray-700">
                  Our customer service team is available Monday through Friday from 9:00 AM to 6:00 PM, and Saturday
                  from 10:00 AM to 4:00 PM (IST). We are closed on Sundays and major holidays.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">How quickly can I expect a response?</h3>
                <p className="text-gray-700">
                  We strive to respond to all inquiries within 24 business hours. For urgent matters, we recommend
                  calling our customer service line directly.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Do you offer on-site consultations?</h3>
                <p className="text-gray-700">
                  Yes, for enterprise clients and large machinery purchases, we offer on-site consultations. Please
                  contact our sales team to schedule an appointment.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">How can I become a verified supplier?</h3>
                <p className="text-gray-700">
                  To become a verified supplier on martXmart, please fill out the supplier application form on our
                  &quot;Sell with Us&quot; page. Our team will review your application and guide you through the verification
                  process.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </main>
  )
}

