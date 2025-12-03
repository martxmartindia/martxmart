'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AuthorSidebar from "@/components/author-sidebar"

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (status === 'unauthenticated' || session?.user?.role !== 'AUTHOR') {
      router.push('/auth/author/login');
      return;
    }
  }, [session, status, router]);

  return (
    <div className="h-full">
    <div className="h-full flex">
      <AuthorSidebar />
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  </div>
  );
}