import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"

interface CategoryCardProps {
  name: string
  icon?: ReactNode
  imageSrc?: string
  href: string
  variant?: "icon" | "image" | "simple"
}

export function CategoryCard({ name, icon, imageSrc, href, variant = "icon" }: CategoryCardProps) {
  if (variant === "image") {
    return (
      <Link href={href} className="group">
        <div className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all">
          <div className="aspect-square relative">
            <Image
              src={imageSrc || "/placeholder.svg?height=200&width=200"}
              alt={name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="p-3 bg-white">
            <h3 className="text-sm font-medium text-center line-clamp-2 h-10 group-hover:text-orange-600 transition-colors">
              {name}
            </h3>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === "simple") {
    return (
      <Link href={href}>
        <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:border-orange-200 border border-transparent">
          <h3 className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors">{name}</h3>
        </div>
      </Link>
    )
  }

  // Default icon variant
  return (
    <Link href={href}>
      <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
        <div className="w-12 h-12 mb-3 flex items-center justify-center bg-orange-50 rounded-full">{icon}</div>
        <h3 className="text-sm font-medium text-center line-clamp-2 h-10">{name}</h3>
      </div>
    </Link>
  )
}

