"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { ChevronLeft, MessageCircle, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  className?: string
}

interface User {
  id: number
  fullName?: string
  phoneNumber?: string
}

export const ProfilePage: React.FC<Props> = ({ className }) => {
  const router = useRouter()
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="p-4">Loading...</div>
  }

  if (!session) {
    return <div className="p-4">You are not authorized</div>
  }

  const user: User = {
    id: session.user.id,
    fullName: session.user.fullName,
    phoneNumber: session.user.phoneNumber,
  }

  const menuItems = [
    { id: "profile", label: "My Profile", icon: User, path: "/profile" },
    { id: "messages", label: "Messages", icon: MessageCircle, path: "/chat", badge: 3 },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ]

  return (
    <div className={cn("", className)}>
      <div className="mx-auto max-w-md overflow-hidden rounded-lg bg-slate-100">
        <div className="relative bg-zinc-500 pb-16 pt-8">
          <div className="px-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage src={session.user.image || "https://github.com/shadcn.png"} alt={session.user.fullName} />
                <AvatarFallback>{session.user.fullName?.[0]}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold text-white">{session.user.fullName}</h2>
              <p className="text-sky-100">{session.user.role || "UI/UX Designer"}</p>
            </div>
          </div>
          <div className="absolute bottom-2 left-6 right-6 flex items-center gap-2 rounded-full bg-white px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Active</span>
          </div>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="relative mb-1 flex w-full items-center justify-between px-4 py-6 hover:bg-cyan-200"
              onClick={() => router.push(item.path)}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
              {item.badge ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-200 text-sm text-sky-600">
                  {item.badge}
                </span>
              ) : (
                <ChevronLeft className="h-5 w-5 rotate-180" />
              )}
            </Button>
          ))}
        </nav>
        <div className="p-4">
          <Button variant="destructive" className="w-full" onClick={() => signOut({ callbackUrl: "/" })}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}

