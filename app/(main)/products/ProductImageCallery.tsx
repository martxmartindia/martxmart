"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function ProductImageGallery({ images }: { images: string[] }) {
  const [currentImage, setCurrentImage] = useState(0)

  const handlePrevious = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  if (!images.length) {
    return (
      <div className="aspect-square relative rounded-md overflow-hidden bg-gray-100">
        <Image
          src="/placeholder.svg?height=800&width=800"
          alt="Product image placeholder"
          fill
          className="object-contain"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-2">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[500px] pb-2 md:pb-0">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative w-16 h-16 flex-shrink-0 border hover:border-primary ${
                index === currentImage ? "border-primary" : "border-gray-200"
              }`}
              onClick={() => setCurrentImage(index)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="flex-1">
        <div className="aspect-square relative rounded-md overflow-hidden bg-gray-100">
          <Image
            src={images[currentImage] || "/placeholder.svg?height=800&width=800"}
            alt={`Product image ${currentImage + 1}`}
            fill
            className="object-contain p-2"
            priority
          />

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-8 w-8"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-8 w-8"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-2 right-2 bg-white/80 hover:bg-white/90 rounded-full h-8 w-8"
              >
                <Expand className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <div className="aspect-square relative">
                <Image
                  src={images[currentImage] || "/placeholder.svg?height=1200&width=1200"}
                  alt={`Product image ${currentImage + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

