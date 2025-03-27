"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, Users, MessageSquare, Terminal, Clock, Zap } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type BotStats = {
  totalServers: number
  totalMembers: number | string
  totalChannels: number | string
  totalMessages: number | string
  commandsUsed: number | string
  uptime: string
  responseTime: string
}

export default function Dashboard() {
  const { token, bot } = useAuth()
  const [stats, setStats] = useState<BotStats>({
    totalServers: 0,
    totalMembers: 0,
    totalChannels: 0,
    totalMessages: "N/A",
    commandsUsed: "N/A",
    uptime: "N/A",
    responseTime: "N/A",
  })
  const [recentMessages, setRecentMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRefreshMessage, setShowRefreshMessage] = useState(false)

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowRefreshMessage(true)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [isLoading])

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return

      try {
        // Fetch real stats
        const statsResponse = await fetch("/api/discord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "fetchStats",
            token,
          }),
        })

        if (!statsResponse.ok) {
          const errorData = await statsResponse.json()
          throw new Error(errorData.error || "Failed to fetch stats")
        }

        const statsData = await statsResponse.json()
        setStats(statsData.data)

        // Fetch recent messages from DMs
        try {
          const dmsResponse = await fetch("/api/discord", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "fetchDMChannels",
              token,
            }),
          })

          if (!dmsResponse.ok) {
            throw new Error("Failed to fetch DM channels")
          }

          const dmsData = await dmsResponse.json()

          // Get messages from the first few DM channels
          const recentMessagesList = []

          for (let i = 0; i < Math.min(3, dmsData.data.length); i++) {
            const channel = dmsData.data[i]

            try {
              const messagesResponse = await fetch("/api/discord", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  action: "fetchMessages",
                  token,
                  channelId: channel.id,
                }),
              })

              if (messagesResponse.ok) {
                const messagesData = await messagesResponse.json()

                // Add the first message from each channel
                if (messagesData.data.length > 0) {
                  recentMessagesList.push({
                    id: messagesData.data[0].id,
                    content: messagesData.data[0].content,
                    server: "Direct Message",
                    channel: channel.recipient.username,
                    timestamp: messagesData.data[0].timestamp,
                    author: messagesData.data[0].author.username,
                  })
                }
              }
            } catch (err) {
              console.error("Error fetching messages for DM channel:", err)
            }
          }

          setRecentMessages(recentMessagesList)
        } catch (err) {
          console.error("Error fetching DMs:", err)
          // Don't fail the whole dashboard if DMs fail
        }
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error)
        setError(error.message || "Failed to fetch dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token, bot])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38bdf8] mx-auto"></div>
          <p className="mt-4 text-[#38bdf8]">Loading dashboard data...</p>
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
      <h2 className="text-3xl font-bold text-white">Bot Dashboard</h2>
      <p className="text-gray-400">Monitor and manage your Discord bot</p>

      {error && (
        <Alert className="bg-red-900/20 border-red-900 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-[#111827] border-[#1f2937]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-400">Total Servers</CardTitle>
            <Server className="h-4 w-4 text-[#38bdf8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalServers}</div>
            <p className="text-xs text-gray-400">Active Nexus servers</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111827] border-[#1f2937]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-400">Total Members</CardTitle>
            <Users className="h-4 w-4 text-[#38bdf8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {typeof stats.totalMembers === "number" ? stats.totalMembers.toLocaleString() : stats.totalMembers}
            </div>
            <p className="text-xs text-gray-400">Across all servers</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111827] border-[#1f2937]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-400">Total Channels</CardTitle>
            <MessageSquare className="h-4 w-4 text-[#38bdf8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {typeof stats.totalChannels === "number" ? stats.totalChannels.toLocaleString() : stats.totalChannels}
            </div>
            <p className="text-xs text-gray-400">Text and voice channels</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111827] border-[#1f2937]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-400">Commands Used</CardTitle>
            <Terminal className="h-4 w-4 text-[#38bdf8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {typeof stats.commandsUsed === "number" ? stats.commandsUsed.toLocaleString() : stats.commandsUsed}
            </div>
            <p className="text-xs text-gray-400">Total commands executed</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111827] border-[#1f2937]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-400">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-[#38bdf8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.uptime}</div>
            <p className="text-xs text-gray-400">Bot availability</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111827] border-[#1f2937]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-400">Response Time</CardTitle>
            <Zap className="h-4 w-4 text-[#38bdf8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.responseTime}</div>
            <p className="text-xs text-gray-400">API response time</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#111827] border-[#1f2937]">
        <CardHeader>
          <CardTitle className="text-[#38bdf8]">Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#1f2937]">
            <div className="grid grid-cols-4 bg-[#1f2937] p-4 text-sm font-medium text-gray-400">
              <div>Server</div>
              <div>Channel</div>
              <div>Message</div>
              <div>Time</div>
            </div>

            {recentMessages.length > 0 ? (
              recentMessages.map((message: any) => (
                <div key={message.id} className="grid grid-cols-4 p-4 text-sm border-t border-[#1f2937] items-center">
                  <div className="text-white font-medium">{message.server}</div>
                  <div className="text-gray-400">{message.channel}</div>
                  <div className="text-gray-300 truncate">{message.content}</div>
                  <div className="text-gray-400">{new Date(message.timestamp).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <div className="py-12 flex flex-col items-center justify-center">
                  <MessageSquare className="h-12 w-12 text-gray-600 mb-4" />
                  <p className="text-gray-500">No messages found</p>
                  <p className="text-xs text-gray-400 mt-1">Send your first message to see results here</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

