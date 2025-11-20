"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { MessageSquare, Reply, Trash2, Edit } from "lucide-react"
import { useAuth } from "@/store/auth"

interface CommentSectionProps {
  postId: string
  comments: any[]
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function BlogCommentSection({ postId, comments }: CommentSectionProps) {
  const router = useRouter()
  const {user}=useAuth()
  const [commentText, setCommentText] = useState("")
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error("Authentication required")
      router.push("/auth/login?callbackUrl=" + encodeURIComponent(window.location.href))
      return
    }

    if (!commentText.trim()) {
      toast.error("Empty Comment")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/blog/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentText,
          postId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit comment")
      }

      setCommentText("")
      toast.success("Comment Submit")
      router.refresh()
    } catch (error) {
      toast.error("Failed to submit Comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (commentId: string) => {
    if (!user) {
      toast.error("Login Required")
      router.push("/auth/login?callbackUrl=" + encodeURIComponent(window.location.href))
      return
    }

    if (!replyText[commentId]?.trim()) {
      toast.error("Empty Reply")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/blog/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: replyText[commentId],
          postId,
          parentId: commentId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit reply")
      }

      setReplyText((prev) => ({ ...prev, [commentId]: "" }))
      setReplyingTo(null)
      toast.success('Reply submitted')
      router.refresh()
    } catch (error) {
      toast.error("Failed to submit your reply")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editText.trim()) {
      toast.error("Empty Comment")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/blog/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editText,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update comment")
      }

      setEditingComment(null)
      setEditText("")
      toast.success('comment Updated')
      router.refresh()
    } catch (error) {
      toast.error('failed to update Comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return
    }

    try {
      const response = await fetch(`/api/blog/comments/${commentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete comment")
      }

      toast.success("comment is deleted")
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete comment")
    }
  }

  const startEditing = (comment: any) => {
    setEditingComment(comment.id)
    setEditText(comment.content)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Comments</h2>

      {/* Comment Form */}
      <div className="space-y-4">
        <Textarea
          placeholder="Leave a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmitComment} disabled={isSubmitting || !commentText.trim()}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Post Comment
          </Button>
        </div>
      </div>

      <Separator />

      {/* Comments List */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h3>

        {comments.length === 0 ? (
          <p className="text-muted-foreground">Be the first to comment on this post!</p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-4">
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user.image || ""} alt={comment.user.name} />
                        <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{comment.user.name}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</div>
                      </div>
                    </div>

                    {user?.email === comment.user.email && (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(comment)} className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  {editingComment === comment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingComment(null)}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEditComment(comment.id)}
                          disabled={isSubmitting || !editText.trim()}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">{comment.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      >
                        <Reply className="mr-1 h-3 w-3" />
                        Reply
                      </Button>
                    </>
                  )}

                  {replyingTo === comment.id && (
                    <div className="mt-2 space-y-2">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyText[comment.id] || ""}
                        onChange={(e) => setReplyText((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                        className="min-h-[80px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={isSubmitting || !replyText[comment.id]?.trim()}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-8 space-y-4">
                    {comment.replies.map((reply: any) => (
                      <div key={reply.id} className="rounded-lg border p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={reply.user.image || ""} alt={reply.user.name} />
                              <AvatarFallback>{getInitials(reply.user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{reply.user.name}</div>
                              <div className="text-xs text-muted-foreground">{formatDate(reply.createdAt)}</div>
                            </div>
                          </div>

                          {user?.email === reply.user.email && (
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startEditing(reply)}
                                className="h-7 w-7"
                              >
                                <Edit className="h-3 w-3" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteComment(reply.id)}
                                className="h-7 w-7 text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          )}
                        </div>

                        {editingComment === reply.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="min-h-[80px]"
                            />
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => setEditingComment(null)}>
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleEditComment(reply.id)}
                                disabled={isSubmitting || !editText.trim()}
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm">{reply.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
