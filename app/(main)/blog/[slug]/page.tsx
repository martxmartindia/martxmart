"use client"

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Share2, Tag } from "lucide-react";
import BlogCommentSection from "@/components/blog/comment-section";
import NewsletterForm from "@/components/NewsletterSignup";

// Define types
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  createdAt: string;
  category: {
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string;
    image?: string;
  };
  tags: string | string[];
  comments: any[]; // Replace with actual comment type if available
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  createdAt: string;
}

// Props for the page
interface Props {
  params: { slug: string };
}

// Fetch blog post data
async function getBlogPost(slug: string): Promise<{ post: BlogPost; relatedPosts: RelatedPost[] }> {
  const res = await fetch(`/api/blog/posts/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch blog post");
  }

  return res.json();
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Get author initials
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Related post card component
function RelatedPostCard({ post }: { post: RelatedPost }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 w-full">
        <Image
          src={post.featuredImage || "/placeholder.svg?height=160&width=320"}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
        <div className="mt-2 text-xs text-muted-foreground">{formatDate(post.createdAt)}</div>
      </CardContent>
    </Card>
  );
}

// Main page component
export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>}) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    const getSlug = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    getSlug()
  }, [params])

  useEffect(() => {
    if (!slug) return
    
    const fetchData = async () => {
      try {
        const { post, relatedPosts } = await getBlogPost(slug)
        setPost(post)
        setRelatedPosts(relatedPosts)
      } catch (error) {
        console.error("Error loading blog post:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [slug])

  if (loading) {
    return (
      <main className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </main>
    )
  }

  if (!post) {
    notFound()
  }

  // Parse tags
  const tags = typeof post.tags === "string" ? post.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : Array.isArray(post.tags) ? post.tags : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-primary">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3">
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative h-[250px] sm:h-[350px] lg:h-[450px] w-full rounded-2xl overflow-hidden mb-8 shadow-2xl">
                <Image 
                  src={post.featuredImage} 
                  alt={post.title} 
                  fill 
                  className="object-cover transition-transform duration-700 hover:scale-105" 
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            {/* Post Header */}
            <div className="space-y-6 mb-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="bg-primary/10 border-primary/20 hover:bg-primary/20 transition-colors">
                  <Link href={`/blog?category=${post.category.slug}`} className="font-medium">
                    {post.category.name}
                  </Link>
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight leading-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed border-l-4 border-primary/30 pl-4 italic">
                  {post.excerpt}
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage src={post.author.image || ""} alt={post.author.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{post.author.name}</div>
                    <div className="text-sm text-muted-foreground">Author</div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.title,
                        text: post.excerpt,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  aria-label="Share this blog post"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>

            {/* Post Content */}
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-8">
              <div 
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }} 
              />
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <Link href={`/blog?tag=${tag}`} key={tag}>
                      <Badge 
                        variant="secondary" 
                        className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer px-3 py-1"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-white dark:bg-slate-800/50 rounded-xl border p-6">
              <BlogCommentSection postId={post.id} comments={post.comments} />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Author Card */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <CardTitle className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.image || ""} alt={post.author.name} />
                    <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
                  </Avatar>
                  About the Author
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <Avatar className="h-20 w-20 mx-auto ring-4 ring-primary/20">
                    <AvatarImage src={post.author.image || ""} alt={post.author.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {getInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{post.author.name}</h3>
                    <p className="text-sm text-muted-foreground">Content Author</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Expert in agriculture and rural development with years of experience in the field.
                  </p>
                  <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground" asChild>
                    <Link href={`/authors/${post.author?.id || post.author.name.toLowerCase().replace(/\s+/g, "-")}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Posts</CardTitle>
              </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {relatedPosts.map((relatedPost: RelatedPost) => (
                    <div key={relatedPost.id} className="group">
                      <div className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={relatedPost.featuredImage || "/placeholder.svg?height=64&width=80"}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/blog/${relatedPost.slug}`}>
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                              {relatedPost.title}
                            </h4>
                          </Link>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(relatedPost.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Newsletter */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Stay Updated</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest posts and updates delivered straight to your inbox.
                </p>
                <NewsletterForm />
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}