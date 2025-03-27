"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "./auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"

export function LoginForm() {
  const { loginWithToken, error, isLoading } = useAuth()
  const [token, setToken] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await loginWithToken(token)
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert className="bg-blue-900/20 border-blue-900 text-blue-400">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Welcome to Nexus Bot Dashboard! You need a Discord bot token to use this dashboard. You can create a bot in
          the
          <a
            href="https://discord.com/developers/applications"
            target="_blank"
            rel="noopener noreferrer"
            className="underline ml-1"
          >
            Discord Developer Portal
          </a>
          .
        </AlertDescription>
      </Alert>

      <Alert className="bg-blue-900/20 border-blue-900 text-blue-400">
        <Info className="h-4 w-4" />
        <AlertDescription>
          For full functionality, enable these permissions in your bot settings:
          <ul className="list-disc pl-5 mt-1">
            <li>Server Members Intent (for member lists)</li>
            <li>Message Content Intent (for message content)</li>
            <li>Presence Intent (for user status)</li>
          </ul>
        </AlertDescription>
      </Alert>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token">Bot Token</Label>
          <Input
            id="token"
            placeholder="Enter your Discord bot token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <p className="text-xs text-gray-400">
            Your token is kept locally and never sent to any server except Discord's API.
          </p>
        </div>
        <Button type="submit" className="w-full bg-[#38bdf8] hover:bg-[#0ea5e9]" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </div>
  )
}

