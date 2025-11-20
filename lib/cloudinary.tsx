import { v2 as cloudinary } from "cloudinary";

// ✅ Cloudinary Proper Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // ❌ Don't use NEXT_PUBLIC_
});

export async function uploadImage(file: Buffer): Promise<string> {
  try {
    if (!file || !Buffer.isBuffer(file)) {
      throw new Error("Invalid file input. Expected a Buffer.");
    }

    // ✅ Convert buffer to properly formatted Base64 string
    const base64Image = `data:image/jpeg;base64,${file.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "martXmart",
      resource_type: "image", // ✅ Explicitly specify type
    });

    if (!result || !result.secure_url) {
      throw new Error("Failed to get secure URL from Cloudinary.");
    }

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error(error instanceof Error ? `Cloudinary upload failed: ${error.message}` : "Unknown Cloudinary error.");
  }
}