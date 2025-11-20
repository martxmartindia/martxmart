"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import type { Metadata } from "next"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, MessageSquare, Search, Tag } from "lucide-react"

async function getBlogPosts(searchQuery?: string, category?: string, tag?: string) {
  try {
    const params = new URLSearchParams()
    if (searchQuery) params.append('search', searchQuery)
    if (category) params.append('category', category)
    if (tag) params.append('tag', tag)
    
    const res = await fetch(`/api/blog/posts?${params.toString()}`, {
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new Error(errorData?.error || "Failed to fetch blog posts")
    }
    
    return res.json()
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return { posts: [], pagination: { page: 1, pages: 1 } }
  }
}

async function getBlogCategories() {
  try {
    const res = await fetch(`/api/blog/categories`, {
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new Error(errorData?.error || "Failed to fetch blog categories")
    }
    
    const response = await res.json()
    return response.data || []
  } catch (error) {
    console.error("Error fetching blog categories:", error)
    return []
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function BlogSearch({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input 
        type="search" 
        placeholder="Search articles..." 
        className="pl-10" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  )
}


function BlogPostCard({ post }: any) {
  return (
    <Card className="group h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-lg">
      <div className="relative h-48 sm:h-56 w-full overflow-hidden">
        <Image 
          src={post.featuredImage || "/placeholder.svg?height=200&width=400"} 
          alt={post.title} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge className="absolute top-3 left-3 bg-primary/90 hover:bg-primary">
          {post.category.name}
        </Badge>
      </div>
      <CardHeader className="p-4 sm:p-6 pb-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {post._count?.comments || 0} comments
          </div>
        </div>
        <CardTitle className="line-clamp-2 text-lg sm:text-xl leading-tight">
          <Link 
            href={`/blog/${post.slug}`} 
            className="hover:text-primary transition-colors duration-200 group-hover:text-primary"
          >
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 flex-grow">
        <p className="text-muted-foreground line-clamp-3 text-sm sm:text-base leading-relaxed">
          {post.excerpt || post.content?.substring(0, 150) + '...'}
        </p>
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0">
        <Button 
          asChild 
          variant="ghost" 
          size="sm" 
          className="w-full justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
        >
          <Link href={`/blog/${post.slug}`} className="font-medium">
            Read More →
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function PopularTags({ posts, handleTagFilter }: any) {
  const tagCounts: Record<string, number> = {}

  posts.forEach((post: any) => {
    if (post.tags) {
      // Handle tags based on type
      let tags: string[] = [];
      if (typeof post.tags === 'string') {
        tags = post.tags.split(",").map((tag: string) => tag.trim());
      } else if (Array.isArray(post.tags)) {
        tags = post.tags.map((tag: string) => tag.trim());
      }

      tags.forEach((tag: string) => {
        if (tag) { // Ensure tag is not empty
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      });
    }
  });

  // Sort tags by count and take top 10
  const popularTags = Object.entries(tagCounts)
    .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
    .slice(0, 10)

  return (
    <div className="flex flex-wrap gap-2">
      {popularTags.map(([tag, count]) => (
        <button key={tag} onClick={() => handleTagFilter && handleTagFilter(tag)}>
          <Badge variant="secondary" className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80">
            <Tag className="h-3 w-3" />
            {tag} <span className="text-xs">({count})</span>
          </Badge>
        </button>
      ))}
    </div>
  )
}

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedTag, setSelectedTag] = useState("")

  const fetchData = async (search?: string, category?: string, tag?: string) => {
    setLoading(true)
    try {
      const [postsData, categoriesData] = await Promise.all([
        getBlogPosts(search, category, tag),
        getBlogCategories()
      ])
      setPosts(postsData.posts)
      setPagination(postsData.pagination)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchData(query, selectedCategory, selectedTag)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    fetchData(searchQuery, category, selectedTag)
  }

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag)
    fetchData(searchQuery, selectedCategory, tag)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
            Our Blog
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the latest insights, expert tips, and success stories in agriculture, food processing, and rural entrepreneurship.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <TabsList className="grid w-full lg:w-auto grid-cols-3 lg:grid-cols-none">
                  <TabsTrigger value="all" className="text-sm">All Posts</TabsTrigger>
                  <TabsTrigger value="featured" className="text-sm">Featured</TabsTrigger>
                  <TabsTrigger value="popular" className="text-sm">Popular</TabsTrigger>
                </TabsList>
                <div className="w-full lg:w-auto">
                  <BlogSearch onSearch={handleSearch} />
                </div>
              </div>

              <TabsContent value="all" className="m-0">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse overflow-hidden">
                        <div className="bg-slate-200 dark:bg-slate-700 h-48 sm:h-56"></div>
                        <div className="p-6 space-y-3">
                          <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded w-1/4"></div>
                          <div className="bg-slate-200 dark:bg-slate-700 h-6 rounded w-3/4"></div>
                          <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded w-full"></div>
                          <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded w-2/3"></div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {posts.map((post: any) => (
                      <BlogPostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}

                {pagination.pages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border">
                      {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button 
                            key={i} 
                            variant={pagination.page === pageNum ? "default" : "ghost"} 
                            size="sm" 
                            className={pagination.page === pageNum ? "bg-primary text-primary-foreground" : "hover:bg-slate-100 dark:hover:bg-slate-700"}
                            asChild
                          >
                            <Link href={`/blog?page=${pageNum}`}>{pageNum}</Link>
                          </Button>
                        );
                      })}
                      {pagination.pages > 5 && (
                        <>
                          <span className="px-2 py-1 text-muted-foreground">...</span>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/blog?page=${pagination.pages}`}>{pagination.pages}</Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="featured" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.slice(0, 6).map((post: any) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="popular" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts
                    .sort((a: any, b: any) => (b.viewCount || 0) - (a.viewCount || 0))
                    .slice(0, 6)
                    .map((post: any) => (
                      <BlogPostCard key={post.id} post={post} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-3">
                <CardTitle className="text-lg font-semibold">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {categories.map((category: any) => (
                    <button 
                      key={category.id}
                      onClick={() => handleCategoryFilter(category.slug)}
                      className="w-full flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
                    >
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {category.name}
                      </span>
                      <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700">
                        {category._count?.posts || 0}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Popular Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <PopularTags posts={posts} handleTagFilter={handleTagFilter} />
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Stay Updated</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Subscribe to get the latest posts delivered to your inbox.
                </p>
                <Button className="w-full" size="sm">
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )

}
