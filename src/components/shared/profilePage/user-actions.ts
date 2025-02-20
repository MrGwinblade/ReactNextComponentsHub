"use server"

import { prisma } from "@@/prisma/prisma-client"
import { compare, hashSync } from "bcryptjs"

import { revalidatePath } from "next/cache"
import { getUserSession } from "../auth/lib/get-server-session"

export async function updateEmail(newEmail: string) {
  const session = await getUserSession()
  if (!session) throw new Error("Not authenticated")

  const existingUser = await prisma.user.findFirst({
    where: { email: newEmail },
  })

  if (existingUser) throw new Error("Email already in use")

  await prisma.user.update({
    where: { id: session.id },
    data: { email: newEmail },
  })

  revalidatePath("/settings")
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const session = await getUserSession()
  if (!session) throw new Error("Not authenticated")

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  })

  if (!user) throw new Error("User not found")

  const isValid = await compare(currentPassword, user.password)
  if (!isValid) throw new Error("Current password is incorrect")

  await prisma.user.update({
    where: { id: session.id },
    data: { password: hashSync(newPassword, 10) },
  })

  revalidatePath("/settings")
}

export async function updatePhoneNumber(newPhoneNumber: string) {
  const session = await getUserSession()
  if (!session) throw new Error("Not authenticated")

  await prisma.user.update({
    where: { id: session.id },
    data: { phoneNumber: newPhoneNumber },
  })

  revalidatePath("/settings")
}
