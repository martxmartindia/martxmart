"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { CheckCircle2, Edit, Filter, Key, MoreHorizontal, Search, Shield, UserPlus, XCircle } from "lucide-react"

interface StaffMember {
  id: string
  user: {
    id: string
    name: string
    email: string
    phone: string | null
    image: string | null
  }
  role: "MANAGER" | "CASHIER" | "SALES_ASSOCIATE" | "INVENTORY_MANAGER" | "ADMIN"
  status: "ACTIVE" | "INACTIVE"
  joinedAt: string
}

export function StaffManagement() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [openNewStaff, setOpenNewStaff] = useState(false)
  const [staffFormData, setStaffFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "CASHIER",
  })

  // Fetch staff on component mount
  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/franchise-portal/staff")
      if (!response.ok) {
        throw new Error("Failed to fetch staff")
      }
      const data = await response.json()
      setStaff(data.staff)
    } catch (error) {
      console.error("Error fetching staff:", error)
      toast.error("Failed to load staff members. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/franchise-portal/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(staffFormData),
      })

      if (!response.ok) {
        throw new Error("Failed to add staff member")
      }

      const data = await response.json()

      // Add the new staff member to the list
      setStaff([data.staff, ...staff])

      // Reset form and close dialog
      setStaffFormData({
        name: "",
        email: "",
        phone: "",
        role: "CASHIER",
      })
      setOpenNewStaff(false)

      toast.success("The staff member has been added successfully.")
    } catch (error) {
      console.error("Error adding staff member:", error)
      toast.error("Failed to add staff member. Please try again.")
    }
  }

  const handleStatusChange = async (staffId: string, newStatus: "ACTIVE" | "INACTIVE") => {
    try {
      const response = await fetch(`/api/franchise-portal/staff/${staffId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update staff status")
      }

      const data = await response.json()

      // Update the staff member in the list
      setStaff(staff.map((s) => (s.id === staffId ? data.staff : s)))

      toast.success(`Staff member status has been updated to ${newStatus.toLowerCase()}.`)
    } catch (error) {
      console.error("Error updating staff status:", error)
      toast.error("Failed to update staff status. Please try again.")
    }
  }

  const handleRoleChange = async (staffId: string, newRole: StaffMember["role"]) => {
    try {
      const response = await fetch(`/api/franchise-portal/staff/${staffId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: newRole,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update staff role")
      }

      const data = await response.json()

      // Update the staff member in the list
      setStaff(staff.map((s) => (s.id === staffId ? data.staff : s)))

      toast.success(`Staff member role has been updated to ${newRole.toLowerCase().replace("_", " ")}.`)
    } catch (error) {
      console.error("Error updating staff role:", error)
      toast.error("Failed to update staff role. Please try again.")
    }
  }

  const handleResetPassword = async (staffId: string) => {
    try {
      const response = await fetch(`/api/franchise-portal/staff/${staffId}/reset-password`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to reset password")
      }

      toast.success("A password reset link has been sent to the staff member's email.")
    } catch (error) {
      console.error("Error resetting password:", error)
      toast.error("Failed to reset password. Please try again.")
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-purple-500">
            <Shield className="mr-1 h-3 w-3" /> Admin
          </Badge>
        )
      case "MANAGER":
        return (
          <Badge className="bg-blue-500">
            <Shield className="mr-1 h-3 w-3" /> Manager
          </Badge>
        )
      case "CASHIER":
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Cashier
          </Badge>
        )
      case "SALES_ASSOCIATE":
        return (
          <Badge className="bg-orange-500">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Sales Associate
          </Badge>
        )
      case "INVENTORY_MANAGER":
        return (
          <Badge className="bg-cyan-500">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Inventory Manager
          </Badge>
        )
      default:
        return <Badge>{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Active
          </Badge>
        )
      case "INACTIVE":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="mr-1 h-3 w-3" /> Inactive
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredStaff = staff.filter(
    (member) =>
      member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Staff Management</CardTitle>
          <CardDescription>Manage your franchise staff members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Dialog open={openNewStaff} onOpenChange={setOpenNewStaff}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Staff
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                    <DialogDescription>Add a new staff member to your franchise.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddStaff}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          className="col-span-3"
                          value={staffFormData.name}
                          onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className="col-span-3"
                          value={staffFormData.email}
                          onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          className="col-span-3"
                          value={staffFormData.phone}
                          onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                          Role
                        </Label>
                        <Select
                          value={staffFormData.role}
                          onValueChange={(value) => setStaffFormData({ ...staffFormData, role: value as any })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MANAGER">Manager</SelectItem>
                            <SelectItem value="CASHIER">Cashier</SelectItem>
                            <SelectItem value="SALES_ASSOCIATE">Sales Associate</SelectItem>
                            <SelectItem value="INVENTORY_MANAGER">Inventory Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Staff Member</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No staff members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStaff.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={member.user.image || "/placeholder.svg"} alt={member.user.name} />
                              <AvatarFallback>{member.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.user.name}</div>
                              <div className="text-sm text-muted-foreground">{member.user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(member.role)}</TableCell>
                        <TableCell>{getStatusBadge(member.status)}</TableCell>
                        <TableCell>{new Date(member.joinedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPassword(member.id)}>
                                <Key className="mr-2 h-4 w-4" /> Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(member.id, "MANAGER")}
                                disabled={member.role === "MANAGER"}
                              >
                                <Shield className="mr-2 h-4 w-4 text-blue-500" /> Manager
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(member.id, "CASHIER")}
                                disabled={member.role === "CASHIER"}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Cashier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(member.id, "SALES_ASSOCIATE")}
                                disabled={member.role === "SALES_ASSOCIATE"}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4 text-orange-500" /> Sales Associate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(member.id, "INVENTORY_MANAGER")}
                                disabled={member.role === "INVENTORY_MANAGER"}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4 text-cyan-500" /> Inventory Manager
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {member.status === "ACTIVE" ? (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(member.id, "INACTIVE")}
                                  className="text-red-600"
                                >
                                  <XCircle className="mr-2 h-4 w-4" /> Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(member.id, "ACTIVE")}
                                  className="text-green-600"
                                >
                                  <CheckCircle2 className="mr-2 h-4 w-4" /> Activate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
