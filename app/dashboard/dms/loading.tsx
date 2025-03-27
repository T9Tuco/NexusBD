"use client"

import { useEffect, useState } from "react"

export default function Loading() {
  const [showRefreshMessage, setShowRefreshMessage] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRefreshMessage(true)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38bdf8] mx-auto"></div>
        <p className="mt-4 text-[#38bdf8]">Loading Nexus Bot Dashboard...</p>
        {showRefreshMessage && (
          <p className="mt-2 text-gray-400 max-w-md px-4">
            Wenn Sie das Gefühl haben, dass es ein Loop ist, refreshen Sie bitte die Seite.
          </p>
        )}
      </div>
    </div>
  )
}

