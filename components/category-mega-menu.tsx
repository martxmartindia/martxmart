"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Grid, Factory, Smartphone, Stethoscope, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CategoryMegaMenu() {
  const [showMegaMenu, setShowMegaMenu] = useState(false)

  // Category groups for mega menu
  const categoryGroups = [
    {
      title: "Industrial",
      icon: <Factory className="h-5 w-5 text-orange-600" />,
      categories: [
        "Industrial Plants, Machinery & Equipment",
        "Industrial & Engineering Products",
        "Mechanical Components & Parts",
        "Tools & Machine Tools",
        "Metals, Minerals, Ores & Alloys",
        "Electrical Equipment and Supplies",
      ],
    },
    {
      title: "Consumer",
      icon: <Smartphone className="h-5 w-5 text-orange-600" />,
      categories: [
        "Consumer Electronics & Appliances",
        "Apparel, Clothing & Garments",
        "Home Furnishings and Textiles",
        "Kitchen Containers & Utensils",
        "Cosmetics & Personal Care",
        "Sports Goods, Games & Toys",
      ],
    },
    {
      title: "Business",
      icon: <Briefcase className="h-5 w-5 text-orange-600" />,
      categories: [
        "Building & Construction Material",
        "Packaging Material & Supplies",
        "Chemicals, Dyes & Products",
        "Scientific & Laboratory Instruments",
        "Furniture & Furniture Hardware",
        "Textiles, Yarn & Fabrics",
      ],
    },
    {
      title: "Services",
      icon: <Stethoscope className="h-5 w-5 text-orange-600" />,
      categories: [
        "Medical, Pharma & Healthcare",
        "IT & Software Services",
        "Financial & Legal Advisory",
        "Educational & Training Institutes",
        "Travel & Tourism Services",
        "Business & Management Consultants",
      ],
    },
  ]

  return (
    <div className="relative" onMouseEnter={() => setShowMegaMenu(true)} onMouseLeave={() => setShowMegaMenu(false)}>
      <Button
        variant="ghost"
        className="flex items-center gap-1 px-0 text-sm font-medium transition-colors hover:text-orange-600 text-gray-700"
      >
        <Grid className="h-4 w-4 mr-1" />
        Categories
        <ChevronDown className="h-4 w-4" />
      </Button>

      {showMegaMenu && (
        <div className="absolute left-0 mt-2 w-[800px] bg-white shadow-lg rounded-lg p-6 grid grid-cols-4 gap-6 z-50">
          {categoryGroups.map((group, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-2 font-medium text-gray-900 pb-2 border-b">
                {group.icon}
                <span>{group.title}</span>
              </div>
              <ul className="space-y-2">
                {group.categories.map((category, idx) => (
                  <li key={idx}>
                    <Link
                      href={`/products?category=${encodeURIComponent(category)}`}
                      className="text-sm text-gray-600 hover:text-orange-600"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/products?group=${encodeURIComponent(group.title)}`}
                className="text-xs text-orange-600 hover:underline inline-block mt-2"
              >
                View all {group.title} →
              </Link>
            </div>
          ))}
          <div className="col-span-4 mt-4 pt-4 border-t text-center">
            <Link href="/products/categories" className="text-sm font-medium text-orange-600 hover:underline">
              View All Categories
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

