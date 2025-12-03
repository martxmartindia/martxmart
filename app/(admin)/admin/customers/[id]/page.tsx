"use client"

import { useState, useEffect } from "react"
import { useRouter,useParams } from "next/navigation"
import { format } from "date-fns"
import {
  Loader2,
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  CreditCard,
  MapPin,
  FileText,
  Lock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface UserData {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  status: string
  createdAt: string
  updatedAt: string
  lastLogin: string | null
  addresses: any[]
  orders: any[]
  wishlist: any[]
  cart: any[]
  reviews: any[]
}

export default function UserDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchUserDetails()
  }, [router,id])

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/users/${id}`)
      const data = await response.json()

      if (response.ok) {
        setUserData(data.user)
      } else {
        toast.error(data.error || "Failed to fetch user details")
        router.push("/admin/customers")
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      toast.error("Failed to fetch user details")
      router.push("/admin/customers")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!userData) return
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("User deleted successfully")
        router.push("/admin/customers")
      } else {
        toast.error(data.error || "Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user")
    } finally {
      setIsDeleting(false)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Admin</Badge>
      case "CUSTOMER":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Customer</Badge>
      case "VENDOR":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Vendor</Badge>
      case "AUTHOR":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Author</Badge>
      case "FRANCHISE":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Franchise</Badge>
      default:
        return <Badge>{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case "INACTIVE":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Inactive
          </Badge>
        )
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "SUSPENDED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Suspended
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
        <span className="text-lg">Loading user details...</span>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">User Not Found</h1>
        </div>
        <p>The requested user could not be found.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{userData.name}</h1>
            <div className="flex items-center mt-1">
              <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{userData.email}</span>
              <span className="mx-2">•</span>
              {getRoleBadge(userData.role)}
              <span className="mx-2">•</span>
              {getStatusBadge(userData.status)}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDeleteUser}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </Button>
          <Button onClick={() => router.push(`/admin/customers/${userData.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Basic details about the user</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{userData.name}</h3>
                    <p className="text-sm text-muted-foreground">{userData.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-4">
                  <div className="flex items-center p-3 border rounded-md">
                    <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{userData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 border rounded-md">
                    <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{userData.phone || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 border rounded-md">
                    <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p>{format(new Date(userData.createdAt), "dd MMM yyyy")}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 border rounded-md">
                    <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Login</p>
                      <p>
                        {userData.lastLogin
                          ? format(new Date(userData.lastLogin), "dd MMM yyyy, HH:mm")
                          : "Never logged in"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>Overview of user activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 border rounded-md">
                    <ShoppingBag className="h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-2xl font-bold">{userData.orders?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>

                  <div className="flex flex-col items-center p-4 border rounded-md">
                    <CreditCard className="h-8 w-8 text-green-500 mb-2" />
                    <p className="text-2xl font-bold">
                      ₹
                      {userData.orders?.reduce((sum, order) => sum + Number(order.totalAmount), 0).toLocaleString() ||
                        0}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>

                  <div className="flex flex-col items-center p-4 border rounded-md">
                    <FileText className="h-8 w-8 text-purple-500 mb-2" />
                    <p className="text-2xl font-bold">{userData.reviews?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </div>

                  <div className="flex flex-col items-center p-4 border rounded-md">
                    <MapPin className="h-8 w-8 text-orange-500 mb-2" />
                    <p className="text-2xl font-bold">{userData.addresses?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Addresses</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                  {userData.orders && userData.orders.length > 0 ? (
                    <div className="space-y-3">
                      {userData.orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(order.createdAt), "dd MMM yyyy")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{Number(order.totalAmount).toLocaleString()}</p>
                            <Badge variant="outline">{order.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>All orders placed by this user</CardDescription>
            </CardHeader>
            <CardContent>
              {userData.orders && userData.orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Items</th>
                        <th className="text-left py-3 px-4 font-medium">Total</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">#{order.id.substring(0, 8)}</td>
                          <td className="py-3 px-4">{format(new Date(order.createdAt), "dd MMM yyyy")}</td>
                          <td className="py-3 px-4">{order.items?.length || 0} items</td>
                          <td className="py-3 px-4">₹{Number(order.totalAmount).toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{order.status}</Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Orders</h3>
                  <p className="text-muted-foreground">This user hasn&apos;t placed any orders yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle>Addresses</CardTitle>
              <CardDescription>Shipping and billing addresses</CardDescription>
            </CardHeader>
            <CardContent>
              {userData.addresses && userData.addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.addresses.map((address) => (
                    <div key={address.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{address.name}</p>
                          <Badge variant="outline" className="mt-1">
                            {address.type}
                          </Badge>
                          {address.isDefault && (
                            <Badge className="ml-2 mt-1 bg-blue-100 text-blue-800 border-blue-200">Default</Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm space-y-1 mt-3">
                        <p>{address.street}</p>
                        <p>
                          {address.city}, {address.state} {address.pincode}
                        </p>
                        <p>{address.country}</p>
                        <p className="mt-2">Phone: {address.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Addresses</h3>
                  <p className="text-muted-foreground">This user hasn't added any addresses yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent user activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-gray-200 pl-4 ml-4 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="font-medium">Logged in</p>
                      <p className="text-sm text-muted-foreground">
                        {userData.lastLogin
                          ? format(new Date(userData.lastLogin), "dd MMM yyyy, HH:mm")
                          : "Never logged in"}
                      </p>
                    </div>
                  </div>

                  {userData.orders && userData.orders.length > 0 && (
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium">Placed an order</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(userData.orders[0].createdAt), "dd MMM yyyy, HH:mm")}
                        </p>
                        <p className="text-sm">
                          Order #{userData.orders[0].id.substring(0, 8)} for ₹
                          {Number(userData.orders[0].totalAmount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {userData.reviews && userData.reviews.length > 0 && (
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full bg-purple-500"></div>
                      <div>
                        <p className="font-medium">Wrote a review</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(userData.reviews[0].createdAt), "dd MMM yyyy, HH:mm")}
                        </p>
                        <p className="text-sm">
                          {userData.reviews[0].rating} stars for {userData.reviews[0].product.name}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full bg-gray-500"></div>
                    <div>
                      <p className="font-medium">Account created</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(userData.createdAt), "dd MMM yyyy, HH:mm")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage user security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 border rounded-md">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Reset Password</p>
                      <p className="text-sm text-muted-foreground">Send a password reset link to the user</p>
                    </div>
                  </div>
                  <Button variant="outline">Send Reset Link</Button>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-md">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Account Status</p>
                      <p className="text-sm text-muted-foreground">
                        {userData.status === "ACTIVE"
                          ? "User account is currently active"
                          : "User account is currently inactive"}
                      </p>
                    </div>
                  </div>
                  <Button variant={userData.status === "ACTIVE" ? "destructive" : "default"}>
                    {userData.status === "ACTIVE" ? "Suspend Account" : "Activate Account"}
                  </Button>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-md">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Login History</p>
                      <p className="text-sm text-muted-foreground">View user login history and sessions</p>
                    </div>
                  </div>
                  <Button variant="outline">View History</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

