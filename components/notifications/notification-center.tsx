"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Bell, Check, CheckCheck, Clock, DollarSign, FileText, Package, RefreshCw, Trash2, Users } from "lucide-react"

type Notification = {
  id: string
  title: string
  message: string
  type: "ORDER" | "PAYMENT" | "SYSTEM" | "PROMOTION" | "STAFF" | "INVENTORY"
  isRead: boolean
  createdAt: string
  readAt?: string
  sender?: {
    name: string
    image?: string
  }
  data?: any
}

interface NotificationCenterProps {
  userId?: string
  franchiseId?: string
}

export function NotificationCenter({ userId, franchiseId }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchNotifications()
  }, [userId, franchiseId])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (userId) params.append("userId", userId)
      if (franchiseId) params.append("franchiseId", franchiseId)

      const response = await fetch(`/api/notifications?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch notifications")
      }

      const data = await response.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast.error("Failed to load notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark notification as read")
      }

      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification,
        ),
      )
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error("Failed to mark notification as read")
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.isRead)

      await Promise.all(
        unreadNotifications.map((notification) =>
          fetch(`/api/notifications/${notification.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ isRead: true }),
          }),
        ),
      )

      setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })))
      setUnreadCount(0)
      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast.error("Failed to mark all notifications as read")
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete notification")
      }

      setNotifications(notifications.filter((notification) => notification.id !== notificationId))
      toast.success("Notification deleted")
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("Failed to delete notification")
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return <Package className="h-4 w-4 text-blue-500" />
      case "PAYMENT":
        return <DollarSign className="h-4 w-4 text-green-500" />
      case "SYSTEM":
        return <Bell className="h-4 w-4 text-gray-500" />
      case "PROMOTION":
        return <FileText className="h-4 w-4 text-purple-500" />
      case "STAFF":
        return <Users className="h-4 w-4 text-orange-500" />
      case "INVENTORY":
        return <Package className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationTypeBadge = (type: string) => {
    const colors = {
      ORDER: "bg-blue-100 text-blue-800 border-blue-300",
      PAYMENT: "bg-green-100 text-green-800 border-green-300",
      SYSTEM: "bg-gray-100 text-gray-800 border-gray-300",
      PROMOTION: "bg-purple-100 text-purple-800 border-purple-300",
      STAFF: "bg-orange-100 text-orange-800 border-orange-300",
      INVENTORY: "bg-red-100 text-red-800 border-red-300",
    }

    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors] || colors.SYSTEM}>
        {type}
      </Badge>
    )
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.isRead
    return notification.type.toLowerCase() === activeTab
  })

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchNotifications}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>
        <CardDescription>Stay updated with your franchise activities</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="order">Orders</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            {renderNotificationsList(filteredNotifications)}
          </TabsContent>
          <TabsContent value="unread" className="mt-4">
            {renderNotificationsList(filteredNotifications)}
          </TabsContent>
          <TabsContent value="order" className="mt-4">
            {renderNotificationsList(filteredNotifications)}
          </TabsContent>
          <TabsContent value="payment" className="mt-4">
            {renderNotificationsList(filteredNotifications)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  function renderNotificationsList(notifications: Notification[]) {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (notifications.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No notifications found</p>
        </div>
      )
    }

    return (
      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-colors ${
                notification.isRead ? "bg-background" : "bg-muted/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      {getNotificationTypeBadge(notification.type)}
                      {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTime(notification.createdAt)}
                      {notification.sender && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={notification.sender.image || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {notification.sender.name.substring(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{notification.sender.name}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    )
  }
}
