"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ImageUpload } from "@/components/imageUpload";

interface SlideData {
  type: "MACHINE" | "SHOP";
  imageorVideo: string;
  mobileImageorVideo: string;
  link?: string;
  isActive: boolean;
}

export default function EditSlidePage() {
  const router = useRouter();
  const params = useParams();
  const slideId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<SlideData>({
    type: "MACHINE",
    imageorVideo: "",
    mobileImageorVideo: "",
    link: "",
    isActive: true,
  });

  const fetchSlide = async () => {
    try {
      const response = await fetch(`/api/slides/${slideId}`);
      if (response.ok) {
        const slide = await response.json();
        setFormData({
          type: slide.type,
          imageorVideo: slide.imageorVideo,
          mobileImageorVideo: slide.mobileImageorVideo,
          link: slide.link || "",
          isActive: slide.isActive,
        });
      } else {
        toast.error("Failed to fetch slide data");
        router.push("/admin/slides");
      }
    } catch (error) {
      console.error("Error fetching slide:", error);
      toast.error("Failed to fetch slide data");
      router.push("/admin/slides");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SlideData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageorVideo || !formData.mobileImageorVideo) {
      toast.error("Please provide both desktop and mobile media");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/slides/${slideId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Slide updated successfully");
        router.push("/admin/slides");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update slide");
      }
    } catch (error) {
      console.error("Error updating slide:", error);
      toast.error("Failed to update slide");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchSlide();
  }, [slideId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Hero Slide</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Slide Information</CardTitle>
            <CardDescription>
              Update the hero slide details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Slide Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "MACHINE" | "SHOP") => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select slide type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MACHINE">Machine</SelectItem>
                  <SelectItem value="SHOP">Shop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Desktop Media (Image or Video){" "}
                <span className="text-red-500">*</span>
              </Label>
              <ImageUpload
                value={formData.imageorVideo ? [formData.imageorVideo] : []}
                onChange={(urls) =>
                  handleInputChange("imageorVideo", urls[0] || "")
                }
                maxImages={1}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Mobile Media (Image or Video){" "}
                <span className="text-red-500">*</span>
              </Label>
              <ImageUpload
                value={
                  formData.mobileImageorVideo
                    ? [formData.mobileImageorVideo]
                    : []
                }
                onChange={(urls) =>
                  handleInputChange("mobileImageorVideo", urls[0] || "")
                }
                maxImages={1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link (Optional)</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://example.com"
                value={formData.link}
                onChange={(e) => handleInputChange("link", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/slides")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Update Slide
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}