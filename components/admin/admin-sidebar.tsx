"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  FileText,
  Settings,
  Store,
  FileQuestion,
} from "lucide-react"

const AdminSidebar = () => {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/",
      active: pathname === "/admin",
    },
    {
      label: "Products",
      icon: Package,
      href: "/admin/products",
      active: pathname === "/admin/products" || pathname.startsWith("/admin/products/"),
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      href: "/admin/orders",
      active: pathname === "/admin/orders" || pathname.startsWith("/admin/orders/"),
    },
    {
      label: "Customers",
      icon: Users,
      href: "/admin/customers",
      active: pathname === "/admin/customers" || pathname.startsWith("/admin/customers/"),
    },
    {
      label: "Categories",
      icon: Tags,
      href: "/admin/categories",
      active: pathname === "/admin/categories",
    },
    {
      label: "Blogs",
      icon: FileText,
      href: "/admin/blogs",
      active: pathname === "/admin/blogs" || pathname.startsWith("/admin/blogs/"),
    },
    {
      label: "Quotations",
      icon: FileQuestion,
      href: "/admin/quotations",
      active: pathname === "/admin/quotations",
    },
    {
      label: "Vendors",
      icon: Store,
      href: "/admin/vendors",
      active: pathname === "/admin/vendors" || pathname.startsWith("/admin/vendors/"),
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <div className="h-full border-r bg-gray-100/40 w-64">
      <div className="p-6">
        <Link href="/admin">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </Link>
      </div>
      <div className="flex flex-col w-full">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-x-2 text-sm font-medium transition-all hover:text-primary hover:bg-gray-100 py-4 px-6",
              route.active ? "text-primary bg-gray-100 border-r-2 border-primary" : "text-muted-foreground",
            )}
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AdminSidebar

