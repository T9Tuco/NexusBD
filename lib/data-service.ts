// Mock data for servers
export const servers = [
  {
    id: "1",
    name: "Gaming Community",
    icon: "/placeholder.svg?height=48&width=48",
    memberCount: 1250,
    channels: 15,
    botCommands: 156,
  },
  {
    id: "2",
    name: "Development Hub",
    icon: "/placeholder.svg?height=48&width=48",
    memberCount: 780,
    channels: 22,
    botCommands: 89,
  },
  {
    id: "3",
    name: "Art & Design",
    icon: "/placeholder.svg?height=48&width=48",
    memberCount: 450,
    channels: 10,
    botCommands: 42,
  },
  {
    id: "4",
    name: "Music Lovers",
    icon: "/placeholder.svg?height=48&width=48",
    memberCount: 920,
    channels: 18,
    botCommands: 103,
  },
  {
    id: "5",
    name: "Study Group",
    icon: "/placeholder.svg?height=48&width=48",
    memberCount: 340,
    channels: 8,
    botCommands: 27,
  },
]

// Mock data for members
export const members = [
  {
    id: "1",
    username: "User1",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Online",
    server: "Gaming Community",
  },
  {
    id: "2",
    username: "User2",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Idle",
    server: "Gaming Community",
  },
  {
    id: "3",
    username: "User3",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Do Not Disturb",
    server: "Development Hub",
  },
  {
    id: "4",
    username: "User4",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Offline",
    server: "Development Hub",
  },
  {
    id: "5",
    username: "User5",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Online",
    server: "Art & Design",
  },
  {
    id: "6",
    username: "User6",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Online",
    server: "Music Lovers",
  },
  { id: "7", username: "User7", avatar: "/placeholder.svg?height=40&width=40", status: "Idle", server: "Study Group" },
  {
    id: "8",
    username: "User8",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Offline",
    server: "Gaming Community",
  },
]

// Mock data for messages
export const messages = [
  {
    id: "1",
    content: "Hello everyone!",
    server: "Gaming Community",
    channel: "general",
    timestamp: "2023-03-15T14:30:00",
    author: "Bot",
  },
  {
    id: "2",
    content: "Welcome to the server!",
    server: "Development Hub",
    channel: "welcome",
    timestamp: "2023-03-14T09:15:00",
    author: "Bot",
  },
  {
    id: "3",
    content: "The event starts in 10 minutes!",
    server: "Art & Design",
    channel: "announcements",
    timestamp: "2023-03-13T18:45:00",
    author: "Bot",
  },
  {
    id: "4",
    content: "Check out the new music releases!",
    server: "Music Lovers",
    channel: "releases",
    timestamp: "2023-03-12T11:20:00",
    author: "Bot",
  },
  {
    id: "5",
    content: "Study session starting now!",
    server: "Study Group",
    channel: "sessions",
    timestamp: "2023-03-11T15:00:00",
    author: "Bot",
  },
]

// Mock data for friends
export const friends = [
  {
    id: 1,
    name: "Alice",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Online",
    lastActive: "5 minutes ago",
  },
  { id: 2, name: "Bob", avatar: "/placeholder.svg?height=40&width=40", status: "Idle", lastActive: "30 minutes ago" },
  {
    id: 3,
    name: "Charlie",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Do Not Disturb",
    lastActive: "1 hour ago",
  },
  { id: 4, name: "David", avatar: "/placeholder.svg?height=40&width=40", status: "Offline", lastActive: "2 days ago" },
]

// Stats data
export const stats = {
  totalServers: 12,
  totalMembers: 3740,
  totalMessages: 1284,
  commandsUsed: 412,
  uptime: "99.8%",
  responseTime: "120ms",
}

// Function to simulate sending a message
export async function sendMessage(content: string, serverId: string | number[], channelId?: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simulate success (95% of the time)
  if (Math.random() < 0.95) {
    // In a real app, this would call the Discord API
    return {
      success: true,
      message: "Message sent successfully",
    }
  } else {
    throw new Error("Failed to send message. Please try again.")
  }
}

// Function to simulate fetching servers
export async function getServers() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return servers
}

// Function to simulate fetching members
export async function getMembers() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return members
}

// Function to simulate fetching messages
export async function getMessages() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return messages
}

// Function to simulate fetching friends
export async function getFriends() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return friends
}

// Function to simulate fetching stats
export async function getStats() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  return stats
}

// Function to simulate fetching channels for a server
export async function getChannels(serverId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Mock channels based on server ID
  const channels = [
    { id: `${serverId}-1`, name: "general", type: "text" },
    { id: `${serverId}-2`, name: "welcome", type: "text" },
    { id: `${serverId}-3`, name: "announcements", type: "text" },
    { id: `${serverId}-4`, name: "bot-commands", type: "text" },
    { id: `${serverId}-5`, name: "voice-chat", type: "voice" },
  ]

  return channels
}

