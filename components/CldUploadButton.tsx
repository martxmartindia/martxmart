'use client';

import { CldUploadButton } from 'next-cloudinary';

export default function CloudinaryUploader() {
  const handleUpload = (result: any) => {
    // Access result.info.secure_url and result.info.public_id
  };

  return (
    <CldUploadButton
      uploadPreset="pdf_upload_preset"
      options={{ folder: 'pdf_uploads', resourceType: 'auto' }}
      onSuccess={handleUpload}
    >
      Upload PDF
    </CldUploadButton>
  );
}
