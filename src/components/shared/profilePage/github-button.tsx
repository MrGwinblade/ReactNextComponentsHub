"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from 'lucide-react'
import { signIn, useSession } from "next-auth/react"
import { useState } from "react"
import toast from "react-hot-toast"
import { unlinkGithubAccount } from "./github-actions"

export function GitHubButton() {
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [updatedSession, setUpdatedSession] = useState(session);

  const handleGitHubAction = async () => {
    setIsLoading(true)
    try {
      if (session?.user?.githubId) {
        // Отвязываем аккаунт
        await unlinkGithubAccount()
        await update()
        toast.success("GitHub account unlinked successfully")
      } else {
        // Проверяем, авторизован ли пользователь
        if (!session?.user?.email) {
          toast.error("Please log in to link your GitHub account")
          return
        }

        // Выполняем вход через GitHub
        const result = await signIn("github", { 
          callbackUrl: '/settings'
        })
        console.log(result)

        if (result?.error) {
          //throw new Error(result.error)
          toast.error(result.error)
        }

        if (result?.ok) {
          // Проверяем, изменился ли githubId пользователя
          await update()
          const newSession = await useSession()
          setUpdatedSession(newSession.data);
          if (newSession.data?.user?.githubId) {
            toast.success("GitHub account linked successfully")
          } else {
            //throw new Error("This GitHub account is already linked to another user")
            toast.error("This GitHub account is already linked to another user")
          }
        } else {
          //throw new Error("Failed to link GitHub account")
          toast.error("Failed to link GitHub account")
        }
      }
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "Failed to perform GitHub action")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-between px-0 py-4 font-normal hover:bg-gray-100"
      onClick={handleGitHubAction}
      disabled={isLoading}
    >
      <div className="flex items-center gap-2">
        <span className="pl-2">GitHub</span>
        <ExternalLink className="h-4 w-4" />
      </div>
      <Button variant="outline" size="sm">
        {session?.user?.githubId ? "Unlink" : "Connect"}
      </Button>
    </Button>
  )
}