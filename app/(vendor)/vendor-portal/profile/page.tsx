"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar, 
  Edit, 
  Save, 
  X,
  Camera,
  Shield,
  Star
} from "lucide-react"
import { toast } from "sonner"

interface VendorProfile {
  id: string
  name: string
  email: string
  phone: string
  businessName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  profileImage?: string
  joinedDate: string
  isVerified: boolean
  rating: number
  totalReviews: number
  businessLicense?: string
  taxId?: string
}

export default function VendorProfilePage() {
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<VendorProfile>>({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/vendor-portal/profile")
      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }
      const data = await response.json()
      setProfile(data)
      setFormData(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof VendorProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/vendor-portal/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(profile || {})
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load profile data</p>
        <Button onClick={fetchProfile} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vendor Profile</h1>
          <p className="text-muted-foreground">Manage your business information and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="w-24 h-24 mx-auto ring-4 ring-orange-100">
                  <AvatarImage src={profile.profileImage} alt={profile.name} />
                  <AvatarFallback className="bg-orange-100 text-orange-600 text-2xl">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="text-muted-foreground">{profile.businessName}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {profile.isVerified ? (
                    <Badge className="bg-green-500">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Unverified</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{profile.rating}</span>
                  <span className="text-muted-foreground">({profile.totalReviews} reviews)</span>
                </div>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {profile.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {profile.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {profile.phone}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  {isEditing ? (
                    <Input
                      id="businessName"
                      value={formData.businessName || ""}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      placeholder="Enter your business name"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      {profile.businessName}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Business Address */}
              <div className="space-y-4">
                <h4 className="font-medium">Business Address</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={formData.address || ""}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Enter street address"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {profile.address}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        value={formData.city || ""}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Enter city"
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md">
                        {profile.city}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    {isEditing ? (
                      <Input
                        id="state"
                        value={formData.state || ""}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="Enter state"
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md">
                        {profile.state}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    {isEditing ? (
                      <Input
                        id="zipCode"
                        value={formData.zipCode || ""}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        placeholder="Enter ZIP code"
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md">
                        {profile.zipCode}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Business Documents */}
              <div className="space-y-4">
                <h4 className="font-medium">Business Documents</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessLicense">Business License</Label>
                    <div className="p-2 bg-muted rounded-md">
                      {profile.businessLicense || "Not provided"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID / GSTIN</Label>
                    <div className="p-2 bg-muted rounded-md">
                      {profile.taxId || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}