'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  tags: string[];
  views: number;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [, setLoading] = useState(true);
  const [, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/admin/blogs');
      const data = await response.json();
      if (response.ok) {
        setBlogs(data);
      } else {
        toast.error('Failed to fetch blogs');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching blogs';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (blogId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: blogId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        toast.success('Blog status updated');
        fetchBlogs();
      } else {
        toast.error('Failed to update blog status');
      }
    } catch (error) {
      toast.error('Error updating blog status');
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const response = await fetch(`/api/admin/blogs?id=${blogId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } else {
        toast.error('Failed to delete blog');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error deleting blog';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <Button
          onClick={() => setSelectedBlog(null)}
          className="bg-primary text-white"
        >
          Create New Blog
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Card key={blog.id} className="overflow-hidden">
            {blog.featuredImage && (
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                height={200}
                width={200}
                className="w-full h-48 object-cover"
              />
            )}
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span className="text-lg font-semibold">{blog.title}</span>
                <div className="flex items-center gap-2">
                  <select
                    value={blog.status}
                    onChange={(e) => handleStatusChange(blog.id, e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                  <Badge
                    variant={blog.status === 'PUBLISHED' ? 'default' : 'secondary'}
                  >
                    {blog.status}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {blog.excerpt || blog.content.substring(0, 150) + '...'}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Views: {blog.views}</span>
                <span>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBlog(blog)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(blog.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}