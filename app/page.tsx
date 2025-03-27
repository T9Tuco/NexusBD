import { LoginForm } from "@/components/login-form"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0e17]">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#111827] rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#38bdf8]">NexusBD</h1>
          <p className="mt-2 text-gray-400">Nexus Bot Dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

