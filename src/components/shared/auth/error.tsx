"use client"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function ErrorPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(router.query.error as string)
  }, [router.query.error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">Oops! An error occurred</h1>
        <p className="mt-3 text-2xl">{error ? `Error: ${error}` : "Something went wrong."}</p>
        <Link href="/">
          <a className="mt-6 text-blue-600 hover:underline">Go back to homepage</a>
        </Link>
      </main>
    </div>
  )
}

