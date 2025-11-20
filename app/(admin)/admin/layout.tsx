// app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useAdmin } from '@/store/admin';
import AdminSidebar from '@/components/admin-sidebar';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isAdmin, isLoading, token, logout } = useAdmin();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated or not admin
    if (!isLoading && (!isAuthenticated || !isAdmin || !token)) {
      toast.error('You do not have permission to access the admin panel');
      router.push('/auth/admin/login?callbackUrl=/admin');
    }

    // Handle responsive sidebar
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [router, isAuthenticated, isAdmin, isLoading, token]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/auth/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex-1 flex">
          <div className="w-64 bg-white border-r border-gray-200 p-4">
            <div className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <div className="space-y-2">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
              </div>
            </div>
          </div>
          <div className="flex-1 p-8">
            <Skeleton className="h-12 w-48 mb-8" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <AdminSidebar isOpen={isSidebarOpen} onLogout={handleLogout} />
      <div className="flex-1 overflow-y-auto">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        >
          <Menu className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>
  );
}