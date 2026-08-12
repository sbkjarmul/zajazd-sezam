'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/routing'
import type { GALLERY_IMAGES_QUERY_RESULT } from '@/types/sanity'
import { GalleryGrid } from './GalleryGrid'
import { GalleryLightbox } from './GalleryLightbox'

type GalleryImage = NonNullable<GALLERY_IMAGES_QUERY_RESULT>[number]

type Props = {
  /** Pierwsza partia (SSR — dobra dla LCP/SEO). */
  initialImages: GalleryImage[]
  /** Laczna liczba zdjec w galerii (count z Sanity). */
  total: number
  locale: Locale
  /** Rozmiar kolejnych partii dociaganych po scrollu. */
  batchSize: number
}

// Infinite scroll: pierwsza partia z SSR (props), kolejne dociagane z
// /api/gallery po wejsciu sentinela w widok (IntersectionObserver, z zapasem
// rootMargin, zeby ladowac zanim uzytkownik dojdzie do konca). Lista rosnie
// append-only, wiec indeksy kafli i slajdow lightboxa pozostaja spojne.
export function GalleryInfinite({ initialImages, total, locale, batchSize }: Props) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages)
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const done = images.length >= total

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return
    const start = images.length
    if (start >= total) return
    loadingRef.current = true
    setLoading(true)
    try {
      const res = await fetch(`/api/gallery?start=${start}&end=${start + batchSize}`)
      if (res.ok) {
        const data: { images?: GalleryImage[] } = await res.json()
        const next = data.images
        if (next?.length) setImages((prev) => [...prev, ...next])
      }
    } catch {
      // Cichy fallback — sentinel zostaje, sprobuje ponownie przy kolejnym scrollu.
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [images.length, total, batchSize])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || done) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '800px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [done, loadMore])

  return (
    <>
      {/* Kafle (GalleryGrid, prezentacyjny) owiniete lightboxem (klik -> YARL).
          Lista `images` rosnie w miare dociagania kolejnych partii. */}
      <GalleryLightbox images={images} locale={locale}>
        <GalleryGrid images={images} locale={locale} />
      </GalleryLightbox>

      {/* Sentinel poza siatka (nie jest kaflem) — wejscie w widok dociaga partie. */}
      {!done && <div ref={sentinelRef} aria-hidden className="h-px w-full" />}

      {loading && (
        <p className="text-text-muted mt-8 text-center text-sm" role="status">
          {locale === 'pl' ? 'Ładowanie zdjęć…' : 'Loading photos…'}
        </p>
      )}
    </>
  )
}
