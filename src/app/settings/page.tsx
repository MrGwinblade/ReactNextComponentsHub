"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

import { AccountSection } from "@/components/shared/profilePage/settings/accout-section"
import { SettingsSection } from "@/components/shared/profilePage/settings/settings-section"



export default function SettingsPage() {
  const router = useRouter()

  const tabs = [
    { id: "account", label: "Account", content: <AccountSection /> },
    { id: "profile", label: "Profile", content: <div>Profile settings</div> },
    { id: "privacy", label: "Privacy", content: <div>Privacy settings</div> },
    { id: "notifications", label: "Notifications", content: <div>Notification settings</div> },
    { id: "email", label: "Email", content: <div>Email settings</div> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center gap-4 p-4 border-b bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.push("/?component=profileButton")}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <div className="container max-w-3xl mx-auto py-6">
        <SettingsSection tabs={tabs} defaultTab="account" />
      </div>
    </div>
  )
}

