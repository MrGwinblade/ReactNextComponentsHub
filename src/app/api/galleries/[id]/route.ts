import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { version } from "os"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const galleryDir = path.join(process.cwd(), "public", "gallery", id)

  if (!fs.existsSync(galleryDir)) {
    return NextResponse.json({ error: "Gallery not found" }, { status: 404 })
  }

  const metadataPath = path.join(galleryDir, "metadata.json")
  if (!fs.existsSync(metadataPath)) {
    return NextResponse.json({ error: "Gallery metadata not found" }, { status: 404 })
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"))
  const pageCount = fs.readdirSync(galleryDir).filter((file) => file.match(/^\d+\.png$/)).length

  return NextResponse.json({
    id,
    name: metadata.name,
    tags: metadata.tags,
    version: metadata.version,
    pageCount,
  })
}

