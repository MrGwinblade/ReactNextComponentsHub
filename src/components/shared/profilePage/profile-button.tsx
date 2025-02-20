"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFloating, shift, offset, flip, autoUpdate } from "@floating-ui/react"
import { ProfilePage } from "./profile-page"
import { UserRound } from "lucide-react"

interface Props {
  className?: string
}

export const ProfileButton: React.FC<Props> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [offset(5), flip(), shift()],
    whileElementsMounted: autoUpdate,
  })

  return (
    <div className={cn("flex flex-col justify-items-end items-center p-10 gap-10", className)}>
      <Button ref={refs.setReference} onClick={() => setIsOpen(!isOpen)}>
        <UserRound size={24} />
      </Button>

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="absolute bg-white shadow-lg border rounded-md p-2 w-[350px]"
        >
          <ProfilePage className="" />
        </div>
      )}
    </div>
  )
}

