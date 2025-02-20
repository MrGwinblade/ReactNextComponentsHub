// lib/galleryStore.ts
import { create } from "zustand"

interface GalleryState {
  galleries: Record<string, {
    pageCount: number
    lastVisitedPage: number
    galleryVersion: number
  }>
  setGalleryData: (galleryId: string, pageCount: number, initialPage: number, galleryVersion: number) => void
  updateCurrentPage: (galleryId: string, page: number) => void
  getGalleryData: (galleryId: string) => {
    pageCount: number | null
    lastVisitedPage: number | null
    galleryVersion: number | null
  }
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  galleries: {},

  setGalleryData: (galleryId, pageCount, initialPage, galleryVersion) => {
    set((state) => ({
      galleries: {
        ...state.galleries,
        [galleryId]: {
          pageCount,
          lastVisitedPage: initialPage,
          galleryVersion
        }
      }
    }))
  },

  updateCurrentPage: (galleryId, page) => {
    set((state) => {
      const currentGallery = state.galleries[galleryId]
      if (!currentGallery) return state

      return {
        galleries: {
          ...state.galleries,
          [galleryId]: {
            ...currentGallery,
            lastVisitedPage: page
          }
        }
      }
    })
  },

  getGalleryData: (galleryId) => {
    const gallery = get().galleries[galleryId]
    return {
      pageCount: gallery?.pageCount ?? null,
      lastVisitedPage: gallery?.lastVisitedPage ?? null,
      galleryVersion: gallery?.galleryVersion ?? null
    }
  },

  getGalleryVersion: (galleryId : string) => {
    const gallery = get().galleries[galleryId]
    return {
      galleryVersion: gallery?.galleryVersion ?? null
    }
  }
}))