"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

interface Slide {
  id: number;
  type: "MACHINE" | "SHOP";
  imageorVideo: string;
  mobileImageorVideo: string;
  link?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SlidesPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSlides = async () => {
    try {
      const response = await fetch("/api/slides");
      const data = await response.json();
      setSlides(data.slides || []);
    } catch (error) {
      console.error("Error fetching slides:", error);
      toast.error("Failed to fetch slides");
    } finally {
      setLoading(false);
    }
  };

  const toggleSlideStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/slides/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        toast.success(`Slide ${!currentStatus ? "activated" : "deactivated"}`);
        fetchSlides();
      } else {
        toast.error("Failed to update slide status");
      }
    } catch (error) {
      console.error("Error updating slide:", error);
      toast.error("Failed to update slide status");
    }
  };

  const deleteSlide = async (id: number) => {
    try {
      const response = await fetch(`/api/slides/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Slide deleted successfully");
        fetchSlides();
      } else {
        toast.error("Failed to delete slide");
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      toast.error("Failed to delete slide");
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Hero Slides</h1>
          <p className="text-gray-600">Manage homepage hero slides</p>
        </div>
        <Button onClick={() => router.push("/admin/slides/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Slide
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Slides</CardTitle>
          <CardDescription>
            Manage your homepage hero slides and their visibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          {slides.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No slides found</p>
              <Button
                className="mt-4"
                onClick={() => router.push("/admin/slides/new")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Slide
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slides.map((slide) => (
                  <TableRow key={slide.id}>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Image
                          src={slide.imageorVideo}
                          alt="Desktop preview"
                          width={80}
                          height={80}
                          className="w-16 h-10 object-cover rounded border"
                        />
                        <Image
                          width={40}
                          height={40}
                          src={slide.mobileImageorVideo}
                          alt="Mobile preview"
                          className="w-8 h-10 object-cover rounded border"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={slide.type === "MACHINE" ? "default" : "secondary"}>
                        {slide.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {slide.link ? (
                        <a
                          href={slide.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate max-w-32 block"
                        >
                          {slide.link}
                        </a>
                      ) : (
                        <span className="text-gray-400">No link</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={slide.isActive ? "default" : "secondary"}>
                        {slide.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(slide.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleSlideStatus(slide.id, slide.isActive)}
                        >
                          {slide.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/slides/${slide.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Slide</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this slide? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteSlide(slide.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}