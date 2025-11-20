"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Download, ExternalLink, FileText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type PressRelease = {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
  image?: string
  link: string
}

type NewsArticle = {
  id: string
  title: string
  date: string
  source: string
  excerpt: string
  image: string
  link: string
}

type MediaKit = {
  id: string
  title: string
  description: string
  fileType: string
  fileSize: string
  downloadLink: string
}

export default function PressMediaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([])
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [filteredPressReleases, setFilteredPressReleases] = useState<PressRelease[]>([])
  const [filteredNewsArticles, setFilteredNewsArticles] = useState<NewsArticle[]>([])

  // Fetch press releases from API
  useEffect(() => {
    const fetchPressReleases = async () => {
      try {
        const params = new URLSearchParams()
        if (searchTerm) params.append('search', searchTerm)
        if (selectedYear !== 'all') params.append('year', selectedYear)
        if (selectedCategory !== 'all') params.append('category', selectedCategory)

        const response = await fetch(`/api/media/press-releases?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch press releases')
        const data = await response.json()
        setPressReleases(data)
        setFilteredPressReleases(data)
      } catch (error) {
        console.error('Error fetching press releases:', error)
        setPressReleases([])
        setFilteredPressReleases([])
      }
    }

    fetchPressReleases()
  }, [searchTerm, selectedYear, selectedCategory])

  // Fetch news articles from API
  useEffect(() => {
    const fetchNewsArticles = async () => {
      try {
        const params = new URLSearchParams()
        if (searchTerm) params.append('search', searchTerm)

        const response = await fetch(`/api/media/news-articles?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch news articles')
        const data = await response.json()
        setNewsArticles(data)
        setFilteredNewsArticles(data)
      } catch (error) {
        console.error('Error fetching news articles:', error)
        setNewsArticles([])
        setFilteredNewsArticles([])
      }
    }

    fetchNewsArticles()
  }, [searchTerm])
  // Fetch media kits
  const [mediaKits, setMediaKits] = useState<MediaKit[]>([])

  useEffect(() => {
    const fetchMediaKits = async () => {
      try {
        const response = await fetch('/api/media/media-kits')
        if (!response.ok) throw new Error('Failed to fetch media kits')
        const data = await response.json()
        setMediaKits(data)
      } catch (error) {
        console.error('Error fetching media kits:', error)
        setMediaKits([])
      }
    }

    fetchMediaKits()
  }, [])


  // Get unique years and categories for filters
  const years = useMemo(() => [
    "all",
    ...new Set(pressReleases.map((pr) => new Date(pr.date).getFullYear().toString()))
  ], [pressReleases])

  const categories = useMemo(() => [
    "all",
    ...new Set(pressReleases.map((pr) => pr.category))
  ], [pressReleases])

  // Filter press releases based on search term, year, and category
  useEffect(() => {
    let filtered = [...pressReleases]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (pr) => pr.title.toLowerCase().includes(term) || pr.excerpt.toLowerCase().includes(term),
      )
    }

    // Apply year filter
    if (selectedYear !== "all") {
      filtered = filtered.filter((pr) => new Date(pr.date).getFullYear().toString() === selectedYear)
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((pr) => pr.category === selectedCategory)
    }

    setFilteredPressReleases(filtered)
  }, [searchTerm, pressReleases, selectedYear, selectedCategory])

  // Filter news articles based on search term
  useEffect(() => {
    let filtered = [...newsArticles]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(term) ||
          article.excerpt.toLowerCase().includes(term) ||
          article.source.toLowerCase().includes(term),
      )
    }

    setFilteredNewsArticles(filtered)
  }, [searchTerm, newsArticles])

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/media.jpg?height=800&width=1600"
            alt="Press and Media"
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Press & Media</h1>
            <p className="text-xl text-gray-300 mb-8">
              Stay updated with the latest news, press releases, and media resources from martXmart.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search press releases and news..."
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

      {/* Press Content Tabs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="press-releases" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
              <TabsTrigger value="press-releases">Press Releases</TabsTrigger>
              <TabsTrigger value="news">In the News</TabsTrigger>
              <TabsTrigger value="media-kit">Media Kit</TabsTrigger>
            </TabsList>

            {/* Press Releases Tab */}
            <TabsContent value="press-releases">
              <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-48">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year === "all" ? "All Years" : year}
                          </SelectItem>
                        ))}
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
                <div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Subscribe to Press Updates</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPressReleases.length > 0 ? (
                  filteredPressReleases.map((pressRelease) => (
                    <motion.div
                      key={pressRelease.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link href={pressRelease.link} className="group">
                        <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                          {pressRelease.image && (
                            <div className="relative h-48 w-full">
                              <Image
                                src={pressRelease.image || "/logo.png"}
                                alt={pressRelease.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                              />
                            </div>
                          )}
                          <CardContent className={`p-6 ${!pressRelease.image ? "pt-6" : ""}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-500">{formatDate(pressRelease.date)}</span>
                            </div>
                            <Badge className="mb-3 bg-orange-100 text-orange-800 hover:bg-orange-200">
                              {pressRelease.category}
                            </Badge>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                              {pressRelease.title}
                            </h3>
                            <p className="text-gray-700 mb-4 line-clamp-3">{pressRelease.excerpt}</p>
                            <div className="flex items-center text-orange-600 font-medium group-hover:underline">
                              Read More <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-600 mb-4">No press releases found matching your criteria.</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedYear("all")
                        setSelectedCategory("all")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* In the News Tab */}
            <TabsContent value="news">
              <div className="mb-8 flex justify-end">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Submit a Media Inquiry</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredNewsArticles.length > 0 ? (
                  filteredNewsArticles.map((article) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="relative h-48 md:h-auto md:w-1/3 flex-shrink-0">
                            <Image
                              src={article.image || "/logo.png"}
                              alt={article.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="p-6 flex-grow flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-500">{formatDate(article.date)}</span>
                              <Badge variant="outline">{article.source}</Badge>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{article.title}</h3>
                            <p className="text-gray-700 mb-4 line-clamp-3 flex-grow">{article.excerpt}</p>
                            <a
                              href={article.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-orange-600 font-medium hover:underline mt-auto"
                            >
                              Read Article <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-600 mb-4">No news articles found matching your search.</p>
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Media Kit Tab */}
            <TabsContent value="media-kit">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Media Resources</h2>
                  <p className="text-gray-700 mb-6">
                    Welcome to the martXmart Media Kit. Here you&apos;ll find logos, brand guidelines, executive photos,
                    and other resources for media use. All materials are available for download and can be used in
                    accordance with our usage guidelines.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-orange-600 hover:bg-orange-700">Download Complete Media Kit</Button>
                    <Button variant="outline">View Usage Guidelines</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mediaKits.map((kit) => (
                    <motion.div
                      key={kit.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{kit.title}</h3>
                              <p className="text-gray-700 mb-4">{kit.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{kit.fileType}</span>
                                <span>{kit.fileSize}</span>
                              </div>
                            </div>
                            <a
                              href={kit.downloadLink}
                              className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors"
                            >
                              <Download className="h-5 w-5 text-gray-700" />
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Featured Press Release */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Press Release</h2>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image
                    src="/logo.png?height=600&width=1200"
                    alt="martXmart Raises $50 Million in Series C Funding"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <Badge className="mb-3 bg-orange-500 hover:bg-orange-600">Funding</Badge>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      martXmart Raises $50 Million in Series C Funding to Expand Industrial Machinery Marketplace
                    </h3>
                    <div className="flex items-center text-white/80 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>June 15, 2023</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-6">
                    martXmart, India&apos;s leading industrial machinery marketplace, today announced it has raised $50
                    million in Series C funding led by Global Ventures, with participation from existing investors
                    Industrial Partners and Tech Ventures. The funding will accelerate martXmart&apos;s platform
                    development and international expansion to connect more industrial machinery buyers and sellers
                    worldwide.
                  </p>
                  <p className="text-gray-700 mb-6">
                    &quot;This investment marks a significant milestone in our journey to revolutionize how industrial
                    machinery is bought and sold globally,&quot; said Rajiv Mehta, Founder and CEO of martXmart. &quot;With this
                    funding, we&apos;ll enhance our AI-powered matching capabilities, expand our verified supplier network,
                    and enter new markets across Southeast Asia and the Middle East.&quot;
                  </p>
                  <p className="text-gray-700 mb-6">
                    The funding comes as martXmart reports 300% year-over-year growth in transaction volume and
                    expansion of its user base to over 1 million registered businesses across 50 countries. The company
                    plans to double its team size over the next 18 months, with a focus on engineering, product
                    development, and international operations.
                  </p>
                  <div className="flex justify-end">
                    <Button className="bg-orange-600 hover:bg-orange-700">Read Full Press Release</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Media Contacts */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Media Contacts</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src="/logo.png?height=100&width=100"
                          alt="Priya Sharma"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">Priya Sharma</h3>
                        <p className="text-orange-600 font-medium mb-2">Head of Public Relations</p>
                        <p className="text-gray-700 mb-4">
                          For press inquiries, interviews, and general media questions.
                        </p>
                        <div className="space-y-1 text-gray-700">
                          <p>Email: priya.sharma@martXmart.com</p>
                          <p>Phone: +91 98765 43210</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src="/logo.png?height=100&width=100"
                          alt="Amit Patel"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">Amit Patel</h3>
                        <p className="text-orange-600 font-medium mb-2">Corporate Communications Manager</p>
                        <p className="text-gray-700 mb-4">
                          For speaking engagements, events, and partnership inquiries.
                        </p>
                        <div className="space-y-1 text-gray-700">
                          <p>Email: amit.patel@martXmart.com</p>
                          <p>Phone: +91 87654 32109</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-700 mb-4">
                For urgent media inquiries outside of business hours, please contact:
              </p>
              <p className="font-medium text-gray-900">media@martXmart.com</p>
            </div>
          </div>
        </div>
      </section>      
    </main>
  )
}

