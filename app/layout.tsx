import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NexusBD | Nexus Bot Dashboard",
  description:
    "NexusBD - The ultimate Nexus bot dashboard. Monitor servers, send messages, manage DMs, and control your bot with ease.",
  keywords: "nexus bot, bot dashboard, nexus management, nexusbd, bot control panel, nexus automation",
  authors: [{ name: "NexusBD Team" }],
  creator: "NexusBD",
  publisher: "NexusBD",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexusbd.vercel.app/",
    title: "NexusBD | Nexus Bot Dashboard",
    description:
      "The ultimate Nexus bot dashboard. Monitor servers, send messages, manage DMs, and control your bot with ease.",
    siteName: "NexusBD",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NexusBD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusBD | Nexus Bot Dashboard",
    description:
      "The ultimate Nexus bot dashboard. Monitor servers, send messages, manage DMs, and control your bot with ease.",
    images: ["/og-image.png"],
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0e17" },
    { media: "(prefers-color-scheme: light)", color: "#38bdf8" },
  ],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'