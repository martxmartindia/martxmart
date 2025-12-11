'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  CreditCard, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';

const navigation = [
  { name: 'Dashboard', href: '/vendor-portal/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/vendor-portal/products', icon: Package },
  { name: 'Orders', href: '/vendor-portal/orders', icon: ShoppingCart },
  { name: 'Analytics', href: '/vendor-portal/analytics', icon: BarChart3 },
  { name: 'Payouts', href: '/vendor-portal/payouts', icon: CreditCard },
  { name: 'Settings', href: '/vendor-portal/settings', icon: Settings },
];

export function VendorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call the vendor logout API
      await fetch('/api/vendor/auth/logout', {
        method: 'POST',
      });

      // Sign out from NextAuth
      await signOut({ 
        redirect: false,
        callbackUrl: '/auth/vendor/login'
      });

      toast.success('Logged out successfully');
      router.push('/auth/vendor/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="border-b bg-gradient-to-r from-orange-50 to-orange-100/50">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-gray-900">Vendor Portal</span>
            <span className="text-xs text-gray-600 font-medium">Manage your store</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href} className="transition-all duration-200 hover:bg-accent">
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.name}</span>
                        {isActive && (
                          <div className="ml-auto w-1 h-4 bg-orange-500 rounded-full" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t bg-gray-50/50">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg border shadow-sm">
            <Avatar className="h-10 w-10 ring-2 ring-orange-100">
              <AvatarImage src="/avatars/vendor.png" alt="Vendor" />
              <AvatarFallback className="bg-orange-100 text-orange-600">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold truncate text-gray-900">John Vendor</p>
              <p className="text-xs text-gray-500 truncate">vendor@example.com</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-colors"
              onClick={() => router.push('/vendor-portal/profile')}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? '...' : 'Logout'}
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
