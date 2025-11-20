'use client';

import { useState, ChangeEvent } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  documentType: 'GST' | 'AADHAR'| 'PAN' | 'BANK' | 'OTHER' | 'UDYAM' | 'APPLICATION';
}

export default function FileUploader({
  onUploadComplete,
  acceptedTypes = '.pdf,.jpg,.jpeg,.png',
  maxSize = 5, // 5MB default
  documentType,
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Check file type
    const fileType = selectedFile.type;
    const validTypes = acceptedTypes.split(',').map(type => type.replace('.', ''));
    if (!validTypes.some(type => fileType.includes(type.toLowerCase()))) {
      toast.error(`Please upload a valid file type (${acceptedTypes})`);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', documentType);

    setUploading(true);
    setProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const response = await fetch('/api/pdf-uploader', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data = await response.json();
      setProgress(100);
      onUploadComplete(data.url);
      toast.success(`${documentType} document uploaded successfully`);
      
      // Reset after successful upload
      setTimeout(() => {
        setFile(null);
        setProgress(0);
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor={`file-upload-${documentType}`}
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
            file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {!file ? (
              <>
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  {acceptedTypes.replace(/\./g, '').toUpperCase()} (max. {maxSize}MB)
                </p>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <FileText className="w-8 h-8 text-green-500" />
                <span className="text-sm font-medium text-green-500">{file.name}</span>
                {!uploading && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                    }}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            )}
          </div>
          <input
            id={`file-upload-${documentType}`}
            type="file"
            className="hidden"
            accept={acceptedTypes}
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {file && (
        <div className="space-y-2">
          {progress > 0 && (
            <div className="w-full">
              <Progress value={progress} className="h-2" />
              <p className="mt-1 text-sm text-gray-500 text-center">
                {progress === 100 ? 'Upload complete!' : `Uploading... ${progress}%`}
              </p>
            </div>
          )}
          <Button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>Upload {documentType} Document</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}