import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { Link } from '@/i18n/navigation'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['eventsBlock']
  locale: Locale
}

// Dwa bloki obok siebie (od lg): [główny obraz] | [content].
//   content = nagłówek (góra) + rząd [mały obraz][opis + CTA] (dół).
// Mały obraz pokazywany dopiero od xl. Gdy ukryty (tablet/mobile) lub brak go
// w Sanity, opis+CTA (flex-1) automatycznie wypełnia cały rząd.
// Poniżej lg: bloki ułożone pionowo (content → obraz) — obraz pod tekstem
// dzięki order-last; na lg wraca do DOM order (obraz po lewej).
export function EventsBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section className="bg-bg py-16 md:py-32">
      <div className="layout-container flex flex-col gap-8 lg:flex-row">
        {/* Blok 1: główny obraz */}
        <div className="relative order-last aspect-[662/592] w-full overflow-hidden lg:order-none lg:w-1/2 lg:shrink-0 lg:self-start">
          <SanityImage
            image={data.mainImage}
            locale={locale}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Blok 2: nagłówek + rząd [mały obraz][opis + CTA] */}
        <div className="flex flex-1 flex-col gap-8 lg:justify-between">
          {/* Nagłówek */}
          <div className="flex flex-col gap-4 md:gap-6">
            {eyebrow && (
              <p className="text-text wide:text-lg text-base tracking-normal uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-text text-4xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-[64px]">
                {title}
              </h2>
            )}
          </div>

          {/* Rząd: mały obraz + opis/CTA. Mały obraz tylko od xl —
              gdy ukryty, opis+CTA (flex-1) wypełnia całą szerokość. */}
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end">
            {data.secondaryImage && (
              <div className="relative hidden aspect-square overflow-hidden xl:block xl:w-1/2 xl:shrink-0">
                <SanityImage
                  image={data.secondaryImage}
                  locale={locale}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col gap-6">
              {description && (
                <p className="text-text text-base leading-[1.2] lg:text-lg">{description}</p>
              )}
              {ctaLabel && (
                <Link
                  href="/imprezy-okolicznosciowe"
                  className="text-text-inverse inline-flex h-[60px] w-full items-center justify-center rounded-full px-6 text-lg transition-opacity hover:opacity-90 md:w-fit md:min-w-[220px]"
                  style={{ background: 'var(--color-dark-ruby)' }}
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
