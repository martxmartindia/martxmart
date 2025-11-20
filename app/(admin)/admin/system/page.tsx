"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

export default function AdminSystemPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "martXmart Machinery store",
    siteDescription: "Your one-stop destination for all your machinery needs.",
    contactEmail: "support@martXmart.com",
    contactPhone: "+91 9876543210",
    address: "Trademins Machinery Madhubani Purnia",
    logo: "/logo1.png",
    favicon: "/favicon.ico",
    enableMaintenance: false,
    maintenanceMessage: "We are currently undergoing scheduled maintenance. Please check back soon.",
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: process.env.SMTP_HOST || "",
    smtpPort: process.env.SMTP_PORT || "",
    smtpUser: process.env.SMTP_USER || "",
    smtpPassword: process.env.SMTP_PASSWORD || "",
    smtpSecure: process.env.SMTP_SECURE === "true",
    senderName: "martXmart Machinery",
    senderEmail: "noreply@example.com",
    enableOrderConfirmation: true,
    enableShippingNotification: true,
    enableDeliveryNotification: true,
    enableAccountCreation: true,
    enablePasswordReset: true,
  })

  const [paymentSettings, setPaymentSettings] = useState({
    currency: "INR",
    currencySymbol: "₹",
    enableRazorpay: true,
    enableCashOnDelivery: true,
    enablePhonePe: true,
    minOrderAmount: "0",
    maxOrderAmount: "100000",
    enableTax: true,
    taxPercentage: "18",
    enableShipping: true,
    freeShippingThreshold: "1000",
    defaultShippingRate: "100",
  })

  const [socialSettings, setSettingsSocial] = useState({
    facebookUrl: "https://facebook.com/yourstore",
    twitterUrl: "https://twitter.com/yourstore",
    instagramUrl: "https://instagram.com/yourstore",
    youtubeUrl: "https://youtube.com/yourstore",
    linkedinUrl: "https://linkedin.com/company/yourstore",
    enableSocialLogin: true,
    enableFacebookLogin: true,
    enableGoogleLogin: true,
  })

  const handleSaveGeneral = async () => {
    setIsSubmitting(true)
    try {
      // In a real implementation, this would save to the database
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("General settings saved successfully")
    } catch (error) {      
      toast.error("Failed to save settings")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveEmail = async () => {
    setIsSubmitting(true)
    try {
      // In a real implementation, this would save to the database
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Email settings saved successfully")
    } catch (error) {      
      toast.error("Failed to save settings")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSavePayment = async () => {
    setIsSubmitting(true)
    try {
      // In a real implementation, this would save to the database
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Payment settings saved successfully")
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveSocial = async () => {
    setIsSubmitting(true)
    try {
      // In a real implementation, this would save to the database
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Social settings saved successfully")
    } catch (error) {      
      toast.error("Failed to save settings")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic store information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={generalSettings.contactPhone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      id="logo"
                      value={generalSettings.logo}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, logo: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="favicon">Favicon URL</Label>
                    <Input
                      id="favicon"
                      value={generalSettings.favicon}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, favicon: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableMaintenance"
                      checked={generalSettings.enableMaintenance}
                      onCheckedChange={(checked) =>
                        setGeneralSettings({ ...generalSettings, enableMaintenance: checked })
                      }
                    />
                    <Label htmlFor="enableMaintenance">Enable Maintenance Mode</Label>
                  </div>

                  {generalSettings.enableMaintenance && (
                    <div className="space-y-2">
                      <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                      <Textarea
                        id="maintenanceMessage"
                        value={generalSettings.maintenanceMessage}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, maintenanceMessage: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveGeneral} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email server and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                      id="smtpUser"
                      value={emailSettings.smtpUser}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senderName">Sender Name</Label>
                    <Input
                      id="senderName"
                      value={emailSettings.senderName}
                      onChange={(e) => setEmailSettings({ ...emailSettings, senderName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senderEmail">Sender Email</Label>
                    <Input
                      id="senderEmail"
                      type="email"
                      value={emailSettings.senderEmail}
                      onChange={(e) => setEmailSettings({ ...emailSettings, senderEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="smtpSecure"
                    checked={emailSettings.smtpSecure}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, smtpSecure: checked })}
                  />
                  <Label htmlFor="smtpSecure">Use Secure Connection (SSL/TLS)</Label>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableOrderConfirmation"
                        checked={emailSettings.enableOrderConfirmation}
                        onCheckedChange={(checked) =>
                          setEmailSettings({ ...emailSettings, enableOrderConfirmation: checked })
                        }
                      />
                      <Label htmlFor="enableOrderConfirmation">Order Confirmation</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableShippingNotification"
                        checked={emailSettings.enableShippingNotification}
                        onCheckedChange={(checked) =>
                          setEmailSettings({ ...emailSettings, enableShippingNotification: checked })
                        }
                      />
                      <Label htmlFor="enableShippingNotification">Shipping Notification</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableDeliveryNotification"
                        checked={emailSettings.enableDeliveryNotification}
                        onCheckedChange={(checked) =>
                          setEmailSettings({ ...emailSettings, enableDeliveryNotification: checked })
                        }
                      />
                      <Label htmlFor="enableDeliveryNotification">Delivery Notification</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableAccountCreation"
                        checked={emailSettings.enableAccountCreation}
                        onCheckedChange={(checked) =>
                          setEmailSettings({ ...emailSettings, enableAccountCreation: checked })
                        }
                      />
                      <Label htmlFor="enableAccountCreation">Account Creation</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enablePasswordReset"
                        checked={emailSettings.enablePasswordReset}
                        onCheckedChange={(checked) =>
                          setEmailSettings({ ...emailSettings, enablePasswordReset: checked })
                        }
                      />
                      <Label htmlFor="enablePasswordReset">Password Reset</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveEmail} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment methods and options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={paymentSettings.currency}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, currency: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currencySymbol">Currency Symbol</Label>
                    <Input
                      id="currencySymbol"
                      value={paymentSettings.currencySymbol}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, currencySymbol: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minOrderAmount">Minimum Order Amount</Label>
                    <Input
                      id="minOrderAmount"
                      type="number"
                      value={paymentSettings.minOrderAmount}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, minOrderAmount: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxOrderAmount">Maximum Order Amount</Label>
                    <Input
                      id="maxOrderAmount"
                      type="number"
                      value={paymentSettings.maxOrderAmount}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, maxOrderAmount: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Methods</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableRazorpay"
                        checked={paymentSettings.enableRazorpay}
                        onCheckedChange={(checked) =>
                          setPaymentSettings({ ...paymentSettings, enableRazorpay: checked })
                        }
                      />
                      <Label htmlFor="enableRazorpay">Razorpay</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableCashOnDelivery"
                        checked={paymentSettings.enableCashOnDelivery}
                        onCheckedChange={(checked) =>
                          setPaymentSettings({ ...paymentSettings, enableCashOnDelivery: checked })
                        }
                      />
                      <Label htmlFor="enableCashOnDelivery">Cash on Delivery</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enablePhonePe"
                        checked={paymentSettings.enablePhonePe}
                        onCheckedChange={(checked) =>
                          setPaymentSettings({ ...paymentSettings, enablePhonePe: checked })
                        }
                      />
                      <Label htmlFor="enablePhonePe">PhonePe</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tax Settings</h3>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableTax"
                      checked={paymentSettings.enableTax}
                      onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableTax: checked })}
                    />
                    <Label htmlFor="enableTax">Enable Tax</Label>
                  </div>

                  {paymentSettings.enableTax && (
                    <div className="space-y-2">
                      <Label htmlFor="taxPercentage">Tax Percentage (%)</Label>
                      <Input
                        id="taxPercentage"
                        type="number"
                        value={paymentSettings.taxPercentage}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, taxPercentage: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Shipping Settings</h3>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableShipping"
                      checked={paymentSettings.enableShipping}
                      onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableShipping: checked })}
                    />
                    <Label htmlFor="enableShipping">Enable Shipping Charges</Label>
                  </div>

                  {paymentSettings.enableShipping && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="freeShippingThreshold">Free Shipping Threshold</Label>
                        <Input
                          id="freeShippingThreshold"
                          type="number"
                          value={paymentSettings.freeShippingThreshold}
                          onChange={(e) =>
                            setPaymentSettings({ ...paymentSettings, freeShippingThreshold: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="defaultShippingRate">Default Shipping Rate</Label>
                        <Input
                          id="defaultShippingRate"
                          type="number"
                          value={paymentSettings.defaultShippingRate}
                          onChange={(e) =>
                            setPaymentSettings({ ...paymentSettings, defaultShippingRate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSavePayment} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Settings</CardTitle>
              <CardDescription>Configure social media links and login options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="facebookUrl">Facebook URL</Label>
                    <Input
                      id="facebookUrl"
                      value={socialSettings.facebookUrl}
                      onChange={(e) => setSettingsSocial({ ...socialSettings, facebookUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitterUrl">Twitter URL</Label>
                    <Input
                      id="twitterUrl"
                      value={socialSettings.twitterUrl}
                      onChange={(e) => setSettingsSocial({ ...socialSettings, twitterUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagramUrl">Instagram URL</Label>
                    <Input
                      id="instagramUrl"
                      value={socialSettings.instagramUrl}
                      onChange={(e) => setSettingsSocial({ ...socialSettings, instagramUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="youtubeUrl">YouTube URL</Label>
                    <Input
                      id="youtubeUrl"
                      value={socialSettings.youtubeUrl}
                      onChange={(e) => setSettingsSocial({ ...socialSettings, youtubeUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <Input
                      id="linkedinUrl"
                      value={socialSettings.linkedinUrl}
                      onChange={(e) => setSettingsSocial({ ...socialSettings, linkedinUrl: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Login</h3>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableSocialLogin"
                      checked={socialSettings.enableSocialLogin}
                      onCheckedChange={(checked) =>
                        setSettingsSocial({ ...socialSettings, enableSocialLogin: checked })
                      }
                    />
                    <Label htmlFor="enableSocialLogin">Enable Social Login</Label>
                  </div>

                  {socialSettings.enableSocialLogin && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enableFacebookLogin"
                          checked={socialSettings.enableFacebookLogin}
                          onCheckedChange={(checked) =>
                            setSettingsSocial({ ...socialSettings, enableFacebookLogin: checked })
                          }
                        />
                        <Label htmlFor="enableFacebookLogin">Facebook Login</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enableGoogleLogin"
                          checked={socialSettings.enableGoogleLogin}
                          onCheckedChange={(checked) =>
                            setSettingsSocial({ ...socialSettings, enableGoogleLogin: checked })
                          }
                        />
                        <Label htmlFor="enableGoogleLogin">Google Login</Label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSocial} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

