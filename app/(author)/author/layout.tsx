'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthorSidebar from "@/components/author-sidebar"
import { useAuthor } from '@/store/author';

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthor();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/author/login');
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="h-full">
    <div className="h-full flex">
      <AuthorSidebar />
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  </div>
  );
}