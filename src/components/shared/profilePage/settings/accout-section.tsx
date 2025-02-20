"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Dialog } from "@/components/ui/dialog"
import { SettingsButton } from "./settings-button"
import { Button } from "@/components/ui"
import { ChevronRight, ExternalLink } from "lucide-react"

export function AccountSection() {
  const { data: session, update } = useSession()
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false)

  const handleSuccess = async () => {
    await update()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">General</h2>
        <div className="space-y-1">
          <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
            <SettingsButton
              title="Email address"
              variant="ghost"
              userContent={session?.user.email}
              email={true}
              onSuccess={() => {
                handleSuccess()
                setIsEmailDialogOpen(false)
              }}
            />
          </Dialog>

          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <SettingsButton
              title="Password"
              variant="ghost"
              password={true}
              onSuccess={() => {
                handleSuccess()
                setIsPasswordDialogOpen(false)
              }}
            />
          </Dialog>

          <Dialog open={isPhoneDialogOpen} onOpenChange={setIsPhoneDialogOpen}>
            <SettingsButton
              title="Phone Number"
              variant="ghost"
              phoneNumber={true}
              userContent={session?.user.phoneNumber}
              onSuccess={() => {
                handleSuccess()
                setIsPhoneDialogOpen(false)
              }}
            />
          </Dialog>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Account authorization</h2>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-between px-0 py-4 font-normal hover:bg-gray-100">
            <div className="flex items-center gap-2">
              <span className="pl-2">Google(Нет я не буду еще раз лезть в гугл генерить токен, так что без него)</span>
              <ExternalLink className="h-4 w-4" />
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </Button>
          <Button variant="ghost" className="w-full justify-between px-0 py-4 font-normal hover:bg-gray-100">
            <div className="flex items-center gap-2">
              <span className="pl-2">GitHub</span>
              <ExternalLink className="h-4 w-4" />
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Advanced</h2>
        <Button
          variant="ghost"
          className="w-full justify-between px-0 py-4 font-normal text-red-500 hover:bg-gray-100 hover:text-red-500"
        >
          <span className="pl-2">Delete account</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

