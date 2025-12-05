"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  FileIcon,
  ImageIcon,
  Paperclip,
  RefreshCw,
  Search,
  Send,
  Store,
  User,
  Users,
} from "lucide-react"
import { MessageSquare } from "lucide-react"

type Contact = {
  id: string
  name: string
  email: string
  role: string
  image?: string | null
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  isOnline?: boolean
}

type Message = {
  id: string
  content: string
  senderId: string
  receiverId: string
  isRead: boolean
  createdAt: string
  attachments?: any
  sender: {
    id: string
    name: string
    image: string | null
  }
}

export function MessagingSystem() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts()
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchContacts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/franchise-portal/messages")
      if (!response.ok) {
        throw new Error("Failed to fetch contacts")
      }
      const data = await response.json()
      setContacts(data.contacts)
    } catch (error) {
      console.error("Error fetching contacts:", error)
      toast.error("Failed to load contacts. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async (contactId: string) => {
    setIsLoadingMessages(true)
    try {
      const response = await fetch(`/api/franchise-portal/messages?contactId=${contactId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }
      const data = await response.json()
      setMessages(data.messages)
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast.error("Failed to load messages. Please try again.")
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact)
    fetchMessages(contact.id)
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedContact) return

    try {
      const response = await fetch("/api/franchise-portal/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: messageText,
          receiverId: selectedContact.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()

      // Add the new message to the list
      setMessages([...messages, data.message])

      // Clear the input
      setMessageText("")

      toast.success("Your message has been sent successfully.")
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message. Please try again.")
    }
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const getContactTypeIcon = (role: string) => {
    switch (role.toUpperCase()) {
      case "ADMIN":
        return <Users className="h-4 w-4 text-blue-500" />
      case "VENDOR":
        return <Store className="h-4 w-4 text-purple-500" />
      case "STAFF":
      case "FRANCHISE_OWNER":
        return <User className="h-4 w-4 text-green-500" />
      case "USER":
        return <User className="h-4 w-4 text-orange-500" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <Card className="h-[calc(100vh-12rem)]">
        <CardHeader>
          <CardTitle>Messaging</CardTitle>
          <CardDescription>Communicate with admins, vendors, staff, and customers</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex h-[calc(100vh-16rem)]">
            {/* Contacts Sidebar */}
            <div className="w-1/3 border-r">
              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Contacts</h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={fetchContacts}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-22rem)]">
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : filteredContacts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No contacts found</div>
                ) : (
                  <div className="space-y-1">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors ${
                          selectedContact?.id === contact.id ? "bg-muted" : ""
                        }`}
                        onClick={() => handleContactSelect(contact)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={contact.image || "/placeholder.svg"} alt={contact.name} />
                            <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          {contact.isOnline && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <div className="font-medium truncate">{contact.name}</div>
                            {contact.lastMessageTime && (
                              <div className="text-xs text-muted-foreground">
                                {formatLastMessageTime(contact.lastMessageTime)}
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                              {getContactTypeIcon(contact.role)}
                              <span className="text-xs capitalize">{contact.role.toLowerCase().replace("_", " ")}</span>
                            </div>
                            {contact.unreadCount && contact.unreadCount > 0 ? (
                              <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                                {contact.unreadCount}
                              </Badge>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 md:hidden"
                        onClick={() => setSelectedContact(null)}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Avatar>
                        <AvatarImage src={selectedContact.image || "/placeholder.svg"} alt={selectedContact.name} />
                        <AvatarFallback>{selectedContact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedContact.name}</div>
                        <div className="flex items-center gap-1 text-xs">
                          {getContactTypeIcon(selectedContact.role)}
                          <span className="capitalize">{selectedContact.role.toLowerCase().replace("_", " ")}</span>
                          {selectedContact.isOnline && <span className="text-green-500 ml-1">• Online</span>}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    {isLoadingMessages ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No messages yet</div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isCurrentUser = message.sender.id !== selectedContact.id
                          return (
                            <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  isCurrentUser
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                <div className="text-sm">{message.content}</div>
                                {/* {message.attachments && message.attachments.length > 0 && (
                                  <div className="mt-2 space-y-2">
                                    {message.attachments.map((attachment, index) => (
                                      <div
                                        key={index}
                                        className={`flex items-center gap-2 p-2 rounded ${
                                          isCurrentUser ? "bg-primary-dark" : "bg-background"
                                        }`}
                                      >
                                        {attachment.type === "pdf" ? (
                                          <FileIcon className="h-4 w-4" />
                                        ) : (
                                          <ImageIcon className="h-4 w-4" />
                                        )}
                                        <span className="text-xs truncate">{attachment.name}</span>
                                        <ChevronRight className="h-4 w-4 ml-auto" />
                                      </div>
                                    ))}  */}
                                  {/* </div>
                                )} */}
                                <div
                                  className={`text-xs mt-1 ${
                                    isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground/70"
                                  }`}
                                >
                                  {formatMessageTime(message.createdAt)}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex items-end gap-2">
                      <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Textarea
                        placeholder="Type a message..."
                        className="min-h-10 resize-none"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        className="h-10 w-10 shrink-0"
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                  <div className="mb-4 p-4 rounded-full bg-muted">
                    <MessageSquare className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Your Messages</h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    Select a contact to start messaging. You can communicate with admins, vendors, staff, and customers.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
