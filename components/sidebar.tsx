"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Server, MessageSquare, BarChart2, Users, Settings, LogOut, Mail } from "lucide-react"
import { useAuth } from "./auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Sidebar() {
  const router = useRouter()
  const [activeItem, setActiveItem] = useState("dashboard")
  const { bot, logout } = useAuth()

  const handleNavigation = (path: string, item: string) => {
    setActiveItem(item)
    router.push(path)
  }

  return (
    <div className="w-64 bg-[#111827] border-r border-[#1f2937] flex flex-col">
      <div className="p-4 border-b border-[#1f2937]">
        {bot && (
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={bot.avatar} alt={bot.username} />
              <AvatarFallback className="bg-[#1f2937]">{bot.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-[#38bdf8]">{bot.username}</h2>
              <p className="text-sm text-gray-400">Online • Bot</p>
            </div>
          </div>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant="ghost"
          className={`w-full justify-start ${
            activeItem === "dashboard"
              ? "bg-[#1f2937] text-[#38bdf8]"
              : "text-gray-400 hover:text-[#38bdf8] hover:bg-[#1f2937]"
          }`}
          onClick={() => handleNavigation("/dashboard", "dashboard")}
        >
          <BarChart2 className="mr-2 h-5 w-5" />
          Dashboard
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start ${
            activeItem === "servers"
              ? "bg-[#1f2937] text-[#38bdf8]"
              : "text-gray-400 hover:text-[#38bdf8] hover:bg-[#1f2937]"
          }`}
          onClick={() => handleNavigation("/dashboard/servers", "servers")}
        >
          <Server className="mr-2 h-5 w-5" />
          Servers
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start ${
            activeItem === "members"
              ? "bg-[#1f2937] text-[#38bdf8]"
              : "text-gray-400 hover:text-[#38bdf8] hover:bg-[#1f2937]"
          }`}
          onClick={() => handleNavigation("/dashboard/members", "members")}
        >
          <Users className="mr-2 h-5 w-5" />
          Members
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start ${
            activeItem === "messages"
              ? "bg-[#1f2937] text-[#38bdf8]"
              : "text-gray-400 hover:text-[#38bdf8] hover:bg-[#1f2937]"
          }`}
          onClick={() => handleNavigation("/dashboard/messages", "messages")}
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Messages
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start ${
            activeItem === "dms"
              ? "bg-[#1f2937] text-[#38bdf8]"
              : "text-gray-400 hover:text-[#38bdf8] hover:bg-[#1f2937]"
          }`}
          onClick={() => handleNavigation("/dashboard/dms", "dms")}
        >
          <Mail className="mr-2 h-5 w-5" />
          Direct Messages
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start ${
            activeItem === "settings"
              ? "bg-[#1f2937] text-[#38bdf8]"
              : "text-gray-400 hover:text-[#38bdf8] hover:bg-[#1f2937]"
          }`}
          onClick={() => handleNavigation("/dashboard/settings", "settings")}
        >
          <Settings className="mr-2 h-5 w-5" />
          Settings
        </Button>
      </nav>
      <div className="p-4 border-t border-[#1f2937]">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-[#38bdf8] hover:bg-[#1f2937]"
          onClick={logout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}

