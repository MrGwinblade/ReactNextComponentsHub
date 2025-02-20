"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Title } from "@/components/shared/title"

interface GalleryItem {
  id: string
  name: string
  tags: string[]
}

const ITEMS_PER_PAGE = 8

export const FullGalleryTemplate = () => {
  const [galleries, setGalleries] = useState<GalleryItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchGalleries = async () => {
      const response = await fetch("/api/galleries")
      const data = await response.json()
      setGalleries(data)
    }

    fetchGalleries()
  }, [])

  const totalPages = Math.ceil(galleries.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentGalleries = galleries.slice(startIndex, endIndex)

  return (
    <div className="container mx-auto px-4 py-8">
      <Title text="Gallery" size="lg" className="mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentGalleries.map((gallery) => (
          <Link href={`/gallery/${gallery.id}`} key={gallery.id}>
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <Image
                src={`/gallery/${gallery.id}/thumbnail.png`}
                alt={gallery.name}
                width={200}
                height={200}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-2">{gallery.name}</h2>
                <div className="flex flex-wrap gap-2">
                  {gallery.tags.map((tag) => (
                    <span key={tag} className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="py-2 px-4 border rounded">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

