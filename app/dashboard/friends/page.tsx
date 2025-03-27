"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageSquare } from "lucide-react"
import { getFriends } from "@/lib/data-service"
import { useRouter } from "next/navigation"

export default function FriendsPage() {
  const [friends, setFriends] = useState([])
  const [selectedFriends, setSelectedFriends] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await getFriends()
        setFriends(data)
      } catch (error) {
        console.error("Error fetching friends:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFriends()
  }, [])

  const handleSelectFriend = (id: number) => {
    setSelectedFriends((prev) => (prev.includes(id) ? prev.filter((friendId) => friendId !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedFriends.length === friends.length) {
      setSelectedFriends([])
    } else {
      setSelectedFriends(friends.map((friend: any) => friend.id))
    }
  }

  const handleMessageSelected = () => {
    if (selectedFriends.length === 0) return

    // Store selected friends in localStorage to access them on the send page
    localStorage.setItem("selectedFriends", JSON.stringify(selectedFriends))
    router.push("/dashboard/send")
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38bdf8] mx-auto"></div>
          <p className="mt-4 text-[#38bdf8]">Loading friends...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Friends</h2>
          <p className="text-gray-400">View and manage your Discord friends</p>
        </div>
        <Button
          className="bg-[#38bdf8] hover:bg-[#0ea5e9]"
          onClick={handleMessageSelected}
          disabled={selectedFriends.length === 0}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Message Selected
        </Button>
      </div>

      <Card className="bg-[#111827] border-[#1f2937]">
        <CardHeader>
          <CardTitle className="text-[#38bdf8]">Friend List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#1f2937]">
            <div className="grid grid-cols-5 bg-[#1f2937] p-4 text-sm font-medium text-gray-400">
              <div className="flex items-center">
                <Checkbox
                  id="select-all"
                  className="mr-2 border-gray-500"
                  checked={selectedFriends.length === friends.length && friends.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all">Select All</label>
              </div>
              <div>User</div>
              <div>Status</div>
              <div>Last Active</div>
              <div>Actions</div>
            </div>

            {friends.map((friend: any) => (
              <div key={friend.id} className="grid grid-cols-5 p-4 text-sm border-t border-[#1f2937] items-center">
                <div>
                  <Checkbox
                    id={`friend-${friend.id}`}
                    className="border-gray-500"
                    checked={selectedFriends.includes(friend.id)}
                    onCheckedChange={() => handleSelectFriend(friend.id)}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={friend.avatar || "/placeholder.svg"}
                    alt={friend.name}
                    className="h-10 w-10 rounded-full bg-[#1f2937]"
                  />
                  <span className="font-medium text-white">{friend.name}</span>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      friend.status === "Online"
                        ? "bg-green-100 text-green-800"
                        : friend.status === "Idle"
                          ? "bg-yellow-100 text-yellow-800"
                          : friend.status === "Do Not Disturb"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {friend.status}
                  </span>
                </div>
                <div className="text-gray-400">{friend.lastActive}</div>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#38bdf8] hover:text-[#0ea5e9] hover:bg-[#1f2937]"
                    onClick={() => {
                      setSelectedFriends([friend.id])
                      handleMessageSelected()
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="sr-only">Message</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

