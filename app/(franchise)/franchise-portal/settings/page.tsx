"use client"

import { Badge } from "@/components/ui/badge"
import type React from "react"
import { useState, useEffect } from "react"
import { User, Store, CreditCard, Bell, Lock, Users, Save, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface FranchiseData {
  id: string
  name: string
  location: string
  address: string
  gstNumber: string
  panNumber: string
  contactEmail: string
  contactPhone: string
  businessAddress: string
  owner: {
    id: string
    name: string
    email: string
    phone: string
    image: string | null
  }
}

interface NotificationSettings {
  emailOrders: boolean
  emailMarketing: boolean
  emailSystem: boolean
  smsOrders: boolean
  smsMarketing: boolean
  smsSystem: boolean
  pushOrders: boolean
  pushMarketing: boolean
  pushSystem: boolean
}

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [franchiseData, setFranchiseData] = useState<FranchiseData | null>(null)

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
  })

  const [franchiseForm, setFranchiseForm] = useState({
    name: "",
    location: "",
    address: "",
    gstNumber: "",
    panNumber: "",
    businessHours: "",
    contactEmail: "",
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailOrders: true,
    emailMarketing: false,
    emailSystem: true,
    smsOrders: false,
    smsMarketing: false,
    smsSystem: false,
    pushOrders: true,
    pushMarketing: false,
    pushSystem: true,
  })

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  })

  // Fetch franchise profile data
  useEffect(() => {
    const fetchFranchiseProfile = async () => {
      try {
        setIsLoading(true)

        const response = await fetch("/api/franchise-portal/profile")

        if (!response.ok) {
          throw new Error("Failed to fetch franchise profile")
        }

        const data = await response.json()
        setFranchiseData(data.franchise)

        // Set form data
        const nameParts = data.franchise.owner.name.split(" ")
        setProfileForm({
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: data.franchise.owner.email || "",
          phone: data.franchise.owner.phone || "",
          bio: "Franchise owner with experience in retail management.",
        })

        setFranchiseForm({
          name: data.franchise.name || "",
          location: data.franchise.location || "",
          address: data.franchise.businessAddress || "",
          gstNumber: data.franchise.gstNumber || "",
          panNumber: data.franchise.panNumber || "",
          businessHours: "9:00 AM - 9:00 PM",
          contactEmail: data.franchise.contactEmail || "",
        })

        // Fetch notification settings
        const notificationResponse = await fetch("/api/franchise-portal/settings/notifications")
        if (notificationResponse.ok) {
          const notificationData = await notificationResponse.json()
          setNotificationSettings(notificationData.settings)
        }
      } catch (error) {
        console.error("Error fetching franchise profile:", error)
        toast.error("Failed to load franchise profile. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFranchiseProfile()
  }, [])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFranchiseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFranchiseForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSecurityForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleNotificationChange = (name: keyof NotificationSettings, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSaveSettings = async (settingType: string) => {
    setIsSubmitting(true)

    try {
      let response

      if (settingType === "profile") {
        response = await fetch("/api/franchise-portal/settings/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${profileForm.firstName} ${profileForm.lastName}`,
            email: profileForm.email,
            phone: profileForm.phone,
          }),
        })
      } else if (settingType === "franchise") {
        response = await fetch("/api/franchise-portal/settings/franchise", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(franchiseForm),
        })
      } else if (settingType === "notifications") {
        response = await fetch("/api/franchise-portal/settings/notifications", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ settings: notificationSettings }),
        })
      } else if (settingType === "security") {
        if (securityForm.newPassword !== securityForm.confirmPassword) {
          toast.error("New passwords do not match")
          return
        }

        response = await fetch("/api/franchise-portal/settings/security", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: securityForm.currentPassword,
            newPassword: securityForm.newPassword,
            twoFactorEnabled: securityForm.twoFactorEnabled,
          }),
        })
      }

      if (!response?.ok) {
        throw new Error(`Failed to update ${settingType} settings`)
      }

      toast.success(`${settingType.charAt(0).toUpperCase() + settingType.slice(1)} settings updated successfully`)

      // Reset security form after successful password change
      if (settingType === "security") {
        setSecurityForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          twoFactorEnabled: securityForm.twoFactorEnabled,
        })
      }
    } catch (error) {
      console.error(`Error saving ${settingType} settings:`, error)
      toast.error(`Failed to save ${settingType} settings. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUploadProfilePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/franchise-portal/settings/upload-avatar", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload profile picture")
      }

      const data = await response.json()
      toast.success("Profile picture updated successfully")

      // Update the franchise data with new image URL
      if (franchiseData) {
        setFranchiseData({
          ...franchiseData,
          owner: {
            ...franchiseData.owner,
            image: data.imageUrl,
          },
        })
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      toast.error("Failed to upload profile picture. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
        <p className="text-gray-500">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-gray-500">Manage your franchise settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 w-full">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="franchise" className="flex items-center">
            <Store className="mr-2 h-4 w-4" />
            Franchise
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Team
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={franchiseData?.owner.image || "/placeholder.svg?height=96&width=96"}
                      alt={`${profileForm.firstName} ${profileForm.lastName}`}
                    />
                    <AvatarFallback>
                      {profileForm.firstName.charAt(0)}
                      {profileForm.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center sm:items-start gap-2">
                    <h3 className="text-lg font-medium">Profile Picture</h3>
                    <p className="text-sm text-gray-500">Upload a new profile picture. Recommended size: 300x300px.</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <label htmlFor="profile-upload" className="cursor-pointer">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </label>
                      </Button>
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadProfilePicture}
                      />
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" value={profileForm.lastName} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={profileForm.phone} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself"
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      className="min-h-32"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => handleSaveSettings("profile")}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Franchise Settings */}
        <TabsContent value="franchise" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Franchise Information</CardTitle>
              <CardDescription>Update your franchise details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="franchiseName">Franchise Name</Label>
                  <Input id="franchiseName" name="name" value={franchiseForm.name} onChange={handleFranchiseChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="franchiseId">Franchise ID</Label>
                  <Input id="franchiseId" value={franchiseData?.id || ""} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={franchiseForm.location}
                    onChange={handleFranchiseChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessHours">Business Hours</Label>
                  <Input
                    id="businessHours"
                    name="businessHours"
                    value={franchiseForm.businessHours}
                    onChange={handleFranchiseChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={franchiseForm.address}
                    onChange={handleFranchiseChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gst">GST Number</Label>
                  <Input id="gst" name="gstNumber" value={franchiseForm.gstNumber} onChange={handleFranchiseChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input id="pan" name="panNumber" value={franchiseForm.panNumber} onChange={handleFranchiseChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={franchiseForm.contactEmail}
                    onChange={handleFranchiseChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => handleSaveSettings("franchise")}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your billing details and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Methods</h3>
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">HDFC Bank Credit Card</p>
                      <p className="text-sm text-gray-500">Ending with 1234 • Expires 12/25</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                      Remove
                    </Button>
                  </div>
                </div>
                <Button variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Billing Address</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="billingName">Name</Label>
                    <Input id="billingName" defaultValue={`${profileForm.firstName} ${profileForm.lastName}`} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingCompany">Company Name</Label>
                    <Input id="billingCompany" defaultValue={franchiseForm.name + " Pvt. Ltd."} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="billingAddress">Address</Label>
                    <Textarea id="billingAddress" defaultValue={franchiseForm.address} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => handleSaveSettings("billing")}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-gray-500">Receive notifications about order status changes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailOrders}
                      onCheckedChange={(checked) => handleNotificationChange("emailOrders", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing & Promotions</p>
                      <p className="text-sm text-gray-500">Receive marketing emails and promotional offers</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailMarketing}
                      onCheckedChange={(checked) => handleNotificationChange("emailMarketing", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Updates</p>
                      <p className="text-sm text-gray-500">Receive notifications about system changes and updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailSystem}
                      onCheckedChange={(checked) => handleNotificationChange("emailSystem", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">SMS Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-gray-500">Receive SMS notifications about order status changes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsOrders}
                      onCheckedChange={(checked) => handleNotificationChange("smsOrders", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing & Promotions</p>
                      <p className="text-sm text-gray-500">Receive marketing SMS and promotional offers</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsMarketing}
                      onCheckedChange={(checked) => handleNotificationChange("smsMarketing", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Updates</p>
                      <p className="text-sm text-gray-500">Receive SMS notifications about system changes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsSystem}
                      onCheckedChange={(checked) => handleNotificationChange("smsSystem", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-gray-500">Receive push notifications about order status changes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushOrders}
                      onCheckedChange={(checked) => handleNotificationChange("pushOrders", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing & Promotions</p>
                      <p className="text-sm text-gray-500">Receive marketing push notifications and offers</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushMarketing}
                      onCheckedChange={(checked) => handleNotificationChange("pushMarketing", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Updates</p>
                      <p className="text-sm text-gray-500">Receive push notifications about system changes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushSystem}
                      onCheckedChange={(checked) => handleNotificationChange("pushSystem", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => handleSaveSettings("notifications")}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={securityForm.newPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={securityForm.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecurityForm((prev) => ({ ...prev, twoFactorEnabled: checked }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Session Management</h3>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-500">Mumbai, India • Chrome on Windows</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active Now</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Sign Out of All Other Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => handleSaveSettings("security")}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Team Settings */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Manage your team members and their permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Team Members</h3>
                  <Button variant="outline" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Invite Member
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            src={franchiseData?.owner.image || "/placeholder.svg?height=40&width=40"}
                            alt={franchiseData?.owner.name}
                          />
                          <AvatarFallback>
                            {franchiseData?.owner.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{franchiseData?.owner.name}</p>
                          <p className="text-sm text-gray-500">{franchiseData?.owner.email}</p>
                        </div>
                      </div>
                      <Badge>Owner</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Roles & Permissions</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Owner</h4>
                    <p className="text-sm text-gray-500 mb-4">Full access to all settings and features</p>
                    <Badge className="bg-green-100 text-green-800">1 Member</Badge>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Manager</h4>
                    <p className="text-sm text-gray-500 mb-4">Can manage orders, products, and customers</p>
                    <Badge className="bg-green-100 text-green-800">0 Members</Badge>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Staff</h4>
                    <p className="text-sm text-gray-500 mb-4">Limited access to orders and customers</p>
                    <Badge className="bg-green-100 text-green-800">0 Members</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => handleSaveSettings("team")}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
