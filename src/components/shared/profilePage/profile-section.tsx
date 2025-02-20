"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User } from "next-auth"

interface ProfileSectionProps {
  user: User & {
    fullName?: string
    phoneNumber?: string
  }
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    // Template function for updating name
    console.log("Updating name...")
    setIsEditingName(false)
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    // Template function for updating email
    console.log("Updating email...")
    setIsEditingEmail(false)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    // Template function for updating password
    console.log("Updating password...")
    setIsEditingPassword(false)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Full Name</Label>
          <Button variant="outline" size="sm" onClick={() => setIsEditingName(!isEditingName)}>
            Change
          </Button>
        </div>
        {isEditingName ? (
          <form onSubmit={handleUpdateName} className="space-y-2">
            <Input defaultValue={user.fullName} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditingName(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit">
                Save
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-muted-foreground">{user.fullName}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Email</Label>
          <Button variant="outline" size="sm" onClick={() => setIsEditingEmail(!isEditingEmail)}>
            Change
          </Button>
        </div>
        {isEditingEmail ? (
          <form onSubmit={handleUpdateEmail} className="space-y-2">
            <Input type="email" defaultValue={user.email || ""} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditingEmail(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit">
                Save
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-muted-foreground">{user.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Password</Label>
          <Button variant="outline" size="sm" onClick={() => setIsEditingPassword(!isEditingPassword)}>
            Change
          </Button>
        </div>
        {isEditingPassword && (
          <form onSubmit={handleUpdatePassword} className="space-y-2">
            <div className="space-y-2">
              <Input type="password" placeholder="Current password" />
              <Input type="password" placeholder="New password" />
              <Input type="password" placeholder="Confirm new password" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditingPassword(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit">
                Save
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

