"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, PlusCircle, BarChart2, User, Settings } from "lucide-react"

const AuthorSidebar = () => {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/author",
      active: pathname === "/author",
    },
    {
      label: "My Blogs",
      icon: FileText,
      href: "/author/blogs",
      active: pathname === "/author/blogs" || (pathname.startsWith("/author/blogs/") && !pathname.includes("/new")),
    },
    {
      label: "Create New Blog",
      icon: PlusCircle,
      href: "/author/blogs/new",
      active: pathname === "/author/blogs/new",
    },
    {
      label: "Analytics",
      icon: BarChart2,
      href: "/author/analytics",
      active: pathname === "/author/analytics",
    },
    {
      label: "Profile",
      icon: User,
      href: "/author/profile",
      active: pathname === "/author/profile",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/author/settings",
      active: pathname === "/author/settings",
    },
  ]

  return (
    <div className="h-full border-r bg-gray-100/40 w-64">
      <div className="p-6">
        <Link href="/author/dashboard">
          <h1 className="text-2xl font-bold">Author Panel</h1>
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

export default AuthorSidebar

