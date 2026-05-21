'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SanityImage } from '@/components/SanityImage'
import type { ALL_ROOM_TYPES_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/utils'

type RoomImages = NonNullable<ALL_ROOM_TYPES_QUERY_RESULT[number]['images']>

type Props = {
  images: RoomImages
  locale: Locale
  prevLabel: string
  nextLabel: string
}

// Próg w pikselach — krótsze swipe ignorujemy żeby zwykły tap/scroll
// w nie wywoływał zmiany slajdu.
const SWIPE_THRESHOLD = 40

export function RoomImageSlider({ images, locale, prevLabel, nextLabel }: Props) {
  const [index, setIndex] = useState(0)
  const count = images.length
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  if (count === 0) return null

  const goPrev = () => setIndex((i) => (i - 1 + count) % count)
  const goNext = () => setIndex((i) => (i + 1) % count)

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX
    touchStartY.current = e.changedTouches[0].clientY
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    touchStartX.current = null
    touchStartY.current = null
    // Tylko ruchy bardziej poziome niż pionowe — nie kradniemy pionowego scrolla.
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return
    if (dx > 0) goPrev()
    else goNext()
  }

  // Strzałki schowane na mobile — od md w górę: zawsze widoczne na tablet,
  // a od lg odsłaniane tylko na hover / focus w grupie.
  const arrowBase =
    'bg-bg/80 text-text hover:bg-bg absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full backdrop-blur-sm transition-opacity duration-200 md:inline-flex md:size-14 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100 lg:group-focus-within:opacity-100'

  return (
    <div
      className="group relative h-full w-full touch-pan-y select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {images.map((image, i) => (
        <div
          key={i}
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          aria-hidden={i !== index}
        >
          <SanityImage
            image={image}
            locale={locale}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label={prevLabel}
            className={cn(arrowBase, 'left-4 md:left-6')}
          >
            <ChevronLeft className="size-6 md:size-7" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={nextLabel}
            className={cn(arrowBase, 'right-4 md:right-6')}
          >
            <ChevronRight className="size-6 md:size-7" aria-hidden />
          </button>
        </>
      )}
    </div>
  )
}
