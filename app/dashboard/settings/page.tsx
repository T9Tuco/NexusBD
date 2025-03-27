"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function SettingsPage() {
  const { bot } = useAuth()
  const [status, setStatus] = useState<{ message: string } | null>(null)

  const handleSaveSettings = () => {
    // Simulate saving settings
    setTimeout(() => {
      setStatus({ message: "Settings saved successfully" })

      // Clear status after 3 seconds
      setTimeout(() => {
        setStatus(null)
      }, 3000)
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Bot Settings</h2>
        <p className="text-gray-400">Configure your Discord bot</p>
      </div>

      {status && (
        <Alert className="bg-green-900/20 border-green-900 text-green-400">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-[#1f2937]">
          <TabsTrigger value="general" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-white">
            General
          </TabsTrigger>
          <TabsTrigger value="commands" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-white">
            Commands
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-white">
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-[#111827] border-[#1f2937]">
            <CardHeader>
              <CardTitle className="text-[#38bdf8]">General Settings</CardTitle>
              <CardDescription className="text-gray-400">Configure your bot's basic settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bot-name">Bot Name</Label>
                <Input
                  id="bot-name"
                  defaultValue={bot?.username || "DiscordBot"}
                  className="bg-[#1f2937] border-[#374151] focus:border-[#38bdf8]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prefix">Command Prefix</Label>
                <Input id="prefix" defaultValue="!" className="bg-[#1f2937] border-[#374151] focus:border-[#38bdf8]" />
                <p className="text-xs text-gray-400">The character users type before commands</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="status-toggle">Online Status</Label>
                  <p className="text-xs text-gray-400">Show your bot as online</p>
                </div>
                <Switch id="status-toggle" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dm-toggle">Allow Direct Messages</Label>
                  <p className="text-xs text-gray-400">Let users send DMs to your bot</p>
                </div>
                <Switch id="dm-toggle" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-[#38bdf8] hover:bg-[#0ea5e9]" onClick={handleSaveSettings}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="commands">
          <Card className="bg-[#111827] border-[#1f2937]">
            <CardHeader>
              <CardTitle className="text-[#38bdf8]">Command Settings</CardTitle>
              <CardDescription className="text-gray-400">Configure which commands are enabled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="help-toggle">Help Command</Label>
                  <p className="text-xs text-gray-400">!help - Shows available commands</p>
                </div>
                <Switch id="help-toggle" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="info-toggle">Info Command</Label>
                  <p className="text-xs text-gray-400">!info - Shows server information</p>
                </div>
                <Switch id="info-toggle" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="kick-toggle">Kick Command</Label>
                  <p className="text-xs text-gray-400">!kick - Kicks a user from the server</p>
                </div>
                <Switch id="kick-toggle" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ban-toggle">Ban Command</Label>
                  <p className="text-xs text-gray-400">!ban - Bans a user from the server</p>
                </div>
                <Switch id="ban-toggle" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="clear-toggle">Clear Command</Label>
                  <p className="text-xs text-gray-400">!clear - Clears messages in a channel</p>
                </div>
                <Switch id="clear-toggle" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-[#38bdf8] hover:bg-[#0ea5e9]" onClick={handleSaveSettings}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card className="bg-[#111827] border-[#1f2937]">
            <CardHeader>
              <CardTitle className="text-[#38bdf8]">Permission Settings</CardTitle>
              <CardDescription className="text-gray-400">Configure who can use your bot's commands</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="admin-toggle">Admin Commands</Label>
                  <p className="text-xs text-gray-400">Restrict admin commands to server administrators</p>
                </div>
                <Switch id="admin-toggle" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mod-toggle">Moderation Commands</Label>
                  <p className="text-xs text-gray-400">Restrict moderation commands to server moderators</p>
                </div>
                <Switch id="mod-toggle" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="everyone-toggle">Everyone Commands</Label>
                  <p className="text-xs text-gray-400">Allow everyone to use basic commands</p>
                </div>
                <Switch id="everyone-toggle" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role-permission">Required Role</Label>
                <Input
                  id="role-permission"
                  placeholder="Enter role name"
                  defaultValue="Bot User"
                  className="bg-[#1f2937] border-[#374151] focus:border-[#38bdf8]"
                />
                <p className="text-xs text-gray-400">Users need this role to use the bot (leave empty for everyone)</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-[#38bdf8] hover:bg-[#0ea5e9]" onClick={handleSaveSettings}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

