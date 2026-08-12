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
// Uklad: kwadraty (aspect-square). 4 kolumny (mobile+tablet) -> 6 (desktop).
// "Lekko przesuniete" — co druga kolumna (parzyste kafle: nth-child(2n)) zjezdza
// lekko w dol. Przy 4 / 6 kolumnach (parzyste) nth-child(2n) trafia dokladnie w
// kolumny parzyste, wiec offset czyta sie jak przesuniecie calych kolumn, nie
// zygzak. Odstepy male (dense mozaika), offset delikatny.
export function GalleryGrid({ images, locale }: Props) {
  return (
    <div
      className={[
        'grid grid-cols-4 gap-2 md:gap-3 lg:grid-cols-6',
        // Offset parzystych kafli: ~16px mobile, ~32px desktop.
        '[&>*:nth-child(2n)]:translate-y-4 lg:[&>*:nth-child(2n)]:translate-y-8',
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
              sizes="(min-width: 1024px) 16vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
            />
          </button>
        )
      })}
    </div>
  )
}
