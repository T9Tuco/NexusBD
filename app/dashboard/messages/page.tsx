"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, AlertCircle, CheckCircle, Info } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useSearchParams } from "next/navigation"

type DiscordGuild = {
  id: string
  name: string
}

type DiscordChannel = {
  id: string
  name: string
  type: number
}

export default function MessagesPage() {
  const { token } = useAuth()
  const searchParams = useSearchParams()

  const [servers, setServers] = useState<DiscordGuild[]>([])
  const [channels, setChannels] = useState<DiscordChannel[]>([])
  const [selectedServer, setSelectedServer] = useState("")
  const [selectedChannel, setSelectedChannel] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Handle URL parameters for direct channel selection
  useEffect(() => {
    const serverParam = searchParams.get("server")
    const channelParam = searchParams.get("channel")

    if (serverParam) {
      setSelectedServer(serverParam)
    }

    if (channelParam) {
      setSelectedChannel(channelParam)
    }
  }, [searchParams])

  // Fetch servers
  useEffect(() => {
    const fetchServers = async () => {
      if (!token) return

      try {
        setStatus({ type: "info", message: "Loading servers..." })

        const response = await fetch("/api/discord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "fetchGuilds",
            token,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()

          // Check if we're being rate limited
          if (response.status === 429 && retryCount < 3) {
            const retryAfter = errorData.details?.includes("retry_after")
              ? Number.parseInt(errorData.details.split("retry_after")[1].split(",")[0].replace(/\D/g, "")) * 1000
              : 2000

            setStatus({ type: "info", message: `Rate limited by Discord. Retrying in ${retryAfter / 1000} seconds...` })

            // Wait and retry
            setTimeout(() => {
              setRetryCount((prev) => prev + 1)
            }, retryAfter)

            return
          }

          throw new Error(errorData.error || "Failed to fetch servers")
        }

        const result = await response.json()
        setServers(result.data)
        setStatus(null)

        if (result.data.length > 0 && !selectedServer) {
          setSelectedServer(result.data[0].id)
        }
      } catch (error: any) {
        console.error("Error fetching servers:", error)
        setStatus({
          type: "error",
          message: error.message || "Failed to fetch servers. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchServers()
  }, [token, retryCount])

  // Fetch channels when server is selected
  useEffect(() => {
    const fetchChannels = async () => {
      if (!token || !selectedServer) return

      try {
        setChannels([])
        const response = await fetch("/api/discord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "fetchChannels",
            token,
            guildId: selectedServer,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch channels")
        }

        const result = await response.json()
        const textChannels = result.data.filter((channel: DiscordChannel) => channel.type === 0)
        setChannels(textChannels)

        if (textChannels.length > 0 && !selectedChannel) {
          setSelectedChannel(textChannels[0].id)
        }
      } catch (error: any) {
        console.error("Error fetching channels:", error)
        // Don't show error for channels, just log it
      }
    }

    fetchChannels()
  }, [selectedServer, token])

  const handleSendMessage = async () => {
    if (!message || !selectedServer || !selectedChannel || !token) return

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
          content: message,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send message")
      }

      setStatus({
        type: "success",
        message: "Message sent successfully",
      })

      // Reset form after 3 seconds
      setTimeout(() => {
        setMessage("")
        setStatus(null)
      }, 3000)
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.message || "Failed to send message",
      })
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading && !status) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38bdf8] mx-auto"></div>
          <p className="mt-4 text-[#38bdf8]">Loading servers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Send Message</h2>
        <p className="text-gray-400">Send messages to Discord channels</p>
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
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-[#111827] border-[#1f2937]">
        <CardHeader>
          <CardTitle className="text-[#38bdf8]">Compose Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="server">Server</Label>
              <Select value={selectedServer} onValueChange={setSelectedServer}>
                <SelectTrigger id="server" className="bg-[#1f2937] border-[#374151] focus:border-[#38bdf8]">
                  <SelectValue placeholder="Select a server" />
                </SelectTrigger>
                <SelectContent>
                  {servers.map((server) => (
                    <SelectItem key={server.id} value={server.id}>
                      {server.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel">Channel</Label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel} disabled={channels.length === 0}>
                <SelectTrigger id="channel" className="bg-[#1f2937] border-[#374151] focus:border-[#38bdf8]">
                  <SelectValue
                    placeholder={channels.length === 0 ? "No text channels available" : "Select a channel"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      #{channel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              className="min-h-32 bg-[#1f2937] border-[#374151] focus:border-[#38bdf8] focus:ring-[#38bdf8]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            className="bg-[#38bdf8] hover:bg-[#0ea5e9]"
            onClick={handleSendMessage}
            disabled={isSending || !message || !selectedServer || !selectedChannel}
          >
            {isSending ? (
              "Sending..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="text-sm text-gray-400 mt-4">
        <p>
          Note: Discord limits how many requests you can make in a short time. If you encounter rate limiting, the
          dashboard will automatically retry after a short delay.
        </p>
      </div>
    </div>
  )
}

