"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"

type DiscordGuild = {
  id: string
  name: string
}

type DiscordMember = {
  user: {
    id: string
    username: string
    avatar: string | null
  }
  nick: string | null
  status?: string
}

export default function MembersPage() {
  const { token } = useAuth()
  const [members, setMembers] = useState<DiscordMember[]>([])
  const [servers, setServers] = useState<DiscordGuild[]>([])
  const [filteredMembers, setFilteredMembers] = useState<DiscordMember[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [serverFilter, setServerFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return

      try {
        // Fetch servers
        const serversResponse = await fetch("/api/discord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "fetchGuilds",
            token,
          }),
        })

        if (!serversResponse.ok) {
          const errorData = await serversResponse.json()
          throw new Error(errorData.error || "Failed to fetch servers")
        }

        const serversData = await serversResponse.json()
        setServers(serversData.data)

        // Since fetching members requires the "Server Members Intent" permission,
        // which many bots don't have enabled, we'll create mock members for demonstration
        const mockMembers: DiscordMember[] = []
        const statuses = ["Online", "Idle", "Do Not Disturb", "Offline"]

        // Create 5 mock members for each server
        serversData.data.forEach((server: DiscordGuild) => {
          for (let i = 1; i <= 5; i++) {
            mockMembers.push({
              user: {
                id: `${server.id}-user-${i}`,
                username: `User ${i} (${server.name})`,
                avatar: null,
              },
              nick: null,
              status: statuses[Math.floor(Math.random() * statuses.length)],
            })
          }
        })

        setMembers(mockMembers)
        setFilteredMembers(mockMembers)
      } catch (error: any) {
        console.error("Error fetching data:", error)
        setError(error.message || "Failed to fetch data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  useEffect(() => {
    let filtered = [...members]

    // Filter by server
    if (serverFilter !== "all") {
      filtered = filtered.filter((member: DiscordMember) => member.user.username.includes(serverFilter))
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((member: DiscordMember) => member.user.username.toLowerCase().includes(query))
    }

    setFilteredMembers(filtered)
  }, [searchQuery, serverFilter, members])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38bdf8] mx-auto"></div>
          <p className="mt-4 text-[#38bdf8]">Loading members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Members</h2>
        <p className="text-gray-400">View members across all servers</p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search members..."
            className="pl-8 bg-[#1f2937] border-[#374151] focus:border-[#38bdf8]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={serverFilter} onValueChange={setServerFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-[#1f2937] border-[#374151] focus:border-[#38bdf8]">
            <SelectValue placeholder="Filter by server" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Servers</SelectItem>
            {servers.map((server: DiscordGuild) => (
              <SelectItem key={server.id} value={server.name}>
                {server.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-[#111827] border-[#1f2937]">
        <CardHeader>
          <CardTitle className="text-[#38bdf8]">Member List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#1f2937]">
            <div className="grid grid-cols-4 bg-[#1f2937] p-4 text-sm font-medium text-gray-400">
              <div>User</div>
              <div>Status</div>
              <div>Server</div>
              <div>ID</div>
            </div>

            {filteredMembers.length > 0 ? (
              filteredMembers.map((member: DiscordMember) => (
                <div
                  key={member.user.id}
                  className="grid grid-cols-4 p-4 text-sm border-t border-[#1f2937] items-center"
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
                  <div className="text-gray-400">
                    {member.user.username.split("(")[1]?.replace(")", "") || "Unknown"}
                  </div>
                  <div className="text-gray-400 font-mono text-xs">{member.user.id}</div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <div className="py-12">
                  <p className="text-gray-500">No members found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {searchQuery || serverFilter !== "all" ? "Try different search criteria" : "No members available"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-gray-400 mt-4">
        <p>
          Note: To view actual server members, your bot needs the "Server Members Intent" permission enabled in the
          Discord Developer Portal.
        </p>
      </div>
    </div>
  )
}

