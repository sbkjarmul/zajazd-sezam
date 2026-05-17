'use client'

import { Expand } from 'lucide-react'
import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { LightboxGallery } from '@/components/ui/LightboxGallery'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Hall = NonNullable<NonNullable<EVENTS_PAGE_QUERY_RESULT>['halls']>[number]

type Props = {
  hall: Hall
  locale: Locale
}

export function HallCard({ hall, locale }: Props) {
  const hallName = pickLocale(hall.name, locale)
  const hallDesc = pickLocale(hall.description, locale)
  const images = hall.images ?? []
  const cover = images[0]
  const galleryTitle = hallName ?? (locale === 'pl' ? 'Galeria sali' : 'Hall gallery')

  const thumbnail = (
    <button
      type="button"
      className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-md"
      aria-label={
        locale === 'pl' ? `Otwórz galerię — ${galleryTitle}` : `Open gallery — ${galleryTitle}`
      }
    >
      <SanityImage
        image={cover}
        locale={locale}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {images.length > 1 && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white">
          <Expand className="size-3.5" aria-hidden />
          {images.length}
        </span>
      )}
    </button>
  )

  return (
    <article className="flex flex-col gap-3">
      {images.length > 0 ? (
        <LightboxGallery images={images} locale={locale} trigger={thumbnail} title={galleryTitle} />
      ) : (
        thumbnail
      )}
      {hall.capacity != null && (
        <p className="text-text text-base">
          {hall.capacity} {locale === 'pl' ? 'osób' : 'guests'}
        </p>
      )}
      {hallName && (
        <h3 className="text-text text-2xl leading-tight font-bold tracking-tight md:tracking-[-0.03em]">
          {hallName}
        </h3>
      )}
      {hallDesc && <p className="text-text text-sm leading-relaxed">{hallDesc}</p>}
    </article>
  )
}
