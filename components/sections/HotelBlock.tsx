import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['hotelBlock']
  locale: Locale
}

// Desktop (lg+): 2 kolumny — obrazy po lewej (col 1, oba rzędy), tekst po prawej
//   (tytuł góra, opis+CTA dół). Rozmieszczenie przez explicit grid placement,
//   więc kolejność w DOM nie wpływa na desktop.
// Tablet/mobile (<lg): jedna kolumna, kolejność DOM — tytuł → opis+CTA → obrazy
//   (obraz pod tekstem).
export function HotelBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)
  const images = data.images ?? []
  const [hero, second, third] = images

  return (
    <section className="bg-bg pt-20 md:py-32">
      <div className="layout-container grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-36">
        {/* Title — stacked pos 1, desktop col 2 row 1 (top) */}
        <Reveal className="flex flex-col gap-4 lg:col-start-2 lg:row-start-1 lg:self-start">
          {eyebrow && (
            <p className="text-text wide:text-lg text-base tracking-normal uppercase">{eyebrow}</p>
          )}
          {title && (
            <h2 className="text-text text-2xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
              {title}
            </h2>
          )}
        </Reveal>

        {/* Description + CTA — stacked pos 2, desktop col 2 row 2 (bottom) */}
        <Reveal
          delay={100}
          className="flex flex-col items-start gap-6 lg:col-start-2 lg:row-start-2 lg:self-end"
        >
          {description && <p className="text-text-muted text-base leading-[1.2] md:text-lg">{description}</p>}
          {ctaLabel && (
            <ReservationCtaButton tab="room" variant="filled-dark" className="w-full md:w-auto">
              {ctaLabel}
            </ReservationCtaButton>
          )}
        </Reveal>

        {/* Images — stacked pos 3 (pod tekstem), desktop col 1 row 1+2 */}
        <Reveal
          delay={200}
          className="-mx-4 flex w-[calc(100%+2rem)] flex-col gap-4 md:mx-0 md:w-full lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center"
        >
          <div className="relative aspect-[2/1] overflow-hidden">
            <SanityImage
              image={hero}
              locale={locale}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-square overflow-hidden">
              <SanityImage
                image={second}
                locale={locale}
                fill
                sizes="(max-width: 1024px) 50vw, 22vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden">
              <SanityImage
                image={third}
                locale={locale}
                fill
                sizes="(max-width: 1024px) 50vw, 22vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
