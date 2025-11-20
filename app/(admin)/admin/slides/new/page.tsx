"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function NewSlidePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "MACHINE" as "MACHINE" | "SHOP",
    imageorVideo: "",
    mobileImageorVideo: "",
    link: "",
    isActive: true,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageorVideo || !formData.mobileImageorVideo) {
      toast.error("Please provide both desktop and mobile media");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/slides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Slide created successfully");
        router.push("/admin/slides");
      } else {
        toast.error(data.error || "Failed to create slide");
      }
    } catch (error) {
      console.error("Error creating slide:", error);
      toast.error("Failed to create slide");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Add New Hero Slide</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Slide Information</CardTitle>
            <CardDescription>
              Create a new hero slide for the homepage
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
                Save Slide
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
