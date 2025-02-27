import { authOptions } from "@/constants/auth-constants"
import NextAuth from "next-auth"
import { NextResponse } from "next/server"

const handler = NextAuth(authOptions)

export async function GET(request: Request) {
  try {
    return await handler(request)
  } catch (error) {
    console.error("Authentication error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.redirect(`/auth/error?error=${encodeURIComponent(errorMessage)}`)
  }
}

export async function POST(request: Request) {
  try {
    return await handler(request)
  } catch (error) {
    console.error("Authentication error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.redirect(`/auth/error?error=${encodeURIComponent(errorMessage)}`)
  }
}

