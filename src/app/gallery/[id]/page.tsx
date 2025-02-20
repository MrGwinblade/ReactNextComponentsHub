"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { Title } from "@/components/shared/title"
import { useRouter } from "next/navigation"

interface GalleryDetail {
  id: string
  name: string
  tags: string[]
  version: number
  pageCount: number
}

export default function GalleryDetail({ params }: { params: Promise<{ id: string }> }) {
  const [gallery, setGallery] = useState<GalleryDetail | null>(null)
  const [liked, setLiked] = useState(false)
  const [galleryId, setGalleryId] = useState<string | null>(null)
  const router = useRouter()


  useEffect(() => {
    const fetchGalleryDetail = async () => {
      const resolvedParams = await params
      setGalleryId(resolvedParams.id)
    }

    fetchGalleryDetail()
  }, [params])

  useEffect(() => {
    if (galleryId) {
      const fetchGalleryDetail = async () => {
        const response = await fetch(`/api/galleries/${galleryId}`)
        const data = await response.json()
        setGallery(data)
      }

      fetchGalleryDetail()
    }
  }, [galleryId])

  if (!gallery) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/3">
          <Image
            src={`/gallery/${galleryId}/thumbnail.png?v=${gallery.version}`}
            alt={''}
            width={400}
            height={400}
            className="w-full rounded-lg"
          />
        </div>
        <div className="md:w-2/3">
          <Title text={gallery.name} size="lg" className="mb-4" />
          <div className="flex flex-wrap gap-2 mb-4">
            {gallery.tags.map((tag) => (
              <span key={tag} className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-4">
            <Button onClick={() => setLiked(!liked)}>
              <Heart className={`mr-2 ${liked ? "fill-current" : ""}`} />
              {liked ? "Liked" : "Like"}
            </Button>
            <Button variant="outline">Share</Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: gallery.pageCount }, (_, i) => i + 1).map((pageNum) => (
          <Link href={`/gallery/${galleryId}/${pageNum}`} key={pageNum}>
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <Image
                src={`/gallery/${galleryId}/${pageNum}.png?v=${gallery.version}`}
                alt={`Page ${pageNum}`}
                width={200}
                height={200}
                className="w-full h-40 object-cover"
              />
              <div className="p-2 text-center">Page {pageNum}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <Button variant="outline" onClick={() => router.push("/?component=fullGalleryTemplate")}>
          Back to Gallery List
        </Button>
      </div>
    </div>
  )
}

