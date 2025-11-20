"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Bell, Check, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

export default function AdminNotificationsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<any[]>([])
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, this would fetch from an API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockNotifications = [
        {
          id: "1",
          title: "New Order Received",
          message: "Order #12345 has been placed for ₹2,500",
          type: "order",
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        },
        {
          id: "2",
          title: "Low Stock Alert",
          message: "Product 'Smartphone X' is running low on stock (3 remaining)",
          type: "inventory",
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
        {
          id: "3",
          title: "New User Registration",
          message: "John Doe has created a new account",
          type: "user",
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        },
        {
          id: "4",
          title: "Payment Received",
          message: "Payment of ₹1,800 received for Order #12340",
          type: "payment",
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        },
        {
          id: "5",
          title: "New Product Review",
          message: "A new 5-star review has been submitted for 'Wireless Earbuds'",
          type: "review",
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        },
      ]

      // Filter notifications
      let filteredNotifications = mockNotifications
      if (filter === "unread") {
        filteredNotifications = mockNotifications.filter((notification) => !notification.isRead)
      } else if (filter !== "all") {
        filteredNotifications = mockNotifications.filter((notification) => notification.type === filter)
      }

      setNotifications(filteredNotifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast.error("Failed to load notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      // In a real implementation, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 500))

      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
      )

      toast.success("Notification marked as read")
    } catch (error) {
      toast.error("Failed to update notification")
    }
  }

  const markAllAsRead = async () => {
    try {
      // In a real implementation, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 500))

      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))

      toast.success("All notifications marked as read")
    } catch (error) {
      toast.error("Failed to update notifications")
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      // In a real implementation, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 500))

      setNotifications((prev) => prev.filter((notification) => notification.id !== id))

      toast.success("Notification deleted")
    } catch (error) {
      toast.error("Failed to delete notification")
    }
  }

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-800"
      case "inventory":
        return "bg-yellow-100 text-yellow-800"
      case "user":
        return "bg-green-100 text-green-800"
      case "payment":
        return "bg-purple-100 text-purple-800"
      case "review":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case "order":
        return "Order"
      case "inventory":
        return "Inventory"
      case "user":
        return "User"
      case "payment":
        return "Payment"
      case "review":
        return "Review"
      default:
        return type
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "Just now"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
    } else {
      return format(date, "MMM d, yyyy")
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="order">Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="payment">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          <Card>
            <CardHeader>
              <CardTitle>
                {filter === "all"
                  ? "All Notifications"
                  : filter === "unread"
                    ? "Unread Notifications"
                    : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Notifications`}
              </CardTitle>
              <CardDescription>
                {filter === "unread" ? "Notifications you haven't read yet" : "Recent system notifications and alerts"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-2" />
                  <span className="text-lg text-gray-700">Loading notifications...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                  <p className="text-gray-500">You&apos;re all caught up!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${notification.isRead ? "bg-white" : "bg-blue-50"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${getNotificationTypeColor(notification.type)}`}>
                            <Bell className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{notification.title}</h3>
                              {!notification.isRead && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-500 mt-1">{notification.message}</p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                              <Badge variant="outline" className={getNotificationTypeColor(notification.type)}>
                                {getNotificationTypeLabel(notification.type)}
                              </Badge>
                              <span>{getTimeAgo(notification.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {!notification.isRead && (
                            <Button variant="ghost" size="icon" onClick={() => markAsRead(notification.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

