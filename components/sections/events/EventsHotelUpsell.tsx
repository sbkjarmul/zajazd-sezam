import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { Reveal } from '@/components/Reveal'
import { ParallaxImage } from '@/components/ParallaxImage'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<EVENTS_PAGE_QUERY_RESULT>['hotelUpsellSection']
  image: NonNullable<EVENTS_PAGE_QUERY_RESULT>['hotelUpsellImage']
  locale: Locale
}

// Sekcja „Nocleg na miejscu" — pełnoekranowy hero (100% szer./wys., min 800px) na
// ciemnym tle. Zdjęcie hotelu (hero z /hotel) przygaszone do 25%, a na nim
// pełnoszerokościowy gradient: Ruby Dark → Ruby 50% → Ruby Dark. Treść na wierzchu.
export function EventsHotelUpsell({ data, image, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section
      data-header-theme="dark"
      className="text-text-inverse relative flex min-h-[max(100svh,800px)] w-full items-center overflow-hidden py-24"
      style={{ background: 'var(--color-dark-ruby)' }}
    >
      {/* Zdjęcie tła — parallax (stoi „w miejscu", treść przesuwa się nad nim),
          przygaszone do 25%. `loading=eager` bo obraz jest w kontenerze z transformem. */}
      {image && (
        <div aria-hidden className="absolute inset-0 opacity-25">
          <ParallaxImage
            image={image}
            locale={locale}
            sizes="100vw"
            loading="eager"
            driftPercent={16}
          />
        </div>
      )}

      {/* Gradient overlay na całą szerokość: Ruby Dark → Ruby 50% → Ruby Dark */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, var(--color-dark-ruby) 0%, color-mix(in srgb, var(--color-ruby) 50%, transparent) 50%, var(--color-dark-ruby) 100%)',
        }}
      />

      {/* Treść */}
      <div className="layout-container relative z-10 flex max-w-[1280px] flex-col items-center gap-10 text-center">
        <Reveal>
          <header className="flex flex-col items-center gap-4">
            {eyebrow && (
              <p className="text-text-inverse text-base wide:text-lg tracking-normal uppercase leading-[normal]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-text-inverse max-w-3xl text-3xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
                {title}
              </h2>
            )}
          </header>
        </Reveal>
        {description && (
          <Reveal delay={100}>
            <p className="text-text-inverse/80 max-w-3xl text-base leading-[1.2] md:text-lg">
              {description}
            </p>
          </Reveal>
        )}
        {ctaLabel && (
          <Reveal delay={200}>
            <ReservationCtaButton tab="room" variant="outline-light">
              {ctaLabel}
            </ReservationCtaButton>
          </Reveal>
        )}
      </div>
    </section>
  )
}
