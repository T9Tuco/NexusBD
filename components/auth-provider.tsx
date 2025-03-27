"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type Bot = {
  id: string
  username: string
  discriminator?: string
  avatar: string
  guilds: number
}

type AuthContextType = {
  bot: Bot | null
  isLoading: boolean
  loginWithToken: (token: string) => Promise<void>
  logout: () => void
  error: string | null
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [bot, setBot] = useState<Bot | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check for existing session on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Use a try-catch block for localStorage operations to handle potential errors
        let storedBot = null
        let storedToken = null

        try {
          storedBot = localStorage.getItem("discord_bot")
          storedToken = localStorage.getItem("discord_bot_token")
        } catch (e) {
          console.error("Error accessing localStorage:", e)
        }

        if (storedBot && storedToken) {
          try {
            setBot(JSON.parse(storedBot))
            setToken(storedToken)
          } catch (e) {
            console.error("Error parsing stored bot data:", e)
            // Clear invalid data
            localStorage.removeItem("discord_bot")
            localStorage.removeItem("discord_bot_token")
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err)
        logout()
      } finally {
        // Always set loading to false to prevent infinite loading state
        setIsLoading(false)
      }
    }

    // Execute immediately to prevent delay
    checkAuth()
  }, [])

  // Login with bot token
  const loginWithToken = async (inputToken: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate token format (basic check)
      if (!inputToken || inputToken.length < 50) {
        throw new Error("Invalid bot token format")
      }

      // Authenticate with Discord API
      const response = await fetch("/api/discord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "authenticate",
          token: inputToken,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // Handle rate limiting specifically
        if (response.status === 429) {
          throw new Error("Discord rate limit reached. Please try again in a few seconds.")
        }

        throw new Error(errorData.error || "Authentication failed. Please check your token.")
      }

      const userData = await response.json()

      // Create bot object with minimal data first
      const botData = {
        id: userData.data.id,
        username: userData.data.username,
        discriminator: userData.data.discriminator,
        avatar: userData.data.avatar
          ? `https://cdn.discordapp.com/avatars/${userData.data.id}/${userData.data.avatar}.png`
          : "/placeholder.svg?height=128&width=128",
        guilds: 0, // We'll update this later
      }

      // Set the bot data and token immediately to avoid delays
      setBot(botData)
      setToken(inputToken)
      localStorage.setItem("discord_bot", JSON.stringify(botData))
      localStorage.setItem("discord_bot_token", inputToken)

      // Navigate to dashboard
      router.push("/dashboard")

      // Fetch guilds in the background after navigation
      try {
        const guildsResponse = await fetch("/api/discord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "fetchGuilds",
            token: inputToken,
          }),
        })

        if (guildsResponse.ok) {
          const guildsData = await guildsResponse.json()

          // Update bot data with guild count
          const updatedBotData = {
            ...botData,
            guilds: guildsData.data.length,
          }

          setBot(updatedBotData)
          localStorage.setItem("discord_bot", JSON.stringify(updatedBotData))
        }
      } catch (err) {
        console.error("Background guild fetch error:", err)
        // Don't show this error to the user since they're already logged in
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Invalid token")
      setIsLoading(false)
    }
  }

  const logout = () => {
    setBot(null)
    setToken(null)
    localStorage.removeItem("discord_bot")
    localStorage.removeItem("discord_bot_token")
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        bot,
        isLoading,
        loginWithToken,
        logout,
        error,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

