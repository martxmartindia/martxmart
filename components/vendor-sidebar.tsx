"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart2,
  FileText,
  CreditCard,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  User,
  MessageSquare,
  HelpCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: { title: string; href: string }[]
}

export function VendorSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Logout successful")
        router.push("/auth/login")
      } else {
        throw new Error("Logout failed")
      }
    } catch (error) {
      
      toast.error("Logout failed")
    }
  }

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null)
    } else {
      setOpenSubmenu(title)
    }
  }

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/vendor/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Products",
      href: "/vendor/products",
      icon: <Package className="h-5 w-5" />,
      submenu: [
        { title: "All Products", href: "/vendor/products" },
        { title: "Add Product", href: "/vendor/products/new" },
        { title: "Categories", href: "/vendor/products/categories" },
        { title: "Inventory", href: "/vendor/products/inventory" },
      ],
    },
    {
      title: "Orders",
      href: "/vendor/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: "Customers",
      href: "/vendor/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/vendor/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      title: "Payments",
      href: "/vendor/payments",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Documents",
      href: "/vendor/documents",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Messages",
      href: "/vendor/messages",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Profile",
      href: "/vendor/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Help & Support",
      href: "/vendor/support",
      icon: <HelpCircle className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/vendor/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="px-3 py-4">
        <Link href="/vendor/dashboard" className="flex items-center px-2 py-2">
          <span className="text-xl font-bold">Vendor Portal</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {sidebarItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between font-normal",
                      pathname.startsWith(item.href) && "bg-muted font-medium",
                    )}
                    onClick={() => toggleSubmenu(item.title)}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </div>
                    {openSubmenu === item.title ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  {openSubmenu === item.title && (
                    <div className="ml-4 space-y-1 pl-4 border-l">
                      {item.submenu.map((subitem) => (
                        <Button
                          key={subitem.title}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start font-normal",
                            pathname === subitem.href && "bg-muted font-medium",
                          )}
                          asChild
                        >
                          <Link href={subitem.href}>{subitem.title}</Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start font-normal", pathname === item.href && "bg-muted font-medium")}
                  asChild
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto border-t p-3">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Logout</span>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <SidebarContent />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
