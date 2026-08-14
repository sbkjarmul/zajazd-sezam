'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { buildGallerySlides, type GallerySlideImage } from '@/lib/gallery/slides'
import type { Locale } from '@/i18n/routing'

// YARL doladowywany leniwie — chunk biblioteki + jej style dochodza dopiero przy
// pierwszym otwarciu podgladu (open === true), nie przy montowaniu sekcji.
const LightboxInner = dynamic(() => import('./LightboxInner'), { ssr: false })

type Props = {
  images: readonly (GallerySlideImage | null | undefined)[]
  locale: Locale
  /** Tryb kontrolowany — widocznosc podgladu. */
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Kadr, od ktorego startuje galeria po otwarciu. */
  initialIndex?: number
}

// Kontrolowany podglad YARL (pinch/double-tap zoom) nad dowolna lista obrazow
// Sanity. Zastapil wlasny components/ui/Lightbox — ten sam lightbox co na
// /galeria, uzywany tez w sekcjach imprez (sale, typy imprez).
export function SanityLightbox({ images, locale, open, onOpenChange, initialIndex = 0 }: Props) {
  const slides = useMemo(() => buildGallerySlides(images, locale), [images, locale])

  // Nie montujemy YARL, dopoki podglad nie zostal choc raz otwarty — sekcja bez
  // interakcji nie sciaga biblioteki (leniwy import wyzej + ta bramka). Po
  // pierwszym otwarciu YARL zostaje zamontowany, zeby sam odegral fade zamkniecia
  // (odmontowanie na `!open` uciela by animacje wyjscia).
  const [activated, setActivated] = useState(false)
  if (open && !activated) setActivated(true)

  if (!activated || !slides.length) return null

  return (
    <LightboxInner
      open={open}
      index={initialIndex}
      close={() => onOpenChange(false)}
      slides={slides}
    />
  )
}
