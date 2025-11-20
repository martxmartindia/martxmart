"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, CheckCircle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/store/auth"
import { toast } from "sonner"
interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      fetchNotifications()
    }
  }, [authLoading])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/account/notifications")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch notifications")
      }

      setNotifications(data.notifications || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast("Error fetching notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/account/notifications/${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update notification")
      }

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification,
        ),
      )
    } catch (error: any) {      
      toast("Error updating notification")
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/account/notifications/${notificationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete notification")
      }

      // Update local state
      setNotifications(notifications.filter((notification) => notification.id !== notificationId))

      toast("Notification deleted")
    } catch (error: any) {
      toast("Error deleting notification")
    } finally {
      setIsUpdating(false)
    }
  }

  const markAllAsRead = async () => {
    if (notifications.filter((n) => !n.isRead).length === 0) return

    setIsUpdating(true)
    try {
      const response = await fetch("/api/account/notifications/mark-all-read", {
        method: "POST",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update notifications")
      }

      // Update local state
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      )

      toast("All notifications marked as read")
    } catch (error: any) {
      toast("Error updating notifications")
    } finally {
      setIsUpdating(false)
    }
  }

  const getNotificationTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "order":
        return <Bell className="h-5 w-5 text-blue-500" />
      case "account":
        return <Bell className="h-5 w-5 text-purple-500" />
      case "promotion":
        return <Bell className="h-5 w-5 text-orange-500" />
      case "system":
        return <Bell className="h-5 w-5 text-gray-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  if (authLoading) {
    return <NotificationsSkeleton />
  }

  if (!user) {
    return (
      <div className="container max-w-6xl py-10">
        <div className="text-center py-16">
          <Bell className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">No notifications</h1>
          <p className="text-gray-500 mb-6">Please sign in to view your notifications</p>
          <Button
            onClick={() => router.push("/auth/login?redirect=/account/notifications")}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <NotificationsSkeleton />
  }

  return (
    <div className="container max-w-6xl py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.length > 0 && (
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={isUpdating || notifications.every((n) => n.isRead)}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">No notifications</h2>
          <p className="text-gray-500">You don&apso;t have any notifications at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`${!notification.isRead ? "border-l-4 border-l-orange-500" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getNotificationTypeIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{notification.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize text-xs font-normal">
                          {notification.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-2 gap-2">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => markAsRead(notification.id)}
                      disabled={isUpdating}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark as Read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteNotification(notification.id)}
                    disabled={isUpdating}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function NotificationsSkeleton() {
  return (
    <div className="container max-w-6xl py-10">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-5 w-5 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-40" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

