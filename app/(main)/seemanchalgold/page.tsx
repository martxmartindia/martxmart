"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Bell, Check, Heart, Mail, MapPin, Phone, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function Component() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      toast.success("Thank you for subscribing!")
      setEmail("")
    }
  }

  const benefits = [
    { icon: Heart, title: "Heart Healthy", description: "Rich in antioxidants and good for cardiovascular health" },
    { icon: Users, title: "Weight Management", description: "Low in calories, high in protein and fiber" },
    { icon: Star, title: "Premium Quality", description: "Hand-picked from the finest farms in Seemanchal region" },
    { icon: Check, title: "100% Natural", description: "No artificial colors, preservatives, or additives" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              🌟 Premium Quality Makhana
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Seemanchal Gold
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Makhana
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience the finest quality fox nuts from the heart of Seemanchal region. Nutritious, delicious, and
              naturally perfect for your healthy lifestyle.
            </p>

            {/* Email Signup */}
            <div className="max-w-md mx-auto mb-12">
              {!isSubscribed ? (
                <form onSubmit={handleNotifyMe} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-12 border-2 border-amber-200 focus:border-amber-400"
                    required
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-6"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notify Me
                  </Button>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg border border-green-200">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">You're on the list! We'll notify you when we launch.</span>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">Be the first to know when we launch on MartXMart</p>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-3xl blur-3xl"></div>
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Premium Seemanchal Gold Makhana"
                width={600}
                height={400}
                className="mx-auto rounded-3xl shadow-2xl relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Seemanchal Gold?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our premium makhana offers exceptional nutritional benefits and unmatched quality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="text-center border-2 border-amber-100 hover:border-amber-300 transition-colors"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Gallery */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium Quality Gallery</h2>
            <p className="text-xl text-gray-600">See the difference quality makes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Raw Makhana"
                width={400}
                height={300}
                className="rounded-2xl shadow-lg w-full"
              />
              <h3 className="text-xl font-semibold text-gray-900">Raw Makhana</h3>
              <p className="text-gray-600">Fresh, unprocessed fox nuts straight from farms</p>
            </div>
            <div className="space-y-4">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Roasted Makhana"
                width={400}
                height={300}
                className="rounded-2xl shadow-lg w-full"
              />
              <h3 className="text-xl font-semibold text-gray-900">Roasted Makhana</h3>
              <p className="text-gray-600">Perfectly roasted for that crispy, crunchy texture</p>
            </div>
            <div className="space-y-4">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Flavored Varieties"
                width={400}
                height={300}
                className="rounded-2xl shadow-lg w-full"
              />
              <h3 className="text-xl font-semibold text-gray-900">Flavored Varieties</h3>
              <p className="text-gray-600">Multiple flavors to satisfy every taste preference</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nutrition Facts */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nutritional Powerhouse</h2>
              <p className="text-xl text-gray-600">Packed with essential nutrients for your health</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Nutrition Facts"
                  width={500}
                  height={400}
                  className="rounded-2xl shadow-lg"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">P</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">High Protein Content</h3>
                    <p className="text-gray-600">9.7g protein per 100g serving</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">F</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Rich in Fiber</h3>
                    <p className="text-gray-600">Supports digestive health</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">M</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Essential Minerals</h3>
                    <p className="text-gray-600">Calcium, magnesium, iron, and phosphorus</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold">L</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Low Calorie</h3>
                    <p className="text-gray-600">Only 347 calories per 100g</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Experience Premium Quality?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of health-conscious customers who trust Seemanchal Gold for their makhana needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" className="bg-white text-amber-600 hover:bg-gray-100 px-8">
                <Mail className="w-4 h-4 mr-2" />
                Get Launch Updates
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-600 px-8 bg-transparent"
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
