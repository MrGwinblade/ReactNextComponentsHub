"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/constants/auth-constants"
import { prisma } from "@@/prisma/prisma-client"

export async function linkGithubAccount(githubId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    throw new Error("User not authenticated")
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { githubId: githubId },
  })
}

export async function unlinkGithubAccount() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      throw new Error("User not authenticated")
    }
  
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        githubId: null,
        githubLogin: null,
      },
    })
  }
  

