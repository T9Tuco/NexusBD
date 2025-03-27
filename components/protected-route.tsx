"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { bot, isLoading } = useAuth()
  const router = useRouter()
  const [showRefreshMessage, setShowRefreshMessage] = useState(false)

  useEffect(() => {
    if (!isLoading && !bot) {
      router.push("/")
    }
  }, [bot, isLoading, router])

  // Add timeout to show refresh message after 4 seconds
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
      <div className="flex h-screen items-center justify-center bg-[#0a0e17]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38bdf8] mx-auto"></div>
          <p className="mt-4 text-[#38bdf8]">Loading...</p>
          {showRefreshMessage && (
            <p className="mt-2 text-gray-400 max-w-md px-4">
              Wenn Sie das Gefühl haben, dass es ein Loop ist, refreshen Sie bitte die Seite.
            </p>
          )}
        </div>
      </div>
    )
  }

  if (!bot) {
    return null
  }

  return <>{children}</>
}

