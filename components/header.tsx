"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Send, LayoutDashboard, Server, Mail } from "lucide-react"
import { useAuth } from "./auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const router = useRouter()
  const { bot, logout } = useAuth()

  return (
    <header className="border-b border-[#1f2937] bg-[#111827] px-6 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#38bdf8]">Nexus Bot Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-[#38bdf8] hover:text-[#0ea5e9] hover:bg-[#1f2937]"
            onClick={() => router.push("/dashboard/dms")}
          >
            <Mail className="mr-2 h-4 w-4" />
            Direct Messages
          </Button>
          <Button
            variant="ghost"
            className="text-[#38bdf8] hover:text-[#0ea5e9] hover:bg-[#1f2937]"
            onClick={() => router.push("/dashboard/messages")}
          >
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
          <Button
            variant="ghost"
            className="text-[#38bdf8] hover:text-[#0ea5e9] hover:bg-[#1f2937]"
            onClick={() => router.push("/dashboard/servers")}
          >
            <Server className="mr-2 h-4 w-4" />
            Servers
          </Button>
          <Button
            variant="ghost"
            className="text-[#38bdf8] hover:text-[#0ea5e9] hover:bg-[#1f2937]"
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>

          {bot && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={bot.avatar} alt={bot.username} />
                    <AvatarFallback className="bg-[#1f2937]">{bot.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{bot.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">Bot • {bot.guilds} servers</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

