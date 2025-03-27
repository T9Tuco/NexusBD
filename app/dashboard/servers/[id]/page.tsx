"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, Hash, ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

type DiscordChannel = {
  id: string
  name: string
  type: number
}

type DiscordMember = {
  user: {
    id: string
    username: string
    avatar: string | null
  }
  nick: string | null
  roles: string[]
  joined_at: string
  status?: string // This isn't provided by Discord API, we'll mock it
}

export default function ServerDetailPage() {
  const params = useParams()
  const serverId = params.id as string
  const router = useRouter()
  const { token } = useAuth()

  const [server, setServer] = useState<any>(null)
  const [channels, setChannels] = useState<DiscordChannel[]>([])
  const [members, setMembers] = useState<DiscordMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showRefreshMessage, setShowRefreshMessage] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return

      try {
        // Fetch server details
        const guildsResponse = await fetch("/api/discord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "fetchGuilds",
            token,
          }),
        })

        if (!guildsResponse.ok) {
          throw new Error("Failed to fetch servers")
        }

        const guildsData = await guildsResponse.json()
        const currentServer = guildsData.data.find((s: any) => s.id === serverId)

        if (!currentServer) {
          router.push("/dashboard/servers")
          return
        }

        // Add mock data for stats
        // currentServer.memberCount = Math.floor(Math.random() * 1000) + 100
        // currentServer.channels = Math.floor(Math.random() * 20) + 5
        // currentServer.botCommands = Math.floor(Math.random() * 200)

        setServer(currentServer)

        // Fetch channels
        const channelsResponse = await fetch("/api/discord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "fetchChannels",
            token,
            guildId: serverId,
          }),
        })

        if (!channelsResponse.ok) {
          throw new Error("Failed to fetch channels")
        }

        const channelsData = await channelsResponse.json()
        setChannels(channelsData.data)

        // Fetch members
        const membersResponse = await fetch("/api/discord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "fetchMembers",
            token,
            guildId: serverId,
          }),
        })

        if (!membersResponse.ok) {
          throw new Error("Failed to fetch members")
        }

        const membersData = await membersResponse.json()

        // Add mock status since Discord API doesn't provide this
        const statuses = ["Online", "Idle", "Do Not Disturb", "Offline"]
        const membersWithStatus = membersData.data.map((member: DiscordMember) => ({
          ...member,
          status: statuses[Math.floor(Math.random() * statuses.length)],
        }))

        setMembers(membersWithStatus)
      } catch (error) {
        console.error("Error fetching server data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [serverId, router, token])

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowRefreshMessage(true)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38bdf8] mx-auto"></div>
          <p className="mt-4 text-[#38bdf8]">Loading server data...</p>
          {showRefreshMessage && (
            <p className="mt-2 text-gray-400 max-w-md px-4">
              Wenn Sie das Gefühl haben, dass es ein Loop ist, refreshen Sie bitte die Seite.
            </p>
          )}
        </div>
      </div>
    )
  }

  if (!server) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-white"
          onClick={() => router.push("/dashboard/servers")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold text-white">{server.name}</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-[#111827] border-[#1f2937]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-400">Members</CardTitle>
            <Users className="h-4 w-4 text-[#38bdf8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {server.approximate_member_count?.toLocaleString() || server.memberCount?.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">Total server members</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111827] border-[#1f2937]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-400">Channels</CardTitle>
            <Hash className="h-4 w-4 text-[#38bdf8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{channels.length}</div>
            <p className="text-xs text-gray-400">Text and voice channels</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111827] border-[#1f2937]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-400">Commands Used</CardTitle>
            <MessageSquare className="h-4 w-4 text-[#38bdf8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {server.botCommands || Math.floor(Math.random() * 100) + 10}
            </div>
            <p className="text-xs text-gray-400">Bot commands executed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="channels" className="space-y-4">
        <TabsList className="bg-[#1f2937]">
          <TabsTrigger value="channels" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-white">
            Channels
          </TabsTrigger>
          <TabsTrigger value="members" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-white">
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="channels">
          <Card className="bg-[#111827] border-[#1f2937]">
            <CardHeader>
              <CardTitle className="text-[#38bdf8]">Server Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-[#1f2937]">
                <div className="grid grid-cols-3 bg-[#1f2937] p-4 text-sm font-medium text-gray-400">
                  <div>Name</div>
                  <div>Type</div>
                  <div>Actions</div>
                </div>

                {channels.length > 0 ? (
                  channels.map((channel) => (
                    <div
                      key={channel.id}
                      className="grid grid-cols-3 p-4 text-sm border-t border-[#1f2937] items-center"
                    >
                      <div className="flex items-center gap-2">
                        {channel.type === 0 ? (
                          <Hash className="h-4 w-4 text-gray-400" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="font-medium text-white">{channel.name}</span>
                      </div>
                      <div className="text-gray-400 capitalize">
                        {channel.type === 0
                          ? "text"
                          : channel.type === 2
                            ? "voice"
                            : channel.type === 4
                              ? "category"
                              : "other"}
                      </div>
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#38bdf8] hover:text-[#0ea5e9] hover:bg-[#1f2937]"
                          onClick={() => router.push(`/dashboard/messages?channel=${channel.id}&server=${serverId}`)}
                          disabled={channel.type !== 0}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <div className="py-12">
                      <p className="text-gray-500">No channels available</p>
                      <p className="text-xs text-gray-400 mt-1">This server has no visible channels</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card className="bg-[#111827] border-[#1f2937]">
            <CardHeader>
              <CardTitle className="text-[#38bdf8]">Server Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-[#1f2937]">
                <div className="grid grid-cols-3 bg-[#1f2937] p-4 text-sm font-medium text-gray-400">
                  <div>User</div>
                  <div>Status</div>
                  <div>ID</div>
                </div>

                {members.length > 0 ? (
                  members.map((member) => (
                    <div
                      key={member.user.id}
                      className="grid grid-cols-3 p-4 text-sm border-t border-[#1f2937] items-center"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            member.user.avatar
                              ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
                              : "/placeholder.svg?height=40&width=40"
                          }
                          alt={member.user.username}
                          className="h-8 w-8 rounded-full bg-[#1f2937]"
                        />
                        <span className="font-medium text-white">{member.nick || member.user.username}</span>
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.status === "Online"
                              ? "bg-green-100 text-green-800"
                              : member.status === "Idle"
                                ? "bg-yellow-100 text-yellow-800"
                                : member.status === "Do Not Disturb"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.status}
                        </span>
                      </div>
                      <div className="text-gray-400 font-mono text-xs">{member.user.id}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <div className="py-12">
                      <p className="text-gray-500">No members available</p>
                      <p className="text-xs text-gray-400 mt-1">This server has no visible members</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

