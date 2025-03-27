"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Users, AlertCircle, CheckCircle } from "lucide-react"
import { getFriends, sendMessage } from "@/lib/data-service"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SendMessagePage() {
  const [friends, setFriends] = useState([])
  const [message, setMessage] = useState("")
  const [messageAll, setMessageAll] = useState("")
  const [selectedFriends, setSelectedFriends] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsData = await getFriends()
        setFriends(friendsData)

        // Check if there are pre-selected friends from the friends page
        const storedSelection = localStorage.getItem("selectedFriends")
        if (storedSelection) {
          setSelectedFriends(JSON.parse(storedSelection))
          localStorage.removeItem("selectedFriends")
        }
      } catch (error) {
        console.error("Error fetching friends:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
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

  const handleSendMessage = async () => {
    if (!message || selectedFriends.length === 0) return

    setIsSending(true)
    setStatus(null)

    try {
      await sendMessage(message, selectedFriends)

      setStatus({
        type: "success",
        message: `Message sent successfully to ${selectedFriends.length} ${selectedFriends.length === 1 ? "friend" : "friends"}`,
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

  const handleSendToAll = async () => {
    if (!messageAll) return

    setIsSending(true)
    setStatus(null)

    try {
      const allFriendIds = friends.map((friend: any) => friend.id)
      await sendMessage(messageAll, allFriendIds)

      setStatus({
        type: "success",
        message: `Message sent successfully to all ${friends.length} friends`,
      })

      // Reset form after 3 seconds
      setTimeout(() => {
        setMessageAll("")
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
      <h2 className="text-3xl font-bold text-white">Send Message</h2>
      <p className="text-gray-400">Send messages to your Discord friends</p>

      {status && (
        <Alert
          variant={status.type === "error" ? "destructive" : "default"}
          className={
            status.type === "error"
              ? "bg-red-900/20 border-red-900 text-red-400"
              : "bg-green-900/20 border-green-900 text-green-400"
          }
        >
          {status.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="select">
        <TabsList className="bg-[#1f2937]">
          <TabsTrigger value="select" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-white">
            Select Recipients
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-white">
            All Friends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="select">
          <Card className="bg-[#111827] border-[#1f2937]">
            <CardHeader>
              <CardTitle className="text-[#38bdf8]">Select Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-[#1f2937] mb-4">
                <div className="flex items-center bg-[#1f2937] p-4 text-sm font-medium text-gray-400">
                  <Checkbox
                    id="select-all"
                    className="mr-2 border-gray-500"
                    checked={selectedFriends.length === friends.length && friends.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all">Select All Friends</label>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friends.map((friend: any) => (
                    <div key={friend.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`friend-${friend.id}`}
                        className="border-gray-500"
                        checked={selectedFriends.includes(friend.id)}
                        onCheckedChange={() => handleSelectFriend(friend.id)}
                      />
                      <label htmlFor={`friend-${friend.id}`} className="flex items-center space-x-3 cursor-pointer">
                        <img
                          src={friend.avatar || "/placeholder.svg"}
                          alt={friend.name}
                          className="h-8 w-8 rounded-full bg-[#1f2937]"
                        />
                        <span className="font-medium text-white">{friend.name}</span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
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

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    {selectedFriends.length > 0 ? (
                      <span className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Sending to {selectedFriends.length} {selectedFriends.length === 1 ? "friend" : "friends"}
                      </span>
                    ) : (
                      <span>Select at least one friend</span>
                    )}
                  </div>
                  <Button
                    className="bg-[#38bdf8] hover:bg-[#0ea5e9]"
                    onClick={handleSendMessage}
                    disabled={isSending || !message || selectedFriends.length === 0}
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
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card className="bg-[#111827] border-[#1f2937]">
            <CardHeader>
              <CardTitle className="text-[#38bdf8]">Message All Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message-all">Message</Label>
                  <Textarea
                    id="message-all"
                    placeholder="Type your message here..."
                    className="min-h-32 bg-[#1f2937] border-[#374151] focus:border-[#38bdf8] focus:ring-[#38bdf8]"
                    value={messageAll}
                    onChange={(e) => setMessageAll(e.target.value)}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    <span className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Sending to all {friends.length} friends
                    </span>
                  </div>
                  <Button
                    className="bg-[#38bdf8] hover:bg-[#0ea5e9]"
                    onClick={handleSendToAll}
                    disabled={isSending || !messageAll}
                  >
                    {isSending ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send to All
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

