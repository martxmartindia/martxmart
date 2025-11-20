"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Server,
  AlertTriangle,
  Activity,
  Shield,
  Settings,
  Terminal,
  FileText,
  BarChart3,
  ChevronDown,
  ChevronRight,
  User,
} from "lucide-react"
import { useState } from "react"

const CTOSidebar = () => {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    monitoring: true,
    infrastructure: false,
    security: false,
    logs: false,
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
      href: "/cto/dashboard",
      active: pathname === "/cto/dashboard",
    },
    {
      label: "Monitoring",
      icon: Activity,
      menu: "monitoring",
      active: pathname.startsWith("/cto/monitoring"),
      submenu: [
        {
          label: "Performance",
          href: "/cto/monitoring/performance",
          active: pathname === "/cto/monitoring/performance",
        },
        {
          label: "API Metrics",
          href: "/cto/monitoring/api",
          active: pathname === "/cto/monitoring/api",
        },
        {
          label: "Database",
          href: "/cto/monitoring/database",
          active: pathname === "/cto/monitoring/database",
        },
        {
          label: "Real-time",
          href: "/cto/monitoring/realtime",
          active: pathname === "/cto/monitoring/realtime",
        },
      ],
    },
    {
      label: "Infrastructure",
      icon: Server,
      menu: "infrastructure",
      active: pathname.startsWith("/cto/infrastructure"),
      submenu: [
        {
          label: "Servers",
          href: "/cto/infrastructure/servers",
          active: pathname === "/cto/infrastructure/servers",
        },
        {
          label: "Databases",
          href: "/cto/infrastructure/databases",
          active: pathname === "/cto/infrastructure/databases",
        },
        {
          label: "Network",
          href: "/cto/infrastructure/network",
          active: pathname === "/cto/infrastructure/network",
        },
        {
          label: "Storage",
          href: "/cto/infrastructure/storage",
          active: pathname === "/cto/infrastructure/storage",
        },
      ],
    },
    {
      label: "Security",
      icon: Shield,
      menu: "security",
      active: pathname.startsWith("/cto/security"),
      submenu: [
        {
          label: "Threats",
          href: "/cto/security/threats",
          active: pathname === "/cto/security/threats",
        },
        {
          label: "Access Control",
          href: "/cto/security/access",
          active: pathname === "/cto/security/access",
        },
        {
          label: "Audit",
          href: "/cto/security/audit",
          active: pathname === "/cto/security/audit",
        },
        {
          label: "Compliance",
          href: "/cto/security/compliance",
          active: pathname === "/cto/security/compliance",
        },
      ],
    },
    {
      label: "Logs & Errors",
      icon: AlertTriangle,
      menu: "logs",
      active: pathname.startsWith("/cto/logs"),
      submenu: [
        {
          label: "Error Logs",
          href: "/cto/logs/errors",
          active: pathname === "/cto/logs/errors",
        },
        {
          label: "System Logs",
          href: "/cto/logs/system",
          active: pathname === "/cto/logs/system",
        },
        {
          label: "Access Logs",
          href: "/cto/logs/access",
          active: pathname === "/cto/logs/access",
        },
        {
          label: "Audit Logs",
          href: "/cto/logs/audit",
          active: pathname === "/cto/logs/audit",
        },
      ],
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/cto/analytics",
      active: pathname === "/cto/analytics",
    },
    {
      label: "API Management",
      icon: Terminal,
      href: "/cto/api",
      active: pathname === "/cto/api",
    },
    {
      label: "Documentation",
      icon: FileText,
      href: "/cto/documentation",
      active: pathname === "/cto/documentation",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/cto/settings",
      active: pathname === "/cto/settings",
    },
    {
      label: "Profile",
      icon: User,
      href: "/cto/profile",
      active: pathname === "/cto/profile",
    },
  ]

  return (
    <div className="h-full border-r bg-gray-100/40 w-64 overflow-y-auto">
      <div className="p-6">
        <Link href="/cto/dashboard">
          <h1 className="text-2xl font-bold">CTO Panel</h1>
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
      </div>
    </div>
  )
}

export default CTOSidebar

