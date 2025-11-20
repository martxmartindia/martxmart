"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { User, Building, CreditCard, Bell, Save, Upload } from "lucide-react"

interface VendorProfile {
  id: string
  businessName: string
  businessType: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  website: string
  gstNumber: string
  panNumber: string
  user: {
    name: string
    email: string
    image: string
  }
}

interface BankDetails {
  bankName: string
  accountNumber: string
  ifscCode: string
  accountHolderName: string
}

interface NotificationSettings {
  emailOrders: boolean
  emailPayouts: boolean
  emailMarketing: boolean
  smsOrders: boolean
  smsPayouts: boolean
  pushNotifications: boolean
}

export default function VendorSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null)
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  })
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailOrders: true,
    emailPayouts: true,
    emailMarketing: false,
    smsOrders: false,
    smsPayouts: true,
    pushNotifications: true,
  })

  useEffect(() => {
    fetchVendorProfile()
    fetchBankDetails()
    fetchNotificationSettings()
  }, [])

  const fetchVendorProfile = async () => {
    try {
      const response = await fetch("/api/vendor-portal/profile")
      if (!response.ok) throw new Error("Failed to fetch profile")

      const data = await response.json()
      setVendorProfile(data.vendor)
    } catch (error) {
      console.error("Error fetching vendor profile:", error)
      toast.error("Failed to load vendor profile")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBankDetails = async () => {
    try {
      const response = await fetch("/api/vendor-portal/settings/bank-details")
      if (response.ok) {
        const data = await response.json()
        setBankDetails(data.bankDetails)
      }
    } catch (error) {
      console.error("Error fetching bank details:", error)
    }
  }

  const fetchNotificationSettings = async () => {
    try {
      const response = await fetch("/api/vendor-portal/settings/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotificationSettings(data.settings)
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vendorProfile) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/vendor-portal/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendorProfile),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBankDetailsUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/vendor-portal/settings/bank-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bankDetails),
      })

      if (!response.ok) throw new Error("Failed to update bank details")

      toast.success("Bank details updated successfully")
    } catch (error) {
      console.error("Error updating bank details:", error)
      toast.error("Failed to update bank details")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/vendor-portal/settings/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings: notificationSettings }),
      })

      if (!response.ok) throw new Error("Failed to update notification settings")

      toast.success("Notification settings updated successfully")
    } catch (error) {
      console.error("Error updating notification settings:", error)
      toast.error("Failed to update notification settings")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", "vendor-profiles")

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to upload image")

      const data = await response.json()

      // Update vendor profile with new image
      if (vendorProfile) {
        setVendorProfile({
          ...vendorProfile,
          user: {
            ...vendorProfile.user,
            image: data.url,
          },
        })
      }

      toast.success("Profile image updated successfully")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!vendorProfile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load vendor profile</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your vendor account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center">
            <Building className="mr-2 h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="banking" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Banking
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and profile picture</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={vendorProfile.user.image || "/placeholder.svg"} alt={vendorProfile.user.name} />
                    <AvatarFallback>{vendorProfile.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center sm:items-start gap-2">
                    <h3 className="text-lg font-medium">Profile Picture</h3>
                    <p className="text-sm text-gray-500">Upload a new profile picture. Recommended size: 300x300px.</p>
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
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={vendorProfile.user.name}
                      onChange={(e) =>
                        setVendorProfile({
                          ...vendorProfile,
                          user: { ...vendorProfile.user, name: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={vendorProfile.user.email}
                      onChange={(e) =>
                        setVendorProfile({
                          ...vendorProfile,
                          user: { ...vendorProfile.user, email: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={vendorProfile.phone}
                      onChange={(e) => setVendorProfile({ ...vendorProfile, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={vendorProfile.website}
                      onChange={(e) => setVendorProfile({ ...vendorProfile, website: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
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
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your business details and registration information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={vendorProfile.businessName}
                      onChange={(e) => setVendorProfile({ ...vendorProfile, businessName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Input
                      id="businessType"
                      value={vendorProfile.businessType}
                      onChange={(e) => setVendorProfile({ ...vendorProfile, businessType: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                      id="gstNumber"
                      value={vendorProfile.gstNumber}
                      onChange={(e) => setVendorProfile({ ...vendorProfile, gstNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      value={vendorProfile.panNumber}
                      onChange={(e) => setVendorProfile({ ...vendorProfile, panNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    value={vendorProfile.address}
                    onChange={(e) => setVendorProfile({ ...vendorProfile, address: e.target.value })}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={vendorProfile.city}
                      onChange={(e) => setVendorProfile({ ...vendorProfile, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={vendorProfile.state}
                      onChange={(e) => setVendorProfile({ ...vendorProfile, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={vendorProfile.pincode}
                      onChange={(e) => setVendorProfile({ ...vendorProfile, pincode: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
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
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking Settings */}
        <TabsContent value="banking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bank Account Details</CardTitle>
              <CardDescription>Manage your bank account information for payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBankDetailsUpdate} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                      placeholder="e.g., State Bank of India"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Account Holder Name</Label>
                    <Input
                      id="accountHolderName"
                      value={bankDetails.accountHolderName}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                      placeholder="As per bank records"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                      placeholder="Enter account number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      value={bankDetails.ifscCode}
                      onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                      placeholder="e.g., SBIN0001234"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Important Notes</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Ensure all details match your bank records exactly</li>
                    <li>• Account holder name should match your business registration</li>
                    <li>• Payouts will be processed to this account automatically</li>
                    <li>• Changes may take 24-48 hours to verify</li>
                  </ul>
                </div>

                <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Bank Details
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Email Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-gray-500">Receive notifications about new orders and updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailOrders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailOrders: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payout Notifications</p>
                      <p className="text-sm text-gray-500">Get notified when payouts are processed</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailPayouts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailPayouts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing & Promotions</p>
                      <p className="text-sm text-gray-500">Receive marketing emails and promotional offers</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailMarketing}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailMarketing: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">SMS Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-gray-500">Receive SMS notifications about orders</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsOrders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, smsOrders: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payout Notifications</p>
                      <p className="text-sm text-gray-500">Get SMS alerts for payout updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsPayouts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, smsPayouts: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Push Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Browser Notifications</p>
                      <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleNotificationUpdate}
                className="bg-orange-600 hover:bg-orange-700"
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
                    Save Preferences
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
