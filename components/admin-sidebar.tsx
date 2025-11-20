"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Bell,
  User,
  ChevronDown,
  ChevronRight,
  BarChart3,
  CreditCard,
  Layers,
  Zap,
  LogOut,
} from "lucide-react"
import { useState } from "react"

interface AdminSidebarProps {
  isOpen: boolean;
  onLogout: () => Promise<void>;
}

const AdminSidebar = ({ isOpen, onLogout }: AdminSidebarProps) => {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    dashboard: true,
    users: false,
    products: false,
    orders: false,
    content: false,
    marketing: false,
    finance: false,
    settings: false,
  })

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: "Users & Partners",
      icon: Users,
      menu: "users",
      active:
        pathname.startsWith("/admin/customers") ||
        pathname.startsWith("/admin/vendors") ||
        pathname.startsWith("/admin/authors") ||
        pathname.startsWith("/admin/franchises"),
      submenu: [
        {
          label: "Customers",
          href: "/admin/customers",
          active: pathname === "/admin/customers" || pathname.startsWith("/admin/customers/"),
        },
        {
          label: "Vendors",
          href: "/admin/vendors",
          active: pathname === "/admin/vendors" || pathname.startsWith("/admin/vendors/"),
        },
        {
          label: "Authors",
          href: "/admin/authors",
          active: pathname === "/admin/authors" || pathname.startsWith("/admin/authors/"),
        },
        {
          label: "Franchises",
          href: "/admin/franchises",
          active: pathname === "/admin/franchises" || pathname.startsWith("/admin/franchises/"),
        },
      ],
    },
    {
      label: "Products",
      icon: Package,
      menu: "products",
      active:
        pathname.startsWith("/admin/products") ||
        pathname.startsWith("/admin/categories") ||
        pathname.startsWith("/admin/inventory"),
      submenu: [
        {
          label: "All Products",
          href: "/admin/products",
          active: pathname === "/admin/products",
        },
        {
          label: "Add Product",
          href: "/admin/products/new",
          active: pathname === "/admin/products/new",
        },
        {
          label: "Categories",
          href: "/admin/categories",
          active: pathname === "/admin/categories" || pathname.startsWith("/admin/categories/"),
        },
        {
          label: "Shopping",
          href: "/admin/shopping/products",
          active: pathname === "/admin/shopping/products" || pathname.startsWith("/admin/shopping/products/"),
        },
      ],
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      menu: "orders",
      active:
        pathname.startsWith("/admin/orders") ||
        pathname.startsWith("/admin/quotations"),
      submenu: [
        {
          label: "All Orders",
          href: "/admin/orders",
          active: pathname === "/admin/orders" || pathname.startsWith("/admin/orders/"),
        },
        {
          label: "Quotations",
          href: "/admin/quotations",
          active: pathname === "/admin/quotations" || pathname.startsWith("/admin/quotations/"),
        },
      ],
    },
    {
      label: "Content",
      icon: Layers,
      menu: "content",
      active:
        pathname.startsWith("/admin/blogs") ||
        pathname.startsWith("/admin/pages") ||
        pathname.startsWith("/admin/media"),
      submenu: [
        {
          label: "Blogs",
          href: "/admin/blogs",
          active: pathname === "/admin/blogs" || pathname.startsWith("/admin/blogs/"),
        },
        {
          label:"Coupons",
          href: "/admin/coupons",
          active: pathname === "/admin/coupons" || pathname.startsWith("/admin/coupons/"),
        },
        {
          label: "HSN/SAC",
          href: "/admin/hsn",
          active: pathname === "/admin/hsn" || pathname.startsWith("/admin/hsn"),
        },
        {
          label: "Careers",
          href: "/admin/careers",
          active: pathname === "/admin/careers" || pathname.startsWith("/admin/careers/"),
        },
        {
          label: "Hero Slides",
          href: "/admin/slides",
          active: pathname === "/admin/slides" || pathname.startsWith("/admin/slides/"),
        },
        {
          label:"Advertisment",
          href: "/admin/advertisements",
          active: pathname === "/admin/advertisements" || pathname.startsWith("/admin/advertisements/")
        }
      ],
    },
    // {
    //   label: "Marketing",
    //   icon: Zap,
    //   menu: "marketing",
    //   active:
    //     pathname.startsWith("/admin/campaigns") ||
    //     pathname.startsWith("/admin/discounts") ||
    //     pathname.startsWith("/admin/seo"),
    //   submenu: [
    //     // {
    //     //   label: "Campaigns",
    //     //   href: "/admin/campaigns",
    //     //   active: pathname === "/admin/campaigns" || pathname.startsWith("/admin/campaigns/"),
    //     // },
    //     {
    //       label: "Discounts",
    //       href: "/admin/discounts",
    //       active: pathname === "/admin/discounts" || pathname.startsWith("/admin/discounts/"),
    //     },
    //     // {
    //     //   label: "SEO",
    //     //   href: "/admin/seo",
    //     //   active: pathname === "/admin/seo" || pathname.startsWith("/admin/seo/"),
    //     // },
    //   ],
    // },
    // {
    //   label: "Finance",
    //   icon: CreditCard,
    //   menu: "finance",
    //   active:
    //     pathname.startsWith("/admin/payments") ||
    //     pathname.startsWith("/admin/invoices") ||
    //     pathname.startsWith("/admin/taxes"),
    //   submenu: [
    //     {
    //       label: "Payments",
    //       href: "/admin/payments",
    //       active: pathname === "/admin/payments" || pathname.startsWith("/admin/payments/"),
    //     },
    //     {
    //       label: "Invoices",
    //       href: "/admin/invoices",
    //       active: pathname === "/admin/invoices" || pathname.startsWith("/admin/invoices/"),
    //     },
    //     {
    //       label: "Taxes",
    //       href: "/admin/taxes",
    //       active: pathname === "/admin/taxes" || pathname.startsWith("/admin/taxes/"),
    //     },
    //   ],
    // },
    {
      label: "Reports",
      icon: BarChart3,
      href: "/admin/reports",
      active: pathname === "/admin/reports" || pathname.startsWith("/admin/reports/"),
    },
    {
      label: "System",
      icon: Settings,
      menu: "settings",
      active:
        pathname.startsWith("/admin/settings") ||
        pathname.startsWith("/admin/system") ||
        pathname.startsWith("/admin/logs"),
              submenu: [
        {
          label: "General Settings",
          href: "/admin/settings",
          active: pathname === "/admin/settings",
        },
        {
          label: "System",
          href: "/admin/system",
          active: pathname === "/admin/system",
        },
        {
          label: "Logs",
          href: "/admin/logs",
          active: pathname === "/admin/logs",
        },
      ],
    },
    {
      label: "Notifications",
      icon: Bell,
      href: "/admin/notifications",
      active: pathname === "/admin/notifications",
    },
    {
      label: "Profile",
      icon: User,
      href: "/admin/profile",
      active: pathname === "/admin/profile",
    },
  ]

  return (
    <div className={cn(
      "h-full border-r bg-gray-100/40 w-64 overflow-y-auto transition-all duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      "fixed lg:static z-50 lg:z-auto"
    )}>
      <div className="p-6">
        <Link href="/admin/dashboard">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </Link>
      </div>
      <div className="flex flex-col w-full">
        {routes.map((route) => (
          <div key={route.label.toLowerCase()}>
            {route.submenu ? (
              <>
                <button
                  onClick={() => toggleMenu(route.menu)}
                  className={cn(
                    "flex items-center justify-between w-full text-sm font-medium transition-all hover:text-primary hover:bg-gray-100 py-4 px-6",
                    route.active ? "text-primary bg-gray-100 border-r-2 border-primary" : "text-muted-foreground",
                  )}
                >
                  <div className="flex items-center gap-x-2">
                    <route.icon className="h-5 w-5" />
                    {route.label}
                  </div>
                  {openMenus[route.menu] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openMenus[route.menu] && (
                  <div className="pl-10 bg-gray-50">
                    {route.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center text-sm font-medium transition-all hover:text-primary hover:bg-gray-100 py-3 px-4",
                          subItem.active ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={route.href}
                className={cn(
                  "flex items-center gap-x-2 text-sm font-medium transition-all hover:text-primary hover:bg-gray-100 py-4 px-6",
                  route.active ? "text-primary bg-gray-100 border-r-2 border-primary" : "text-muted-foreground",
                )}
              >
                <route.icon className="h-5 w-5" />
                {route.label}
              </Link>
            )}
          </div>
        ))}
        
        {/* Logout Button */}
        <div className="mt-auto border-t pt-4">
          <button
            onClick={onLogout}
            className="flex items-center gap-x-2 text-sm font-medium transition-all hover:text-red-600 hover:bg-red-50 py-4 px-6 w-full text-left text-muted-foreground"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar

