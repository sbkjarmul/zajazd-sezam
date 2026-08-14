'use client'

import { useCallback, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { buildGallerySlides } from '@/lib/gallery/slides'
import type { Locale } from '@/i18n/routing'
import type { GALLERY_IMAGES_QUERY_RESULT } from '@/types/sanity'

// YARL doladowywany leniwie — chunk pobiera sie dopiero po pierwszym klik w kafel
// (patrz `activated`). Wejscie na strone galerii = zero JS lightboxa.
const LightboxInner = dynamic(() => import('./LightboxInner'), { ssr: false })

type GalleryImage = NonNullable<GALLERY_IMAGES_QUERY_RESULT>[number]

type Props = {
  images: GalleryImage[]
  locale: Locale
  /** Kafle galerii (Server Component) — renderowane serwerowo, klik delegowany. */
  children: React.ReactNode
}

// Cienka warstwa klienta nad serwerowa siatka. Kafle (children) sa RSC; tutaj
// tylko delegacja klikniec (odczyt data-gallery-index) i sterowanie YARL.
export function GalleryLightbox({ images, locale, children }: Props) {
  // -1 = zamkniete. Trzymamy realny index zdjecia (kolejnosc z Sanity).
  const [index, setIndex] = useState(-1)
  const [activated, setActivated] = useState(false)

  const slides = useMemo(() => buildGallerySlides(images, locale), [images, locale])

  const openAt = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-gallery-index]')
    if (!el) return
    const i = Number(el.dataset.galleryIndex)
    if (Number.isNaN(i)) return
    setActivated(true)
    setIndex(i)
  }, [])

  return (
    <>
      <div onClick={openAt}>{children}</div>
      {activated && (
        <LightboxInner
          open={index >= 0}
          index={index < 0 ? 0 : index}
          close={() => setIndex(-1)}
          slides={slides}
          // Utrzymuje realny index po nawigacji strzalkami/swipe — reopen wraca
          // w to samo miejsce. Gdy juz zamkniete (-1), ignorujemy view, zeby
          // pozne zdarzenie z animacji zamkniecia nie otworzylo podgladu ponownie.
          on={{ view: ({ index: i }) => setIndex((cur) => (cur < 0 ? cur : i)) }}
        />
      )}
    </>
  )
}
