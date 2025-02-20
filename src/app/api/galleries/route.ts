import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  const galleryDir = path.join(process.cwd(), "public", "gallery")
  const galleries = fs
    .readdirSync(galleryDir)
    .filter((dir) => fs.statSync(path.join(galleryDir, dir)).isDirectory())
    .map((dir) => {
      const metadataPath = path.join(galleryDir, dir, "metadata.json")
      if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"))
        return {
          id: dir,
          name: metadata.name,
          tags: metadata.tags,
          version: metadata.version
        }
      }
      return null
    })
    .filter(Boolean)

  return NextResponse.json(galleries)
}