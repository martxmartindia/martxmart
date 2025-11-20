"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Check, Search, Star, ThumbsUp, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "sonner"

type Review = {
  id: string
  userName: string
  userImage?: string
  userLocation: string
  rating: number
  date: string
  title: string
  comment: string
  productName?: string
  productImage?: string
  productId?: string
  helpful: number
  category: string
  verified: boolean
}

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  image: string;
  quote: string;
  rating: number;
}
export default function CustomerReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRating, setSelectedRating] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set())

  // Mock reviews data wrapped in useMemo
  const reviews = useMemo<Review[]>(() => [
    {
      id: "1",
      userName: "Rajesh Kumar",
      userImage: "/logo.png?height=100&width=100",
      userLocation: "Mumbai",
      rating: 5,
      date: "2023-06-15",
      title: "Excellent platform for industrial machinery",
      comment:
        "I've been using martXmart for over a year now to source machinery for my manufacturing business. The platform is intuitive, the supplier verification process gives me confidence, and I've found exactly what I needed at competitive prices. The customer support team is also very responsive and helpful.",
      productName: "CNC Milling Machine XYZ-1000",
      productImage: "/logo.png?height=100&width=100",
      productId: "1",
      helpful: 24,
      category: "Machinery",
      verified: true,
    },
    {
      id: "2",
      userName: "Priya Sharma",
      userImage: "/logo.png?height=100&width=100",
      userLocation: "Delhi",
      rating: 4,
      date: "2023-05-22",
      title: "Great selection, shipping could be improved",
      comment:
        "martXmart offers an impressive selection of industrial equipment. I found several options for the packaging machinery I was looking for, and the comparison features helped me make an informed decision. The only reason I'm giving 4 stars instead of 5 is that the shipping took longer than expected. Otherwise, it's a fantastic platform.",
      productName: "Industrial Packaging Machine",
      productImage: "/logo.png?height=100&width=100",
      productId: "2",
      helpful: 18,
      category: "Packaging",
      verified: true,
    },
    {
      id: "3",
      userName: "Amit Patel",
      userImage: "/logo.png?height=100&width=100",
      userLocation: "Ahmedabad",
      rating: 5,
      date: "2023-04-10",
      title: "Transformed our procurement process",
      comment:
        "martXmart has completely transformed how we procure industrial machinery for our textile business. The platform's search and filter capabilities make it easy to find exactly what we need, and the verified supplier program ensures we're dealing with reputable vendors. We've saved both time and money since we started using martXmart.",
      helpful: 32,
      category: "Textile",
      verified: true,
    },
    {
      id: "4",
      userName: "Sunita Verma",
      userLocation: "Bangalore",
      rating: 3,
      date: "2023-03-18",
      title: "Good platform but needs more suppliers",
      comment:
        "martXmart is a well-designed platform with good features, but I found the selection of woodworking machinery to be somewhat limited compared to other categories. I hope they expand their supplier network in this area. The machinery I did purchase works well, and the transaction process was smooth.",
      productName: "Woodworking CNC Router",
      productImage: "/logo.png?height=100&width=100",
      productId: "6",
      helpful: 12,
      category: "Woodworking",
      verified: true,
    },
    {
      id: "5",
      userName: "Vikram Singh",
      userImage: "/logo.png?height=100&width=100",
      userLocation: "Pune",
      rating: 5,
      date: "2023-02-25",
      title: "Exceptional customer service",
      comment:
        "What sets martXmart apart is their exceptional customer service. When I encountered an issue with a supplier, the martXmart team stepped in immediately and helped resolve the situation. They truly stand behind their buyer protection program. The platform itself is also very user-friendly and comprehensive.",
      helpful: 29,
      category: "Metalworking",
      verified: true,
    },
    {
      id: "6",
      userName: "Neha Gupta",
      userLocation: "Chennai",
      rating: 4,
      date: "2023-01-30",
      title: "Reliable platform for food processing equipment",
      comment:
        "I've purchased several pieces of food processing equipment through martXmart, and I've been consistently satisfied with the quality and value. The detailed product specifications and supplier ratings helped me make informed decisions. The only improvement I'd suggest is adding more filter options for specialized equipment.",
      productName: "Industrial Food Mixer",
      productImage: "/logo.png?height=100&width=100",
      productId: "5",
      helpful: 15,
      category: "Food Processing",
      verified: false,
    },
    {
      id: "7",
      userName: "Arjun Reddy",
      userImage: "/logo.png?height=100&width=100",
      userLocation: "Hyderabad",
      rating: 5,
      date: "2022-12-12",
      title: "Game-changer for small manufacturers",
      comment:
        "As a small manufacturer, martXmart has been a game-changer for us. We now have access to suppliers and machinery that were previously out of reach. The financing options offered through the platform have also been incredibly helpful for managing our cash flow while expanding our production capabilities.",
      helpful: 41,
      category: "Machinery",
      verified: true,
    },
    {
      id: "8",
      userName: "Meera Joshi",
      userLocation: "Kolkata",
      rating: 2,
      date: "2022-11-05",
      title: "Disappointed with delivery experience",
      comment:
        "While the martXmart platform itself is well-designed, I had a disappointing experience with the delivery of my conveyor belt system. There were significant delays and poor communication from the logistics partner. martXmart should improve their shipping and delivery processes or partner with more reliable logistics companies.",
      productName: "Industrial Conveyor Belt System",
      productImage: "/logo.png?height=100&width=100",
      productId: "8",
      helpful: 8,
      category: "Material Handling",
      verified: true,
    },
  ], [])

  // Mock testimonials data
  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Rajesh Kumar",
      position: "CEO",
      company: "Kumar Manufacturing Industries",
      image: "/logo.png?height=200&width=200",
      quote:
        "martXmart has revolutionized how we source industrial machinery. Their platform has saved us countless hours and significantly reduced our procurement costs.",
      rating: 5,
    },
    {
      id: "2",
      name: "Priya Sharma",
      position: "Operations Director",
      company: "Sharma Textiles Ltd.",
      image: "/logo.png?height=200&width=200",
      quote:
        "The supplier verification process on martXmart gives us confidence in every purchase. We've expanded our production capacity with high-quality machinery at competitive prices.",
      rating: 5,
    },
    {
      id: "3",
      name: "Amit Patel",
      position: "Founder",
      company: "Patel Engineering Works",
      image: "/logo.png?height=200&width=200",
      quote:
        "As a supplier on martXmart, we've been able to reach customers across India and beyond. The platform's tools make it easy to showcase our products and manage orders efficiently.",
      rating: 4,
    },
  ];

  // Get unique categories for filters
  const categories = ["all", ...new Set(reviews.map((review) => review.category))]

  // Filter reviews based on search term, rating, and category
  useEffect(() => {
    let filtered = [...reviews]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (review) =>
          review.title.toLowerCase().includes(term) ||
          review.comment.toLowerCase().includes(term) ||
          review.userName.toLowerCase().includes(term) ||
          (review.productName && review.productName.toLowerCase().includes(term)),
      )
    }

    // Apply rating filter
    if (selectedRating !== "all") {
      filtered = filtered.filter((review) => review.rating === Number.parseInt(selectedRating))
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((review) => review.category === selectedCategory)
    }

    setFilteredReviews(filtered)
  }, [searchTerm,reviews, selectedRating, selectedCategory])

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Handle marking review as helpful
  const handleMarkHelpful = (reviewId: string) => {
    if (helpfulReviews.has(reviewId)) {
      toast.error("You've already marked this review as helpful")
      return
    }

    setHelpfulReviews((prev) => new Set(prev).add(reviewId))

    // Update the helpful count in the reviews
    setFilteredReviews((prev) =>
      prev.map((review) => (review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review)),
    )

    toast.success("Thank you for your feedback!")
  }

  // Calculate average rating
  const calculateAverageRating = () => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / reviews.length).toFixed(1)
  }

  // Calculate rating distribution
  const calculateRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]

    reviews.forEach((review) => {
      distribution[review.rating - 1]++
    })

    return distribution.reverse() // 5 to 1 stars
  }

  const ratingDistribution = calculateRatingDistribution()
  const totalReviews = reviews.length

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/logo.png?height=800&width=1600"
            alt="Customer Reviews"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Customer Reviews</h1>
            <p className="text-xl text-gray-300 mb-8">
              See what our customers are saying about their experience with martXmart.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-5 w-5" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-50 rounded-lg p-6 h-full"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall Rating</h2>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl font-bold text-gray-900">{calculateAverageRating()}</div>
                    <div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < Math.round(Number.parseFloat(calculateAverageRating()))
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 mt-1">Based on {totalReviews} reviews</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {ratingDistribution.map((count, index) => {
                      const stars = 5 - index
                      const percentage = (count / totalReviews) * 100

                      return (
                        <div key={stars} className="flex items-center gap-2">
                          <div className="flex items-center w-16">
                            <span className="text-sm font-medium text-gray-700">{stars}</span>
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-1" />
                          </div>
                          <div className="flex-grow bg-gray-200 rounded-full h-2.5">
                            <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <div className="w-10 text-right text-sm text-gray-600">{count}</div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              </div>

              <div className="md:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">What Customers Love</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Verified Suppliers</h3>
                          <p className="text-gray-700 text-sm">
                            Customers appreciate our rigorous supplier verification process that ensures quality and
                            reliability.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Wide Selection</h3>
                          <p className="text-gray-700 text-sm">
                            Our extensive range of industrial machinery across multiple categories meets diverse
                            business needs.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Customer Support</h3>
                          <p className="text-gray-700 text-sm">
                            Our responsive and knowledgeable customer support team consistently receives high praise.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Buyer Protection</h3>
                          <p className="text-gray-700 text-sm">
                            Customers value our comprehensive buyer protection program that ensures secure transactions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button className="bg-orange-600 hover:bg-orange-700">Write a Review</Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all-reviews" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="all-reviews">Customer Reviews</TabsTrigger>
              <TabsTrigger value="testimonials">Business Testimonials</TabsTrigger>
            </TabsList>

            {/* All Reviews Tab */}
            <TabsContent value="all-reviews">
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-48">
                      <Select value={selectedRating} onValueChange={setSelectedRating}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full sm:w-48">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category === "all" ? "All Categories" : category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="md:w-1/4">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                                    {review.userImage ? (
                                      <Image
                                        src={review.userImage || "/logo.png"}
                                        alt={review.userName}
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-gray-500" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{review.userName}</p>
                                    <p className="text-sm text-gray-600">{review.userLocation}</p>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <div className="flex mb-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-5 h-5 ${
                                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <p className="text-sm text-gray-600">{formatDate(review.date)}</p>
                                </div>

                                {review.verified && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    <Check className="h-3 w-3 mr-1" /> Verified Purchase
                                  </Badge>
                                )}
                              </div>

                              <div className="md:w-3/4">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{review.title}</h3>
                                <p className="text-gray-700 mb-4">{review.comment}</p>

                                {review.productName && (
                                  <div className="bg-gray-50 rounded-lg p-3 mb-4 flex items-center gap-3">
                                    {review.productImage && (
                                      <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                                        <Image
                                          src={review.productImage || "/logo.png"}
                                          alt={review.productName}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-sm text-gray-500">Purchased Product:</p>
                                      <Link
                                        href={`/products/${review.productId}`}
                                        className="text-sm font-medium text-orange-600 hover:underline"
                                      >
                                        {review.productName}
                                      </Link>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="bg-gray-50">
                                    {review.category}
                                  </Badge>
                                  <button
                                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-orange-600"
                                    onClick={() => handleMarkHelpful(review.id)}
                                  >
                                    <ThumbsUp className="h-4 w-4" />
                                    <span>Helpful ({review.helpful})</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-600 mb-4">No reviews found matching your criteria.</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("")
                          setSelectedRating("all")
                          setSelectedCategory("all")
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials">
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
                              <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4">
                                <Image
                                  src={testimonial.image || "/logo.png"}
                                  alt={testimonial.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">{testimonial.name}</h3>
                              <p className="text-orange-600 font-medium mb-1">{testimonial.position}</p>
                              <p className="text-gray-600 mb-3">{testimonial.company}</p>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="md:w-2/3 p-6 flex items-center">
                              <blockquote className="text-gray-700 text-lg italic relative">
                                <p className="relative z-10">&quot;{testimonial.quote}&quot;</p>
                              </blockquote>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Share Your Success Story</h3>
                  <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                    Are you a business that has benefited from using martXmart? We&apos;d love to hear your story and
                    potentially feature it on our website.
                  </p>
                  <Button className="bg-orange-600 hover:bg-orange-700">Submit Your Testimonial</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">How can I leave a review on martXmart?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    You can leave a review for products you&apos;ve purchased on martXmart by going to your order history,
                    finding the relevant order, and clicking on &quot;Write a Review.&quot; You can also review suppliers you&apos;ve
                    worked with by visiting their profile page and clicking the &quot;Review&quot; button.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">Are all reviews verified?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    Reviews marked as &quot;Verified Purchase&quot; are from customers who have bought the product through
                    martXmart. We also verify supplier reviews to ensure they come from actual customers who have
                    completed transactions with the supplier. This helps maintain the integrity and trustworthiness of
                    our review system.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">Can I edit or delete my review after posting?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    Yes, you can edit or delete your review within 30 days of posting. To do so, go to your account
                    dashboard, navigate to &quot;My Reviews,&quot; find the review you want to modify, and click on &quot;Edit&quot; or
                    &quot;Delete.&quot; After 30 days, please contact our customer support team if you need to make changes.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">How does martXmart handle negative reviews?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    We believe in transparent and honest feedback. Negative reviews that meet our community guidelines
                    are published alongside positive ones. Suppliers have the opportunity to respond to reviews and
                    address any concerns. We do not remove negative reviews unless they violate our guidelines, such as
                    containing inappropriate content or false information.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">Can I feature my testimonial on martXmart?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">
                    Yes! If you&apos;ve had a positive experience with martXmart and would like to share your story, you
                    can submit a testimonial through our &quot;Submit Your Testimonial&quot; form. Our team reviews all
                    submissions and may contact you for additional information or to schedule a professional photo
                    session if your testimonial is selected for featuring on our website.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Share Your Experience</h2>
            <p className="text-xl mb-8">
              Your feedback helps other businesses make informed decisions and helps us improve our platform.
            </p>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Write a Review <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

