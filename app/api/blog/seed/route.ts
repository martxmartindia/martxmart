import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { BlogStatus } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    // First seed categories
    const categories = [
      { name: "Technology", slug: "technology" },
      { name: "Agriculture", slug: "agriculture" },
      { name: "Manufacturing", slug: "manufacturing" },
      { name: "Business", slug: "business" },
    ]

    const createdCategories = []
    for (const cat of categories) {
      const existing = await prisma.blogCategory.findUnique({ where: { slug: cat.slug } })
      if (!existing) {
        const created = await prisma.blogCategory.create({ data: cat })
        createdCategories.push(created)
      } else {
        createdCategories.push(existing)
      }
    }

    // Create admin user if not exists
    let adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } })
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          name: "Admin User",
          email: "admin@martxmart.com",
          role: "ADMIN",
          isVerified: true,
        }
      })
    }

    // Create author profile
    let author = await prisma.author.findUnique({ where: { userId: adminUser.id } })
    if (!author) {
      author = await prisma.author.create({
        data: {
          userId: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          bio: "Expert in agriculture and business development",
        }
      })
    }

    // Seed blog posts
    const blogPosts = [
      {
        title: "The Future of Smart Agriculture Technology",
        slug: "future-smart-agriculture-technology",
        excerpt: "Discover how IoT, AI, and automation are revolutionizing modern farming practices.",
        content: "Smart agriculture represents a revolutionary approach to farming that leverages cutting-edge technology to optimize crop yields, reduce resource consumption, and enhance sustainability. IoT sensors monitor soil conditions in real-time, while AI algorithms analyze data to predict weather patterns and detect diseases. Drone technology enables efficient field monitoring and assessment.",
        categoryId: createdCategories.find(c => c.slug === "technology")?.id,
        tags: ["IoT", "AI", "Smart Farming", "Technology"],
        featuredImage: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=400&fit=crop",
        status: BlogStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: author.id,
      },
      {
        title: "Essential Food Processing Equipment for Small Businesses",
        slug: "essential-food-processing-equipment-small-businesses",
        excerpt: "A comprehensive guide to selecting the right food processing machinery for your startup.",
        content: "Starting a food processing business requires the right equipment. Essential machinery includes commercial mixers for combining ingredients, food processors for preparation, and packaging machines for product finishing. Quality control equipment like metal detectors and weight checkers ensure food safety and portion control.",
        categoryId: createdCategories.find(c => c.slug === "manufacturing")?.id,
        tags: ["Food Processing", "Equipment", "Small Business", "Manufacturing"],
        featuredImage: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=400&fit=crop",
        status: BlogStatus.PUBLISHED,
        publishedAt: new Date(Date.now() - 86400000),
        authorId: author.id,
      },
      {
        title: "Sustainable Farming Practices for Modern Agriculture",
        slug: "sustainable-farming-practices-modern-agriculture",
        excerpt: "Learn about eco-friendly farming methods that protect the environment while maintaining productivity.",
        content: "Sustainable farming practices are essential for maintaining soil health and protecting biodiversity. Key methods include crop rotation, integrated pest management, water conservation techniques like drip irrigation, and soil health management through composting and reduced tillage. These practices reduce input costs while improving crop quality.",
        categoryId: createdCategories.find(c => c.slug === "agriculture")?.id,
        tags: ["Sustainability", "Organic Farming", "Environment", "Soil Health"],
        featuredImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=400&fit=crop",
        status: BlogStatus.PUBLISHED,
        publishedAt: new Date(Date.now() - 172800000),
        authorId: author.id,
      },
      {
        title: "Building a Successful Agribusiness: Key Strategies",
        slug: "building-successful-agribusiness-key-strategies",
        excerpt: "Essential business strategies for entrepreneurs entering the agricultural sector.",
        content: "Agribusiness success requires understanding market dynamics, supply chain management, and consumer trends. Key strategies include thorough market research, comprehensive financial planning, supply chain optimization, technology integration, and effective risk management. Building partnerships with other stakeholders strengthens market position.",
        categoryId: createdCategories.find(c => c.slug === "business")?.id,
        tags: ["Agribusiness", "Entrepreneurship", "Strategy", "Market Analysis"],
        featuredImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
        status: BlogStatus.PUBLISHED,
        publishedAt: new Date(Date.now() - 259200000),
        authorId: author.id,
      },
    ]

    const createdPosts = []
    for (const post of blogPosts) {
      const existing = await prisma.blog.findUnique({ where: { slug: post.slug } })
      if (!existing && post.categoryId) {
        const created = await prisma.blog.create({ 
          data: {
            ...post,
            categoryId: post.categoryId
          }
        })
        createdPosts.push(created)
      }
    }

    return NextResponse.json({
      message: "Blog data seeded successfully",
      categories: createdCategories.length,
      posts: createdPosts.length,
    })
  } catch (error) {
    console.error("Error seeding blog data:", error)
    return NextResponse.json({ error: "Failed to seed blog data" }, { status: 500 })
  }
}