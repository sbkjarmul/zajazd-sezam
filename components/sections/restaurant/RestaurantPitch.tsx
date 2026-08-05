import type { RESTAURANT_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { AccentText } from '@/components/AccentText'
import { RevealText } from '@/components/RevealText'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<RESTAURANT_PAGE_QUERY_RESULT>['pitchSection']
  locale: Locale
}

// Pitch (Figma 967:43): wyśrodkowany serif headline z akcentem kursywą,
// pod nim outline pill CTA do menu.
export function RestaurantPitch({ data, locale }: Props) {
  if (!data) return null
  const text = pickLocale(data.text, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section
      data-header-theme="light"
      className="bg-bg flex min-h-[600px] items-center py-16 md:min-h-[800px] md:py-24"
    >
      <div className="layout-container flex flex-col items-center gap-10 text-center">
        {text && (
          <RevealText
            as="h2"
            mode="fade"
            className="font-accent text-ruby text-[clamp(34px,6vw,64px)] leading-none tracking-[-0.01em] not-italic"
          >
            <AccentText text={text} />
          </RevealText>
        )}
        {ctaLabel && (
          <Reveal delay={120}>
            <Link
              href="/restauracja/menu"
              className="border-ruby text-ruby hover:bg-ruby hover:text-light inline-flex items-center justify-center rounded-full border-2 px-6 py-3 text-lg transition-colors"
            >
              {ctaLabel}
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  )
}
