"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2, User, Package, Heart, Settings, CreditCard, MapPin } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/store/auth"
import { toast } from "sonner"

interface Address {
  id: string
  type: string
  contactName: string
  phone: string
  email: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zip: string
  placeOfSupply?: string
  userId: string
}

export default function AccountPage() {
  const {user} = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (!user) {
      router.push("/auth/login?callbackUrl=/account")
      return
    }

    const fetchData = async () => {
      try {
        const [ordersRes, addressesRes] = await Promise.all([
          fetch("/api/orders?limit=5", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch("/api/account/address", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
        ])

        const [ordersData, addressesData] = await Promise.all([
          ordersRes.json(),
          addressesRes.json()
        ])

        if (!ordersRes.ok) throw new Error(ordersData.error || "Failed to fetch orders")
        if (!addressesRes.ok) throw new Error(addressesData.error || "Failed to fetch addresses")

        setOrders(ordersData.orders || [])
        setAddresses(addressesData.addresses || [])
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load account data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router, user])

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch("/api/account/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success("Password updated successfully")
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error:any) {
      console.error("Error changing password:", error)
      toast.error(error.message || "Failed to update password")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddressDelete = async (addressId: string) => {
    try {
      const response = await fetch(`/api/account/address/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      setAddresses(addresses.filter(addr => addr.id !== addressId))
      toast.success("Address deleted successfully")
    } catch (error) {
      console.error("Error deleting address:", error)
      toast.error("Failed to delete address")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-2" />
        <span className="text-lg text-gray-700">Loading account...</span>
      </div>
    )
  }

  return (
    <div>
      {/* Main Content */}
      <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <CardDescription>View and manage your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="profile">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="recent-orders">Recent Orders</TabsTrigger>
                    <TabsTrigger value="addresses">Addresses</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Personal Information</h3>
                        <p className="text-sm text-gray-500">Update your personal details</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" value={user?.name || ""} disabled />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" value={user?.email || ""} disabled />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" value={user?.phone || ""} disabled />
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium">Password</h3>
                        <p className="text-sm text-gray-500">Update your password</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input 
                            id="current-password" 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-password">New Password</Label>
                          <Input 
                            id="new-password" 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input 
                            id="confirm-password" 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button 
                          className="bg-orange-600 hover:bg-orange-700" 
                          onClick={handlePasswordChange}
                          disabled={isUpdating || !currentPassword || !newPassword || !confirmPassword}
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            'Update Password'
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="recent-orders" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Recent Orders</h3>
                        <p className="text-sm text-gray-500">View your recent order history</p>
                      </div>

                      {orders && orders.length > 0 ? (
                        <div className="space-y-4">
                          {orders.map((order: any) => (
                            <div key={order.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">₹{Number(order.totalAmount).toLocaleString()}</p>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      order.status === "DELIVERED"
                                        ? "bg-green-100 text-green-800"
                                        : order.status === "CANCELLED"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-4">
                                <p className="text-sm text-gray-600">
                                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
                                </p>
                              </div>

                              <div className="mt-4 flex justify-end">
                                <Link href={`/account/orders/${order.id}`}>
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border rounded-lg">
                          <p className="text-gray-500">You haven&apos;t any orders yet.</p>
                          <Button
                            className="mt-4 bg-orange-600 hover:bg-orange-700"
                            onClick={() => router.push("/products")}
                          >
                            Start Shopping
                          </Button>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Link href="/account/orders">
                          <Button variant="outline">View All Orders</Button>
                        </Link>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="addresses" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Saved Addresses</h3>
                        <p className="text-sm text-gray-500">Manage your shipping and billing addresses</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                          <div key={address.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{address.type} Address</p>
                                <p className="text-sm text-gray-500">{address.contactName}</p>
                              </div>
                              <div className="flex gap-2">
                                <Link href={`/account/addresses/edit/${address.id}`}>
                                  <Button variant="ghost" size="sm">
                                    Edit
                                  </Button>
                                </Link>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600"
                                  onClick={() => handleAddressDelete(address.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>

                            <div className="mt-4 text-sm">
                              <p>{address.addressLine1}</p>
                              {address.addressLine2 && <p>{address.addressLine2}</p>}
                              <p>{address.city}, {address.state} {address.zip}</p>
                              <p className="mt-2">Phone: {address.phone}</p>
                            </div>
                          </div>
                        ))}

                        <Link href="/account/addresses/new">
                          <div className="border border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-orange-600 transition-colors">
                            <Button variant="outline">+ Add New Address</Button>
                          </div>
                        </Link>
                      </div>

                      <div className="flex justify-end">
                        <Link href="/account/addresses">
                          <Button variant="outline">Manage Addresses</Button>
                        </Link>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
  )
}

