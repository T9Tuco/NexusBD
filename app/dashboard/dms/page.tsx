"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, AlertCircle, Info, RefreshCw, UserPlus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type DMChannel = {
  id: string
  recipient?: {
    id: string
    username: string
    avatar: string | null
    discriminator: string
  }
  recipients?: Array<{
    id: string
    username: string
    avatar: string | null
    discriminator: string
  }>
  last_message_id: string | null
  type: number
}

type Message = {
  id: string
  content: string
  author: {
    id: string
    username: string
    avatar: string | null
  }
  timestamp: string
}

export default function DMsPage() {
  const { token, bot } = useAuth()
  const [dmChannels, setDmChannels] = useState<DMChannel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)
  const [recipientId, setRecipientId] = useState("")
  const [showRefreshMessage, setShowRefreshMessage] = useState(false)

  // Fetch DM channels
  useEffect(() => {
    const fetchDMs = async () => {
      if (!token) return

      try {
        setStatus({ type: "info", message: "Loading DM channels..." })

        const response = await fetch("/api/discord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "fetchDMChannels",
            token,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch DM channels")
        }

        const result = await response.json()

        if (result.data && Array.isArray(result.data)) {
          console.log("DM channels data:", result.data)
          setDmChannels(result.data)
        } else {
          setDmChannels([])
          console.error("Invalid DM channels data format:", result)
        }

        setStatus(null)
      } catch (error: any) {
        console.error("Error fetching DM channels:", error)
        setStatus({
          type: "error",
          message: error.message || "Failed to fetch DM channels",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDMs()
  }, [token])

  // Fetch messages when a channel is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!token || !selectedChannel) return

      try {
        setIsLoadingMessages(true)
        setMessages([]) // Clear messages while loading

        const response = await fetch("/api/discord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "fetchMessages",
            token,
            channelId: selectedChannel,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch messages")
        }

        const result = await response.json()
        if (result.data && Array.isArray(result.data)) {
          // Sort messages by timestamp (newest last)
          const sortedMessages = [...result.data].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          )
          setMessages(sortedMessages)
        } else {
          setMessages([])
          console.error("Invalid messages data format:", result)
        }
      } catch (error: any) {
        console.error("Error fetching messages:", error)
        setStatus({
          type: "error",
          message: error.message || "Failed to fetch messages",
        })
        setMessages([])
      } finally {
        setIsLoadingMessages(false)
      }
    }

    if (selectedChannel) {
      fetchMessages()
    }
  }, [selectedChannel, token])

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowRefreshMessage(true)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [isLoading])

  const handleSendMessage = async () => {
    if (!token || !selectedChannel || !newMessage) return

    setIsSending(true)
    setStatus(null)

    try {
      const response = await fetch("/api/discord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sendMessage",
          token,
          channelId: selectedChannel,
          content: newMessage,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send message")
      }

      // Add the new message to the list
      const result = await response.json()
      if (result.data && bot) {
        setMessages((prev) => [
          ...prev,
          {
            id: result.data.id || `temp-${Date.now()}`,
            content: newMessage,
            author: {
              id: bot.id || "",
              username: bot.username || "",
              avatar: bot.avatar || null,
            },
            timestamp: new Date().toISOString(),
          },
        ])
      }

      setNewMessage("")
    } catch (error: any) {
      console.error("Error sending message:", error)
      setStatus({
        type: "error",
        message: error.message || "Failed to send message",
      })
    } finally {
      setIsSending(false)
    }
  }

  const createNewDM = async () => {
    if (!token || !recipientId) return

    setIsLoading(true)
    setStatus({ type: "info", message: "Creating DM channel..." })

    try {
      const response = await fetch("/api/discord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "createDM",
          token,
          recipientId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create DM channel")
      }

      const result = await response.json()

      if (result.data) {
        // Add the new channel to the list
        setDmChannels((prev) => [result.data, ...prev])
        setSelectedChannel(result.data.id)
        setRecipientId("")
        setStatus({ type: "success", message: "DM channel created" })

        // Clear status after 3 seconds
        setTimeout(() => {
          setStatus(null)
        }, 3000)
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error: any) {
      console.error("Error creating DM channel:", error)
      setStatus({
        type: "error",
        message: error.message || "Failed to create DM channel",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshDMs = async () => {
    setIsLoading(true)

    try {
      setStatus({ type: "info", message: "Refreshing DM channels..." })

      const response = await fetch("/api/discord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "fetchDMChannels",
          token,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to refresh DM channels")
      }

      const result = await response.json()

      if (result.data && Array.isArray(result.data)) {
        console.log("Refreshed DM channels:", result.data)
        setDmChannels(result.data)
        setStatus({ type: "success", message: "DM channels refreshed" })

        // Clear status after 3 seconds
        setTimeout(() => {
          setStatus(null)
        }, 3000)
      } else {
        setDmChannels([])
        throw new Error("Invalid DM channels data format")
      }
    } catch (error: any) {
      console.error("Error refreshing DM channels:", error)
      setStatus({
        type: "error",
        message: error.message || "Failed to refresh DM channels",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshMessages = async () => {
    if (!selectedChannel) return

    setIsLoadingMessages(true)

    try {
      const response = await fetch("/api/discord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "fetchMessages",
          token,
          channelId: selectedChannel,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to refresh messages")
      }

      const result = await response.json()
      if (result.data && Array.isArray(result.data)) {
        // Sort messages by timestamp (newest last)
        const sortedMessages = [...result.data].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        )
        setMessages(sortedMessages)
      } else {
        console.error("Invalid messages data format:", result)
      }
    } catch (error: any) {
      console.error("Error refreshing messages:", error)
      setStatus({
        type: "error",
        message: error.message || "Failed to refresh messages",
      })
    } finally {
      setIsLoadingMessages(false)
    }
  }

  // Helper function to get recipient info from a DM channel
  const getRecipientInfo = (channel: DMChannel) => {
    // For regular DM channels
    if (channel.recipient) {
      return {
        id: channel.recipient.id,
        username: channel.recipient.username,
        avatar: channel.recipient.avatar,
        discriminator: channel.recipient.discriminator,
      }
    }

    // For group DMs or other channel types
    if (channel.recipients && channel.recipients.length > 0) {
      return {
        id: channel.recipients[0].id,
        username: channel.recipients[0].username,
        avatar: channel.recipients[0].avatar,
        discriminator: channel.recipients[0].discriminator,
      }
    }

    // Fallback
    return {
      id: "unknown",
      username: "Unknown User",
      avatar: null,
      discriminator: "0000",
    }
  }

  if (isLoading && !status) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38bdf8] mx-auto"></div>
          <p className="mt-4 text-[#38bdf8]">Loading DM channels...</p>
          {showRefreshMessage && (
            <p className="mt-2 text-gray-400 max-w-md px-4">
              Wenn Sie das Gefühl haben, dass es ein Loop ist, refreshen Sie bitte die Seite.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Direct Messages</h2>
          <p className="text-gray-400">View and send direct messages</p>
        </div>
        <Button
          variant="outline"
          onClick={refreshDMs}
          disabled={isLoading}
          className="bg-[#1f2937] border-[#374151] hover:bg-[#2d3748] text-[#38bdf8]"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh DMs
        </Button>
      </div>

      {status && (
        <Alert
          variant={status.type === "error" ? "destructive" : status.type === "info" ? "default" : "default"}
          className={
            status.type === "error"
              ? "bg-red-900/20 border-red-900 text-red-400"
              : status.type === "info"
                ? "bg-blue-900/20 border-blue-900 text-blue-400"
                : "bg-green-900/20 border-green-900 text-green-400"
          }
        >
          {status.type === "error" ? (
            <AlertCircle className="h-4 w-4" />
          ) : status.type === "info" ? (
            <Info className="h-4 w-4" />
          ) : (
            <Info className="h-4 w-4" />
          )}
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="bg-[#111827] border-[#1f2937]">
            <CardHeader>
              <CardTitle className="text-[#38bdf8] flex justify-between items-center">
                <span>Conversations ({dmChannels.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="User ID"
                    className="bg-[#1f2937] border-[#374151] focus:border-[#38bdf8]"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                  />
                  <Button
                    className="bg-[#38bdf8] hover:bg-[#0ea5e9]"
                    onClick={createNewDM}
                    disabled={!recipientId || isLoading}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    New DM
                  </Button>
                </div>
                <p className="text-xs text-gray-400">Enter a user ID to start a new conversation</p>
                <Alert className="mt-2 bg-blue-900/20 border-blue-900 text-blue-400">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    To load a chat, you need to know the user's ID. Right-click on a user in Discord and select "Copy
                    ID" (Developer Mode must be enabled in Discord settings).
                  </AlertDescription>
                </Alert>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {dmChannels && dmChannels.length > 0 ? (
                  dmChannels.map((channel) => {
                    // Skip rendering if channel is invalid
                    if (!channel || !channel.id) {
                      return null
                    }

                    const recipient = getRecipientInfo(channel)
                    const recipientName = recipient.username || "Unknown User"
                    const recipientId = recipient.id || ""
                    const avatarUrl = recipient.avatar
                      ? `https://cdn.discordapp.com/avatars/${recipientId}/${recipient.avatar}.png`
                      : "/placeholder.svg?height=32&width=32"

                    return (
                      <div
                        key={channel.id}
                        className={`p-2 rounded-md cursor-pointer transition-colors ${
                          selectedChannel === channel.id
                            ? "bg-[#38bdf8] text-white"
                            : "bg-[#1f2937] hover:bg-[#2d3748] text-gray-200"
                        }`}
                        onClick={() => setSelectedChannel(channel.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={avatarUrl} alt={recipientName} />
                            <AvatarFallback className="bg-[#2d3748]">
                              {recipientName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="overflow-hidden">
                            <p className="font-medium truncate">{recipientName}</p>
                            {recipientId && <p className="text-xs text-gray-400 truncate">ID: {recipientId}</p>}
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    <p>No DM channels found</p>
                    <p className="text-xs mt-1">Enter a user ID above to start a conversation</p>
                    <p className="text-xs mt-2 text-[#38bdf8]">
                      Note: Discord API limitations may prevent loading all past conversations
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="bg-[#111827] border-[#1f2937] h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-[#38bdf8] flex justify-between items-center">
                <span>
                  {selectedChannel && dmChannels && dmChannels.length > 0
                    ? (() => {
                        const channel = dmChannels.find((c) => c.id === selectedChannel)
                        if (channel) {
                          const recipient = getRecipientInfo(channel)
                          return recipient.username || "Messages"
                        }
                        return "Messages"
                      })()
                    : "Messages"}
                </span>
                {selectedChannel && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={refreshMessages}
                    disabled={isLoadingMessages}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoadingMessages ? "animate-spin" : ""}`} />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden flex flex-col">
              {selectedChannel ? (
                <>
                  <div className="flex-grow overflow-y-auto mb-4 space-y-4 max-h-[400px]">
                    {isLoadingMessages ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#38bdf8]"></div>
                      </div>
                    ) : messages && messages.length > 0 ? (
                      messages.map((message) => {
                        // Skip rendering if message is invalid
                        if (!message || !message.id) {
                          return null
                        }

                        const isBot = bot && message.author && message.author.id === bot.id
                        const authorName = message.author?.username || "Unknown User"
                        const authorId = message.author?.id || ""
                        const messageContent = message.content || "No content"
                        const messageTime = message.timestamp
                          ? new Date(message.timestamp).toLocaleTimeString()
                          : "Unknown time"

                        let avatarUrl = "/placeholder.svg?height=32&width=32"
                        if (message.author?.avatar) {
                          avatarUrl =
                            authorId === bot?.id
                              ? message.author.avatar
                              : `https://cdn.discordapp.com/avatars/${authorId}/${message.author.avatar}.png`
                        }

                        return (
                          <div key={message.id} className={`flex ${isBot ? "justify-end" : "justify-start"}`}>
                            <div className={`flex max-w-[80%] ${isBot ? "flex-row-reverse" : "flex-row"}`}>
                              <Avatar className="h-8 w-8 mt-1">
                                <AvatarImage src={avatarUrl} alt={authorName} />
                                <AvatarFallback className="bg-[#2d3748]">
                                  {authorName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`mx-2 ${isBot ? "text-right" : "text-left"}`}>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm text-white">{authorName}</span>
                                  <span className="text-xs text-gray-400">{messageTime}</span>
                                </div>
                                <div
                                  className={`mt-1 p-2 rounded-md ${
                                    isBot ? "bg-[#38bdf8] text-white" : "bg-[#1f2937] text-gray-200"
                                  }`}
                                >
                                  {messageContent}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        <p>No messages yet</p>
                        <p className="text-xs mt-1">Start the conversation</p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Type your message..."
                      className="bg-[#1f2937] border-[#374151] focus:border-[#38bdf8] min-h-[80px]"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button
                      className="bg-[#38bdf8] hover:bg-[#0ea5e9] self-end"
                      onClick={handleSendMessage}
                      disabled={!newMessage || isSending}
                    >
                      {isSending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <p>Select a conversation</p>
                    <p className="text-xs mt-1">Or start a new one</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

