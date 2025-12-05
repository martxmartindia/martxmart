"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertTriangle, Info, Package, Users, DollarSign, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  timestamp: string
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/franchise-portal/notifications")

      if (!response.ok) {
        throw new Error("Failed to fetch notifications")
      }

      const data = await response.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast.error("Failed to load notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-5 w-5 text-blue-600" />
      case "inventory":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "payment":
        return <DollarSign className="h-5 w-5 text-green-600" />
      case "customer":
        return <Users className="h-5 w-5 text-purple-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationBadge = (type: string) => {
    const badges = {
      order: { label: "Order", className: "bg-blue-100 text-blue-800" },
      inventory: { label: "Inventory", className: "bg-yellow-100 text-yellow-800" },
      payment: { label: "Payment", className: "bg-green-100 text-green-800" },
      customer: { label: "Customer", className: "bg-purple-100 text-purple-800" },
      system: { label: "System", className: "bg-gray-100 text-gray-800" },
    }

    const config = badges[type as keyof typeof badges] || badges.system
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch("/api/franchise-portal/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId: id }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark notification as read")
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
      toast.success("Notification marked as read")
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error("Failed to mark notification as read")
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/franchise-portal/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markAllAsRead: true }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read")
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      )
      setUnreadCount(0)
      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast.error("Failed to mark all notifications as read")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading notifications...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with important alerts and messages</p>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-orange-600 hover:bg-orange-700">{unreadCount} unread</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No notifications</h3>
              <p className="text-gray-400 text-center">You're all caught up! Check back later for new updates.</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification.id} className={`transition-colors ${!notification.read ? 'border-orange-200 bg-orange-50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {getNotificationBadge(notification.type)}
                          <span className="text-sm text-gray-500">{formatTimeAgo(notification.timestamp)}</span>
                        </div>
                      </div>
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(notification.id)}
                          className="flex-shrink-0"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Order Notifications</h4>
                <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Inventory Alerts</h4>
                <p className="text-sm text-gray-500">Receive alerts for low stock items</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Payment Updates</h4>
                <p className="text-sm text-gray-500">Notifications for payment confirmations</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}