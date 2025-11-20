"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductSkeletonProps {
  viewMode: "grid" | "list"
}

export default function ProductSkeleton({ viewMode }: ProductSkeletonProps) {
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <Skeleton className="w-full sm:w-48 h-48 sm:h-32" />
          <CardContent className="flex-1 p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between h-full">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex flex-col sm:items-end justify-between mt-4 sm:mt-0">
                <Skeleton className="h-6 w-20 mb-2" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductSkeletonGrid({ viewMode, count = 12 }: { viewMode: "grid" | "list", count?: number }) {
  return (
    <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  )
}