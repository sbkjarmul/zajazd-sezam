import type { RESTAURANT_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<RESTAURANT_PAGE_QUERY_RESULT>['pitchSection']
  locale: Locale
}

// Pitch ma dwa zdania o różnej stylistyce — pierwsze (bold uppercase) i drugie (regular).
// Seed rozdziela je znakiem nowej linii.
export function RestaurantPitch({ data, locale }: Props) {
  if (!data) return null
  const text = pickLocale(data.text, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)
  const [first, ...rest] = (text ?? '').split(/\n+/).filter(Boolean)
  const second = rest.join(' ')

  return (
    <section className="bg-bg flex min-h-[800px] items-center py-16 md:py-[64px]">
      <div className="layout-container flex flex-col items-start gap-10 text-left md:items-center md:text-center">
        {first && (
          <p className="text-dark-ruby text-3xl leading-[1.1] tracking-[-0.01em] uppercase md:text-5xl lg:text-[58px]">
            <span className="block font-bold">{first}</span>
            {second && <span className="block font-normal">{second}</span>}
          </p>
        )}
        {ctaLabel && (
          <Link
            href="/restauracja/menu"
            className="border-dark-ruby text-dark-ruby hover:bg-dark-ruby hover:text-text-inverse inline-flex h-[60px] w-full items-center justify-center rounded-full border-2 px-6 py-2 text-lg transition-colors md:w-auto"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
