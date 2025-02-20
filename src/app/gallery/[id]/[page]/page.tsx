// components/GalleryPage.tsx
"use client"

import { useState, useEffect, useCallback, use } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { useGalleryStore } from "@/lib/galleryStore"


export default function GalleryPage({ params }: { params: Promise<{ id: string; page: string; version: number }> }) {
  const router = useRouter()
  const { id: galleryId, page, version } = use(params)
  const initialPage = Number.parseInt(page, 10)

  const { setGalleryData, updateCurrentPage, getGalleryData } = useGalleryStore()
  const { pageCount, lastVisitedPage, galleryVersion } = getGalleryData(galleryId)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const currentPage = lastVisitedPage ?? initialPage

  // Загрузка метаданных галереи, если их еще нет в store
  useEffect(() => {
    if (pageCount === null) {
      const fetchGalleryMetadata = async () => {
        try {
          const response = await fetch(`/api/galleries/${galleryId}`)
          const data = await response.json()
          setGalleryData(galleryId, data.pageCount, initialPage, data.version)
        } catch (error) {
          console.error("Failed to fetch gallery metadata:", error)
        }
      }

      fetchGalleryMetadata()
    } else {
      // Обновляем текущую страницу в store, если данные уже есть
      updateCurrentPage(galleryId, initialPage)
    }
  }, [galleryId, initialPage, pageCount, setGalleryData, updateCurrentPage])

  // Предзагрузка следующего и предыдущего изображений
  useEffect(() => {
    if (pageCount !== null) {
      const preloadImages = []
      if (currentPage < pageCount) {
        const nextImg = new window.Image()
        nextImg.src = `/gallery/${galleryId}/${currentPage + 1}.png`
        preloadImages.push(nextImg)
      }
      if (currentPage > 1) {
        const prevImg = new window.Image()
        prevImg.src = `/gallery/${galleryId}/${currentPage - 1}.png`
        preloadImages.push(prevImg)
      }
    }
  }, [pageCount, currentPage, galleryId])

  // Обработчик смены страниц
  const navigateTo = useCallback(
    (newPage: number) => {
      if (newPage !== currentPage && pageCount !== null) {
        if (newPage >= 1 && newPage <= pageCount) {
          setIsImageLoading(true)
          updateCurrentPage(galleryId, newPage)
          router.push(`/gallery/${galleryId}/${newPage}`, { scroll: false })
        }
      }
    },
    [pageCount, currentPage, galleryId, router, updateCurrentPage]
  )

  // Компонент пагинации
  const PaginationControls = () => (
    <div className="flex justify-center gap-4">
      <Button onClick={() => navigateTo(1)} disabled={currentPage === 1 || pageCount === null}>
        First
      </Button>
      <Button onClick={() => navigateTo(currentPage - 1)} disabled={currentPage === 1 || pageCount === null}>
        Previous
      </Button>
      <span className="py-2 px-4 border rounded">
        Page {currentPage} of {pageCount ?? "..."}
      </span>
      <Button
        onClick={() => navigateTo(currentPage + 1)}
        disabled={pageCount !== null ? currentPage === pageCount : true}
      >
        Next
      </Button>
      <Button
        onClick={() => pageCount !== null && navigateTo(pageCount)}
        disabled={pageCount !== null ? currentPage === pageCount : true}
      >
        Last
      </Button>
      <Button variant="outline" onClick={() => router.push(`/gallery/${galleryId}`)}>
        Back to Gallery
      </Button>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 relative">
        <div className="relative w-full max-w-3xl mx-auto">
          
          <Image
            src={`/gallery/${galleryId}/${currentPage}.png?v=${galleryVersion}`}
            alt={`Page ${currentPage}`}
            width={800}
            height={600}
            className={'w-full rounded-lg transition-opacity duration-300 opacity-100 '}
            onLoadingComplete={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
            priority={currentPage === initialPage}
          />
        </div>
      </div>
      <PaginationControls />
    </div>
  )
}