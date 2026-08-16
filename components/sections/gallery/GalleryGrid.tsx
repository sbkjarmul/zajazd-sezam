import { SanityImage } from '@/components/SanityImage'
import { pickLocale } from '@/lib/i18n/pickLocale'
import type { Locale } from '@/i18n/routing'
import type { GALLERY_IMAGES_QUERY_RESULT } from '@/types/sanity'

type GalleryImage = NonNullable<GALLERY_IMAGES_QUERY_RESULT>[number]

type Props = {
  images: GalleryImage[]
  locale: Locale
}

// Server Component — cala siatka renderuje sie serwerowo (zero JS na layout),
// obrazki leniwie przez next/image + blur-up z LQIP. Interakcja (otwarcie
// podgladu) obsluzona delegacja w GalleryLightbox, ktory owija te siatke.
//
// Uklad: kwadraty (aspect-square). 3 kolumny (mobile) -> 4 (tablet) -> 6 (desktop).
// "Lekko przesuniete" — co druga kolumna zjezdza lekko w dol. Przy 4 / 6
// kolumnach (parzyste) robi to nth-child(2n), ktory trafia dokladnie w kolumny
// parzyste. Przy 3 kolumnach (nieparzyste) 2n dawaloby zygzak, wiec na mobile
// przesuwamy srodkowa kolumne: nth-child(3n+2). Reguly sa rozdzielone na
// max-md / md — wykluczajace sie media query, wiec nie walcza o kolejnosc.
// Odstepy male (dense mozaika), offset delikatny.
export function GalleryGrid({ images, locale }: Props) {
  return (
    <div
      className={[
        'grid grid-cols-3 gap-2 md:grid-cols-4 md:gap-3 lg:grid-cols-6',
        // Offset przesunietej kolumny: ~16px mobile/tablet, ~32px desktop.
        'max-md:[&>*:nth-child(3n+2)]:translate-y-4',
        'md:[&>*:nth-child(2n)]:translate-y-4 lg:[&>*:nth-child(2n)]:translate-y-8',
        // Zapas na dole, zeby przesuniete kafle nie byly przyciete.
        'pb-4 lg:pb-8',
      ].join(' ')}
    >
      {images.map((image, i) => {
        const alt = pickLocale(image.alt, locale) ?? ''
        return (
          <button
            key={image._key}
            type="button"
            data-gallery-index={i}
            aria-label={alt || `Zdjęcie ${i + 1}`}
            className="group bg-surface-dark/5 focus-visible:outline-accent relative block aspect-square w-full cursor-pointer overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <SanityImage
              image={image}
              locale={locale}
              fill
              // Pierwszy rzad (6 kafli) nad foldem: priority (LCP); reszta leniwie.
              priority={i < 6}
              sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
            />
          </button>
        )
      })}
    </div>
  )
}
