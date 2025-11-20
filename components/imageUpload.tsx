'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  label?: string
}

export function ImageUpload({ value = [], onChange, maxImages = 5, label = 'Images' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    
    if (!files || files.length === 0) return
    
    if (value.length + files.length > maxImages) {
      toast.error(`You can only upload a maximum of ${maxImages} images`)
      return
    }
    
    setIsUploading(true)
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to upload image')
        }
        
        const data = await response.json()
        return data.url
      })
      
      const uploadedUrls = await Promise.all(uploadPromises)
      onChange([...value, ...uploadedUrls])
      toast.success('Images uploaded successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload images')
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }
  
  const handleRemove = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-500">
          {value.length} / {maxImages} images
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative group aspect-square">
            <Image
              src={url || "/logo.png"}
              alt={`Uploaded image ${index + 1}`}
              width={100}
              height={100}
              className="h-full w-full object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {value.length < maxImages && (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center p-4 hover:border-orange-500 transition-colors cursor-pointer aspect-square"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
            ) : (
              <>
                <Upload className="h-6 w-6 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500 text-center">
                  Click to upload
                </p>
              </>
            )}
          </div>
        )}
      </div>
      
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
        disabled={isUploading || value.length >= maxImages}
      />
    </div>
  )
}