'use client'

import { useCallback, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { pickLocale } from '@/lib/i18n/pickLocale'
import type { Locale } from '@/i18n/routing'
import type { GALLERY_PAGE_QUERY_RESULT } from '@/types/sanity'

// YARL doladowywany leniwie — chunk pobiera sie dopiero po pierwszym klik w kafel
// (patrz `activated`). Wejscie na strone galerii = zero JS lightboxa.
const LightboxInner = dynamic(() => import('./LightboxInner'), { ssr: false })

type GalleryImage = NonNullable<NonNullable<GALLERY_PAGE_QUERY_RESULT>['images']>[number]

// Szerokosci generowane przez Sanity CDN dla srcSet — na mobile pobierany jest
// maly wariant, na desktop wiekszy; `auto=format` = AVIF/WebP gdy wspierane.
const SRCSET_WIDTHS = [640, 960, 1280, 1920, 2400] as const

// Wariant obrazu z Sanity CDN. `asset.url` (surowy, jak w SanityImage) + params
// pipeline'u obrazow — bez urlFor, ktory nie przyjmuje zdereferencjonowanego assetu.
const cdn = (url: string, w: number) => `${url}?w=${w}&q=80&auto=format&fit=max`

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

  const slides = useMemo(
    () =>
      images.map((img) => {
        const url = img.asset?.url ?? ''
        const dims = img.asset?.metadata?.dimensions
        const width = dims?.width ?? 1600
        const height = dims?.height ?? 1600
        return {
          src: cdn(url, 2400),
          width,
          height,
          alt: pickLocale(img.alt, locale) ?? '',
          srcSet: SRCSET_WIDTHS.map((w) => ({
            src: cdn(url, w),
            width: w,
            height: Math.round((height / width) * w),
          })),
        }
      }),
    [images, locale],
  )

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
