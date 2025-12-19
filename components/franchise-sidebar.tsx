"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  LayoutDashboard,
  ShoppingCart,
  Package2,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Boxes,
  Bell,
  HelpCircle,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
export function FranchiseSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    inventory: true,
    reports: true,
  })

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/auth/franchise/login" })
      toast.success("Logout successful")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Logout failed")
    }
  }

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`)

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-600 text-white">
            <Package2 className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Franchise Portal</span>
            <span className="text-xs text-gray-500">Management System</span>
          </div>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <div className="px-2 py-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/franchise-portal")}>
                <Link href="/franchise-portal">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/franchise-portal/orders")}>
                <Link href="/franchise-portal/orders">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Orders</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/franchise-portal/customers")}>
                <Link href="/franchise-portal/customers">
                  <Users className="h-4 w-4" />
                  <span>Customers</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Inventory Management */}
            <Collapsible
              open={openMenus.inventory}
              onOpenChange={() => toggleMenu("inventory")}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton isActive={isActive("/franchise-portal/inventory")}>
                    <Boxes className="h-4 w-4" />
                    <span>Inventory</span>
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={pathname === "/franchise-portal/inventory"}>
                        <Link href="/franchise-portal/inventory">Overview</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/franchise-portal/inventory/stock")}>
                        <Link href="/franchise-portal/inventory/stock">Stock Levels</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/franchise-portal/inventory/transfers")}>
                        <Link href="/franchise-portal/inventory/transfers">Transfers</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/franchise-portal/inventory/adjustments")}>
                        <Link href="/franchise-portal/inventory/adjustments">Adjustments</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* Reports */}
            <Collapsible
              open={openMenus.reports}
              onOpenChange={() => toggleMenu("reports")}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton isActive={isActive("/franchise-portal/reports")}>
                    <BarChart3 className="h-4 w-4" />
                    <span>Reports</span>
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={pathname === "/franchise-portal/reports"}>
                        <Link href="/franchise-portal/reports">Overview</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/franchise-portal/reports/sales")}>
                        <Link href="/franchise-portal/reports/sales">Sales</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/franchise-portal/reports/inventory")}>
                        <Link href="/franchise-portal/reports/inventory">Inventory</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/franchise-portal/reports/customers")}>
                        <Link href="/franchise-portal/reports/customers">Customers</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/franchise-portal/settings")}>
                <Link href="/franchise-portal/settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        <Separator className="my-2" />

        {/* Help & Support */}
        <div className="px-2 py-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/franchise-portal/notifications">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                  <Badge className="ml-auto bg-orange-600 hover:bg-orange-700">3</Badge>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/franchise-portal/help">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help & Support</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 py-2">
          <div className="flex items-center gap-3 rounded-md border p-2">
            <Avatar>
              <AvatarImage src={session?.user?.image || "/franchise-avatar.jpg"} alt={session?.user?.name || "Franchise User"} />
              <AvatarFallback>{session?.user?.name?.charAt(0) || "F"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{session?.user?.name || "Franchise User"}</span>
              <span className="text-xs text-gray-500">{session?.user?.email || "franchise@martxmart.com"}</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
