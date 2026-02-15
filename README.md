# NexusBD - Nexus Bot Dashboard

## Official Website

Visit the official NexusBD website: **https://botdb.nexusng.site**

## Overview

NexusBD is a powerful, modern dashboard for Discord bots. It provides an intuitive interface to monitor and manage your Discord bot, view server statistics, send messages, manage direct messages, and more. Built with Next.js and TypeScript, it offers a responsive and user-friendly experience.

## A Quick Heads-Up

A good amount of this project was built using AI. While it's a cool tool, it's not always perfect. So, be careful, you might find some weird code or unexpected bugs. Just saying.

## Features

- **Secure Authentication**: Log in with your Discord bot token
- **Comprehensive Dashboard**: View bot statistics, server count, member count, and more
- **Server Management**: Browse and manage all servers your bot is in
- **Member Management**: View and filter members across all servers
- **Messaging System**: Send messages to channels and users directly from the dashboard
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Easy on the eyes, perfect for night-time use
- **Privacy-Focused**: Your bot token is stored locally and only sent to Discord's API

## Installation

1. Clone the repository:

```bash
git clone https://github.com/t9tuco/nexusbd.git
cd nexusbd
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```ini
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Create a Discord bot in the [Discord Developer Portal](https://discord.com/developers/applications)
2. Enable the required intents for your bot:
   - **Server Members Intent** (for member lists)
   - **Message Content Intent** (for message content)
   - **Presence Intent** (for user status)
3. Copy your bot token
4. Log in to the dashboard using your bot token
5. Start managing your bot through the intuitive interface

## Technologies Used

### Frontend:
- [Next.js 14](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

### APIs:
- [Discord API](https://discord.com/developers/docs/intro)
- [Vercel Analytics](https://vercel.com/analytics)

### Deployment:
- [Vercel](https://vercel.com/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Discord API Documentation](https://discord.com/developers/docs/intro)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

---

Made by TucoT9
