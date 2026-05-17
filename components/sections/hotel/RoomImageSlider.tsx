'use client'

import { useState } from 'react'
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

export function RoomImageSlider({ images, locale, prevLabel, nextLabel }: Props) {
  const [index, setIndex] = useState(0)
  const count = images.length

  if (count === 0) return null

  const goPrev = () => setIndex((i) => (i - 1 + count) % count)
  const goNext = () => setIndex((i) => (i + 1) % count)

  return (
    <div className="relative h-full w-full">
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
            className="bg-bg/80 text-text hover:bg-bg absolute top-1/2 left-4 z-10 inline-flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full backdrop-blur-sm transition-colors md:left-6 md:size-14"
          >
            <ChevronLeft className="size-6 md:size-7" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={nextLabel}
            className="bg-bg/80 text-text hover:bg-bg absolute top-1/2 right-4 z-10 inline-flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full backdrop-blur-sm transition-colors md:right-6 md:size-14"
          >
            <ChevronRight className="size-6 md:size-7" aria-hidden />
          </button>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-6">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1} / ${count}`}
                aria-current={i === index}
                className={cn(
                  'h-2 cursor-pointer rounded-full transition-all',
                  i === index ? 'bg-bg w-8' : 'bg-bg/50 hover:bg-bg/80 w-2',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
