// app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import AdminSidebar from '@/components/admin-sidebar';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && session?.user;
  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    // Debug logging to understand session state
    console.log("🔍 [AdminLayout] Session state:", {
      status,
      isLoading,
      isAuthenticated,
      isAdmin,
      userRole: session?.user?.role,
      hasSession: !!session,
      hasUser: !!session?.user
    });

    // Only redirect if we're sure the user is not an admin
    // Wait for session to be fully loaded and authenticated
    if (!isLoading && isAuthenticated) {
      if (!isAdmin) {
        console.log("🚫 [AdminLayout] User is not admin, redirecting to login");
        toast.error('You do not have permission to access the admin panel');
        router.push('/auth/admin/login?callbackUrl=/admin');
      } else {
        console.log("✅ [AdminLayout] User is admin, allowing access");
      }
    } else if (!isLoading && !isAuthenticated) {
      console.log("🚫 [AdminLayout] User is not authenticated, redirecting to login");
      toast.error('Please log in to access the admin panel');
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
  }, [router, isAuthenticated, isAdmin, isLoading, status, session]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/admin/login' });
    toast.success('Logged out successfully');
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