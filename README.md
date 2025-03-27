# NexusBD - Nexus Bot Dashboard

[![Vercel](https://img.shields.io/badge/Vercel-deployed-brightgreen.svg)](https://v0-dicord-dashboard.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-blue.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Discord API](https://img.shields.io/badge/Discord%20API-v10-7289da.svg)](https://discord.com/developers/docs/intro)

<p align="center">
  <img src="https://your-cdn-link.com/nexusbd-dashboard.png" alt="NexusBD Dashboard" width="600">
</p>

## 🚀 Overview

NexusBD is a powerful, modern dashboard for Discord bots. It provides an intuitive interface to monitor and manage your Discord bot, view server statistics, send messages, manage direct messages, and more. Built with Next.js and TypeScript, it offers a responsive and user-friendly experience.

## ✨ Features

- **🔐 Secure Authentication**: Log in with your Discord bot token
- **📊 Comprehensive Dashboard**: View bot statistics, server count, member count, and more
- **🖥️ Server Management**: Browse and manage all servers your bot is in
- **👥 Member Management**: View and filter members across all servers
- **💬 Messaging System**: Send messages to channels and users directly from the dashboard
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🌙 Dark Mode**: Easy on the eyes, perfect for night-time use
- **🔒 Privacy-Focused**: Your bot token is stored locally and only sent to Discord's API

## 📸 Screenshots

<p align="center">
  <img src="https://your-cdn-link.com/nexusbd-login.png" alt="Login Screen" width="400">
</p>

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nexusbd.git
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

## 📖 Usage

1. Create a Discord bot in the [Discord Developer Portal](https://discord.com/developers/applications)
2. Enable the required intents for your bot:
   - **Server Members Intent** (for member lists)
   - **Message Content Intent** (for message content)
   - **Presence Intent** (for user status)
3. Copy your bot token
4. Log in to the dashboard using your bot token
5. Start managing your bot through the intuitive interface

## 🔧 Technologies Used

### **Frontend**:
- [Next.js 14](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

### **APIs**:
- [Discord API](https://discord.com/developers/docs/intro)
- [Vercel Analytics](https://vercel.com/analytics)

### **Deployment**:
- [Vercel](https://vercel.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Discord API Documentation](https://discord.com/developers/docs/intro)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

## 📬 Contact

Project Link: [https://github.com/yourusername/nexusbd](https://github.com/yourusername/nexusbd)

---

Made with ❤️ by the NexusBD Team
